import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getQuotes } from "@/services/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  FiChevronRight,
  FiCalendar,
  FiBarChart2,
  FiSearch,
} from "react-icons/fi";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import { AddressModal } from "./modals/AddressModal";
import { PackageTypeModal } from "./modals/PackageTypeModal";
import { PickupDateModal } from "./modals/PickupDateModal";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { NIGERIAN_STATES_AND_CITIES } from "@/constants/nigeriaLocations";
import { trackBookingsHandler } from "@/hooks/useTrackBookings";
import { GoArrowRight } from "react-icons/go";

const normalizeStateKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*state$/, "")
    .trim();

const normalizeCityKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const STATE_LOOKUP = NIGERIAN_STATES_AND_CITIES.reduce<Record<string, string>>(
  (acc, { state }) => {
    acc[normalizeStateKey(state)] = state;
    return acc;
  },
  {}
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

const extractLocationFromAddress = (
  address?: string
): { city: string; state: string } => {
  if (!address) return { city: "", state: "" };

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return { city: "", state: "" };
  }

  let detectedState = "";
  let stateIndex = -1;

  for (let i = parts.length - 1; i >= 0; i--) {
    const normalized = normalizeStateKey(parts[i]);
    if (STATE_LOOKUP[normalized]) {
      detectedState = STATE_LOOKUP[normalized];
      stateIndex = i;
      break;
    }
  }

  if (!detectedState) {
    const lagosPartIndex = parts.findIndex((part) =>
      normalizeStateKey(part).includes("lagos")
    );
    if (lagosPartIndex !== -1) {
      detectedState = "Lagos State";
      stateIndex = lagosPartIndex;
    } else {
      const oyoPartIndex = parts.findIndex((part) =>
        normalizeStateKey(part).includes("oyo")
      );
      if (oyoPartIndex !== -1) {
        detectedState = "Oyo State";
        stateIndex = oyoPartIndex;
      }
    }
  }

  let detectedCity = "";
  const searchStart = stateIndex !== -1 ? stateIndex - 1 : parts.length - 1;
  for (let i = searchStart; i >= 0; i--) {
    const normalized = normalizeCityKey(parts[i]);
    if (NORMALIZED_CITY_LOOKUP[normalized]) {
      detectedCity = NORMALIZED_CITY_LOOKUP[normalized];
      break;
    }
  }

  if (!detectedCity && searchStart >= 0) {
    detectedCity = parts[searchStart];
  }

  if (!detectedState && detectedCity && CITY_STATE_MAP[detectedCity]) {
    detectedState = CITY_STATE_MAP[detectedCity];
  }

  return { city: detectedCity, state: detectedState };
};

const isServiceableAddress = (address?: string) => {
  if (!address) return false;

  const { city, state } = extractLocationFromAddress(address);
  const normalizedState = normalizeStateKey(state);
  const normalizedCity = normalizeCityKey(city);

  if (normalizedState === "lagos") {
    return true;
  }

  if (normalizedState === "oyo") {
    return normalizedCity.startsWith("ibadan");
  }

  return false;
};

interface FormHorizontalBarProps {
  variant?: "bold" | "minimal" | "floating";
  bookingRequest?: any;
  setData?: any;
  activeMode?: "gosendeet" | "compare" | "tracking"; // Current active mode
}

