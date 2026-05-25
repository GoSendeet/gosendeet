import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIAN_STATES_AND_CITIES } from "@/constants/nigeriaLocations";
import { cn } from "@/lib/utils";
import {
  ADDRESS_LIMITS,
  STREET_ALLOWED_REGEX,
  STREET_SANITIZE_REGEX,
  validateManualAddress,
} from "@/utils/form-validators";
import { ManualAddressData } from "@/types/forms";
import { toast } from "sonner";
import { FiEdit3, FiMapPin, FiNavigation, FiSearch } from "react-icons/fi";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

interface AddressPopoverProps {
  type: "pickup" | "destination";
  open: boolean;
  query: string;
  otherAddress?: string;
  onOpenChange: (open: boolean) => void;
  onQueryChange: (query: string) => void;
  onSelect: (location: string, breakdown?: { city: string; state: string }) => void;
}

const normalizeStateKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*state$/, "")
    .trim();

const normalizeCityKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const STATE_CITY_MAP = NIGERIAN_STATES_AND_CITIES.reduce<
  Record<string, string[]>
>((acc, { state, cities }) => {
  acc[state] = [...cities].sort((a, b) => a.localeCompare(b));
  return acc;
}, {});

const STATE_LOOKUP = Object.keys(STATE_CITY_MAP).reduce<Record<string, string>>(
  (acc, state) => {
    acc[normalizeStateKey(state)] = state;
    return acc;
  },
  {},
);

const CITY_STATE_MAP = NIGERIAN_STATES_AND_CITIES.reduce<Record<string, string>>(
  (acc, { state, cities }) => {
    cities.forEach((city) => {
      acc[city] = state;
    });
    return acc;
  },
  {},
);

const NORMALIZED_CITY_LOOKUP = Object.keys(CITY_STATE_MAP).reduce<
  Record<string, string>
>((acc, city) => {
  acc[normalizeCityKey(city)] = city;
  return acc;
}, {});

const STATE_OPTIONS = Object.keys(STATE_CITY_MAP).sort((a, b) =>
  a.localeCompare(b),
);

const DELIVERY_RESTRICTION_MESSAGE =
  "We currently only operate in Lagos State and Ibadan, Oyo.";

const sanitizeStreetInput = (value: string) =>
  value.replace(STREET_SANITIZE_REGEX, "");

const isLagosState = (state?: string) =>
  normalizeStateKey(state || "") === "lagos";

const isOyoState = (state?: string) => normalizeStateKey(state || "") === "oyo";

const isIbadanCity = (city?: string) =>
  normalizeCityKey(city || "").startsWith("ibadan");

const getCanonicalCityMatch = (city?: string) => {
  if (!city) return "";

  const normalizedCity = normalizeCityKey(city);
  return (
    NORMALIZED_CITY_LOOKUP[normalizedCity] ||
    Object.keys(NORMALIZED_CITY_LOOKUP).find(
      (canonicalCity) =>
        normalizedCity.startsWith(`${canonicalCity} -`) ||
        normalizedCity.startsWith(`${canonicalCity},`) ||
        normalizedCity.startsWith(`${canonicalCity} `),
    ) ||
    ""
  );
};

const resolveStateForValidation = (state?: string, city?: string) => {
  if (state) return state;
  const canonicalCity = getCanonicalCityMatch(city);
  return canonicalCity ? CITY_STATE_MAP[canonicalCity] : "";
};

const isDeliveryLocationAllowed = (state?: string, city?: string) => {
  const resolvedState = resolveStateForValidation(state, city);

  if (isLagosState(resolvedState)) return true;
  if (isOyoState(resolvedState)) return isIbadanCity(city);
  return false;
};

const inferAllowedLocationFromText = (value?: string) => {
  const normalizedValue = normalizeCityKey(value || "");
  if (!normalizedValue) return null;

  if (normalizedValue.includes("lagos")) {
    return { city: "Lagos", state: "Lagos State" };
  }

  if (normalizedValue.includes("ibadan")) {
    return { city: "Ibadan", state: "Oyo State" };
  }

  if (
    normalizedValue.includes("ikeja") ||
    normalizedValue.includes("lekki") ||
    normalizedValue.includes("ikorodu") ||
    normalizedValue.includes("mushin") ||
    normalizedValue.includes("badagry")
  ) {
    return { city: "", state: "Lagos State" };
  }

  return null;
};

