import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useClickAway } from "@/hooks/useClickAway";
import { useRef, useState, useEffect } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressModalProps, ManualAddressData } from "@/types/forms";
import {
  validateManualAddress,
  ADDRESS_LIMITS,
  STREET_ALLOWED_REGEX,
  STREET_SANITIZE_REGEX,
} from "@/utils/form-validators";
import { NIGERIAN_STATES_AND_CITIES } from "@/constants/nigeriaLocations";
import { toast } from "sonner";

// Centralized focus border color for all inputs
const INPUT_FOCUS_BORDER = "focus:border-[#0A4F32]";

const normalizeStateKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*state$/, "")
    .trim();

const normalizeCityKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const getCanonicalCityMatch = (city?: string) => {
  if (!city) return "";

  const normalizedCity = normalizeCityKey(city);
  const exactMatch = NORMALIZED_CITY_LOOKUP[normalizedCity];

  if (exactMatch) {
    return exactMatch;
  }

  return (
    Object.keys(NORMALIZED_CITY_LOOKUP).find(
      (canonicalCity) =>
        normalizedCity.startsWith(`${canonicalCity} -`) ||
        normalizedCity.startsWith(`${canonicalCity},`) ||
        normalizedCity.startsWith(`${canonicalCity} `),
    ) || ""
  );
};

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

const CITY_STATE_MAP = NIGERIAN_STATES_AND_CITIES.reduce<
  Record<string, string>
>((acc, { state, cities }) => {
  cities.forEach((city) => {
    acc[city] = state;
  });
  return acc;
}, {});

const NORMALIZED_CITY_LOOKUP = Object.keys(CITY_STATE_MAP).reduce<
  Record<string, string>
>((acc, city) => {
  acc[normalizeCityKey(city)] = city;
  return acc;
}, {});

const STATE_OPTIONS = Object.keys(STATE_CITY_MAP).sort((a, b) =>
  a.localeCompare(b),
);

const ALL_CITIES = Object.keys(CITY_STATE_MAP).sort((a, b) =>
  a.localeCompare(b),
);

const DELIVERY_RESTRICTION_MESSAGE =
  "We currently only available in  Lagos State and Ibadan, Oyo.";

const isLagosState = (state?: string) =>
  normalizeStateKey(state || "") === "lagos";

const isOyoState = (state?: string) => normalizeStateKey(state || "") === "oyo";

const isIbadanCity = (city?: string) =>
  normalizeCityKey(city || "").startsWith("ibadan");

const inferAllowedLocationFromText = (value?: string) => {
  const normalizedValue = normalizeCityKey(value || "");

  if (!normalizedValue) {
    return null;
  }

  if (
    normalizedValue.startsWith("ibadan -") ||
    normalizedValue.startsWith("ibadan,") ||
    normalizedValue.includes(" ibadan -") ||
    normalizedValue.includes(", ibadan")
  ) {
    return {
      city: "Ibadan",
      state: "Oyo State",
    };
  }

  if (
    normalizedValue.includes("lagos - ibadan expressway") ||
    normalizedValue.includes("lagos ibadan expressway") ||
    normalizedValue.includes("ibadan expressway, lagos")
  ) {
    return {
      city: "Lagos",
      state: "Lagos State",
    };
  }

  if (
    normalizedValue.includes("lagos") ||
    normalizedValue.includes("ikeja") ||
    normalizedValue.includes("ikorodu") ||
    normalizedValue.includes("mushin") ||
    normalizedValue.includes("shomolu") ||
    normalizedValue.includes("somolu") ||
    normalizedValue.includes("epe") ||
    normalizedValue.includes("badagry")
  ) {
    return {
      city: normalizedValue.includes("lagos") ? "Lagos" : "",
      state: "Lagos State",
    };
  }

  if (
    normalizedValue.includes("ibadan") &&
    normalizedValue.includes("oyo")
  ) {
    return {
      city: "Ibadan",
      state: "Oyo State",
    };
  }

  return null;
};

