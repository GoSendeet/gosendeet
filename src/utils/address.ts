import { NIGERIAN_STATES_AND_CITIES } from "@/constants/nigeriaLocations";
import type { ManualAddressData } from "@/types/forms";
import { sanitizeStreetInput } from "@/utils/form-validators";

export const normalizeStateKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*state$/, "")
    .trim();

export const normalizeCityKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

export const STATE_CITY_MAP = NIGERIAN_STATES_AND_CITIES.reduce<
  Record<string, string[]>
>((acc, { state, cities }) => {
  acc[state] = [...cities].sort((a, b) => a.localeCompare(b));
  return acc;
}, {});

export const STATE_LOOKUP = Object.keys(STATE_CITY_MAP).reduce<
  Record<string, string>
>((acc, state) => {
  acc[normalizeStateKey(state)] = state;
  return acc;
}, {});

export const CITY_STATE_MAP = NIGERIAN_STATES_AND_CITIES.reduce<
  Record<string, string>
>((acc, { state, cities }) => {
  cities.forEach((city) => {
    acc[city] = state;
  });
  return acc;
}, {});

export const NORMALIZED_CITY_LOOKUP = Object.keys(CITY_STATE_MAP).reduce<
  Record<string, string>
>((acc, city) => {
  acc[normalizeCityKey(city)] = city;
  return acc;
}, {});

export const STATE_OPTIONS = Object.keys(STATE_CITY_MAP).sort((a, b) =>
  a.localeCompare(b),
);

export const ALL_CITIES = Object.keys(CITY_STATE_MAP).sort((a, b) =>
  a.localeCompare(b),
);

export const isLagosState = (state?: string) =>
  normalizeStateKey(state || "") === "lagos";

export const isOyoState = (state?: string) =>
  normalizeStateKey(state || "") === "oyo";

export const isIbadanCity = (city?: string) =>
  normalizeCityKey(city || "").startsWith("ibadan");

export const getCanonicalCityMatch = (city?: string) => {
  if (!city) return "";

  const normalizedCity = normalizeCityKey(city);
  const exactMatch = NORMALIZED_CITY_LOOKUP[normalizedCity];

  if (exactMatch) return exactMatch;

  return (
    Object.keys(NORMALIZED_CITY_LOOKUP).find(
      (canonicalCity) =>
        normalizedCity.startsWith(`${canonicalCity} -`) ||
        normalizedCity.startsWith(`${canonicalCity},`) ||
        normalizedCity.startsWith(`${canonicalCity} `),
    ) || ""
  );
};

export const inferAllowedLocationFromText = (value?: string) => {
  const normalizedValue = normalizeCityKey(value || "");

  if (!normalizedValue) return null;

  if (
    normalizedValue.startsWith("ibadan -") ||
    normalizedValue.startsWith("ibadan,") ||
    normalizedValue.includes(" ibadan -") ||
    normalizedValue.includes(", ibadan")
  ) {
    return { city: "Ibadan", state: "Oyo State" };
  }

  if (
    normalizedValue.includes("lagos - ibadan expressway") ||
    normalizedValue.includes("lagos ibadan expressway") ||
    normalizedValue.includes("ibadan expressway, lagos")
  ) {
    return { city: "Lagos", state: "Lagos State" };
  }

  if (
    normalizedValue.includes("lagos") ||
    normalizedValue.includes("ikeja") ||
    normalizedValue.includes("ikorodu") ||
    normalizedValue.includes("mushin") ||
    normalizedValue.includes("shomolu") ||
    normalizedValue.includes("somolu") ||
    normalizedValue.includes("epe") ||
    normalizedValue.includes("lekki") ||
    normalizedValue.includes("badagry")
  ) {
    return {
      city: normalizedValue.includes("lagos") ? "Lagos" : "",
      state: "Lagos State",
    };
  }

  if (normalizedValue.includes("ibadan") && normalizedValue.includes("oyo")) {
    return { city: "Ibadan", state: "Oyo State" };
  }

  return null;
};

export const resolveStateForValidation = (state?: string, city?: string) => {
  if (state) return state;
  if (!city) return "";
  const canonicalCity = getCanonicalCityMatch(city);
  return canonicalCity ? CITY_STATE_MAP[canonicalCity] : "";
};

export const isDeliveryLocationAllowed = (state?: string, city?: string) => {
  const resolvedState = resolveStateForValidation(state, city);

  if (isLagosState(resolvedState)) return true;
  if (isOyoState(resolvedState)) return isIbadanCity(city);
  return false;
};

export const resolveStateValue = (value?: string) => {
  if (!value) return "";
  return STATE_LOOKUP[normalizeStateKey(value)] || "";
};

export const resolveCityValue = (city?: string, state?: string) => {
  if (!city) return "";

  const normalizedCity = normalizeCityKey(city);
  const canonical = getCanonicalCityMatch(city);

  if (canonical) return canonical;

  const canonicalState = state
    ? STATE_LOOKUP[normalizeStateKey(state)]
    : undefined;

  if (canonicalState && STATE_CITY_MAP[canonicalState]) {
    const fromState = STATE_CITY_MAP[canonicalState].find(
      (stateCity) => normalizeCityKey(stateCity) === normalizedCity,
    );

    if (fromState) return fromState;
  }

  return city;
};

export const getCityOptions = (state?: string) => {
  if (state && STATE_CITY_MAP[state]) return [...STATE_CITY_MAP[state]];
  return [...ALL_CITIES];
};

