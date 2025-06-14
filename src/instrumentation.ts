import { captureRequestError } from '@sentry/nextjs';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('../instrumentation-server');
    }

    // if (process.env.NEXT_RUNTIME === 'edge') {
    //     await import('../sentry.edge.config');
    // }
}

export const onRequestError = captureRequestError;
