'use client';

// Simple client-side audio engine for streaming one main track and controlling master volume.
// Uses HTMLAudioElement for streaming and pipes it through Web Audio for gain control (and future effects).

export type AudioVariant = { codec: 'webm' | 'm4a'; bitrateKbps: number; url: string };
export type AudioTrack = { id: string; title: string; variants?: AudioVariant[]; url?: string };

class AudioEngineImpl {
    private audioContext: AudioContext | null = null;
    private masterGainNode: GainNode | null = null;
    private mediaElement: HTMLAudioElement | null = null;
    private mediaSourceNode: MediaElementAudioSourceNode | null = null;

    private ensureContext(): void {
        if (this.audioContext) return;
        const w = window as Window & { webkitAudioContext?: typeof AudioContext };
        const Ctor = window.AudioContext ?? w.webkitAudioContext;
        if (!Ctor) throw new Error('Web Audio API not supported');
        this.audioContext = new Ctor();
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.gain.value = 0.5;
        this.masterGainNode.connect(this.audioContext.destination);
    }

    async init(): Promise<void> {
        this.ensureContext();
        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    hasMainTrack(): boolean {
        return Boolean(this.mediaElement?.src);
    }

    // Choose best variant by simple preference: webm first if supported, else m4a
    private pickVariant(track: AudioTrack): string | null {
        if (track.url) return track.url;
        const variants = track.variants ?? [];
        const probe = document.createElement('audio');
        const webm = variants.find(v => v.codec === 'webm');
        const m4a = variants.find(v => v.codec === 'm4a');
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
        if (!this.mediaElement) {
            this.mediaElement = new Audio();
            this.mediaElement.crossOrigin = 'anonymous';
            this.mediaElement.preload = 'auto';
            this.mediaElement.loop = false;
        }

        this.mediaElement.oncanplaythrough = null;
        this.mediaElement.onerror = null;

        this.mediaElement.src = url;
        this.mediaElement.load();

        if (!this.mediaSourceNode) {
            if (!this.audioContext || !this.masterGainNode || !this.mediaElement) return;
            this.mediaSourceNode = this.audioContext.createMediaElementSource(this.mediaElement);
            this.mediaSourceNode.connect(this.masterGainNode);
        }

        await new Promise<void>((resolve, reject) => {
            if (!this.mediaElement) return reject(new Error('Media element not initialized'));
            const onReady: () => void = () => {
                if (!this.mediaElement) return;
                this.mediaElement.oncanplaythrough = null;
                this.mediaElement.onerror = null;
                resolve();
            };
            const onErr: OnErrorEventHandler = () => {
                if (!this.mediaElement) return;
                const err = this.mediaElement.error as MediaError | null;
                const code = err?.code ?? 0;
                this.mediaElement.oncanplaythrough = null;
                this.mediaElement.onerror = null;
                reject(new Error(`Audio load error (${code})`));
            };
            this.mediaElement.oncanplaythrough = onReady;
            this.mediaElement.onerror = onErr;
        });
    }

    async play(): Promise<void> {
        this.ensureContext();
        if (!this.mediaElement) throw new Error('No main track loaded');
        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume();
        }
        await this.mediaElement.play();
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
        if (!this.masterGainNode) return;
        const v = Math.max(0, Math.min(1, volume01));
        this.masterGainNode.gain.value = v * v; // simple perceptual mapping
    }
}

let singleton: AudioEngineImpl | null = null;

export function getAudioEngine(): AudioEngineImpl {
    if (!singleton) singleton = new AudioEngineImpl();
    return singleton;
}
