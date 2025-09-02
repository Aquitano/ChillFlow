'use client';

export type AudioVariant = { codec: 'webm' | 'm4a'; bitrateKbps: number; url: string };
export type AudioTrack = { id: string; title: string; variants?: AudioVariant[]; url?: string };

type AudioEventMap = {
    statechange: CustomEvent<{ isPlaying: boolean }>;
    time: CustomEvent<{ currentTime: number; duration: number; bufferedPercent: number }>;
    ended: CustomEvent<object>;
    error: CustomEvent<{ message: string }>;
    volumechange: CustomEvent<{ volume: number; muted: boolean }>;
};

/**
 * Simple client-side audio engine for streaming one main track and controlling master volume.
 * Uses HTMLAudioElement for streaming and pipes it through Web Audio for gain control.
 */
class AudioEngineImpl {
    private audioContext: AudioContext | null = null;
    private masterGainNode: GainNode | null = null;
    private mediaElement: HTMLAudioElement | null = null;
    private mediaSourceNode: MediaElementAudioSourceNode | null = null;

    private eventTarget = new EventTarget();
    private isPlaying = false;
    private volumeNormalized = 0.5; // 0..1 persisted
    private muted = false;
    private loadToken = 0;

    private ensureContext(): void {
        if (this.audioContext) return;
        const w = window as Window & { webkitAudioContext?: typeof AudioContext };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Ctor = (window as any).AudioContext ?? w.webkitAudioContext;
        if (!Ctor) throw new Error('Web Audio API not supported');
        this.audioContext = new Ctor({ latencyHint: 'interactive' });

        try {
            const saved = localStorage.getItem('audio.masterVolume');
            if (saved != null) this.volumeNormalized = Math.max(0, Math.min(1, Number(saved)));
        } catch {
            /* ignore */
        }

        this.masterGainNode = this.audioContext!.createGain();
        this.masterGainNode.gain.value = this.perceptual(this.volumeNormalized);
        this.masterGainNode.connect(this.audioContext!.destination);
    }

    /**
     * Maps a normalized 0..1 control value to linear amplitude with a perceptual curve.
     * Account for human logarithmic loudness perception.
     */
    private perceptual(v01: number): number {
        const v = Math.max(0, Math.min(1, v01));
        return v * v;
    }

    /**
     * Smoothly transitions the master gain to the given target without audible clicks.
    *
     * @param target Linear amplitude in [0, 1]. Caller should apply perceptual mapping already.
     * @param timeMs Approximate ramp duration in milliseconds (default 60 ms).
     */
    private rampGain(target: number, timeMs = 60): void {
        if (!this.audioContext || !this.masterGainNode) return;
        const now = this.audioContext.currentTime;
        const param = this.masterGainNode.gain as AudioParam & { cancelAndHoldAtTime?: (t: number) => void };
        try {
            param.cancelAndHoldAtTime?.(now);
        } catch {
            param.cancelScheduledValues(now);
        }
        const timeConst = Math.max(0.005, timeMs / 1000);
        if (typeof param.setTargetAtTime === 'function') {
            param.setTargetAtTime(target, now, Math.min(0.05, timeConst));
        } else if (typeof param.linearRampToValueAtTime === 'function') {
            param.linearRampToValueAtTime(target, now + timeConst);
        } else {
            param.value = target;
        }
    }

    async init(): Promise<void> {
        this.ensureContext();
    }

    hasMainTrack(): boolean {
        return Boolean(this.mediaElement?.src);
    }

    // Choose best variant by simple preference: webm first if supported, else m4a
    private pickVariant(track: AudioTrack): string | null {
        if (track.url) return track.url;
        const variants = track.variants ?? [];
        const probe = document.createElement('audio');
        const webm = variants.find((v) => v.codec === 'webm');
        const m4a = variants.find((v) => v.codec === 'm4a');
        if (webm && probe.canPlayType('audio/webm')) return webm.url;
        if (m4a && (probe.canPlayType('audio/mp4') || probe.canPlayType('audio/aac'))) return m4a.url;
        return variants[0]?.url ?? null;
    }

