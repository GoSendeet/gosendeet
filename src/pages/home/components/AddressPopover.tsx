import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DELIVERY_RESTRICTION_MESSAGE } from "@/constants/booking";
import { cn } from "@/lib/utils";
import {
  ADDRESS_LIMITS,
  STREET_ALLOWED_REGEX,
  sanitizeStreetInput,
  validateManualAddress,
} from "@/utils/form-validators";
import { ManualAddressData } from "@/types/forms";
import { toast } from "sonner";
import { FiEdit3, FiMapPin, FiNavigation } from "react-icons/fi";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import {
  CITY_STATE_MAP,
  getCityOptions,
  inferAllowedLocationFromText,
  isDeliveryLocationAllowed,
  isLagosState,
  isOyoState,
  parseAddressComponents,
  parseAddressFields,
} from "@/utils/address";

interface AddressPopoverProps {
  type?: "pickup" | "destination";
  open: boolean;
  query: string;
  otherAddress?: string;
  onOpenChange: (open: boolean) => void;
  onQueryChange: (query: string) => void;
  onSelect: (location: string, breakdown?: { city: string; state: string }) => void;
}

const MANUAL_STATE_OPTIONS = ["Lagos State", "Oyo State"];

export function AddressPopover({
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
  const [completedSearchQuery, setCompletedSearchQuery] = useState("");

  const {
    suggestions: { loading: suggestionsLoading, status, data: suggestions },
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

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setCompletedSearchQuery("");
      return;
    }

    if (!suggestionsLoading && status) {
      setCompletedSearchQuery(trimmedQuery);
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!suggestionsLoading && suggestions.length === 0) {
        setCompletedSearchQuery(trimmedQuery);
      }
    }, 550);

    return () => window.clearTimeout(fallbackTimer);
  }, [query, status, suggestions.length, suggestionsLoading]);

  const cityOptions = useMemo(() => {
    const options = isOyoState(manualAddress.state)
      ? ["Ibadan"]
      : getCityOptions(manualAddress.state);
    if (
      manualAddress.city &&
      !options.some(
        (city) =>
          city.toLowerCase().trim() === manualAddress.city.toLowerCase().trim(),
      )
    ) {
      return [manualAddress.city, ...options];
    }

    return options;
  }, [manualAddress.city, manualAddress.state]);

  const getManualAddressFromQuery = useCallback(() => {
    const parsed = parseAddressFields(query);
    const inferred = inferAllowedLocationFromText(query);

    return {
      street: parsed.street,
      apartment: parsed.apartment,
      city: parsed.city || inferred?.city || "",
      state: parsed.state || inferred?.state || "",
    };
  }, [query]);

  const fillManualAddressFromQuery = () => {
    const parsed = getManualAddressFromQuery();

    setManualAddress((current) => ({
      street: parsed.street || current.street,
      apartment: parsed.apartment || current.apartment,
      city: parsed.city || current.city,
      state: parsed.state || current.state,
    }));
  };

  useEffect(() => {
    const parsed = getManualAddressFromQuery();
    const hasCompleteManualAddress =
      query.split(",").length >= 4 &&
      Boolean(parsed.street.trim()) &&
      Boolean(parsed.city.trim()) &&
      Boolean(parsed.state.trim());

    if (!open || showManual || !hasCompleteManualAddress) return;

    setManualAddress(parsed);
    setShowManual(true);
  }, [getManualAddressFromQuery, open, query, showManual]);

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
      city: "",
      street: "",
      apartment: "",
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
      apartment.trim() || "",
      street,
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
  const hasManualLocationSelected =
    Boolean(manualAddress.state.trim()) && Boolean(manualAddress.city.trim());

  const trimmedQuery = query.trim();
  const isSearchComplete = completedSearchQuery === trimmedQuery;
  const hasNoSuggestions =
    // hasSearchQuery &&
    isSearchComplete 
    // !suggestionsLoading &&
    // !hasSuggestions;

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
        {!showManual && (
          <div className="space-y-2">

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

            {/* {isSearching && (
              <p className="rounded-xl bg-gray-50 px-3 py-3 text-xs text-[#64748B]">
                Searching for matching addresses...
              </p>
            )} */}

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out",
                !hasNoSuggestions
                  ? "grid-rows-[1fr] opacity-100 translate-y-0"
                  : "grid-rows-[0fr] opacity-0 -translate-y-2 pointer-events-none",
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-2">
                  <p className="rounded-xl bg-gray-50 px-3 py-3 text-xs text-[#64748B]">
                    No matching addresses found.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowManual(true);
                      fillManualAddressFromQuery();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-left text-xs font-bold text-brand hover:border-brand hover:bg-[#F0FDF4]"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    Enter address manually
                  </button>
                </div>
              </div>
            </div>

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
                    {MANUAL_STATE_OPTIONS.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state.replace(" State", "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">
                  City
                </label>
                <div
                  className="group relative"
                  title={!manualAddress.state ? "Select a state" : undefined}
                >
                  <Select
                    value={manualAddress.city || undefined}
                    onValueChange={handleManualCityChange}
                    disabled={!manualAddress.state}
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
                  {!manualAddress.state && (
                    <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0F172A] px-2 py-1 text-[11px] font-semibold text-white shadow-lg group-hover:block">
                      Select a state
                    </span>
                  )}
                </div>
              </div>
            </div>

            {hasManualLocationSelected && (
              <>
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
                    placeholder="e.g. Admiralty Way"
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
              </>
            )}

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
              {hasManualLocationSelected && (
                <Button
                  type="button"
                  size="custom"
                  className="flex-1 bg-[#064E3B] py-2 text-xs font-bold"
                  disabled={!isManualValid}
                  onClick={handleManualSubmit}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </PopoverContent>
  );
}
