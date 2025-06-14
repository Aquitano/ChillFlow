'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRef } from 'react';

interface FeatureProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
    color: string;
    isInView: boolean;
}

export const Feature = ({ title, description, icon, index, color, isInView }: FeatureProps) => {
    const featureRef = useRef(null);

    const colorClasses = {
        iconBg: `bg-${color}-100 dark:bg-${color}-900/20`,
        iconColor: `text-${color}-600 dark:text-${color}-400`,
        accentLine: `bg-${color}-500 dark:bg-${color}-400`,
        hoverTitle: `hover:text-${color}-600 dark:hover:text-${color}-400`,
        hoverBg: `bg-${color}-500/30`,
    };

    return (
        <motion.div
            ref={featureRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
                delay: 0.1 * index,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
                'group relative flex flex-col p-6 lg:p-8',
                'border-neutral-200 dark:border-neutral-800',
                'hover:bg-neutral-50 dark:hover:bg-neutral-900/50',
                'transition-all duration-300 ease-in-out',
                (index === 0 || index === 4) && 'lg:border-l',
                index < 4 && 'lg:border-b',
                index % 4 !== 3 && 'lg:border-r',
            )}
        >
            <div
                className={cn(
                    'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10',
                    colorClasses.hoverBg,
                )}
                aria-hidden="true"
            />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.2 + 0.05 * index, duration: 0.5 }}
                className={cn('mb-5 flex h-12 w-12 items-center justify-center rounded-lg', colorClasses.iconBg)}
            >
                <div className={colorClasses.iconColor}>{icon}</div>
            </motion.div>

            <div className="relative">
                <h3 className="text-base leading-7 font-semibold tracking-tight text-neutral-900 dark:text-white">
                    <motion.span
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={cn('inline-block transition-all', colorClasses.hoverTitle)}
                    >
                        {title}
                    </motion.span>
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
        </motion.div>
    );
};
