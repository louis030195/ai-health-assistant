// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";


if (process.env.SENTRY_ENABLED !== 'false' && process.env.ENVIRONMENT && process.env.ENVIRONMENT !== 'development') {
  Sentry.init({
    dsn: "https://d991f2934a8a47e3ab3c6f5789a6c4ca@o4505591122886656.ingest.sentry.io/4505591123607552",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}