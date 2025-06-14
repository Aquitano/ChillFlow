'use client';

import { AppHeader } from '@/components/app/AppHeader';
import { CenterContent } from '@/components/app/CenterContent';
import { FeatureMenu } from '@/components/app/FeatureMenu';
import { PlayerControls } from '@/components/app/PlayerControls';
import { useAppStore } from '@/store/app-store';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';

export default function AppPage() {
    const currentMode = useAppStore((state) => state.currentMode);
    const modes = useAppStore((state) => state.modes);

    const showBackground = modes[currentMode]?.showBackground || false;

    useEffect(() => {
        console.log('Current mode:', currentMode);
        console.log('Mode settings:', modes[currentMode]);
    }, [currentMode, modes]);

    return (
        <main
            className={`relative min-h-screen w-screen overflow-hidden text-white ${
                showBackground ? 'bg-cover bg-center bg-no-repeat' : 'bg-black'
            }`}
            style={
                showBackground
                    ? {
                          backgroundImage: "url('https://source.unsplash.com/1600x900/?nature,calm')",
                      }
                    : {}
            }
        >
            {showBackground && (
                <div className="absolute inset-0 bg-black/60" style={{ backgroundBlendMode: 'overlay' }} />
            )}

            <AnimatePresence>
                {showBackground && (
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        style={{
                            background: 'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 50%)',
                        }}
                    />
                )}
            </AnimatePresence>

            <AppHeader />
            <FeatureMenu />
            <CenterContent />
            <PlayerControls />

            <AnimatePresence>
                {showBackground && (
                    <motion.div
                        className="absolute right-0 bottom-0 left-0 h-80 opacity-30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                        style={{
                            background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.2), transparent 70%)',
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
