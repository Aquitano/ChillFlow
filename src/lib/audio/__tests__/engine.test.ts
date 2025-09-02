import { describe, expect, it } from 'vitest';
import { getAudioEngine } from '../engine';

describe('AudioEngine', () => {
    it('initializes and exposes engine methods', async () => {
        const engine = getAudioEngine();
        await engine.init();
        expect(engine.getMasterVolume()).toBeGreaterThanOrEqual(0);
        expect(engine.getMasterVolume()).toBeLessThanOrEqual(1);
        expect(engine.hasMainTrack()).toBe(false);
    });

    it('loads a track and updates hasMainTrack', async () => {
        const engine = getAudioEngine();
        await engine.init();
        await engine.loadMainTrack('https://example.com/audio.webm');
        expect(engine.hasMainTrack()).toBe(true);
    });

    it('plays and pauses without throwing', async () => {
        const engine = getAudioEngine();
        await engine.init();
        await engine.loadMainTrack('https://example.com/audio.webm');
        const states: boolean[] = [];
        engine.addEventListener('statechange', (e: CustomEvent<{ isPlaying: boolean }>) => { states.push(e.detail!.isPlaying); });
        await expect(engine.play()).resolves.toBeUndefined();
        expect(states.length).toBeGreaterThan(0);
        expect(states[states.length - 1]!).toBe(true);
        engine.pause();
        expect(states.length).toBeGreaterThan(0);
        expect(states[states.length - 1]!).toBe(false);
    });

    it('sets and persists volume with perceptual mapping', async () => {
        const engine = getAudioEngine();
        await engine.init();
        engine.setMasterVolume(0.7);
        expect(engine.getMasterVolume()).toBeCloseTo(0.7, 3);
        // @ts-expect-error test shim injects vi-mock
        const calls = globalThis.localStorage.setItem.mock.calls;
        expect(calls[0]).toEqual(['audio.masterVolume', '0.7']);
    });

    it('mute/unmute toggles volumechange events', async () => {
        const engine = getAudioEngine();
        await engine.init();
        const volEvents: Array<{ volume: number; muted: boolean }> = [];
        engine.addEventListener('volumechange', (e: CustomEvent<{ volume: number; muted: boolean }>) => volEvents.push(e.detail!));
        engine.mute();
        engine.unmute();
        expect(volEvents.length).toBeGreaterThanOrEqual(2);
        expect(volEvents[0]!.muted).toBe(true);
        expect(volEvents[volEvents.length - 1]!.muted).toBe(false);
    });

    it('time event includes currentTime, duration, bufferedPercent', async () => {
        const engine = getAudioEngine();
        await engine.init();
        await engine.loadMainTrack('https://example.com/audio.webm');
        const times: Array<{ currentTime: number; duration: number; bufferedPercent: number }> = [];
        engine.addEventListener('time', (e: CustomEvent<{ currentTime: number; duration: number; bufferedPercent: number }>) => times.push(e.detail!));
        // Ensure at least one dispatch occurs after listener registration
        (engine as unknown as { dispatchTime: () => void }).dispatchTime();
        expect(times.length).toBeGreaterThan(0);
        expect(times[0]!.duration).toBeGreaterThan(0);
        expect(times[0]!.bufferedPercent).toBeGreaterThanOrEqual(0);
        expect(times[0]!.bufferedPercent).toBeLessThanOrEqual(1);
    });
});
