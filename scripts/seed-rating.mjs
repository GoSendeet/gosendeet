/**
 * Seed a 5-star rating for a booking on GoSendeet.
 *
 * Usage:
 *   node scripts/seed-rating.mjs <bookingId> <authToken>
 *
 * Example:
 *   node scripts/seed-rating.mjs abc-123 eyJhbGci...
 */

const BASE_URL = "https://beta-api.gosendeet.com/api/v1";

const [, , bookingId, authToken] = process.argv;

if (!bookingId || !authToken) {
  console.error("Usage: node scripts/seed-rating.mjs <bookingId> <authToken>");
  process.exit(1);
}

const payload = {
  bookingId,
  score: 5,
  comment: "Excellent service!",
};

console.log(`Posting 5-star rating for booking: ${bookingId}`);

const res = await fetch(`${BASE_URL}/ratings`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  },
  body: JSON.stringify(payload),
});

const data = await res.json();

if (!res.ok) {
  console.error("Failed:", data);
  process.exit(1);
}

console.log("Success:", data);
