'use client';

import { Protect, RedirectToSignIn, UserButton } from '@clerk/nextjs';
import { IconAlarm, IconMusic, IconRipple, IconSettings, IconSun, IconVolume2 } from '@tabler/icons-react';
import { useState } from 'react';

export default function FocusPage() {
    // Simple state for timer display, theme, volume, etc.
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(25 * 60); // 25:00 in seconds
    const [volume, setVolume] = useState(0.5);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
        // Add logic to actually count down the timer, etc.
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <Protect fallback={<RedirectToSignIn />}>
            <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500 text-white">
                {/* Header / Nav (optional) */}
                <header className="absolute top-0 right-0 left-0 flex items-center justify-between px-4 py-4">
                    <div className="font-sans text-xl font-bold">ChillFlow</div>
                    <nav className="flex items-center space-x-4">
                        <UserButton />
                    </nav>
                </header>

                {/* Focus Area */}
                <div className="flex flex-col items-center space-y-6 px-4 text-center">
                    <h1 className="text-2xl font-semibold tracking-wider">What do you want to focus on?</h1>

                    {/* Session Type Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30">
                            Focus
                        </button>
                        <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30">
                            Short Break
                        </button>
                        <button className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30">
                            Long Break
                        </button>
                    </div>

                    {/* Timer Display */}
                    <div className="text-7xl font-bold tabular-nums">{formatTime(time)}</div>

                    {/* Start / Stop Button */}
                    <button
                        onClick={handleStartStop}
                        className="rounded-full bg-white/20 px-8 py-3 text-xl font-semibold transition hover:bg-white/30"
                    >
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                </div>

                {/* Footer Controls */}
                <div className="fixed right-0 bottom-4 left-0 mx-auto flex max-w-md items-center justify-between rounded-md bg-white/10 p-3 shadow-lg">
                    {/* Music Selection */}
                    <button className="group flex flex-col items-center justify-center px-2 py-1 text-white transition hover:text-yellow-300">
                        <IconMusic size={24} />
                        <span className="mt-1 text-xs opacity-70 group-hover:opacity-100">Music</span>
                    </button>

                    {/* Background Noise */}
                    <button className="group flex flex-col items-center justify-center px-2 py-1 text-white transition hover:text-cyan-300">
                        <IconRipple size={24} />
                        <span className="mt-1 text-xs opacity-70 group-hover:opacity-100">Noise</span>
                    </button>

                    {/* Theme Selector */}
                    <button className="group flex flex-col items-center justify-center px-2 py-1 text-white transition hover:text-lime-300">
                        <IconSun size={24} />
                        <span className="mt-1 text-xs opacity-70 group-hover:opacity-100">Theme</span>
                    </button>

                    {/* Pomodoro Settings */}
                    <button className="group flex flex-col items-center justify-center px-2 py-1 text-white transition hover:text-pink-300">
                        <IconAlarm size={24} />
                        <span className="mt-1 text-xs opacity-70 group-hover:opacity-100">Timer</span>
                    </button>

                    {/* Volume */}
                    <button className="group flex flex-col items-center justify-center px-2 py-1 text-white transition hover:text-purple-300">
                        <IconVolume2 size={24} />
                        <span className="mt-1 text-xs opacity-70 group-hover:opacity-100">Volume</span>
                    </button>

                    {/* General Settings */}
                    <button className="group flex flex-col items-center justify-center px-2 py-1 text-white transition hover:text-blue-300">
                        <IconSettings size={24} />
                        <span className="mt-1 text-xs opacity-70 group-hover:opacity-100">Settings</span>
                    </button>
                </div>
            </main>
        </Protect>
    );
}