    async loadMainTrackFromTrack(track: AudioTrack): Promise<void> {
        const url = this.pickVariant(track);
        if (!url) throw new Error('No playable variant for track');
        await this.loadMainTrack(url);
    }

    async loadMainTrack(url: string): Promise<void> {
        this.ensureContext();
        const myToken = ++this.loadToken;

        if (!this.mediaElement) {
            this.mediaElement = new Audio();
            this.mediaElement.crossOrigin = 'anonymous';
            this.mediaElement.preload = 'auto';
            this.mediaElement.loop = false;
            // @ts-expect-error - playsInline may be missing in lib dom types
            this.mediaElement.playsInline = true;

            // Attach persistent listeners once
            this.mediaElement.addEventListener('timeupdate', () => {
                this.dispatchTime();
            });
            this.mediaElement.addEventListener('ended', () => {
                this.isPlaying = false;
                this.dispatch('statechange', { isPlaying: this.isPlaying });
                this.dispatch('ended', {});
            });
            this.mediaElement.addEventListener('play', () => {
                this.isPlaying = true;
                this.dispatch('statechange', { isPlaying: this.isPlaying });
            });
            this.mediaElement.addEventListener('pause', () => {
                this.isPlaying = false;
                this.dispatch('statechange', { isPlaying: this.isPlaying });
            });
            this.mediaElement.addEventListener('error', () => {
                const err = this.mediaElement?.error ?? null;
                this.dispatch('error', { message: this.mediaErrorMessage(err as MediaError | null) });
            });
            this.mediaElement.addEventListener('loadedmetadata', () => {
                this.dispatchTime();
            });
        }

        this.mediaElement.src = url;
        this.mediaElement.load();

        if (!this.mediaSourceNode) {
            if (!this.audioContext || !this.masterGainNode || !this.mediaElement) return;
            this.mediaSourceNode = this.audioContext.createMediaElementSource(this.mediaElement);
            this.mediaSourceNode.connect(this.masterGainNode);
        }

        await new Promise<void>((resolve, reject) => {
            if (!this.mediaElement) return reject(new Error('Media element not initialized'));
            const checkReady = () => {
                if (myToken !== this.loadToken) return; // superseded by a newer load
                const el = this.mediaElement!;
                if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
                    cleanup();
                    resolve();
                }
            };
            const onCanPlay = () => {
                if (myToken !== this.loadToken) return;
                cleanup();
                resolve();
            };
            const onErr = () => {
                if (myToken !== this.loadToken) return;
                const err = this.mediaElement?.error ?? null;
                cleanup();
                reject(new Error(this.mediaErrorMessage(err as MediaError | null)));
            };
            const cleanup = () => {
                this.mediaElement?.removeEventListener('canplay', onCanPlay);
                this.mediaElement?.removeEventListener('loadeddata', checkReady);
                this.mediaElement?.removeEventListener('error', onErr);
            };
            this.mediaElement.addEventListener('canplay', onCanPlay);
            this.mediaElement.addEventListener('loadeddata', checkReady);
            this.mediaElement.addEventListener('error', onErr);
            // In case it's already buffered
            setTimeout(checkReady, 0);
        });
    }

    async play(): Promise<void> {
        this.ensureContext();
        if (!this.mediaElement) throw new Error('No main track loaded');
        if (this.audioContext?.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch {
                // Ignore; browser may require a gesture and will surface on play()
            }
        }
        try {
            await this.mediaElement.play();
        } catch (err: unknown) {
            const name = (err as Error).name || 'PlaybackError';
            if (name === 'NotAllowedError') {
                throw new Error('Playback blocked by browser. Please interact to start audio.');
            }
            throw err;
        }
    }

    pause(): void {
        if (!this.mediaElement) return;
        this.mediaElement.pause();
    }

    stop(): void {
        if (!this.mediaElement) return;
        this.mediaElement.pause();
        this.mediaElement.currentTime = 0;
    }

    setMasterVolume(volume01: number): void {
        this.ensureContext();
        if (!this.masterGainNode) return;
        this.volumeNormalized = Math.max(0, Math.min(1, volume01));
        try {
            localStorage.setItem('audio.masterVolume', String(this.volumeNormalized));
        } catch {
            /* ignore */
        }
        const target = this.muted ? 0 : this.perceptual(this.volumeNormalized);
        this.rampGain(target, 60);
        this.dispatch('volumechange', { volume: this.volumeNormalized, muted: this.muted });
    }

    getMasterVolume(): number {
        return this.volumeNormalized;
    }

    mute(): void {
        this.muted = true;
        this.rampGain(0, 60);
        this.dispatch('volumechange', { volume: this.volumeNormalized, muted: this.muted });
    }
    unmute(): void {
        this.muted = false;
        this.rampGain(this.perceptual(this.volumeNormalized), 60);
        this.dispatch('volumechange', { volume: this.volumeNormalized, muted: this.muted });
    }

    setPlaybackRate(rate: number): void {
        if (!this.mediaElement) return;
        this.mediaElement.playbackRate = Math.max(0.25, Math.min(4, rate));
    }

    seek(seconds: number): void {
        if (!this.mediaElement) return;
        const t = Math.max(0, Math.min(this.mediaElement.duration || Infinity, seconds));
        this.mediaElement.currentTime = t;
    }

    getCurrentTime(): number {
        return this.mediaElement?.currentTime ?? 0;
    }
    getDuration(): number {
        return this.mediaElement?.duration ?? 0;
    }
    getBufferedPercent(): number {
        const el = this.mediaElement;
        if (!el) return 0;
        try {
            const time = el.currentTime;
            for (let i = 0; i < el.buffered.length; i++) {
                const start = el.buffered.start(i);
                const end = el.buffered.end(i);
                if (time >= start && time <= end) {
                    const dur = el.duration || 0;
                    return dur ? Math.min(1, end / dur) : 0;
                }
            }
        } catch {
            /* ignore */
        }
        return 0;
    }

    addEventListener<K extends keyof AudioEventMap>(
        type: K,
        listener: (ev: AudioEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions,
    ): void {
        this.eventTarget.addEventListener(type, listener as EventListener, options);
    }

    removeEventListener<K extends keyof AudioEventMap>(
        type: K,
        listener: (ev: AudioEventMap[K]) => void,
        options?: boolean | EventListenerOptions,
    ): void {
        this.eventTarget.removeEventListener(type, listener as EventListener, options);
    }

    private dispatch<K extends keyof AudioEventMap>(type: K, detail: AudioEventMap[K]['detail']): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const evt = new CustomEvent(type as any, { detail }) as AudioEventMap[K];
        this.eventTarget.dispatchEvent(evt);
    }

    private dispatchTime(): void {
        this.dispatch('time', {
            currentTime: this.getCurrentTime(),
            duration: this.getDuration(),
            bufferedPercent: this.getBufferedPercent(),
        });
    }

    private mediaErrorMessage(err: MediaError | null): string {
        if (!err) return 'Unknown audio error';
        switch (err.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                return 'Audio load aborted';
            case MediaError.MEDIA_ERR_NETWORK:
                return 'Network error while loading audio';
            case MediaError.MEDIA_ERR_DECODE:
                return 'Audio decode error';
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                return 'Audio source not supported';
            default:
                return `Audio error (${err.code})`;
        }
    }
}

let singleton: AudioEngineImpl | null = null;

export function getAudioEngine(): AudioEngineImpl {
    if (!singleton) singleton = new AudioEngineImpl();
    return singleton;
}

declare global {
    interface Window {
        __audioEngine?: ReturnType<typeof getAudioEngine>;
    }
}

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    try {
        window.__audioEngine = getAudioEngine();
    } catch {
        /* ignore */
    }
}
