'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Heart, LayoutGrid, Pencil, Settings, Users } from 'lucide-react';

export const FeatureMenu: React.FC = () => {
    const isMenuOpen = useAppStore((state) => state.isMenuOpen);
    const setMenuOpen = useAppStore((state) => state.setMenuOpen);
    const modes = useAppStore((state) => state.modes);
    const currentMode = useAppStore((state) => state.currentMode);

    return (
        <>
            <motion.div
                className="fixed top-0 right-0 z-40 h-full w-72 bg-black/80 p-6 backdrop-blur-md"
                initial={{ x: '100%' }}
                animate={{ x: isMenuOpen ? 0 : '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Features</h3>
                    <Button variant="ghost" size="sm" onClick={() => setMenuOpen(false)}>
                        Close
                    </Button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="mb-3 text-xs tracking-wider text-stone-400 uppercase">Flow Tools</h4>
                        <div className="space-y-2">
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Clock className="mr-2 h-4 w-4" /> Focus Timer
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" /> Sound Mixing
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <LayoutGrid className="mr-2 h-4 w-4" /> Backgrounds
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 text-xs tracking-wider text-stone-400 uppercase">Productivity</h4>
                        <div className="space-y-2">
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Pencil className="mr-2 h-4 w-4" /> Tasks
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Heart className="mr-2 h-4 w-4" /> Journal
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 text-xs tracking-wider text-stone-400 uppercase">Community</h4>
                        <div className="space-y-2">
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" /> Shared Mixes
                            </Button>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <div className="rounded-lg border border-neutral-800 bg-black/40 p-4">
                            <h4 className="mb-1 text-sm font-medium">Current Mode</h4>
                            <p className="text-xs text-neutral-400">{modes[currentMode]?.description ?? ''}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
