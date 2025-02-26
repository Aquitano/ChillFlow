import { Suspense } from 'react';
import { TaskInput } from './task-input';

export function Hero() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 h-[800px] w-[800px] rounded-full border-2 border-white/20 bg-black/80 shadow-lg">
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
                    <h1 className="mb-2 text-4xl font-medium md:text-5xl">
                        Flow into{' '}
                        <span className="font-serif text-5xl text-stone-500 italic md:text-6xl">productivity</span>
                    </h1>
                    <p className="mb-10 text-lg text-neutral-400">Relaxing beats to keep you calm and focused.</p>

                    {/* Dynamic user-specific content */}
                    <Suspense fallback={<TaskInputSkeleton />}>
                        <TaskInput />
                    </Suspense>
                </div>
            </div>
            <div className="full-flare horizontal-flare absolute" />
        </section>
    );
}

function TaskInputSkeleton() {
    return (
        <div className="mx-auto w-full max-w-xl rounded-xl border-2 border-white/20 bg-black/50 p-4 shadow-lg">
            <div className="h-10 w-full animate-pulse rounded bg-white/10" />
            <div className="mt-3 flex justify-end">
                <div className="h-9 w-24 animate-pulse rounded bg-white/10" />
            </div>
        </div>
    );
}
