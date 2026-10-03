# Landing page visual migration

The approved dark human-photo mock defines the homepage appearance. Existing form hooks, validation, address and package selection callbacks, quote request payloads, saved inputs and tracking navigation remain in use.

`appearance="landing"` scopes the new form presentation. The public calculator also uses the modern form; dashboard and embedded forms retain their default appearance. The homepage renders one responsive form instance so resizing does not discard entered data.

The address and package popovers retain their existing content and handlers. Landing popovers use viewport collision handling and available-height scrolling. Address popup dismissal suppresses automatic focus restoration because the address anchor opens on focus; restoring focus would reopen the dismissed popup. The existing pickup autofocus on page load is retained.

The homepage now includes the hero/form, courier/support strip, route cards, combined three-step section, customer-story area, FAQ and published guides. The original navigation logo and full footer are retained, with Blog before Developer. Decorative CTA arrows and gradients have been replaced by simpler labels and solid colors. Weight appears before package type, and manual entry/current-location actions use inline link styling, with Use location first. Route cards open the existing comparison calculator. All three preset routes seed both address searches and clears stale selected addresses; full addresses must still be selected before submitting. The quote page retains its original results, filters and surrounding layout with only the form modernized. Primary CTA blocks appear after FAQ and after guides. The Ikeja–Lekki starting-price copy is the ₦2,000 supplied in the design brief. Customer stories use the Toheeb and Chioma accounts supplied by the user, lightly edited for clarity. FEZ testimonials and source links were removed. Each story displays the five-star rating requested by the user. More spacing separates the form, carrier strip and route cards. FEZ’s official SVG logo is stored locally. Guide links target existing published articles.

## Assets

Built-in imagegen produced `public/images/landing/hero.webp`, `handoff.webp`, `routes.webp` and `guides.webp`. Images were resized and WebP encoded for a combined payload of approximately 295 KB. The route and guide images are shared triptychs displayed through CSS background positioning. Imagery is illustrative.

The complete generation prompts and original source paths are saved in `output/imagegen/landing-assets-prompts.json`.

## Verification

- Production build: `npm run build`.
- Source tests: `npx vitest run src` (15 tests).
- Blog tests: `npm run test:blog` (6 tests).
- Browser behavior: `env -u ELECTRON_RUN_AS_NODE npx cypress run --spec cypress/e2e/landing.cy.ts --config baseUrl=http://127.0.0.1:5173` (12 scenarios; run a Vite preview first).

Browser checks cover incomplete-form validation, geolocation denial, manual addresses, package/weight changes, state retention through tracking and responsive resizing, the quote request payload and calculator navigation, tracking validation/API errors, all route prefills, stale-address protection and guide/CTA navigation. Quotes/tracking/package API responses are stubbed; no booking is made.

`npm test` runs source tests with Vitest and blog tests with Node, avoiding the previous mixed-runner failure.

## Quote and tracking updates

The public quote page uses the same modern form presentation and explicit comparison/tracking tabs. Existing results, filter, booking and sharing handlers remain in use. The original results section, filters and initial empty state are restored.

Tracking previously checked an object response for an array length and could render a blank page after a successful lookup. It now checks for the booking tracking number, trims the submitted reference, keeps that reference in the results URL for refresh, and avoids requests with an undefined tracking number. A browser regression verifies a successful object response and reload.

Landing address popups match their anchor width and align to its start edge. Tracking uses a flexible input and a 220px desktop CTA, stacking on smaller screens. Presentation-specific assertions for exact popup geometry, button widths and borders were removed.

Route presets also seed manual-entry city/state selections. Lekki, Yaba and Victoria Island are included in the Lagos location options. Edited search text must match a confirmed address before quotes can be submitted, preventing an old selected address from being sent silently. Keyboard form submission now invokes the same quote handler as the CTA.

## Maintainability cleanup

The home and quote pages share `DeliveryFormModeSwitcher`. Form presentation lives beside the reusable form in `components/quote-form/appearance.css`, independent of the landing-page layout. Saved quote reading and normalization live in a pure data module shared by the form, calculator and quote submission; malformed storage falls back to an empty form. The save callback is stable, avoiding unnecessary preset-effect runs. Landing CTAs and story cards use shared rendering. Unused landing CSS and the previous V3 stylesheet import were removed. Address actions are grouped with a small responsive gap instead of spreading across the popup. Existing end-to-end journeys remain; no component tests were added.