const FormHorizontalBar = ({
  variant = "bold",
  bookingRequest,
  setData,
  activeMode = "gosendeet",
}: FormHorizontalBarProps) => {
  const [inputData, setInputData] = useState<any>({});
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect dashboard route early so we can adjust styles/layout
  const isDashboard = location.pathname.includes("dashboard");
  const [currentMode, setCurrentMode] = useState<FormMode>(activeMode);
  const mode = isDashboard ? currentMode : activeMode;

  // Sync external activeMode prop changes with internal currentMode when on dashboard
  useEffect(() => {
    if (isDashboard) {
      setCurrentMode(activeMode);
    }
  }, [activeMode, isDashboard]);

  // Modal states for Direct mode
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);

  // Store package name and data for display
  const [packageName, setPackageName] = useState("");
  const [selectedPackageData, setSelectedPackageData] = useState<any>(null);

  const {
  mutate: getQuotesDirectly,
  isPending: isQuoteLoading,
  reset: resetQuoteMutation,
} = useMutation({
  mutationFn: (vars: { data: any; direct?: boolean }) =>
    getQuotes(vars.data, vars.direct),

  onSuccess: (response: any) => {
    const quotes = response?.data ?? [];

    if (quotes.length === 0) {
      toast.error("No quotes found! Please try a different package type.");
      resetQuoteMutation();
      return;
    }

    toast.success("Successful");

    navigate("/cost-calculator", {
      state: {
        inputData,
        results: response,
        mode: mode, // Use the actual current mode
      },
    });

    if (typeof setData === "function") {
      setData(response);
    }

    resetQuoteMutation();
  },

  onError: (error: any) => {
    toast.error(error?.message || "Something went wrong.");
    resetQuoteMutation();
  },
});


  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = packageTypes?.data;

  const schema = z.object({
    pickupLocation: z
      .string({ required_error: "Pickup location is required" })
      .min(1, { message: "Please enter pickup location" }),
    dropOffLocation: z
      .string({ required_error: "Drop off location is required" })
      .min(1, { message: "Please enter drop off location" }),
    packageTypeId: z
      .string({ required_error: "Package type is required" })
      .min(1, { message: "Please enter package type" }),
    weight: z
      .string({ required_error: "Weight is required" })
      .min(1, { message: "Please enter weight" }),
    dimensions: z.string().optional(),
    itemPrice: z
      .string({ required_error: "Item price is required" })
      .min(1, { message: "Please enter item price" }),
    pickupDate: z.string().optional(),
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      pickupLocation: "",
      dropOffLocation: "",
      packageTypeId: "",
      weight: "",
      dimensions: "",
      itemPrice: "",
      pickupDate: "",
    },
  });

  const pickupLocation = watch("pickupLocation");
  const dropOffLocation = watch("dropOffLocation");
  const packageTypeId = watch("packageTypeId");
  const weight = watch("weight");
  const dimensions = watch("dimensions");
  const itemPrice = watch("itemPrice");
  const pickupDate = watch("pickupDate");

  const normalizeData = (data: any) => ({
    ...data,
    packageTypeId: String(data?.packageTypeId ?? ""),
  });

  const saveInputData = (data: any) => {
    const normalized = normalizeData(data);
    setInputData(normalized);
    sessionStorage.setItem("bookingInputData", JSON.stringify(normalized));
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingInputData");
    const storedData = stored ? normalizeData(JSON.parse(stored)) : null;

    if (storedData) {
      setInputData(storedData);
      reset({
        pickupLocation: storedData.pickupLocation ?? "",
        dropOffLocation: storedData.dropOffLocation ?? "",
        packageTypeId: storedData.packageTypeId ?? "",
        weight: storedData.weight ?? "",
        dimensions: storedData.dimensions ?? "",
        itemPrice: storedData.itemPrice ?? "",
        pickupDate: storedData.pickupDate ?? "",
      });
    } else if (bookingRequest) {
      const normalized = normalizeData(bookingRequest);
      setInputData(normalized);
      reset(normalized);
    }
    setIsHydrated(true);
  }, [bookingRequest, reset]);

  useEffect(() => {
    if (inputData?.packageTypeId && packages?.length > 0) {
      setValue("packageTypeId", String(inputData.packageTypeId), {
        shouldValidate: false,
      });

      // Restore package display state (name and data)
      const pkg = packages.find(
        (p: any) => String(p.id) === String(inputData.packageTypeId)
      );
      if (pkg) {
        setPackageName(pkg.name);
        setSelectedPackageData(pkg);
      }
    }
  }, [inputData?.packageTypeId, packages, setValue]);

  // ----- Handle unauthenticated quick quote -----
  useEffect(() => {
    const isUnauthenticated =
      sessionStorage.getItem("unauthenticated") === "true";
    if (!isUnauthenticated) return;

    const stored = sessionStorage.getItem("bookingInputData");
    if (!stored) return;

    let parsed;
    try {
      parsed = normalizeData(JSON.parse(stored));
    } catch {
      console.error("Invalid bookingInputData in sessionStorage");
      return;
    }

    getQuotesDirectly({data: [
      {
        ...parsed,
        quantity: 1,
        itemValue: Number(parsed.itemPrice),
        packageDescription: {
          isFragile: false,
          isPerishable: false,
          isExclusive: false,
          isHazardous: false,
        },
      },
    ], direct:false});

    sessionStorage.removeItem("unauthenticated");
  }, []);

  const onSubmit = (data: z.infer<typeof schema>) => {
    saveInputData(data);
  };
  const [loading, setLoading] = useState(false);
  // Handle tracking form submission
  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    trackBookingsHandler(trackingNumber, navigate, setLoading);
  };

  // Variant-specific styling
  const containerStyles = cn(
    // Dashboard uses a tighter, card-like container with subtle border
    isDashboard
      ? "w-full max-w-3xl mx-auto py-10 px-6 rounded-2xl bg-white border relative"
      : "w-full max-w-6xl mx-auto py-10 px-6 rounded-3xl",
    !isDashboard &&
      variant === "bold" &&
      "bg-white border shadow-md",
    !isDashboard &&
      variant === "minimal" &&
      "bg-white border border-gray-200 shadow-sm",
    !isDashboard && variant === "floating" && "bg-white"
  );

  const labelStyles = cn(
    "font-clash font-bold text-xs mb-2 block",
    variant === "bold" && "text-[#1a1a1a]",
    (variant === "minimal" || variant === "floating") && "text-[#4b5563]"
  );

  const inputStyles = cn(
    "w-full outline-0 bg-transparent text-base py-2 px-3 border-b-2 transition-colors",
    variant === "bold" &&
      "border-[#e5e5e5] hover:border-green-400 focus:border-green-400 text-[#1a1a1a] placeholder:text-[#9ca3af]",
    (variant === "minimal" || variant === "floating") &&
      "border-[#e5e5e5] hover:border-green-300 focus:border-green-300 text-[#1a1a1a] placeholder:text-[#9ca3af]"
  );

  // Determine if form should be vertical (dashboard route)
  const containerClass = isDashboard
    ? `space-y-8`
    : "grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] gap-4 items-end grid-cols-1 space-y-4 lg:space-y-0";

  // Show loading skeleton while hydrating
  if (!isHydrated) {
    return (
      <div className={containerStyles}>
        <div className="animate-pulse">
          {/* Desktop Grid Skeleton */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-3 items-end min-w-[280px]">
              <div className="h-14 bg-gray-300 rounded flex-[2]"></div>
              <div className="h-14 bg-gray-200 rounded flex-[1]"></div>
            </div>
          </div>
          {/* Mobile Stack Skeleton */}
          <div className="lg:hidden space-y-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-14 bg-gray-300 rounded"></div>
            <div className="h-14 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerStyles}>
      {isDashboard && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[-20px]">
          <ModeSwitcher
            mode={mode}
            onModeChange={setCurrentMode}
            variant="pill"
            animate
          />
        </div>
      )}
      {/* Tracking Mode Form */}
      {mode === "tracking" ? (
        <form onSubmit={handleTrackingSubmit}>
          <div
            className={cn(
              isDashboard
                ? "flex flex-col gap-4"
                : "flex flex-col lg:flex-row lg:items-end gap-4"
            )}
          >
            <div className={isDashboard ? "w-full" : "flex-1"}>
              <label
                htmlFor="trackingNumber"
                className={cn(labelStyles, "flex items-center gap-2")}
              >
                <SlLocationPin size={18} className="text-orange500" />
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (GOS*****)"
                className={inputStyles}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="secondary"
              size="custom"
              className={cn(
                "font-bold",
                isDashboard
                  ? "w-full px-6 py-3 justify-center"
                  : "px-5 py-2.5 h-auto justify-center text-sm whitespace-nowrap"
              )}
            >
              <FiSearch className="text-white mr-1.5 w-4 h-4" />
              <span className="text-white">
                {isDashboard ? "Track Shipment" : "Track"}
              </span>
            </Button>
          </div>
        </form>
      ) : mode === "gosendeet" ? (
        // Direct Mode with Modal Triggers
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={containerClass}>
            {/* Pickup Location - Modal Trigger */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <SlLocationPin size={18} className="text-orange500" />
                Pickup Location
                {errors.pickupLocation && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <button
                type="button"
                onClick={() => setPickupModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  errors.pickupLocation
                    ? "border-red-500"
                    : pickupLocation
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                <span
                  className={cn(
                    "text-base truncate",
                    pickupLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]"
                  )}
                >
                  {pickupLocation || "Where from?"}
                </span>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
              {errors.pickupLocation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pickupLocation.message}
                </p>
              )}
            </div>

            {/* Destination - Modal Trigger */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <SlLocationPin size={18} className="text-orange500" />
                Destination
                {errors.dropOffLocation && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <button
                type="button"
                onClick={() => setDestinationModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  errors.dropOffLocation
                    ? "border-red-500"
                    : dropOffLocation
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                <span
                  className={cn(
                    "text-base truncate",
                    dropOffLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]"
                  )}
                >
                  {dropOffLocation || "Where to?"}
                </span>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
              {errors.dropOffLocation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dropOffLocation.message}
                </p>
              )}
            </div>

            {/* Package Details - Single Modal Trigger */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <HiOutlineAdjustmentsHorizontal
                  size={18}
                  className="text-blue-500"
                />
                Package Details
                {(errors.packageTypeId || errors.weight) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <button
                type="button"
                onClick={() => setPackageModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  errors.packageTypeId || errors.weight
                    ? "border-red-500"
                    : packageTypeId && weight && dimensions
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                <div className="flex-1 min-w-0">
                  {packageName && weight && dimensions ? (
                    <div className="space-y-0.5">
                      <p className="text-base text-[#1a1a1a] font-semibold truncate">
                        {packageName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {dimensions} • {weight}
                        {selectedPackageData?.weightUnit || "kg"}
                      </p>
                    </div>
                  ) : (
                    <span className="text-base text-[#9ca3af]">
                      Select details
                    </span>
                  )}
                </div>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
              {(errors.packageTypeId || errors.weight) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.packageTypeId?.message || errors.weight?.message}
                </p>
              )}
            </div>

            {/* Pickup - Modal Trigger (Only for gosendeet mode) */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <FiCalendar className="w-4 h-4 opacity-90" />
                Pickup
              </label>
              <button
                type="button"
                onClick={() => setDateModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  pickupDate
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                {pickupDate ? (
                  <div className="flex-1 min-w-0">
                    <div className="space-y-0.5">
                      <p className="text-base text-[#1a1a1a] font-semibold truncate">
                        {new Date(pickupDate.split(" ")[0]).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {pickupDate.split(" ").slice(1).join(" ")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-base text-[#9ca3af]">
                    Select pickup
                  </span>
                )}
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
            </div>

            {/* Buttons */}
            <div className={isDashboard ? "w-full" : "flex gap-3 items-end"}>
              <Button
                type="button"
                
                size={"custom"}
                className={cn(
                  "font-bold whitespace-nowrap bg-green800",
                  isDashboard
                    ? "w-full px-6 py-3 justify-center"
                    : "flex-1 px-5 py-2.5 h-auto justify-center text-sm"
                )}
                loading={isQuoteLoading}
                onClick={handleSubmit((data) => {
                  const invalidFields: string[] = [];

                  if (!isServiceableAddress(data.pickupLocation)) {
                    invalidFields.push("pickup");
                  }

                  if (!isServiceableAddress(data.dropOffLocation)) {
                    invalidFields.push("destination");
                  }

                  if (invalidFields.length > 0) {
                    const fieldText =
                      invalidFields.length === 2
                        ? "pickup and destination addresses"
                        : `${invalidFields[0]} address`;

                    toast.error(
                      `We currently only operate in Lagos and Ibadan. Please update your ${fieldText}.`
                    );
                    return;
                  }

                  saveInputData(data);
                  getQuotesDirectly({data : [
                    {
                      ...data,
                      itemValue: Number(data.itemPrice),
                      quantity: 1,
                      packageDescription: {
                        isFragile: false,
                        isPerishable: false,
                        isExclusive: false,
                        isHazardous: false,
                      },
                    },
                  ], direct:true});
                })}
              >
                <GoArrowRight className="text-white mr-1.5 w-4 h-4" />
                <span className="text-white">
                  Get Price
                </span>
              </Button>
            </div>
          </div>
        </form>
      ) : mode === "compare" ? (
        // Compare Mode with Modal Triggers (no Pickup Date)
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={containerClass}>
            {/* Pickup Location - Modal Trigger */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <SlLocationPin size={18} className="text-orange500" />
                Pickup Location
                {!pickupLocation && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => setPickupModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  errors.pickupLocation
                    ? "border-red-500"
                    : pickupLocation
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                <span
                  className={cn(
                    "text-base truncate",
                    pickupLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]"
                  )}
                >
                  {pickupLocation || "Where from?"}
                </span>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
              {errors.pickupLocation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pickupLocation.message}
                </p>
              )}
            </div>

            {/* Destination - Modal Trigger */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <SlLocationPin size={18} className="text-orange500" />
                Destination
                {!dropOffLocation && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => setDestinationModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  errors.dropOffLocation
                    ? "border-red-500"
                    : dropOffLocation
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                <span
                  className={cn(
                    "text-base truncate",
                    dropOffLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]"
                  )}
                >
                  {dropOffLocation || "Where to?"}
                </span>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
              {errors.dropOffLocation && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dropOffLocation.message}
                </p>
              )}
            </div>

            {/* Package Details - Single Modal Trigger */}
            <div>
              <label className={cn(labelStyles, "flex items-center gap-2")}>
                <HiOutlineAdjustmentsHorizontal
                  size={18}
                  className="text-blue-500"
                />
                Package Details
                {(!packageTypeId || !weight || !itemPrice) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <button
                type="button"
                onClick={() => setPackageModalOpen(true)}
                className={cn(
                  "w-full text-left py-2 px-3 border-b-2 transition-colors flex items-center justify-between group",
                  errors.packageTypeId || errors.weight
                    ? "border-red-500"
                    : packageTypeId && weight && dimensions
                    ? "border-green-400"
                    : "border-[#e5e5e5] hover:border-green-400"
                )}
              >
                <div className="flex-1 min-w-0">
                  {packageName && weight && dimensions ? (
                    <div className="space-y-0.5">
                      <p className="text-base text-[#1a1a1a] font-semibold truncate">
                        {packageName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {dimensions} • {weight}
                        {selectedPackageData?.weightUnit || "kg"}
                      </p>
                    </div>
                  ) : (
                    <span className="text-base text-[#9ca3af]">
                      Select details
                    </span>
                  )}
                </div>
                <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </button>
              {(errors.packageTypeId || errors.weight) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.packageTypeId?.message || errors.weight?.message}
                </p>
              )}
            </div>

            {/* Compare Button */}
            <div className={isDashboard ? "w-full" : "flex gap-3 items-end"}>
              <Button
                type="button"
                variant={"secondary"}
                size={"custom"}
                className={cn(
                  "font-bold whitespace-nowrap",
                  isDashboard
                    ? "w-full px-6 py-3 justify-center"
                    : "flex-1 px-5 py-2.5 h-auto justify-center text-sm"
                )}
                loading={isQuoteLoading}
                onClick={handleSubmit((data) => {
                  saveInputData(data);
                  // Compare directly - get quotes immediately without opening modal
                  getQuotesDirectly({data : [
                    {
                      ...data,
                      itemValue: Number(data.itemPrice),
                      quantity: 1,
                      packageDescription: {
                        isFragile: false,
                        isPerishable: false,
                        isExclusive: false,
                        isHazardous: false,
                      },
                    },
                  ], direct:false});
                })}
              >
                <FiBarChart2 className="text-white mr-1.5 w-4 h-4" />
                <span className="text-white">Compare</span>
              </Button>
            </div>
          </div>
        </form>
      ) : null}

      {/* Modals for Direct and Compare modes */}
      {(mode === "gosendeet" || mode === "compare") && (
        <>
          <AddressModal
            type="pickup"
            open={pickupModalOpen}
            onOpenChange={setPickupModalOpen}
            value={pickupLocation || ""}
            onSelect={(location) => {
              setValue("pickupLocation", location, { shouldValidate: true });
              // Immediately save to sessionStorage to ensure persistence
              const currentData = watch();
              saveInputData({ ...currentData, pickupLocation: location });
            }}
          />

          <AddressModal
            type="destination"
            open={destinationModalOpen}
            onOpenChange={setDestinationModalOpen}
            value={dropOffLocation || ""}
            onSelect={(location) => {
              setValue("dropOffLocation", location, { shouldValidate: true });
              // Immediately save to sessionStorage to ensure persistence
              const currentData = watch();
              saveInputData({ ...currentData, dropOffLocation: location });
            }}
          />

          <PackageTypeModal
            open={packageModalOpen}
            onOpenChange={setPackageModalOpen}
            selectedPackageId={packageTypeId || ""}
            currentWeight={weight || ""}
            currentDimensions={dimensions || ""}
            currentItemPrice={itemPrice || ""}
            onConfirm={(
              id,
              name,
              weightValue,
              dimensionsValue,
              itemPriceValue,
              packageData
            ) => {
              setValue("packageTypeId", id, { shouldValidate: true });
              setValue("weight", weightValue, { shouldValidate: true });
              setValue("dimensions", dimensionsValue);
              setValue("itemPrice", itemPriceValue, { shouldValidate: true });
              setPackageName(name);
              setSelectedPackageData(packageData);
              // Immediately save to sessionStorage to ensure persistence
              const currentData = watch();
              saveInputData({
                ...currentData,
                packageTypeId: id,
                weight: weightValue,
                dimensions: dimensionsValue,
                itemPrice: itemPriceValue,
              });
            }}
          />

          {/* Pickup Date Modal - Only for Direct mode */}
          {mode === "gosendeet" && (
            <PickupDateModal
              open={dateModalOpen}
              onOpenChange={setDateModalOpen}
              value={pickupDate || ""}
              onSelect={(date) => {
                setValue("pickupDate", date);
                // Immediately save to sessionStorage to ensure persistence
                const currentData = watch();
                saveInputData({ ...currentData, pickupDate: date });
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FormHorizontalBar;