export const parseAddressComponents = (
  components: google.maps.GeocoderAddressComponent[],
  placeName?: string,
): Partial<ManualAddressData> => {
  let premise = "";
  let streetNumber = "";
  let route = "";
  let sublocality = "";
  let sublocalityLevel1 = "";
  let sublocalityLevel2 = "";
  let neighborhood = "";
  let city = "";
  let state = "";

  for (const component of components) {
    const type = component.types[0];

    switch (type) {
      case "premise":
        premise = component.long_name;
        break;
      case "street_number":
        streetNumber = component.long_name;
        break;
      case "route":
        route = component.long_name;
        break;
      case "sublocality_level_2":
        sublocalityLevel2 = component.long_name;
        break;
      case "sublocality_level_1":
        sublocalityLevel1 = component.long_name;
        break;
      case "sublocality":
        sublocality = component.long_name;
        break;
      case "neighborhood":
        neighborhood = component.long_name;
        break;
      case "locality":
        city = component.long_name;
        break;
      case "administrative_area_level_2":
        if (!city) city = component.long_name;
        break;
      case "administrative_area_level_1":
        state = component.long_name;
        break;
    }
  }

  const effectivePremise = premise || (placeName && placeName !== route ? placeName : "");
  const streetParts: string[] = [];
  if (effectivePremise) streetParts.push(effectivePremise);

  const placeNameContainsRoute =
    route &&
    effectivePremise &&
    effectivePremise.toLowerCase().includes(route.substring(0, 6).toLowerCase());

  if (!placeNameContainsRoute) {
    if (streetNumber && route) {
      streetParts.push(`${streetNumber} ${route}`);
    } else if (route) {
      streetParts.push(route);
    } else if (streetNumber) {
      streetParts.push(streetNumber);
    }
  }

  if (sublocalityLevel2) streetParts.push(sublocalityLevel2);
  if (sublocalityLevel1) streetParts.push(sublocalityLevel1);
  if (sublocality) streetParts.push(sublocality);
  if (neighborhood) streetParts.push(neighborhood);

  const canonicalState = resolveStateValue(state);
  const normalizedCity = resolveCityValue(city, canonicalState || state);
  const resolvedState =
    canonicalState ||
    (normalizedCity ? CITY_STATE_MAP[normalizedCity] : "") ||
    state;

  return {
    street: sanitizeStreetInput(streetParts.join(", ")),
    apartment: "",
    city: normalizedCity,
    state: resolvedState,
  };
};

const APARTMENT_PREFIXES = [
  "apt",
  "apartment",
  "unit",
  "suite",
  "flat",
  "floor",
  "flr",
  "no.",
  "room",
  "blk",
  "block",
  "#",
];

const isApartmentLike = (value: string) => {
  const lower = value.toLowerCase().trim();
  return APARTMENT_PREFIXES.some((prefix) => lower.startsWith(prefix));
};

const isLeadingHouseNumberLike = (value: string) => {
  const normalized = value.toLowerCase().trim();
  return (
    /^\d+[a-z]?([\s/-]*\d+[a-z]?)?$/i.test(normalized) ||
    /^#\s*\d+/i.test(normalized) ||
    /^(no\.?|house|flat|apt|apartment|unit|suite|plot)\s*#?\s*[\w/-]+/i.test(
      normalized,
    )
  );
};

export const parseAddressFields = (address: string): ManualAddressData => {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);

  if (parts[parts.length - 1]?.toLowerCase() === "nigeria") parts.pop();

  let state = "";
  for (let i = parts.length - 1; i >= 0; i--) {
    const canonicalState = STATE_LOOKUP[normalizeStateKey(parts[i])];
    if (canonicalState) {
      state = canonicalState;
      parts.splice(i, 1);
      break;
    }
  }

  let city = "";
  for (let i = parts.length - 1; i >= 0; i--) {
    const canonicalCity = NORMALIZED_CITY_LOOKUP[normalizeCityKey(parts[i])];
    if (canonicalCity) {
      city = canonicalCity;
      parts.splice(i, 1);
      break;
    }
  }

  if (!city && state && parts.length >= 2) {
    city = parts.pop() || "";
  }

  let street = "";
  let apartment = "";
  if (parts.length <= 1) {
    street = parts[0] || "";
  } else if (isLeadingHouseNumberLike(parts[0])) {
    apartment = parts[0];
    street = parts.slice(1).join(", ");
  } else {
    let aptStartIndex = -1;
    for (let i = 1; i < parts.length; i++) {
      if (isApartmentLike(parts[i])) {
        aptStartIndex = i;
        break;
      }
    }
    if (aptStartIndex > 0) {
      apartment = parts.slice(aptStartIndex).join(", ");
      street = parts.slice(0, aptStartIndex).join(", ");
    } else {
      street = parts.join(", ");
    }
  }

  return {
    street: sanitizeStreetInput(street),
    apartment,
    city,
    state,
  };
};

export const extractLocationFromAddress = (
  address?: string,
): { city: string; state: string } => {
  if (!address) return { city: "", state: "" };

  const parsed = parseAddressFields(address);
  const inferred = inferAllowedLocationFromText(address);
  const city = parsed.city || inferred?.city || "";
  const state =
    parsed.state ||
    inferred?.state ||
    (city ? CITY_STATE_MAP[getCanonicalCityMatch(city)] : "") ||
    "";

  return { city, state };
};

export const isServiceableAddress = (address?: string) => {
  const { city, state } = extractLocationFromAddress(address);
  return isDeliveryLocationAllowed(state, city);
};
