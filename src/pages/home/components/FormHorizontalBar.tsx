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
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import { AddressModal } from "./modals/AddressModal";
import { PackageTypeModal } from "./modals/PackageTypeModal";
import { PickupDateModal } from "./modals/PickupDateModal";
import { SlLocationPin } from "react-icons/sl";
import { FiPackage } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";
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

const extractLocationFromAddress = (
  address?: string,
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
      normalizeStateKey(part).includes("lagos"),
    );
    if (lagosPartIndex !== -1) {
      detectedState = "Lagos State";
      stateIndex = lagosPartIndex;
    } else {
      const oyoPartIndex = parts.findIndex((part) =>
        normalizeStateKey(part).includes("oyo"),
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
      .min(1, { message: "Enter pickup location" }),
    dropOffLocation: z
      .string({ required_error: "Drop off location is required" })
      .min(1, { message: "Enter drop off location" }),
    packageTypeId: z
      .string({ required_error: "Package type is required" })
      .min(1, { message: "Enter package type" }),
    weight: z
      .string({ required_error: "Weight is required" })
      .min(1, { message: "Enter weight" }),
    dimensions: z.string().optional(),
    itemPrice: z
      .string({ required_error: "Item price is required" })
      .min(1, { message: "Enter item price" }),
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
        (p: any) => String(p.id) === String(inputData.packageTypeId),
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

    getQuotesDirectly({
      data: [
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
      ],
      direct: false,
    });

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
      : "w-full mx-auto max-w-[354px] lg:max-w-[1024px] pt-[12.82px] px-[12.82px] pb-[0.83px] lg:pt-[16.57px] lg:px-[16.57px] lg:pb-[16.57px] rounded-[32px] lg:rounded-[40px] border-t border-[#F1F5F9] bg-white/80 backdrop-blur-[48px] shadow-lg",
    !isDashboard && variant === "bold" && "bg-white border",
    !isDashboard &&
      variant === "minimal" &&
      "bg-white border border-gray-200",
    !isDashboard && variant === "floating" && "bg-white",
  );

  const labelStyles = cn(
    "font-clash font-bold text-xs mb-2 block",
    variant === "bold" && "text-[#1a1a1a]",
    (variant === "minimal" || variant === "floating") && "text-[#4b5563]",
  );

  const inputStyles = cn(
    "w-full outline-0 bg-transparent text-base py-2 px-1  transition-colors",
    variant === "bold" &&
      "border-[#e5e5e5] text-[#1a1a1a] placeholder:text-[#CAD5E2]",
    (variant === "minimal" || variant === "floating") &&
      "border-[#e5e5e5] font-bold tracking-wider font-arial text-[#1a1a1a] placeholder:text-[#CAD5E2]",
  );

  // Determine if form should be vertical (dashboard route)
  const containerClass = isDashboard
    ? `space-y-2`
    : "grid grid-cols-1 gap-y-2 lg:gap-8 items-end lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]";

  // Compare mode has 3 cards + button, so use a different grid
  const compareContainerClass = isDashboard
    ? `space-y-2`
    : "grid grid-cols-1 gap-y-2 items-end  lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,1fr)_auto] ";

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
    <div className="relative w-full mx-auto max-w-[354px] lg:max-w-[1024px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[48px] lg:rounded-[56px] 
                  bg-[linear-gradient(90deg,#A4F4CF_0%,#DCFCE7_50%,#CBFBF1_100%)]
                  blur-[40px] opacity-50 z-0 translate-y-5"></div>
      <div className={cn(containerStyles, "relative z-10")}>
        {isDashboard && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-39px]">
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
                  : "flex flex-col lg:flex-row lg:items-end gap-4",
              )}
            >
              <div className={isDashboard ? "mt-4 w-full" : "flex-1"}>
                <div className="tracking-section">
                  <label
                    htmlFor="trackingNumber"
                    className={cn(
                      labelStyles,
                      "flex justify-between items-center",
                    )}
                  >
                    <p className="text-[#90A1B9] font-arial text-xs tracking-widest uppercase">
                      Tracking Number
                    </p>
                    <div className="border-2 border-[#CAD5E2] p-1 rounded-full w-4 h-4"></div>
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number (GOS*****)"
                    className={inputStyles}
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                size="custom"
                className={cn(
                  "font-bold bg-[#064E3B] ",
                  isDashboard
                    ? "w-full px-6 py-3 justify-center"
                    : "gosend-custom-button",
                )}
              >
                <GoArrowRight
                  className="text-white mr-1.5 "
                  style={{ width: "32px", height: "32px" }}
                />
                <span className="text-[#D0FAE5CC] font-arial font-bold text-xs">
                  {isDashboard ? (
                    <span className="capitalize">Track Shipment</span>
                  ) : (
                    <span className="uppercase">Track</span>
                  )}
                </span>
              </Button>
            </div>
          </form>
        ) : mode === "gosendeet" ? (
          // Direct Mode with Modal Triggers
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={containerClass}>
              {/* Pickup Location - Modal Trigger */}
              <div
                onClick={() => setPickupModalOpen(true)}
                className={cn("direct-send", isDashboard && "mt-4 w-full!")}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex items-center justify-between gap-2",
                  )}
                >
                  <p className="font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Pickup From
                  </p>
                  <div className="border-2 border-[#CAD5E2] p-1 rounded-full w-4 h-4"></div>
                </label>
               
                <div className="w-full flex items-center justify-between">
                  <span
                    className={cn(
                      "text-base truncate",
                      pickupLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]",
                    )}
                  >
                    {pickupLocation || (
                      <>
                        <span className="lg:hidden font-arial font-bold text-sm">
                          Enter address
                        </span>
                        <span className="hidden lg:block font-arial">
                          Where from
                        </span>
                      </>
                    )}
                  </span>
                </div>
                {errors.pickupLocation && (
                  <p className="w-fit text-xs text-red-500 mt-1">
                    {errors.pickupLocation.message}
                  </p>
                )}
              </div>

              {/* Destination - Modal Trigger */}
              <div
                className={cn("direct-send", isDashboard && "w-full!")}
                onClick={() => setDestinationModalOpen(true)}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex justify-between items-center gap-2",
                  )}
                >
                  <p className="hidden lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Destination
                  </p>
                  <p className="block lg:hidden font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Deliver To
                  </p>

                  <div className="border-2 border-[#CAD5E2] p-1 rounded-full w-4 h-4"></div>
                  
                </label>
               

                <div className="w-full flex items-center justify-between">
                  <span
                    className={cn(
                      "text-base truncate",
                      dropOffLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]",
                    )}
                  >
                    {dropOffLocation || (
                      <>
                        <span className="lg:hidden font-arial font-bold text-sm">
                          Enter Destination
                        </span>
                        <span className="hidden lg:block font-arial">
                          Where to?
                        </span>
                      </>
                    )}
                  </span>
                </div>
                {errors.dropOffLocation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dropOffLocation.message}
                  </p>
                )}
              </div>

              {/* Package Details - Single Modal Trigger */}
              <div
                className={cn("direct-send-package", isDashboard && "w-full!")}
                onClick={() => setPackageModalOpen(true)}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex items-center justify-between gap-2",
                  )}
                >
                  <p className="lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Package
                  </p>

                  <FiPackage size={18} className="text-[#CAD5E2]" />

                  
                </label>

                <div className="w-full flex items-center justify-between -mt-1">
                  {packageName ? (
                    <span className="text-base truncate text-[#1a1a1a]">
                      {packageName}
                    </span>
                  ) : (
                    <>
                      <span className="font-arial text-sm lg:text-base font-bold text-[#9ca3af]">
                        Select
                      </span>
                      <FaAngleDown size={18} className="text-[#CAD5E2]" />
                    </>
                  )}
                </div>

                {(errors.packageTypeId || errors.weight) && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.packageTypeId?.message || errors.weight?.message}
                  </p>
                )}
              </div>

              {/* Pickup - Modal Trigger (Only for gosendeet mode) */}
              <div
                className={cn("direct-send-pickup", isDashboard && "w-full!")}
                onClick={() => setDateModalOpen(true)}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex justify-between items-center gap-2",
                  )}
                >
                  <p className="lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Pickup
                  </p>

                  <FiPackage size={18} className="text-[#CAD5E2]" />
                </label>
                <div className="flex justify-between items-center -mt-1">
                  {pickupDate ? (
                    <div className="flex-1 min-w-0">
                      <div className="space-y-0.2">
                        <p className="text-sm text-[#1a1a1a] font-semibold truncate">
                          {new Date(
                            pickupDate.split(" ")[0],
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {pickupDate.split(" ").slice(1).join(" ")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm font-bold lg:text-base font-arial text-[#9ca3af]">
                      Select
                    </span>
                  )}
                  <FaAngleDown
                    size={18}
                    className="text-[#CAD5E2] transition-colors shrink-0"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className={isDashboard ? "mt-4 w-full" : "flex gap-3 items-end"}>
                <Button
                  type="button"
                  size={"custom"}
                  className={cn(
                    "font-bold bg-[#064E3B]",
                    isDashboard
                      ? "w-full px-6 py-3 justify-center"
                      : "gosend-custom-button",
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
                        `We currently only operate in Lagos and Ibadan. Please update your ${fieldText}.`,
                      );
                      return;
                    }

                    saveInputData(data);
                    getQuotesDirectly({
                      data: [
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
                      ],
                      direct: true,
                    });
                  })}
                >
                  <GoArrowRight
                    className="text-white mr-1.5 "
                    style={{ width: "32px", height: "32px" }}
                  />
                  <span className="text-[#D0FAE5CC] font-arial font-bold text-xs uppercase">
                    Get Price
                  </span>
                </Button>
              </div>
            </div>
          </form>
        ) : mode === "compare" ? (
          // Compare Mode with Modal Triggers (no Pickup Date)
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={compareContainerClass}>
              {/* Pickup Location - Modal Trigger */}
              <div
                className={cn("compare-pickup-from cursor-pointer", isDashboard && "mt-4 w-full!")}
                onClick={() => setPickupModalOpen(true)}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex justify-between items-center gap-2",
                  )}
                >
                  <p className="font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Pickup From
                  </p>
                  <div className="border-2 border-[#CAD5E2] p-1 rounded-full w-4 h-4"></div>
                </label>
                <div className="w-full flex items-center justify-between">
                  <span
                    className={cn(
                      "text-base truncate",
                      pickupLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]",
                    )}
                  >
                    {pickupLocation || (
                      <>
                        <span className="lg:hidden font-arial font-bold text-sm">
                          Enter Address
                        </span>
                        <span className="hidden lg:block text-[#CAD5E2] font-arial font-bold">
                          Enter Address
                        </span>
                      </>
                    )}
                  </span>
                </div>
                {errors.pickupLocation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.pickupLocation.message}
                  </p>
                )}
              </div>

              {/* Destination - Modal Trigger */}
              <div
                className={cn("compare-pickup-destination", isDashboard && "!w-full")}
                onClick={() => setDestinationModalOpen(true)}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex justify-between items-center gap-2",
                  )}
                >
                  <p className="hidden lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Destination
                  </p>
                  <p className="block lg:hidden font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Deliver To
                  </p>
                  <SlLocationPin size={18} className="text-[#CAD5E2]" />
                </label>
                <div className="w-full flex items-center justify-between">
                  <span
                    className={cn(
                      "text-base truncate",
                      dropOffLocation ? "text-[#1a1a1a]" : "text-[#9ca3af]",
                    )}
                  >
                    {dropOffLocation || (
                      <>
                        <span className="lg:hidden font-arial font-bold text-sm">
                          Enter Destination
                        </span>
                        <span className="hidden lg:block text-[#CAD5E2] font-arial font-bold">
                          Enter Destination
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {errors.dropOffLocation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dropOffLocation.message}
                  </p>
                )}
              </div>

              {/* Package Details - Single Modal Trigger */}
              <div
                className={cn("direct-send-package", isDashboard && "!w-full")}
                onClick={() => setPackageModalOpen(true)}
              >
                <label
                  className={cn(
                    labelStyles,
                    "flex justify-between items-center gap-2",
                  )}
                >
                  <p className="lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                    Package
                  </p>

                  <FiPackage size={18} className="text-[#CAD5E2]" />
                </label>
                <div className="w-full flex items-center justify-between">
                  {packageName && weight && dimensions ? (
                    <div className="space-y-0.5">
                      <span className="text-base truncate text-[#1a1a1a] font-semibold">
                        {packageName}
                      </span>
                      <span className="text-xs text-gray-600 truncate">
                        {dimensions} • {weight}
                        {selectedPackageData?.weightUnit || "kg"}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="font-arial text-sm lg:text-base text-[#9ca3af] font-bold">
                        Select
                      </span>
                      <FaAngleDown size={18} className="text-[#CAD5E2]" />
                    </>
                  )}
                </div>

                {(errors.packageTypeId || errors.weight) && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.packageTypeId?.message || errors.weight?.message}
                  </p>
                )}
              </div>

              {/* Compare Button */}
              <div className={isDashboard ? "mt-4 w-full" : "flex gap-3 items-end"}>
                <Button
                  type="button"
                  size={"custom"}
                  className={cn(
                    "font-bold bg-[#064E3B] shadow-lg",
                    isDashboard
                      ? "w-full px-6 py-3 justify-center"
                      : "gosend-custom-button",
                  )}
                  loading={isQuoteLoading}
                  onClick={handleSubmit((data) => {
                    saveInputData(data);
                    // Compare directly - get quotes immediately without opening modal
                    getQuotesDirectly({
                      data: [
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
                      ],
                      direct: false,
                    });
                  })}
                >
                  <GoArrowRight
                    className="text-white mr-1.5 "
                    style={{ width: "32px", height: "32px" }}
                  />
                  <span className="text-[#D0FAE5CC] font-arial font-bold text-xs uppercase">
                    Get Price
                  </span>
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
                packageData,
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
    </div>
  );
};

export default FormHorizontalBar;
