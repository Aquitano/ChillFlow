'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store/app-store';
import { motion } from 'framer-motion';
import { Activity, ChevronDown, Menu } from 'lucide-react';

export const AppHeader: React.FC = () => {
    const modes = useAppStore((state) => state.modes);
    const currentMode = useAppStore((state) => state.currentMode);
    const toggleMenu = useAppStore((state) => state.toggleMenu);
    const setMode = useAppStore((state) => state.setMode);

    const currentModeSettings = modes[currentMode];

    return (
        <motion.header
            className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Activity select dropdown with mode description */}
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 pl-1 text-sm font-normal">
                            <Activity size={18} />
                            <span>{currentModeSettings?.label ?? 'Select Mode'}</span>
                            <ChevronDown size={16} className="ml-1 text-neutral-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 border-neutral-800 bg-black/90 backdrop-blur-md">
                        <DropdownMenuLabel>Flow Modes</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-neutral-800" />
                        {Object.keys(modes ?? {}).map((modeKey) => (
                            <DropdownMenuItem
                                key={modeKey}
                                className={`flex flex-col items-start py-3 ${currentMode === modeKey ? 'bg-neutral-800/50' : ''}`}
                                onClick={() => setMode(modeKey)}
                            >
                                <span className="font-medium">{modes[modeKey]?.label ?? modeKey}</span>
                                <span className="mt-1 text-xs text-neutral-400">
                                    {modes[modeKey]?.description ?? ''}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center">
                <motion.div
                    className="mr-4 rounded-full bg-yellow-400/20 px-4 py-1 text-sm text-yellow-200"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    Trial ends in 2 days
                </motion.div>
                <Button variant="outline" size="sm" className="mr-2 border-white/20">
                    Subscribe
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <Menu size={18} />
                </Button>
            </div>
        </motion.header>
    );
};
