'use client';
import { cn } from '@/lib/utils';
import {
    IconAdjustmentsBolt,
    IconCloud,
    IconCurrencyDollar,
    IconEaseInOut,
    IconHeart,
    IconHelp,
    IconRouteAltLeft,
    IconTerminal2,
} from '@tabler/icons-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
    {
        title: 'Curated Lo-fi',
        description: 'Hand-picked beats and ambient sounds to match your workflow and mood.',
        icon: <IconCloud stroke={1.5} />,
        color: 'blue',
    },
    {
        title: 'Focus Timer',
        description: 'Built-in pomodoro timer with smooth music transitions for natural breaks.',
        icon: <IconEaseInOut stroke={1.5} />,
        color: 'indigo',
    },
    {
        title: 'Sound Mixing',
        description: 'Create your perfect ambiance by mixing lo-fi beats with nature sounds.',
        icon: <IconAdjustmentsBolt />,
        color: 'amber',
    },
    {
        title: 'Task Tracking',
        description: 'Keep track of your accomplishments while staying in the flow.',
        icon: <IconTerminal2 />,
        color: 'violet',
    },
    {
        title: 'Offline Mode',
        description: 'Download your favorite mixes for distraction-free focus sessions.',
        icon: <IconRouteAltLeft />,
        color: 'emerald',
    },
    {
        title: 'Smart Recommendations',
        description: 'AI-powered playlists that adapt to your productivity patterns.',
        icon: <IconHelp />,
        color: 'sky',
    },
    {
        title: 'Mood Journaling',
        description: 'Track how different sounds affect your focus and productivity.',
        icon: <IconHeart />,
        color: 'rose',
    },
    {
        title: 'Community Mixes',
        description: 'Discover and share productivity-boosting sound combinations.',
        icon: <IconCurrencyDollar />,
        color: 'teal',
    },
];

export function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center py-10 pb-20 text-center"
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase"
                >
                    IMMERSIVE FOCUS ENVIRONMENT
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
                >
                    Let the beats guide your flow.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="bg-gradient-to-r from-stone-400 to-stone-300 bg-clip-text font-serif text-4xl text-transparent md:text-5xl"
                >
                    Curated sounds for every mood.
                </motion.p>
            </motion.section>

            <section className="py-24 sm:py-32">
                <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 mx-auto grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-4"
                    >
                        {features.map((feature, index) => (
                            <Feature key={feature.title} {...feature} index={index} isInView={isInView} />
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
    color,
    isInView,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
    color: string;
    isInView: boolean;
}) => {
    const featureRef = useRef(null);

    return (
        <motion.div
            ref={featureRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
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
                    `bg-${color}-500/30`,
                )}
                aria-hidden="true"
            />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.2 + 0.05 * index, duration: 0.5 }}
                className={cn(
                    'mb-5 flex h-10 w-10 items-center justify-center rounded-lg',
                    `bg-${color}-100 dark:bg-${color}-900/20`,
                )}
            >
                <div className={`text-${color}-600 dark:text-${color}-400`}>{icon}</div>
            </motion.div>

            <div className="relative">
                <h3 className="text-base leading-7 font-semibold tracking-tight text-neutral-900 dark:text-white">
                    <motion.span
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={cn(
                            'inline-block transition-all',
                            `hover:text-${color}-600 dark:hover:text-${color}-400`,
                        )}
                    >
                        {title}
                    </motion.span>
                </h3>

                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
        </motion.div>
    );
};