const resolveStateValue = (value?: string) => {
  if (!value) return "";
  return STATE_LOOKUP[normalizeStateKey(value)] || "";
};

const resolveCityValue = (city?: string, state?: string) => {
  if (!city) return "";

  const canonical = getCanonicalCityMatch(city);
  if (canonical) return canonical;

  const canonicalState = state
    ? STATE_LOOKUP[normalizeStateKey(state)]
    : undefined;
  const fromState = canonicalState
    ? STATE_CITY_MAP[canonicalState]?.find(
        (stateCity) => normalizeCityKey(stateCity) === normalizeCityKey(city),
      )
    : "";

  return fromState || city;
};

const parseAddressComponents = (
  components: google.maps.GeocoderAddressComponent[],
  placeName?: string,
): Partial<ManualAddressData> => {
  let streetNumber = "";
  let route = "";
  let premise = "";
  let city = "";
  let state = "";
  const localParts: string[] = [];

  for (const component of components) {
    const type = component.types[0];

    if (type === "premise") premise = component.long_name;
    if (type === "street_number") streetNumber = component.long_name;
    if (type === "route") route = component.long_name;
    if (type === "sublocality" || type === "sublocality_level_1") {
      localParts.push(component.long_name);
    }
    if (type === "locality") city = component.long_name;
    if (type === "administrative_area_level_2" && !city) {
      city = component.long_name;
    }
    if (type === "administrative_area_level_1") state = component.long_name;
  }

  const streetParts = [
    premise || placeName || "",
    streetNumber && route ? `${streetNumber} ${route}` : route || streetNumber,
    ...localParts,
  ].filter(Boolean);

  const canonicalState = resolveStateValue(state);
  const normalizedCity = resolveCityValue(city, canonicalState || state);
  const resolvedState =
    canonicalState || (normalizedCity ? CITY_STATE_MAP[normalizedCity] : "") || state;

  return {
    street: sanitizeStreetInput(streetParts.join(", ")),
    apartment: "",
    city: normalizedCity,
    state: resolvedState,
  };
};

const getCityOptions = (state?: string) => {
  if (state && STATE_CITY_MAP[state]) return [...STATE_CITY_MAP[state]];
  return Object.keys(CITY_STATE_MAP).sort((a, b) => a.localeCompare(b));
};