const resolveStateForValidation = (state?: string, city?: string) => {
  if (state) return state;
  if (!city) return "";
  const canonicalCity = getCanonicalCityMatch(city);
  return canonicalCity ? CITY_STATE_MAP[canonicalCity] : "";
};

const isDeliveryLocationAllowed = (state?: string, city?: string) => {
  const resolvedState = resolveStateForValidation(state, city);

  if (isLagosState(resolvedState)) {
    return true;
  }

  if (isOyoState(resolvedState)) {
    return isIbadanCity(city);
  }

  return false;
};

const resolveStateValue = (value?: string) => {
  if (!value) return "";
  return STATE_LOOKUP[normalizeStateKey(value)] || "";
};

const resolveCityValue = (city?: string, state?: string) => {
  if (!city) return "";
  const normalizedCity = normalizeCityKey(city);
  const canonical = getCanonicalCityMatch(city);

  if (canonical) {
    return canonical;
  }

  const canonicalState = state
    ? STATE_LOOKUP[normalizeStateKey(state)]
    : undefined;

  if (canonicalState && STATE_CITY_MAP[canonicalState]) {
    const fromState = STATE_CITY_MAP[canonicalState].find(
      (stateCity) => normalizeCityKey(stateCity) === normalizedCity,
    );

    if (fromState) {
      return fromState;
    }
  }

  return city;
};

const getCityOptions = (state?: string) => {
  if (state && STATE_CITY_MAP[state]) {
    return [...STATE_CITY_MAP[state]];
  }
  return [...ALL_CITIES];
};

const sanitizeStreetInput = (value: string) =>
  value.replace(STREET_SANITIZE_REGEX, "");

const APARTMENT_PREFIXES = [
  "apt", "apartment", "unit", "suite", "flat", "floor",
  "flr", "no.", "room", "blk", "block", "#",
];

const isApartmentLike = (s: string) => {
  const lower = s.toLowerCase().trim();
  return APARTMENT_PREFIXES.some((prefix) => lower.startsWith(prefix));
};

