// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: 'https://3d18c3bb201160f38c93c82864177b4d@o4507236884676608.ingest.de.sentry.io/4508881947787344',

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    spotlight: process.env.NODE_ENV === 'development',
    enabled: process.env.NODE_ENV === 'production',
});
