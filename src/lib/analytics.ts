import posthog from "posthog-js";

declare function gtag(...args: unknown[]): void;

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST ?? "https://app.posthog.com";
const GA4_ID = "G-LJD6F6XCS2";

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

// ─── GA4 event name map ───────────────────────────────────────────────────────
// Maps internal event names to GA4 recommended event names where applicable.

const GA4_EVENT_MAP: Record<string, string> = {
  page_viewed:                  "page_view",
  quote_started:                "generate_lead",
  quote_result_viewed:          "view_item_list",
  courier_selected:             "select_item",
  checkout_initiated:           "begin_checkout",
  payment_started:              "add_payment_info",
  booking_confirmed:            "purchase",
  signup_completed:             "sign_up",
  login_completed:              "login",
};

function fireGA4(event: string, properties?: Record<string, unknown>) {
  if (typeof gtag === "undefined") return;
  const ga4Event = GA4_EVENT_MAP[event] ?? event;
  gtag("event", ga4Event, { ...properties, send_to: GA4_ID });
}

// ─── Event helpers ────────────────────────────────────────────────────────────

export function track(event: string, properties?: Record<string, unknown>) {
  if (KEY) posthog.capture(event, properties);
  fireGA4(event, properties);
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
