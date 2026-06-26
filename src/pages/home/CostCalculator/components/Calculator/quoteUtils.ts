import { NIGERIAN_STATES_AND_CITIES } from "@/constants/nigeriaLocations";

export const APP_BASE_URL = window.location.origin.replace(/\/$/, "");
export const PRICE_MIN = 0;
export const PRICE_STEP = 200;
export const PAGE_SIZE = 8;

export const parsePrice = (
  price: string | number | undefined | null,
): number => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
};

export const normalizeQuotesResponse = (response: any): any[] => {
  if (Array.isArray(response?.data?.content)) {
    return response.data.content;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  if (Array.isArray(response?.content)) {
    return response.content;
  }
  return [];
};

const CITY_TO_STATE = NIGERIAN_STATES_AND_CITIES.reduce<Record<string, string>>(
  (acc, { state, cities }) => {
    cities.forEach((city) => {
      acc[city.toLowerCase()] = state;
    });
    return acc;
  },
  {},
);

export const extractStateFromAddress = (address?: string): string => {
  if (!address) return "";
  const lowerAddress = address.toLowerCase();

  for (const state of NIGERIAN_STATES_AND_CITIES) {
    if (lowerAddress.includes(state.state.toLowerCase())) {
      return state.state;
    }
  }

  for (const [city, state] of Object.entries(CITY_TO_STATE)) {
    if (lowerAddress.includes(city)) {
      return state;
    }
  }

  const parts = address.split(",").map((part) => part.trim());
  return parts[parts.length - 1] || "";
};

export const getDeliverySpeedFromBoolean = (
  nextDayDelivery: boolean,
): string => {
  return nextDayDelivery ? "Next Day" : "Same Day";
};

const getFirstDate = (dateRange: string) => {
  if (!dateRange) return Infinity;

  const firstPart = dateRange.split("-")[0].trim();
  const currentYear = new Date().getFullYear();
  const parsed = new Date(`${firstPart} ${currentYear}`);

  return isNaN(parsed.getTime()) ? Infinity : parsed.getTime();
};

const getWindowDays = (dateRange: string) => {
  if (!dateRange) return Infinity;

  const parts = dateRange.split("-");
  if (parts.length < 2) return Infinity;

  const currentYear = new Date().getFullYear();
  const start = new Date(`${parts[0].trim()} ${currentYear}`);
  const end = new Date(`${parts[1].trim()} ${currentYear}`);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return Infinity;

  return end.getTime() - start.getTime();
};

export const sortQuotes = (quotes: any[], sortBy: string) => {
  const sorted = [...quotes];

  if (sortBy === "price-asc") {
    sorted.sort((a: any, b: any) => parsePrice(a?.price) - parsePrice(b?.price));
  } else if (sortBy === "price-desc") {
    sorted.sort((a: any, b: any) => parsePrice(b?.price) - parsePrice(a?.price));
  } else if (sortBy === "delivery-fastest") {
    sorted.sort((a: any, b: any) => {
      const dateDiff =
        getFirstDate(a?.estimatedDeliveryDate) -
        getFirstDate(b?.estimatedDeliveryDate);

      if (dateDiff !== 0) return dateDiff;

      return (
        getWindowDays(a?.estimatedDeliveryDate) -
        getWindowDays(b?.estimatedDeliveryDate)
      );
    });
  }

  return sorted;
};

export const buildQuotePayload = (bookingRequest: any) => {
  if (!bookingRequest || Object.keys(bookingRequest).length === 0) return [];
  return [
    {
      ...bookingRequest,
      itemValue: Number(
        bookingRequest.itemValue ?? bookingRequest.itemPrice ?? 0,
      ),
      quantity: bookingRequest.quantity ?? 1,
      packageDescription: bookingRequest.packageDescription ?? {
        isFragile: false,
        isPerishable: false,
        isExclusive: false,
        isHazardous: false,
      },
    },
  ];
};

export const buildPackageSummary = (bookingRequest: any) =>
  [
    bookingRequest?.packageName || "1 package",
    bookingRequest?.weight ? `${bookingRequest.weight}kg` : null,
    bookingRequest?.itemPrice
      ? `₦${parsePrice(bookingRequest.itemPrice).toLocaleString()} value`
      : null,
  ]
    .filter(Boolean)
    .join(" • ");
