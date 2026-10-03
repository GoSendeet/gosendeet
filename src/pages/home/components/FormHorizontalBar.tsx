import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiFlag, FiMapPin } from "react-icons/fi";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import { Popover, PopoverAnchor, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { trackBookingsHandler } from "@/hooks/useTrackBookings";
import { MAX_SUPPORTED_ITEM_VALUE } from "@/constants/booking";
import { isServiceableAddress } from "@/utils/address";
import { AddressPopover } from "./AddressPopover";
import { PackageTypePopover } from "./PackageTypePopover";
import { AddressFieldCard } from "./quote-form/AddressFieldCard";
import { FormHorizontalBarSkeleton } from "./quote-form/FormHorizontalBarSkeleton";
import { PackageFieldCard } from "./quote-form/PackageFieldCard";
import { QuoteSubmitButton } from "./quote-form/QuoteSubmitButton";
import { TrackingNumberForm } from "./quote-form/TrackingNumberForm";
import { useBookingQuoteForm } from "./quote-form/useBookingQuoteForm";
import type { BookingQuoteFormData } from "./quote-form/quoteFormData";
import { useQuoteSubmission } from "./quote-form/useQuoteSubmission";
import "./quote-form/appearance.css";

interface FormHorizontalBarProps {
  variant?: "bold" | "minimal" | "floating";
  bookingRequest?: any;
  setData?: any;
  activeMode?: "gosendeet" | "compare" | "tracking";
  autoFocusPickup?: boolean;
  onQuoteResult?: (result: any, inputData: any, mode: FormMode) => void;
  forcedIsDashboard?: boolean;
  onModeChange?: (mode: FormMode) => void;
  appearance?: "default" | "landing";
  addressSearchPreset?: { pickup: string; destination: string };
}

const FormHorizontalBar = ({
  variant = "bold",
  bookingRequest,
  setData,
  activeMode = "compare",
  autoFocusPickup = false,
  onQuoteResult,
  forcedIsDashboard,
  onModeChange,
  appearance = "default",
  addressSearchPreset,
}: FormHorizontalBarProps) => {
  const isLanding = appearance === "landing";
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showCursorHint, setShowCursorHint] = useState(true);
  const [activeCard, setActiveCard] = useState<
    "pickup" | "destination" | "package" | null
  >("pickup");
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [pickupSearchQuery, setPickupSearchQuery] = useState("");
  const [destinationSearchQuery, setDestinationSearchQuery] = useState("");

  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const hasAutoFocusedPickupRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard =
    forcedIsDashboard !== undefined
      ? forcedIsDashboard
      : location.pathname.includes("dashboard");
  const [currentMode, setCurrentMode] = useState<FormMode>(activeMode);
  const mode = isDashboard ? currentMode : activeMode;

  const {
    form,
    isHydrated,
    packageName,
    selectedPackageData,
    setPackageName,
    setSelectedPackageData,
    saveInputData,
  } = useBookingQuoteForm({ bookingRequest });

  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const { isQuoteLoading, submitQuote } = useQuoteSubmission({
    isDashboard,
    onQuoteResult,
    setData,
  });

  const pickupLocation = watch("pickupLocation");
  const dropOffLocation = watch("dropOffLocation");
  const packageTypeId = watch("packageTypeId");
  const weight = watch("weight");
  const dimensions = watch("dimensions");
  const itemPrice = watch("itemPrice");

  useEffect(() => {
    if (isDashboard) {
      setCurrentMode(activeMode);
    }
  }, [activeMode, isDashboard]);

  useEffect(() => {
    if (
      !autoFocusPickup ||
      hasAutoFocusedPickupRef.current ||
      !isHydrated ||
      mode === "tracking"
    ) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (!pickupInputRef.current) return;

      pickupInputRef.current.focus();
      setActiveCard("pickup");
      setPickupModalOpen(true);
      hasAutoFocusedPickupRef.current = true;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [autoFocusPickup, isHydrated, mode]);

  useEffect(() => {
    setPickupSearchQuery(pickupLocation || addressSearchPreset?.pickup || "");
  }, [pickupLocation, addressSearchPreset?.pickup]);

  useEffect(() => {
    setDestinationSearchQuery(dropOffLocation || addressSearchPreset?.destination || "");
  }, [dropOffLocation, addressSearchPreset?.destination]);

  const appliedPresetRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isHydrated || !addressSearchPreset) return;
    const key = `${addressSearchPreset.pickup}:${addressSearchPreset.destination}`;
    if (appliedPresetRef.current === key) return;
    appliedPresetRef.current = key;
    // Presets seed address search, not validated street addresses. Discard any
    // previous route so stale selections cannot be submitted for this preset.
    setValue("pickupLocation", "");
    setValue("dropOffLocation", "");
    setPickupSearchQuery(addressSearchPreset.pickup);
    setDestinationSearchQuery(addressSearchPreset.destination);
    saveInputData({ ...getValues(), pickupLocation: "", dropOffLocation: "" });
  }, [isHydrated, addressSearchPreset, getValues, setValue, saveInputData]);

  const containerStyles = cn(
    isDashboard
      ? "w-full max-w-3xl mx-auto py-10 px-6 rounded-2xl bg-white border relative"
      : "w-full mx-auto max-w-[354px] lg:max-w-[1120px] pt-[12.82px] px-[10.82px] pb-[0.83px] lg:pt-[16.57px] lg:px-[16.57px] lg:pb-[16.57px] rounded-[32px] lg:rounded-[40px] border-t border-[#F1F5F9] bg-white/80 backdrop-blur-[48px] shadow-lg",
    !isDashboard && variant === "bold" && "bg-white border",
    !isDashboard && variant === "minimal" && "bg-white border border-gray-200",
    !isDashboard && variant === "floating" && "bg-white",
  );

  const labelStyles = cn(
    "font-clash font-bold text-xs mb-2 block",
    variant === "bold" && "text-[#1a1a1a]",
    (variant === "minimal" || variant === "floating") && "text-[#4b5563]",
  );

  const inputStyles = cn(
    "w-full outline-0 bg-transparent text-base py-2 px-1 transition-colors",
    variant === "bold" &&
      "border-[#e5e5e5] text-[#1a1a1a] placeholder:text-[#CAD5E2]",
    (variant === "minimal" || variant === "floating") &&
      "border-[#e5e5e5] font-bold tracking-wider font-arial text-[#1a1a1a] placeholder:text-[#CAD5E2]",
  );

  const quoteGridClass = isDashboard
    ? "space-y-4"
    : cn(
        "grid grid-cols-1 gap-y-4 lg:gap-6 items-end",
        mode === "compare"
          ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_auto]"
          : "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1fr)_auto]",
      );

  const handleTrackingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    trackBookingsHandler(trackingNumber, navigate, setTrackingLoading);
  };

  const handleAddressSelect = (
    field: "pickupLocation" | "dropOffLocation",
    location: string,
  ) => {
    setValue(field, location, { shouldValidate: true });
    saveInputData({ ...getValues(), [field]: location });
  };

  const handlePackageConfirm = (
    id: string,
    name: string,
    weightValue: string,
    dimensionsValue: string,
    itemPriceValue: string,
    packageData: any,
  ) => {
    setValue("packageTypeId", id, { shouldValidate: true });
    setValue("weight", weightValue, { shouldValidate: true });
    setValue("dimensions", dimensionsValue);
    setValue("itemPrice", itemPriceValue, { shouldValidate: true });
    setPackageName(name);
    setSelectedPackageData(packageData);
    saveInputData({
      ...getValues(),
      packageTypeId: id,
      packageName: name,
      weight: weightValue,
      dimensions: dimensionsValue,
      itemPrice: itemPriceValue,
    });
  };

  const validateSupportedValue = (data: BookingQuoteFormData) => {
    if ((Number(data.itemPrice) || 0) > MAX_SUPPORTED_ITEM_VALUE) {
      toast.error("We currently do not support item values above ₦100,000.");
      return false;
    }
    return true;
  };

  const validateDirectServiceArea = (data: BookingQuoteFormData) => {
    const invalidFields: string[] = [];

    if (!isServiceableAddress(data.pickupLocation)) invalidFields.push("pickup");
    if (!isServiceableAddress(data.dropOffLocation)) {
      invalidFields.push("destination");
    }

    if (invalidFields.length === 0) return true;

    const fieldText =
      invalidFields.length === 2
        ? "pickup and destination addresses"
        : `${invalidFields[0]} address`;

    toast.error(
      `We currently only operate in Lagos and Ibadan. Please update your ${fieldText}.`,
    );
    return false;
  };

  const handleQuoteSubmit = (direct: boolean, quoteMode: FormMode) =>
    handleSubmit((data) => {
      let addressesConfirmed = true;
      for (const [field, query] of [
        ["pickupLocation", pickupSearchQuery],
        ["dropOffLocation", destinationSearchQuery],
      ] as const) {
        if (query.trim() !== data[field].trim()) {
          form.setError(field, { type: "manual", message: "Select or enter the complete address before comparing prices" });
          addressesConfirmed = false;
        }
      }
      if (!addressesConfirmed || !validateSupportedValue(data)) return;
      if (direct && !validateDirectServiceArea(data)) return;

      const normalized = saveInputData(data);
      submitQuote({ data: normalized, direct, mode: quoteMode });
    });

  const activatePickup = () => {
    pickupInputRef.current?.focus();
    setActiveCard("pickup");
    setPickupModalOpen(true);
  };

  const activateDestination = () => {
    setActiveCard("destination");
    setDestinationModalOpen(true);
  };

  const activatePackage = () => {
    setActiveCard("package");
  };

  const renderQuoteForm = (direct: boolean) => {
    const pickupClassName = cn(
      direct ? "direct-send" : "compare-pickup-from",
      isDashboard && "mt-4 w-full!",
      activeCard === "pickup" && "outline outline-2 outline-[#77a383]",
    );
    const destinationClassName = cn(
      direct ? "direct-send" : "compare-pickup-destination",
      isDashboard && (direct ? "w-full!" : "!w-full"),
      activeCard === "destination" && "outline outline-2 outline-[#77a383]",
    );
    const packageClassName = cn(
      "direct-send-package",
      isDashboard && (direct ? "w-full!" : "!w-full"),
      activeCard === "package" && "outline outline-2 outline-[#77a383]",
    );

    return (
      <form onSubmit={handleQuoteSubmit(direct, direct ? "gosendeet" : "compare")}>
        <div className={quoteGridClass}>
          <Popover open={pickupModalOpen} onOpenChange={setPickupModalOpen}>
            <PopoverAnchor asChild={!isLanding} className="min-w-0">
              <AddressFieldCard
                ref={pickupInputRef}
                appearance={appearance}
                id={direct ? "pickup-location-input" : "compare-pickup-location-input"}
                label="Pickup address"
                value={pickupSearchQuery}
                placeholder={isLanding ? "Enter pickup address" : "Enter Pickup Address"}
                icon={FiMapPin}
                className={pickupClassName}
                labelClassName={labelStyles}
                error={errors.pickupLocation}
                showCursorHint={!isLanding && showCursorHint && activeCard === "pickup"}
                onActivate={activatePickup}
                onChange={setPickupSearchQuery}
                onHideCursorHint={() => setShowCursorHint(false)}
              />
            </PopoverAnchor>
            <AddressPopover
              type="pickup"
              appearance={appearance}
              open={pickupModalOpen}
              query={pickupSearchQuery}
              otherAddress={dropOffLocation || ""}
              onOpenChange={setPickupModalOpen}
              onQueryChange={setPickupSearchQuery}
              onSelect={(location) => handleAddressSelect("pickupLocation", location)}
            />
          </Popover>

          <Popover
            open={destinationModalOpen}
            onOpenChange={setDestinationModalOpen}
          >
            <PopoverAnchor asChild={!isLanding} className="min-w-0">
              <AddressFieldCard
                appearance={appearance}
                id={
                  direct
                    ? "destination-location-input"
                    : "compare-destination-location-input"
                }
                label="Destination address"
                mobileLabel="Deliver To"
                value={destinationSearchQuery}
                placeholder={isLanding ? "Enter destination address" : "Enter Destination Address"}
                icon={isLanding ? FiMapPin : FiFlag}
                className={destinationClassName}
                labelClassName={labelStyles}
                error={errors.dropOffLocation}
                showCursorHint={!isLanding && showCursorHint && activeCard === "destination"}
                onActivate={activateDestination}
                onChange={setDestinationSearchQuery}
                onHideCursorHint={() => setShowCursorHint(false)}
              />
            </PopoverAnchor>
            <AddressPopover
              type="destination"
              appearance={appearance}
              open={destinationModalOpen}
              query={destinationSearchQuery}
              otherAddress={pickupLocation || ""}
              onOpenChange={setDestinationModalOpen}
              onQueryChange={setDestinationSearchQuery}
              onSelect={(location) => handleAddressSelect("dropOffLocation", location)}
            />
          </Popover>

          <Popover open={packageModalOpen} onOpenChange={setPackageModalOpen}>
            <PopoverTrigger asChild>
              <PackageFieldCard
                appearance={appearance}
                className={packageClassName}
                labelClassName={labelStyles}
                packageName={packageName}
                weight={weight || ""}
                weightUnit={selectedPackageData?.weightUnit}
                packageError={errors.packageTypeId}
                weightError={errors.weight}
                onClick={activatePackage}
                onFocus={activatePackage}
              />
            </PopoverTrigger>
            <PackageTypePopover
              appearance={appearance}
              selectedPackageId={packageTypeId || ""}
              currentWeight={weight || ""}
              currentDimensions={dimensions || ""}
              currentItemPrice={itemPrice || ""}
              onOpenChange={setPackageModalOpen}
              onConfirm={handlePackageConfirm}
            />
          </Popover>

          <QuoteSubmitButton
            appearance={appearance}
            isDashboard={isDashboard}
            loading={isQuoteLoading}
            className={direct ? undefined : "shadow-lg"}
            onClick={handleQuoteSubmit(direct, direct ? "gosendeet" : "compare")}
          />
        </div>
      </form>
    );
  };

  if (!isHydrated) {
    if (isLanding) return (
      <div className="landing-form-skeleton" aria-label="Loading delivery form" aria-busy="true">
        {[0, 1, 2, 3].map(field => <div key={field} />)}
      </div>
    );
    return <FormHorizontalBarSkeleton containerClassName={containerStyles} />;
  }

  return (
    <div className={cn("relative w-full mx-auto", !isDashboard && "max-w-[354px] lg:max-w-[1120px]", isLanding && "landing-form")}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      {!isLanding && <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[48px] lg:rounded-[56px]
                  bg-[linear-gradient(90deg,#A4F4CF_0%,#DCFCE7_50%,#CBFBF1_100%)]
                  blur-[40px] opacity-50 z-0 translate-y-5"
      />}
      <div className={cn(containerStyles, "relative z-10")}>
        {isDashboard && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-39px]">
            <ModeSwitcher
              mode={mode}
              onModeChange={(newMode) => {
                setCurrentMode(newMode);
                onModeChange?.(newMode);
              }}
              variant="pill"
              animate
            />
          </div>
        )}

        {mode === "tracking" && (
          <TrackingNumberForm
            appearance={appearance}
            trackingNumber={trackingNumber}
            loading={trackingLoading}
            isDashboard={isDashboard}
            labelClassName={labelStyles}
            inputClassName={inputStyles}
            onTrackingNumberChange={setTrackingNumber}
            onSubmit={handleTrackingSubmit}
          />
        )}
        {(mode === "gosendeet" || mode === "compare") && renderQuoteForm(false)}
      </div>
    </div>
  );
};

export default FormHorizontalBar;
