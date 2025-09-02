"use client";

import { useEffect, useMemo } from 'react';
import { getAudioEngine } from './engine';

export function useAudioEngine() {
    const engine = useMemo(() => getAudioEngine(), []);

    useEffect(() => {
        // Initialize context on mount; resume on user gesture in play()
        engine.init().catch(() => { });
        // no teardown required; singleton is kept
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return engine;
}
