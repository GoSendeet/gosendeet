import posthog from "posthog-js";

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST ?? "https://app.posthog.com";

export function initAnalytics() {
  if (!KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // we fire page_viewed manually
    autocapture: false,
  });
}

// ─── Identity ─────────────────────────────────────────────────────────────────

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.identify(userId, traits);
}

export function resetUser() {
  if (!KEY) return;
  posthog.reset();
}

// ─── Event helpers ────────────────────────────────────────────────────────────

export function track(event: string, properties?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.capture(event, properties);
}

// ─── Typed event constants ────────────────────────────────────────────────────

export const EVENT = {
  // Visitor
  PAGE_VIEWED: "page_viewed",

  // Calculator
  QUOTE_STARTED: "quote_started",
  QUOTE_COMPLETED: "quote_completed",
  QUOTE_RESULT_VIEWED: "quote_result_viewed",
  COURIER_SELECTED: "courier_selected",

  // Auth
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  LOGIN_STARTED: "login_started",
  LOGIN_COMPLETED: "login_completed",

  // Booking funnel
  DELIVERY_DETAILS_SUBMITTED: "delivery_details_submitted",
  CHECKOUT_INITIATED: "checkout_initiated",
  PAYMENT_STARTED: "payment_started",
  BOOKING_CONFIRMED: "booking_confirmed",

  // Post-booking
  TRACKING_VIEWED: "tracking_viewed",
  SUPPORT_OPENED: "support_opened",
} as const;
