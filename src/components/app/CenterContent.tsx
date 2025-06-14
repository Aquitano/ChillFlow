'use client';

import { useAppStore } from '@/store/app-store';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { TimerPanel } from './TimerPanel';

export const CenterContent: React.FC = () => {
    const currentMode = useAppStore((state) => state.currentMode);
    const modes = useAppStore((state) => state.modes);
    const currentQuote = useAppStore((state) => state.currentQuote);
    const tasks = useAppStore((state) => state.tasks);

    const showQuote = modes[currentMode]?.showQuote || false;
    const showBackground = modes[currentMode]?.showBackground || false;
    const showTasks = modes[currentMode]?.showTasks || false;

    useEffect(() => {
        console.log('CenterContent - Mode:', currentMode);
        console.log('CenterContent - Show tasks:', showTasks);
        console.log('CenterContent - Tasks:', tasks);
    }, [currentMode, showTasks, tasks]);

    return (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">
                {showTasks && (
                    <motion.aside
                        key="tasks-panel"
                        className="absolute top-24 left-6 z-20 w-64 rounded-md bg-black/70 p-4 shadow-lg"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="mb-2 text-lg font-semibold">Tasks</h3>
                        <ul className="space-y-1 text-sm text-stone-200">
                            {tasks?.map((task) => <li key={task.id}>• {task.text}</li>)}
                        </ul>
                    </motion.aside>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <TimerPanel />
            </AnimatePresence>

            <motion.div
                className={`relative z-10 flex h-[600px] w-[600px] flex-col items-center justify-center rounded-full ${
                    showBackground ? 'border-2 border-white/20 bg-black/60 shadow-lg' : 'border-none bg-black'
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <AnimatePresence mode="wait">
                    {showQuote && currentQuote && (
                        <motion.div
                            key="quote-display"
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="mb-4 bg-gradient-to-r from-white to-stone-300 bg-clip-text font-serif text-4xl font-bold text-transparent md:text-5xl">
                                {currentQuote.text}
                            </h1>
                            <p className="text-xl text-stone-400 italic md:text-2xl">— {currentQuote.author} —</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
