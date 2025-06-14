'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store/app-store';
import { motion } from 'framer-motion';
import { Heart, Music, Pause, Play, Repeat, SkipBack, SkipForward, ThumbsDown, Volume2 } from 'lucide-react';
import { useMemo } from 'react';

export const PlayerControls: React.FC = () => {
    const isPlaying = useAppStore((state) => state.isPlaying);
    const volume = useAppStore((state) => state.volume);
    const togglePlay = useAppStore((state) => state.togglePlay);
    const setVolume = useAppStore((state) => state.setVolume);
    const currentTrack = useAppStore((state) => state.currentTrack);
    const lastTrack = useAppStore((state) => state.lastTrack);

    const currentMode = useAppStore((state) => state.currentMode);
    const modes = useAppStore((state) => state.modes);

    const { showStreak } = useMemo(
        () => ({
            showStreak: modes[currentMode]?.showStreak ?? false,
        }),
        [currentMode, modes],
    );

    return (
        <motion.div
            className="absolute right-0 bottom-0 left-0 z-30 flex items-center justify-between bg-black/60 p-4 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
        >
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-md bg-gradient-to-br from-stone-400 to-stone-600 shadow-md" />
                <div className="text-left">
                    <h2 className="text-base font-semibold">{currentTrack?.title ?? 'Jovie'}</h2>
                    <p className="text-sm text-stone-400">by {currentTrack?.artist ?? 'Medium Neural Effect'}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <Heart size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ThumbsDown size={16} />
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" disabled={!lastTrack}>
                    <SkipBack size={18} />
                </Button>

                <Button onClick={togglePlay} className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30">
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </Button>

                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <SkipForward size={18} />
                </Button>

                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <Repeat size={16} />
                </Button>
            </div>

            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <Music size={16} />
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Volume2 size={16} className="text-stone-400" />
                    <div className="w-24">
                        <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="cursor-pointer"
                        />
                    </div>
                </div>

                {showStreak && (
                    <div className="ml-1 flex items-center space-x-1 rounded-full bg-stone-800/70 px-2 py-1">
                        <span className="text-xs font-medium text-stone-300">1-week streak</span>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xs font-bold">
                            ✓
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