export function AddressPopover({
  type,
  open,
  query,
  otherAddress,
  onOpenChange,
  onQueryChange,
  onSelect,
}: AddressPopoverProps) {
  const [showManual, setShowManual] = useState(false);
  const [manualAddress, setManualAddress] = useState<ManualAddressData>({
    street: "",
    apartment: "",
    city: "",
    state: "",
  });
  const [isLocating, setIsLocating] = useState(false);

  const {
    suggestions: { status, data: suggestions },
    setValue: setPlacesValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ng" },
    },
    debounce: 250,
  });

  useEffect(() => {
    setPlacesValue(query);
  }, [query, setPlacesValue]);

  useEffect(() => {
    if (open && query.trim()) {
      setShowManual(false);
    }
  }, [open, query]);

  const title = type === "pickup" ? "Pickup address" : "Destination address";
  const cityOptions = useMemo(
    () => getCityOptions(manualAddress.state),
    [manualAddress.state],
  );

  const handleSelectLocation = async (
    placeId: string,
    suggestionDescription?: string,
  ) => {
    try {
      const details = await getDetails({
        placeId,
        fields: ["address_components", "formatted_address", "name"],
      });

      if (typeof details === "string" || !details.address_components) return;

      const placeName = (details as google.maps.places.PlaceResult).name;
      const formattedAddress =
        (details as google.maps.places.PlaceResult).formatted_address || "";
      const parsed = parseAddressComponents(details.address_components, placeName);
      const inferredLocation =
        inferAllowedLocationFromText(suggestionDescription) ||
        inferAllowedLocationFromText(formattedAddress) ||
        inferAllowedLocationFromText(placeName);

      const finalState = parsed.state || inferredLocation?.state || "";
      const finalCity = parsed.city || inferredLocation?.city || "";

      if (!isDeliveryLocationAllowed(finalState, finalCity)) {
        toast.error(DELIVERY_RESTRICTION_MESSAGE);
        return;
      }

      const street =
        parsed.street ||
        formattedAddress.split(",").map((part) => part.trim()).filter(Boolean)[0] ||
        suggestionDescription ||
        "";
      const addressParts = [
        street,
        finalCity,
        finalState,
        "Nigeria",
      ].filter(Boolean);
      const formatted = addressParts.join(", ");

      onQueryChange(formatted);
      onSelect(formatted, { city: finalCity, state: finalState });
      onOpenChange(false);
      clearSuggestions();
    } catch (error) {
      console.error("Error fetching place details:", error);
      toast.error("Unable to select that address. Please try another one.");
    }
  };

  const handleManualStateChange = (state: string) => {
    if (!isLagosState(state) && !isOyoState(state)) {
      toast.error(DELIVERY_RESTRICTION_MESSAGE);
      return;
    }

    setManualAddress((current) => ({
      ...current,
      state,
      city: isOyoState(state)
        ? (STATE_CITY_MAP[state] || []).find((city) => isIbadanCity(city)) ||
          "Ibadan"
        : current.city,
    }));
  };

  const handleManualCityChange = (city: string) => {
    const resolvedState = CITY_STATE_MAP[city] || manualAddress.state;
    if (!isDeliveryLocationAllowed(resolvedState, city)) {
      toast.error(DELIVERY_RESTRICTION_MESSAGE);
      return;
    }

    setManualAddress((current) => ({
      ...current,
      city,
      state: resolvedState,
    }));
  };

  const handleManualSubmit = () => {
    const { street, apartment, city, state } = manualAddress;
    const validation = validateManualAddress(street, apartment, city, state);
    if (!validation.valid) return;

    if (otherAddress && otherAddress.toLowerCase().includes(street.toLowerCase())) {
      toast.error("Pickup location and destination cannot be the same.");
      return;
    }

    const formatted = [
      street,
      apartment.trim() || "",
      city,
      state,
      "Nigeria",
    ].filter(Boolean).join(", ");

    onQueryChange(formatted);
    onSelect(formatted, { city, state });
    onOpenChange(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Current location is not available in this browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (!window.google?.maps?.Geocoder) {
            toast.error("Map lookup is not ready yet. Please type your address.");
            return;
          }

          const geocoder = new window.google.maps.Geocoder();
          const { latitude, longitude } = position.coords;
          const result = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          });
          const bestMatch = result.results[0];

          if (!bestMatch) {
            toast.error("Unable to identify your current address.");
            return;
          }

          const bestMatchName =
            "name" in bestMatch && typeof bestMatch.name === "string"
              ? bestMatch.name
              : undefined;

          const parsed = parseAddressComponents(
            bestMatch.address_components,
            bestMatchName,
          );
          const inferredLocation = inferAllowedLocationFromText(
            bestMatch.formatted_address,
          );
          const finalState = parsed.state || inferredLocation?.state || "";
          const finalCity = parsed.city || inferredLocation?.city || "";

          if (!isDeliveryLocationAllowed(finalState, finalCity)) {
            toast.error(DELIVERY_RESTRICTION_MESSAGE);
            return;
          }

          const street =
            parsed.street ||
            bestMatch.formatted_address
              .split(",")
              .map((part) => part.trim())
              .filter(Boolean)[0] ||
            "";
          const formatted = [street, finalCity, finalState, "Nigeria"]
            .filter(Boolean)
            .join(", ");

          onQueryChange(formatted);
          onSelect(formatted, { city: finalCity, state: finalState });
          onOpenChange(false);
        } catch (error) {
          console.error("Error resolving current location:", error);
          toast.error("Unable to use current location right now.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Location permission was denied or unavailable.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const isStreetTooLong =
    manualAddress.street.length > ADDRESS_LIMITS.STREET_MAX_LENGTH;
  const isStreetInvalid =
    Boolean(manualAddress.street.trim()) &&
    !STREET_ALLOWED_REGEX.test(manualAddress.street.trim());
  const isApartmentTooLong =
    manualAddress.apartment.length > ADDRESS_LIMITS.APARTMENT_MAX_LENGTH;
  const isManualValid =
    Boolean(manualAddress.street.trim()) &&
    Boolean(manualAddress.city.trim()) &&
    Boolean(manualAddress.state.trim()) &&
    !isStreetTooLong &&
    !isStreetInvalid &&
    !isApartmentTooLong;

  return (
    <PopoverContent
      side="bottom"
      align="center"
      sideOffset={8}
      avoidCollisions={false}
      onOpenAutoFocus={(event) => event.preventDefault()}
      className="w-[min(420px,calc(100vw-32px))] rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl"
    >
      <div className="p-4">
        {/* <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Keep typing in the field. Suggestions update here.
            </p>
          </div>
          <FiSearch className="h-4 w-4 text-brand" />
        </div> */}

        {!showManual && (
          <div className="space-y-2">
            {query.trim().length < 2 && (
              <div className="flex items-start gap-2 px-1 py-1 text-xs text-[#64748B]">
                <FiSearch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <p>
                  Start typing in the address field to see matching suggestions.
                </p>
              </div>
            )}

            {status === "OK" && suggestions.length > 0 && (
              <div className="max-h-[240px] overflow-y-auto rounded-xl border border-gray-100">
                {suggestions.map(({ place_id, description }) => (
                  <button
                    key={place_id}
                    type="button"
                    onClick={() => handleSelectLocation(place_id, description)}
                    className="flex w-full items-start gap-3 border-b border-gray-100 px-3 py-3 text-left last:border-0 hover:bg-[#F0FDF4]"
                  >
                    <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-xs font-medium text-[#0F172A]">
                      {description}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query.trim().length >= 2 && status !== "OK" && (
              <p className="rounded-xl bg-gray-50 px-3 py-3 text-xs text-[#64748B]">
                Searching for matching addresses...
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                setShowManual(true);
                setManualAddress((current) => ({
                  ...current,
                  street: current.street || sanitizeStreetInput(query),
                }));
              }}
              className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-left text-xs font-bold text-brand hover:border-brand hover:bg-[#F0FDF4]"
            >
              <FiEdit3 className="h-4 w-4" />
              Enter address manually
            </button>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-left text-xs font-bold text-brand hover:border-brand hover:bg-[#F0FDF4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiNavigation className="h-4 w-4" />
              {isLocating ? "Finding current location..." : "Use current location"}
            </button>

          </div>
        )}

        {showManual && (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">
                Street address
              </label>
              <input
                type="text"
                value={manualAddress.street}
                onChange={(event) =>
                  setManualAddress((current) => ({
                    ...current,
                    street: sanitizeStreetInput(event.target.value),
                  }))
                }
                placeholder="e.g. 12 Admiralty Way"
                className={cn(
                  "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-brand",
                  isStreetTooLong || isStreetInvalid
                    ? "border-red-400"
                    : "border-gray-200",
                )}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">
                Apartment or house number
              </label>
              <input
                type="text"
                value={manualAddress.apartment}
                onChange={(event) =>
                  setManualAddress((current) => ({
                    ...current,
                    apartment: event.target.value,
                  }))
                }
                placeholder="Optional"
                className={cn(
                  "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-brand",
                  isApartmentTooLong ? "border-red-400" : "border-gray-200",
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">
                  State
                </label>
                <Select
                  value={manualAddress.state || undefined}
                  onValueChange={handleManualStateChange}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_OPTIONS.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">
                  City
                </label>
                <Select
                  value={manualAddress.city || undefined}
                  onValueChange={handleManualCityChange}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-sm">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="custom"
                className="flex-1 py-2 text-xs"
                onClick={() => setShowManual(false)}
              >
                Back
              </Button>
              <Button
                type="button"
                size="custom"
                className="flex-1 bg-[#064E3B] py-2 text-xs font-bold"
                disabled={!isManualValid}
                onClick={handleManualSubmit}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    </PopoverContent>
  );
}
