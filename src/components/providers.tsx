'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HTTPException } from 'hono/http-exception';
import dynamic from 'next/dynamic';
import { PropsWithChildren, useState } from 'react';
const AudioDebugTrigger =
    process.env.NODE_ENV === 'development'
        ? dynamic(() => import('./dev/AudioDebugPanel').then((m) => m.AudioDebugTrigger), { ssr: false })
        : ((() => null) as unknown as React.FC);

export const Providers = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (err) => {
                        if (err instanceof HTTPException) {
                            // global error handling, e.g. toast notification ...
                        }
                    },
                }),
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' ? <AudioDebugTrigger /> : null}
        </QueryClientProvider>
    );
};