/** Parse a stored address string into its components using known lookup tables. */
const parseAddressFields = (address: string) => {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);

  if (parts[parts.length - 1]?.toLowerCase() === "nigeria") parts.pop();

  let state = "";
  for (let i = parts.length - 1; i >= 0; i--) {
    if (STATE_LOOKUP[normalizeStateKey(parts[i])]) {
      state = parts[i];
      parts.splice(i, 1);
      break;
    }
  }

  let city = "";
  for (let i = parts.length - 1; i >= 0; i--) {
    if (NORMALIZED_CITY_LOOKUP[normalizeCityKey(parts[i])]) {
      city = parts[i];
      parts.splice(i, 1);
      break;
    }
  }

  let street = "";
  let apartment = "";
  if (parts.length <= 1) {
    street = parts[0] || "";
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

/**
 * Unified AddressModal - Replaces PickupLocationModal and DestinationModal
 * Handles both pickup and destination address selection with type-based customization
 */
export function AddressModal({
  type,
  open,
  onOpenChange,
  value,
  onSelect,
  otherAddress,
}: AddressModalProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [manualAddress, setManualAddress] = useState<ManualAddressData>({
    street: "",
    apartment: "",
    city: "",
    state: "",
  });
  const suggestionsRef = useRef<HTMLDivElement>(null!);

  const {
    suggestions: { status, data: suggestions },
    setValue: setPlacesValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ng" },
    },
    debounce: 300,
  });

  useClickAway(suggestionsRef, () => setShowSuggestions(false));

  // Parse existing value and pre-fill form when modal opens
  useEffect(() => {
    if (open && value) {
      setManualAddress(parseAddressFields(value));
      setShowExtraFields(true);
    } else if (open && !value) {
      // Reset to blank when opening without a value
      setManualAddress({
        street: "",
        apartment: "",
        city: "",
        state: "",
      });
      setShowExtraFields(false);
    }
  }, [open, value]);

  /**
   * Parse address from Google Places address_components
   * Extracts structured address data from Google Places API response
   */
  const parseAddressComponents = (
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
          if (!city) {
            city = component.long_name;
          }
          break;
        case "administrative_area_level_1":
          state = component.long_name;
          break;
      }
    }

    // Build full street address from all relevant components
    const streetParts = [];
    // Use placeName (e.g. hospital/landmark name) if not already captured as premise
    const effectivePremise = premise || (placeName && placeName !== route ? placeName : "");
    if (effectivePremise) streetParts.push(effectivePremise);

    // Skip streetNumber + route if placeName already contains the route (avoids duplication
    // e.g. "23 Thompson Ave, opposite British Council" + "23 Thompson Avenue")
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

    const fullStreet = sanitizeStreetInput(streetParts.join(", "));
    const canonicalState = resolveStateValue(state);
    const normalizedCity = resolveCityValue(city, canonicalState || state);
    const resolvedState =
      canonicalState ||
      (normalizedCity ? CITY_STATE_MAP[normalizedCity] : "") ||
      state;

    return {
      street: fullStreet,
      apartment: "", // Leave empty for user to fill
      city: normalizedCity,
      state: resolvedState,
    };
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setPlacesValue(newValue);
    setShowSuggestions(true);
  };

  const handleSelectLocation = async (
    placeId: string,
    suggestionDescription?: string,
  ) => {
    try {
      const parameter = {
        placeId: placeId,
        fields: ["address_components", "formatted_address", "name"],
      };

      const details = await getDetails(parameter);

      if (typeof details !== "string" && details.address_components) {
        const placeName = (details as google.maps.places.PlaceResult).name;
        const formattedAddress =
          (details as google.maps.places.PlaceResult).formatted_address || "";
        const parsed = parseAddressComponents(details.address_components, placeName);
        const inferredLocation =
          inferAllowedLocationFromText(suggestionDescription) ||
          inferAllowedLocationFromText(formattedAddress) ||
          inferAllowedLocationFromText(placeName);
        const parsedLocationIsAllowed = isDeliveryLocationAllowed(
          parsed.state,
          parsed.city,
        );
        const finalState =
          parsedLocationIsAllowed
            ? parsed.state || inferredLocation?.state || ""
            : inferredLocation?.state || parsed.state || "";
        const finalCity =
          parsedLocationIsAllowed
            ? parsed.city || inferredLocation?.city || ""
            : inferredLocation?.city || parsed.city || "";

        if (!isDeliveryLocationAllowed(finalState, finalCity)) {
          toast.error(DELIVERY_RESTRICTION_MESSAGE);
        } else {
          setManualAddress((prev) => ({
            ...prev,
            ...parsed,
            city: finalCity,
            state: finalState,
          }));
          setShowExtraFields(true);
        }

        setSearchValue("");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      clearSuggestions();
      setShowSuggestions(false);
    }
  };

  const handleCityChange = (city: string) => {
    const resolvedState = CITY_STATE_MAP[city] || manualAddress.state;

    if (!isDeliveryLocationAllowed(resolvedState, city)) {
      toast.error(DELIVERY_RESTRICTION_MESSAGE);
      return;
    }

    setManualAddress((prev) => ({
      ...prev,
      city,
      state: CITY_STATE_MAP[city] || prev.state,
    }));
  };

  const handleStateChange = (state: string) => {
    if (!isLagosState(state) && !isOyoState(state)) {
      toast.error(DELIVERY_RESTRICTION_MESSAGE);
      return;
    }

    setManualAddress((prev) => {
      if (isOyoState(state)) {
        const ibadanOption =
          (STATE_CITY_MAP[state] || []).find((city) => isIbadanCity(city)) ||
          prev.city ||
          "Ibadan";

        return {
          ...prev,
          state,
          city: isIbadanCity(prev.city) ? prev.city : ibadanOption,
        };
      }

      const canonicalCityKey =
        NORMALIZED_CITY_LOOKUP[normalizeCityKey(prev.city)] || "";
      const cityState = canonicalCityKey
        ? CITY_STATE_MAP[canonicalCityKey]
        : "";
      const cityBelongsToLagos =
        cityState && normalizeStateKey(cityState) === "lagos";

      return {
        ...prev,
        state,
        city: cityBelongsToLagos || !prev.city ? prev.city : "",
      };
    });
  };

  const handleSubmit = () => {
    const { street, apartment, city, state } = manualAddress;
    const validation = validateManualAddress(street, apartment, city, state);

    if (!validation.valid) {
      return;
    }

    if (otherAddress) {
      const other = parseAddressFields(otherAddress);
      if (
        street.trim().toLowerCase() === other.street.trim().toLowerCase() &&
        normalizeCityKey(city) === normalizeCityKey(other.city) &&
        normalizeStateKey(state) === normalizeStateKey(other.state)
      ) {
        toast.error("Pickup location and destination cannot be the same.");
        return;
      }
    }

    const addressParts = [street];
    if (apartment.trim()) {
      addressParts.push(apartment);
    }
    addressParts.push(city, state, "Nigeria");
    const formattedAddress = addressParts.join(", ");

    onSelect(formattedAddress, { city, state });
    onOpenChange(false);
    setManualAddress({
      street: "",
      apartment: "",
      city: "",
      state: "",
    });
  };

  const hasRequiredFields =
    manualAddress.street.trim() &&
    manualAddress.city.trim() &&
    manualAddress.state.trim();

  const isLocationServiceable = isDeliveryLocationAllowed(
    manualAddress.state,
    manualAddress.city,
  );

  // Check character limits
  const isStreetTooLong =
    manualAddress.street.length > ADDRESS_LIMITS.STREET_MAX_LENGTH;
  const isApartmentTooLong =
    manualAddress.apartment.length > ADDRESS_LIMITS.APARTMENT_MAX_LENGTH;
  const hasValidLengths = !isStreetTooLong && !isApartmentTooLong;
  const isStreetInvalid =
    Boolean(manualAddress.street.trim()) &&
    !STREET_ALLOWED_REGEX.test(manualAddress.street.trim());

  const isFormValid =
    Boolean(hasRequiredFields) &&
    isLocationServiceable &&
    hasValidLengths &&
    !isStreetInvalid;

  // Type-specific content
  const title = type === "pickup" ? "Pickup Location" : "Destination";
  const buttonText =
    type === "pickup"
      ? "Confirm Pickup Address"
      : "Confirm Destination Address";

  const stateOptions =
    manualAddress.state && !STATE_OPTIONS.includes(manualAddress.state)
      ? [...STATE_OPTIONS, manualAddress.state]
      : STATE_OPTIONS;

  const baseCityOptions = getCityOptions(manualAddress.state);
  const cityOptions =
    manualAddress.city && !baseCityOptions.includes(manualAddress.city)
      ? [...baseCityOptions, manualAddress.city]
      : baseCityOptions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-visible flex flex-col">
        <DialogTitle className="text-lg font-clash font-bold text-gray-900">
          {title}
        </DialogTitle>

        <div className="space-y-3 mt-3">
          {/* Google Places Search */}
          <div className="relative" ref={suggestionsRef}>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Search Address
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for a place..."
                className={`w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm ${INPUT_FOCUS_BORDER} focus:outline-none transition-colors`}
                autoFocus
              />
            </div>

            {!showExtraFields && (
              <button
                type="button"
                onClick={() => {
                  setShowExtraFields(true);
                  setShowSuggestions(false);
                }}
                className="mt-2 cursor-pointer text-xs font-medium text-[#0A4F32] underline underline-offset-2 hover:text-[#083d27] transition-colors"
              >
                Can&apos;t find your address? Enter it manually
              </button>
            )}

            {/* Suggestions List */}
            {status === "OK" && showSuggestions && suggestions.length > 0 && (
              <div className="mt-1.5 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-[200px] overflow-y-auto">
                {suggestions.map(({ place_id, description }) => (
                  <button
                    key={place_id}
                    type="button"
                    onClick={() => handleSelectLocation(place_id, description)}
                    className="w-full px-3 py-2 flex items-start gap-2 hover:bg-brand-light transition-colors text-left border-b border-gray-100 last:border-0"
                  >
                    <FiMapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 text-xs">{description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-500 bg-brand-light p-2.5 rounded-lg border border-light">
            <FiSearch className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-brand" />
            <p className="text-brand">
              Start typing to see address suggestions to auto-fill the fields below.
            </p>
          </div>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
          {/* All address fields — revealed after Google selection */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${showExtraFields ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
          <div className="overflow-hidden">
          <div className="space-y-3 pt-1">

          {/* Street Address */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-xs ${isStreetTooLong ? "text-red-500 font-medium" : "text-gray-400"}`}
              >
                {manualAddress.street.length}/{ADDRESS_LIMITS.STREET_MAX_LENGTH}
              </span>
            </div>
            <input
              type="text"
              value={manualAddress.street}
              onChange={(e) => {
                const sanitized = sanitizeStreetInput(e.target.value);
                setManualAddress({ ...manualAddress, street: sanitized });
              }}
              placeholder="e.g., 123 Main Street"
              maxLength={ADDRESS_LIMITS.STREET_MAX_LENGTH + 50}
              className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                isStreetTooLong || isStreetInvalid
                  ? "border-red-400 focus:border-red-500"
                  : `border-gray-200 ${INPUT_FOCUS_BORDER}`
              }`}
            />
            {isStreetInvalid && (
              <p className="text-xs text-red-500 mt-1">
                Only letters, numbers, commas, hyphens, periods, and slashes are allowed.
              </p>
            )}
            {isStreetTooLong && (
              <p className="text-xs text-red-500 mt-1">
                Street address cannot exceed {ADDRESS_LIMITS.STREET_MAX_LENGTH}{" "}
                characters
              </p>
            )}
          </div>

          {/* Apartment/House Number */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Apartment/House Number (Optional)
              </label>
              {manualAddress.apartment.length > 0 && (
                <span
                  className={`text-xs ${isApartmentTooLong ? "text-red-500 font-medium" : "text-gray-400"}`}
                >
                  {manualAddress.apartment.length}/
                  {ADDRESS_LIMITS.APARTMENT_MAX_LENGTH}
                </span>
              )}
            </div>
            <input
              type="text"
              value={manualAddress.apartment}
              onChange={(e) =>
                setManualAddress({
                  ...manualAddress,
                  apartment: e.target.value,
                })
              }
              placeholder="e.g., Apt 5, Unit 3B, Floor 2"
              maxLength={ADDRESS_LIMITS.APARTMENT_MAX_LENGTH + 50}
              className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                isApartmentTooLong
                  ? "border-red-400 focus:border-red-500"
                  : `border-gray-200 ${INPUT_FOCUS_BORDER}`
              }`}
            />
            {isApartmentTooLong && (
              <p className="text-xs text-red-500 mt-1">
                Apartment/House number cannot exceed{" "}
                {ADDRESS_LIMITS.APARTMENT_MAX_LENGTH} characters
              </p>
            )}
          </div>

              {/* Country (Fixed) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Country
            </label>
            <div className="px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-600">
              Nigeria
            </div>
          </div>

          {/* State Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              State <span className="text-red-500">*</span>
            </label>
            <Select
              value={manualAddress.state || undefined}
              onValueChange={handleStateChange}
            >
              <SelectTrigger
                className={`w-full py-2 px-3 text-sm border-2 border-gray-200 rounded-xl ${INPUT_FOCUS_BORDER}`}
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {stateOptions.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <Select
              value={manualAddress.city || undefined}
              onValueChange={handleCityChange}
            >
              <SelectTrigger
                className={`w-full py-2 px-3 text-sm border-2 border-gray-200 rounded-xl ${INPUT_FOCUS_BORDER}`}
              >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {cityOptions.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          </div>{/* end space-y-3 */}
          </div>{/* end overflow-hidden */}
          </div>{/* end grid transition wrapper */}

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            variant="secondary"
            size="custom"
            className="w-full py-2.5 text-sm font-bold mt-4"
            disabled={!isFormValid}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
