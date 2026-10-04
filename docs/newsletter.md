# Email signup

The homepage signup sits inside the guides section, directly below the cards, without a divider or separate card. Blog index and detail pages share the same inline form; both pages also show a centered, dismissible modal with a backdrop, focus trap and page scroll lock immediately on page load without a delay or scrolling. The modal is shown once per browser, shared across blog listing and detail pages. Showing it records a persistent seen flag, so navigation and reloads do not repeat it. Successful subscription suppresses popups and updates all mounted signup forms. There is no manual trigger link. No email address is stored in browser storage.

The server-only `api/subscribe.mjs` reuses the Kit account from the `gosendeet-landing` repository. Local credentials are in ignored `.env.local`. Configure `KIT_API_KEY` in the Vercel project's Preview/Production environment before deploying. Do not use a `VITE_` prefix. No Kit secret is needed for API v4. Vite dev and build previews serve the same handler locally via `scripts/newsletter-dev.mjs`; the explicit API rewrite keeps production requests out of the SPA fallback.

Signups create active subscribers, with repeat requests handled by Kit's upsert. Previously unsubscribed or inactive addresses return a support message rather than falsely reporting success. They are not tagged as the old waitlist. The form asks for email only and displays the newsletter purpose, privacy link and unsubscribe note. Kit's existing account settings/automations control subsequent mail; this change does not create broadcasts or automations.

Reference: https://developers.kit.com/api-reference/subscribers/create-a-subscriber

Behavior checks: `env -u ELECTRON_RUN_AS_NODE npx cypress run --spec cypress/e2e/newsletter.cy.ts --config baseUrl=http://127.0.0.1:5173`. Browser tests intercept subscriptions so test emails do not enter the real list.

The form and modal share one subscription store through `useNewsletterSubscription`. Browser storage is authoritative when available, with an in-memory fallback when disabled. The modal belongs to the blog page, outside the static article renderer. Server credentials load only when the local API middleware starts, not during the browser build.

Review cleanup also prevents the public quote page from fetching the unfiltered response a second time after form submission. Changes to delivery/provider/price filters still fetch updated results.
