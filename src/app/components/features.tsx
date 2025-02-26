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

export function FeaturesSection() {
    const features = [
        {
            title: 'Curated Lo-fi',
            description: 'Hand-picked beats and ambient sounds to match your workflow and mood.',
            icon: <IconCloud />,
        },
        {
            title: 'Focus Timer',
            description: 'Built-in pomodoro timer with smooth music transitions for natural breaks.',
            icon: <IconEaseInOut />,
        },
        {
            title: 'Sound Mixing',
            description: 'Create your perfect ambiance by mixing lo-fi beats with nature sounds.',
            icon: <IconAdjustmentsBolt />,
        },
        {
            title: 'Task Tracking',
            description: 'Keep track of your accomplishments while staying in the flow.',
            icon: <IconTerminal2 />,
        },
        {
            title: 'Offline Mode',
            description: 'Download your favorite mixes for distraction-free focus sessions.',
            icon: <IconRouteAltLeft />,
        },
        {
            title: 'Smart Recommendations',
            description: 'AI-powered playlists that adapt to your productivity patterns.',
            icon: <IconHelp />,
        },
        {
            title: 'Mood Journaling',
            description: 'Track how different sounds affect your focus and productivity.',
            icon: <IconHeart />,
        },
        {
            title: 'Community Mixes',
            description: 'Discover and share productivity-boosting sound combinations.',
            icon: <IconCurrencyDollar />,
        },
    ];
    return (
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                'group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800',
                (index === 0 || index === 4) && 'lg:border-l dark:border-neutral-800',
                index < 4 && 'lg:border-b dark:border-neutral-800',
            )}
        >
            {index < 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            {index >= 4 && (
                <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
            )}
            <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
            <div className="relative z-10 mb-2 px-10 text-lg font-bold">
                <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
                <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
    );
};
