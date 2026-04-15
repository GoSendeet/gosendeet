import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import empty from "@/assets/images/green-empty-bg.png";
import Rating from "@/components/Rating";
import { FiPackage } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Box,
  ChevronDown,
  Copy,
  MapPin,
  Share2,
  Shield,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { shareQuotes, getQuotes } from "@/services/user";
import { useGetSharedQuotes } from "@/queries/user/useGetUserBookings";
import logo from "@/assets/images/gosendeet-black-logo.png";
import CurrencyFormatter from "@/components/CurrencyFormatter";
import { NIGERIAN_STATES_AND_CITIES } from "@/constants/nigeriaLocations";

const APP_BASE_URL = window.location.origin.replace(/\/$/, "");

const parsePrice = (price: string | number | undefined | null): number => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
};

const normalizeQuotesResponse = (response: any): any[] => {
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

// Extract state from address using the accepted routes
const extractStateFromAddress = (address?: string): string => {
  if (!address) return "";
  const lowerAddress = address.toLowerCase();

  // First, check against all available states
  for (const state of NIGERIAN_STATES_AND_CITIES) {
    if (lowerAddress.includes(state.state.toLowerCase())) {
      return state.state;
    }
  }

  // Then, check against all available cities
  for (const [city, state] of Object.entries(CITY_TO_STATE)) {
    if (lowerAddress.includes(city)) {
      return state;
    }
  }

  // Return last part of address if no match found
  const parts = address.split(",").map((p) => p.trim());
  return parts[parts.length - 1] || "";
};

const Calculator = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || "";
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get("shareId") || "";
  const { data: sharedQuote } = useGetSharedQuotes(shareId);
  const { results, inputData: stateInputData } = location.state || {};
  const [mode, setMode] = useState<FormMode>(
    location?.state?.mode ?? "gosendeet",
  );

  const storedInputData = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("bookingInputData");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Error parsing bookingInputData from sessionStorage:", err);
      return null;
    }
  }, []);

  const sharedQuoteRequest = sharedQuote?.quoteRequests[0];

  const inputData =
    sharedQuoteRequest || stateInputData || storedInputData || {};

  const PRICE_MIN = 0;
  const PRICE_STEP = 200;
  const PAGE_SIZE = 8;
  const bookingRequest = inputData;
  const [data, setData] = useState(results || {});
  const quoteContent = useMemo(() => {
    return normalizeQuotesResponse(data);
  }, [data]);

  const hasQuotes = quoteContent.length > 0;
  const stablePriceMaxRef = useRef(0);
  const PRICE_MAX = useMemo(() => {
    if (!hasQuotes) return stablePriceMaxRef.current;

    const computed = Math.ceil(
      Math.max(...quoteContent.map((item: any) => parsePrice(item.price))) *
        1.1,
    );
    // Only lock in once — pagination may load higher prices later, we don't want the range to grow
    if (stablePriceMaxRef.current === 0) {
      stablePriceMaxRef.current = computed;
    }
    return stablePriceMaxRef.current;
  }, [hasQuotes, quoteContent]);
  const [sortBy, setSortBy] = useState("price-asc");
  const [filterPickupDate, setFilterPickupDate] = useState("");
  const [filterDeliveryDate, setFilterDeliveryDate] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState<number | "">(PRICE_MAX);
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState<string[]>(
    [],
  );
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedDirectQuoteIndex, setSelectedDirectQuoteIndex] = useState(0);
  const pageRef = useRef(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const minPriceRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const maxPriceInitializedRef = useRef(false);
  useEffect(() => {
    if (PRICE_MAX > 0 && !maxPriceInitializedRef.current) {
      setMaxPrice(PRICE_MAX);
      maxPriceInitializedRef.current = true;
    }
  }, [PRICE_MAX]);

  //focus the cursor on minPrice card when drawer opens
  useEffect(() => {
    if (showFilters) {
      setTimeout(() => {
        minPriceRef.current?.focus();
      }, 300); // wait for drawer animation
    }
  }, [showFilters]);

  const handleMinInput = (value: string) => {
    if (value === "") {
      setMinPrice("");
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) setMinPrice(num);
  };

  const handleMaxInput = (value: string) => {
    if (value === "") {
      setMaxPrice("");
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) setMaxPrice(Math.min(num, PRICE_MAX));
  };

  const getPercent = (value: number) => {
    return ((value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  };

  const toggleMobileFilterBtn = (show: boolean) => {
    setShowFilters(show);
  };

  useEffect(() => {
    if (shareId && sharedQuote) {
      setData(sharedQuote);
    } else if (results) {
      setData(results);
    }
  }, [results, sharedQuote, shareId]);

  //Debounce min price — clamp here so free typing doesn't break filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      const clamped = Math.min(
        Math.max(minPrice || PRICE_MIN, PRICE_MIN),
        (maxPrice || PRICE_MAX) - PRICE_STEP,
      );
      setDebouncedMinPrice(clamped);
    }, 400);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, PRICE_MIN, PRICE_MAX, PRICE_STEP]);

  //Debounce max price — clamp here so free typing doesn't break filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      const clamped = Math.max(
        Math.min(maxPrice || PRICE_MAX, PRICE_MAX),
        (minPrice || PRICE_MIN) + PRICE_STEP,
      );
      setDebouncedMaxPrice(clamped);
    }, 400);
    return () => clearTimeout(timer);
  }, [maxPrice, minPrice, PRICE_MIN, PRICE_MAX, PRICE_STEP]);

  const isSharedView = Boolean(shareId);

  const quotePayload = useMemo(() => {
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
  }, [bookingRequest]);

  const derivedHasNextDay = useMemo(() => {
    const speeds = selectedDeliverySpeed.filter((s) => s !== "Any Speed");
    if (speeds.length === 0 || speeds.length > 1) return undefined;
    return speeds[0] === "Next Day";
  }, [selectedDeliverySpeed]);

  const filterParams = useMemo(() => {
    const companyName =
      selectedProviders.length > 0 ? selectedProviders.join(",") : undefined;
    const minPriceParam =
      typeof debouncedMinPrice === "number" ? debouncedMinPrice : undefined;
    const maxPriceParam =
      typeof debouncedMaxPrice === "number" ? debouncedMaxPrice : undefined;

    return {
      search: undefined,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      companyName,
      hasNextDay: derivedHasNextDay,
    };
  }, [
    selectedProviders,
    debouncedMinPrice,
    debouncedMaxPrice,
    derivedHasNextDay,
  ]);

  const fetchQuotesPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (isSharedView || quotePayload.length === 0 || mode === "tracking") {
        return;
      }

      replace ? setIsFetchingQuotes(true) : setIsLoadingMore(true);

      try {
        const response = await getQuotes(quotePayload, mode === "gosendeet", {
          ...filterParams,
          page: pageToLoad,
          size: PAGE_SIZE,
        });

        const newQuotes = normalizeQuotesResponse(response);
        setHasNextPage(newQuotes.length === PAGE_SIZE);

        setData((prev: any) => {
          const prevQuotes = replace ? [] : normalizeQuotesResponse(prev);
          return {
            ...response,
            data: [...prevQuotes, ...newQuotes],
          };
        });
      } catch (error: any) {
        toast.error(error?.message || "Unable to fetch quotes");
      } finally {
        setIsFetchingQuotes(false);
        setIsLoadingMore(false);
      }
    },
    [filterParams, isSharedView, mode, quotePayload, PAGE_SIZE],
  );

  useEffect(() => {
    if (mode !== "compare" || isSharedView) return;
    if (quotePayload.length === 0) return;
    pageRef.current = 1;
    setHasNextPage(true);
    listRef.current?.scrollTo({ top: 0 });
    fetchQuotesPage(1, true);
  }, [
    mode,
    isSharedView,
    quotePayload,
    debouncedMinPrice,
    debouncedMaxPrice,
    selectedProviders,
    selectedDeliverySpeed,
    fetchQuotesPage,
  ]);

  // Determine delivery speed based on nextDayDelivery boolean
  const getDeliverySpeedFromBoolean = (nextDayDelivery: boolean): string => {
    return nextDayDelivery ? "Next Day" : "Same Day";
  };

  // Get unique providers
  const uniqueProviders = useMemo(() => {
    if (!hasQuotes) return [];
    const providers = [
      ...new Set(quoteContent.map((item: any) => item?.courier?.name)),
    ].filter(Boolean);
    return providers as string[];
  }, [hasQuotes, quoteContent]);

  const providerOptions = useMemo(() => {
    const ordered = [
      ...selectedProviders,
      ...uniqueProviders.filter((p) => !selectedProviders.includes(p)),
    ];
    return ordered.length > 0 ? ordered : uniqueProviders;
  }, [selectedProviders, uniqueProviders]);

  // Get unique delivery speeds
  const uniqueDeliverySpeeds = useMemo(() => {
    if (!hasQuotes) return [];
    const speeds: string[] = [
      ...new Set(
        quoteContent.map((item: any) =>
          getDeliverySpeedFromBoolean(item?.nextDayDelivery),
        ),
      ),
    ].filter(Boolean) as string[];
    // Add "Any Speed" option
    speeds.unshift("Any Speed");
    return speeds.sort((a, b) => {
      const order: Record<string, number> = {
        "Any Speed": 0,
        "Same Day": 1,
        "Next Day": 2,
      };
      return (order[a] ?? 3) - (order[b] ?? 3);
    });
  }, [hasQuotes, quoteContent]);

  const deliverySpeedOptions = useMemo(() => {
    const fallback = ["Any Speed", "Same Day", "Next Day"];
    const base =
      uniqueDeliverySpeeds.length > 0 ? uniqueDeliverySpeeds : fallback;
    const withSelected = [
      ...selectedDeliverySpeed,
      ...base.filter((s) => !selectedDeliverySpeed.includes(s)),
    ];
    if (!withSelected.includes("Any Speed")) {
      withSelected.unshift("Any Speed");
    }
    return withSelected;
  }, [selectedDeliverySpeed, uniqueDeliverySpeeds]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!hasQuotes) return [];

    let filtered = [...quoteContent];

    // Filter by pickup date
    if (filterPickupDate) {
      filtered = filtered.filter(
        (item: any) => item?.pickUpdateDate === filterPickupDate,
      );
    }

    // Filter by delivery date
    if (filterDeliveryDate) {
      filtered = filtered.filter(
        (item: any) => item?.estimatedDeliveryDate === filterDeliveryDate,
      );
    }

    // Filter by price range
    const min =
      typeof debouncedMinPrice === "number" ? debouncedMinPrice : PRICE_MIN;
    const max =
      typeof debouncedMaxPrice === "number" ? debouncedMaxPrice : PRICE_MAX;

    filtered = filtered.filter((item: any) => {
      const price = parsePrice(item?.price);
      return price >= min && price <= max;
    });

    // Filter by providers
    if (selectedProviders.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectedProviders.includes(item?.courier?.name),
      );
    }

    // Filter by delivery speed
    // If "Any Speed" is selected or no speeds selected, show all
    const speedsWithoutAnySpeed = selectedDeliverySpeed.filter(
      (s) => s !== "Any Speed",
    );
    if (speedsWithoutAnySpeed.length > 0) {
      filtered = filtered.filter((item: any) => {
        const speed = getDeliverySpeedFromBoolean(item?.nextDayDelivery);
        return speedsWithoutAnySpeed.includes(speed);
      });
    }

    // Sort data
    if (sortBy === "price-asc") {
      filtered.sort((a: any, b: any) => {
        const priceA = parsePrice(a?.price);
        const priceB = parsePrice(b?.price);
        return priceA - priceB;
      });
    } else if (sortBy === "price-desc") {
      filtered.sort((a: any, b: any) => {
        const priceA = parsePrice(a?.price);
        const priceB = parsePrice(b?.price);
        return priceB - priceA;
      });
    } else if (sortBy === "delivery-fastest") {
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

      filtered.sort((a: any, b: any) => {
        const dateDiff =
          getFirstDate(a?.estimatedDeliveryDate) -
          getFirstDate(b?.estimatedDeliveryDate);

        // Earliest arrival first
        if (dateDiff !== 0) return dateDiff;

        // If same arrival date → shorter delivery window first
        return (
          getWindowDays(a?.estimatedDeliveryDate) -
          getWindowDays(b?.estimatedDeliveryDate)
        );
      });
    }

    return filtered;
  }, [
    hasQuotes,
    quoteContent,
    sortBy,
    filterPickupDate,
    filterDeliveryDate,
    debouncedMinPrice,
    debouncedMaxPrice,
    selectedProviders,
    selectedDeliverySpeed,
    PRICE_MAX,
  ]);

  // Get unique pickup dates for filter
  // const uniquePickupDates = useMemo(() => {
  //   if (!data?.data) return [];
  //   return [
  //     ...new Set(data.data.map((item: any) => item?.pickUpdateDate)),
  //   ].filter(Boolean);
  // }, [data]);

  // Get unique delivery dates for filter
  // const uniqueDeliveryDates = useMemo(() => {
  //   if (!data?.data) return [];
  //   return [
  //     ...new Set(data.data.map((item: any) => item?.estimatedDeliveryDate)),
  //   ].filter(Boolean);
  // }, [data]);

  const clearFilters = () => {
    setFilterPickupDate("");
    setFilterDeliveryDate("");
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setSelectedProviders([]);
    setSelectedDeliverySpeed([]);
    setSortBy("price-asc");
  };

  const handleLoadMore = () => {
    if (isLoadingMore || isFetchingQuotes || !hasNextPage) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchQuotesPage(nextPage, false);
  };

  const activeFiltersCount = [
    filterPickupDate,
    filterDeliveryDate,
    (minPrice || PRICE_MIN) > PRICE_MIN || (maxPrice || PRICE_MAX) < PRICE_MAX,
    selectedProviders.length > 0,
    selectedDeliverySpeed.length > 0,
  ].filter(Boolean).length;

  // Get courier logo based on name
  // const getCourierLogo = (courierName: string) => {
  //   const name = courierName?.toLowerCase() || "";

  //   // Match known courier services with their icons
  //   if (name.includes("fedex")) return SiFedex;
  //   if (name.includes("dhl")) return SiDhl;
  //   if (name.includes("ups")) return SiUps;

  //   // Default fallback icon
  //   return FiPackage;
  // };

  const handleClick = (data: any) => {
    if (!userId) {
      toast.error("Please sign in to continue");
      sessionStorage.setItem("unauthenticated", "true");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } else {
      navigate("/delivery", {
        state: { bookingDetails: data, bookingRequest: bookingRequest },
      });
    }
  };

  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const { mutate: share, isPending: shareLoading } = useMutation({
    mutationFn: shareQuotes,
    onSuccess: (data: any) => {
      const shareId = data?.data?.shareId;
      setShareUrl(`${APP_BASE_URL}/cost-calculator?shareId=${shareId}`);
      toast.success("Share link created");
    },
    onError: (error: any) => {
      toast.error(error?.error);
    },
  });

  const copyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  // ⏳ Auto-reset after 30 seconds
  useEffect(() => {
    if (!shareUrl) return;

    const timer = setTimeout(() => {
      setShareUrl(null); // revert back to Share Quote
    }, 10000);

    return () => clearTimeout(timer);
  }, [shareUrl]);

  const handleShare = () => {
    share([
      {
        ...bookingRequest,
        itemValue: Number(bookingRequest.itemPrice),
        quantity: 1,
        packageDescription: {
          isFragile: false,
          isPerishable: false,
          isExclusive: false,
          isHazardous: false,
        },
      },
    ]);
  };

  return (
    <div className="md:px-20 px-6 py-12 bg-[#F8FAFC]">
      {/* Mode Switcher Tabs - Top of Calculator */}
      <div className="w-full mb-6 flex justify-center">
        <ModeSwitcher
          mode={mode}
          onModeChange={setMode}
          variant="pill"
          animate
        />
      </div>

      <div className="w-full mb-20">
        <FormHorizontalBar
          variant="minimal"
          activeMode={mode}
          bookingRequest={bookingRequest}
          setData={setData}
        />
      </div>

      {/* Results Section Header */}

      {mode === "compare" && (
        <>
          {/* Filter & Sort button — only show when quotes were ever loaded */}
          {stablePriceMaxRef.current > 0 && (
            <div
              className="md:hidden bg-white flex items-center justify-center gap-2 p-2.5 rounded-2xl mb-6 cursor-pointer shadow-md"
              onClick={() => toggleMobileFilterBtn(true)}
            >
              <TrendingUp />
              <h3 className="font-semibold text-base text-gray-900">
                Filter & Sort
              </h3>
            </div>
          )}

          {/* Mobile Filter Overlay/Drawer */}
          <div
            className={cn(
              "fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out",
              showFilters
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
            style={{ touchAction: "pan-y" }}
            onClick={() => toggleMobileFilterBtn(false)}
          >
            {/* Animated Backdrop — transparent blur */}
            <div
              className={cn(
                "absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
                showFilters ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              className={cn(
                "fixed right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-500 ease-in-out",
                showFilters ? "translate-x-0" : "translate-x-full",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                <button
                  onClick={() => toggleMobileFilterBtn(false)}
                  className="text-2xl text-gray-500 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-6">
                {/* Price Range Slider */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-sm text-gray150 uppercase tracking-wider">
                      Price Range
                    </h4>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="w-fit text-sm font-semibold text-brand cursor-pointer  bg-brand-light py-2 px-3 rounded"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Price Display */}
                    <div className="flex items-center justify-between ">
                      <div className="bg-[#F9FAFB] p-3 rounded-lg w-28.75 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                        <p className="text-xs text-[#99A1AF] text-capitalize font-semibold mb-1">
                          MIN
                        </p>
                        <div className="flex item-center gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setMinPrice(
                                  Math.max(
                                    PRICE_MIN,
                                    (minPrice || PRICE_MIN) - PRICE_STEP,
                                  ),
                                )
                              }
                              className="font-semibold pr-1"
                            >
                              −
                            </button>
                            <input
                              ref={minPriceRef}
                              type="number"
                              value={minPrice ?? ""}
                              onChange={(e) => handleMinInput(e.target.value)}
                              className="price-input w-full text-sm font-bold text-brand text-center bg-transparent outline-none cursor-text"
                              min={PRICE_MIN}
                              max={maxPrice}
                              step={PRICE_STEP}
                            />

                            <button
                              onClick={() =>
                                setMinPrice(
                                  Math.min(
                                    maxPrice || PRICE_MAX,
                                    (minPrice || PRICE_MIN) + PRICE_STEP,
                                  ),
                                )
                              }
                              className="font-semibold "
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-right bg-[#F9FAFB] p-3 rounded-lg w-28.75 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                        <p className="text-xs text-[#99A1AF] text-capitalize font-semibold mb-1">
                          MAX
                        </p>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={maxPrice ?? ""}
                            onChange={(e) => handleMaxInput(e.target.value)}
                            className="price-input w-full text-sm font-bold text-brand bg-transparent outline-none text-center cursor-text"
                            min={minPrice}
                            max={PRICE_MAX}
                            step={PRICE_STEP}
                          />
                          <button
                            onClick={() =>
                              setMaxPrice(
                                Math.max(
                                  (minPrice || PRICE_MIN) + PRICE_STEP,
                                  (maxPrice || PRICE_MAX) - PRICE_STEP,
                                ),
                              )
                            }
                            className="font-semibold pr-1"
                          >
                            −
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Providers */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray150 mb-3 uppercase tracking-wider">
                    Providers
                  </h4>
                  <div className="w-full h-[160px] overflow-y-auto">
                    <div className="flex flex-col items-start gap-3">
                      {providerOptions.map((provider) => (
                        <button
                          key={provider}
                          onClick={() => {
                            setSelectedProviders((prev) =>
                              prev.includes(provider)
                                ? prev.filter((p) => p !== provider)
                                : [...prev, provider],
                            );
                          }}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                            selectedProviders.includes(provider)
                              ? "bg-brand text-white"
                              : "bg-brand-light text-brand hover:bg-opacity-80",
                          )}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Speed */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray150 mb-3 uppercase tracking-wider">
                    Delivery Speed
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {deliverySpeedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() =>
                          setSelectedDeliverySpeed((prev) =>
                            prev.includes(speed) ? [] : [speed],
                          )
                        }
                        className={cn(
                          "px-3 py-2 shadow-sm rounded-lg text-xs font-semibold transition-all",
                          selectedDeliverySpeed.includes(speed)
                            ? "bg-brand text-white"
                            : "bg-brand-light text-brand hover:bg-opacity-80",
                        )}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => toggleMobileFilterBtn(false)}
                    className="w-full text-sm font-semibold text-white cursor-pointer bg-brand py-2 px-3 rounded transition-colors"
                  >
                    Apply Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row md:flex-col gap-6 mb-6 font-arial">
            {/* Large Screen Left Sidebar - Filters (only when quotes were ever loaded) */}
            <div
              className={cn(
                "hidden xl:w-64 w-full shrink-0",
                stablePriceMaxRef.current > 0 ? "md:block" : "",
              )}
            >
              <div className="bg-white rounded-xl shadow-md p-6 border border-[#E2E8F0] sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Filters
                  </h3>
                  {
                    <button
                      onClick={clearFilters}
                      className="text-xs font-semibold text-brand cursor-pointer hover:text-green-800 bg-brand-light py-1 px-2 rounded transition-colors"
                    >
                      Reset
                    </button>
                  }
                </div>

                {/* Price Range Slider */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray150 mb-6 uppercase tracking-wider">
                    Price Range
                  </h4>
                  <div className="space-y-4">
                    <div className="relative w-full h-6">
                      {/* Track */}
                      <div className="absolute -top-0.1 w-full h-2.5 bg-gray-200 rounded-lg" />

                      {/* Selected Range */}
                      <div
                        className="absolute -top-0.1 h-2.5 bg-brand rounded-lg"
                        style={{
                          left: `${getPercent(minPrice === "" ? PRICE_MIN : minPrice)}%`,
                          width: `${Math.max(0, getPercent(maxPrice === "" ? PRICE_MAX : maxPrice) - getPercent(minPrice === "" ? PRICE_MIN : minPrice))}%`,
                        }}
                      />

                      {/* MIN THUMB */}
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={
                          minPrice === ""
                            ? PRICE_MIN
                            : Math.min(minPrice, PRICE_MAX)
                        }
                        onChange={(e) => {
                          const value = Math.min(
                            Number(e.target.value),
                            (maxPrice === "" ? PRICE_MAX : maxPrice) -
                              PRICE_STEP,
                          );
                          setMinPrice(value);
                        }}
                        style={{
                          zIndex:
                            (minPrice === "" ? PRICE_MIN : minPrice) >=
                            PRICE_MAX - PRICE_STEP
                              ? 5
                              : 3,
                        }}
                        className="absolute w-full h-3.5 -top-0.5 appearance-none bg-transparent pointer-events-none slider-thumb"
                      />

                      {/* MAX THUMB */}
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={
                          maxPrice === ""
                            ? PRICE_MAX
                            : Math.max(
                                PRICE_MIN + PRICE_STEP,
                                Math.min(maxPrice, PRICE_MAX),
                              )
                        }
                        onChange={(e) => {
                          const value = Math.max(
                            Number(e.target.value),
                            (minPrice === "" ? PRICE_MIN : minPrice) +
                              PRICE_STEP,
                          );
                          setMaxPrice(value);
                        }}
                        style={{ zIndex: 4 }}
                        className="absolute w-full h-3.5 -top-0.5 appearance-none bg-transparent pointer-events-none slider-thumb"
                      />
                    </div>

                    {/* Price Display */}
                    <div className="flex items-center justify-between ">
                      <div className="bg-[#F9FAFB] p-3 rounded-lg w-28.75 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                        <p className="text-xs text-[#99A1AF] text-capitalize font-semibold mb-1">
                          MIN
                        </p>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => handleMinInput(e.target.value)}
                          className="price-input w-full text-sm font-bold text-brand bg-transparent outline-none cursor-text"
                          step={PRICE_STEP}
                        />
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-right bg-[#F9FAFB] p-3 rounded-lg w-28.75 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                        <p className="text-xs text-[#99A1AF] text-capitalize font-semibold mb-1">
                          MAX
                        </p>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => handleMaxInput(e.target.value)}
                          className="price-input w-full text-sm font-bold text-brand bg-transparent outline-none text-right cursor-text"
                          step={PRICE_STEP}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Providers */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray150 mb-3 uppercase tracking-wider">
                    Providers
                  </h4>
                  <div className="w-full overflow-y-auto">
                    <div className="flex flex-col items-start gap-3">
                      {providerOptions.map((provider) => (
                        <button
                          key={provider}
                          onClick={() => {
                            setSelectedProviders((prev) =>
                              prev.includes(provider)
                                ? prev.filter((p) => p !== provider)
                                : [...prev, provider],
                            );
                          }}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                            selectedProviders.includes(provider)
                              ? "bg-brand text-white"
                              : "bg-brand-light text-brand hover:bg-opacity-80",
                          )}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Speed */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray150 mb-3 uppercase tracking-wider">
                    Delivery Speed
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {deliverySpeedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() =>
                          setSelectedDeliverySpeed((prev) =>
                            prev.includes(speed) ? [] : [speed],
                          )
                        }
                        className={cn(
                          "px-3 py-2 cursor-pointer shadow-sm rounded-lg text-xs font-semibold transition-all",
                          selectedDeliverySpeed.includes(speed)
                            ? "bg-brand text-white"
                            : "bg-brand-light text-brand hover:bg-opacity-80",
                        )}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Route Summary */}

              {/* Header Section */}
              <div className="mb-1 lg:mb-6">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <Button
                    className="w-fit bg-brand hover:bg-green-800"
                    loading={shareLoading}
                    onClick={shareUrl ? copyUrl : handleShare}
                  >
                    {shareUrl ? <Copy size={16} /> : <Share2 size={16} />}
                    <span className="ml-2">
                      {shareUrl ? "Copy Link" : "Share Quote"}
                    </span>
                  </Button>
                </div>
                <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row items-start lg:items-center justify-between mb-1">
                  <div>
                    {(bookingRequest?.pickupLocation ||
                      bookingRequest?.dropOffLocation) && (
                      <div className="flex items-center gap-4 mb-1 ">
                        <div className="text-xs font-semibold text-brand bg-brabd-light2 rounded px-2 py-1">
                          ROUTE
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-lg">
                            {extractStateFromAddress(
                              bookingRequest?.pickupLocation,
                            )}
                          </span>
                          <span className="mx-3 text-gray150">→</span>
                          <span className="font-semibold text-gray-900 text-lg">
                            {extractStateFromAddress(
                              bookingRequest?.dropOffLocation,
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-900">
                        {filteredAndSortedData.length}
                      </span>{" "}
                      option{filteredAndSortedData.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="w-full lg:w-fit">
                    <div className="flex items-center justify-between mb-6 bg-[#F3F4F6CC] px-2 py-1 rounded-md mt-2 lg:mt-0">
                      <button
                        onClick={() => {
                          setActiveTab("recommended");
                          setSortBy("price-asc");
                        }}
                        className={`md:px-6 px-3 py-2.5 md:font-bold font-medium text-sm rounded-md transition-all ${
                          activeTab === "recommended"
                            ? "bg-white border border-gray-200 text-green100 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Recommended
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("cheapest");
                          setSortBy("price-asc");
                        }}
                        className={`md:px-6 px-3 py-2.5 md:font-bold font-medium text-sm rounded-md transition-all ${
                          activeTab === "cheapest"
                            ? "bg-white border border-gray-200 text-green100 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Cheapest
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("fastest");
                          setSortBy("delivery-fastest");
                        }}
                        className={`md:px-6 px-3 py-2.5 md:font-bold font-medium text-sm rounded-md transition-all ${
                          activeTab === "fastest"
                            ? "bg-white border border-gray-200 text-green100 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Fastest
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
              </div>

              {/* Results Cards */}
              <div className="flex flex-col gap-4">
                {!hasQuotes && !isFetchingQuotes && !isLoadingMore && (
                  <div className="flex flex-col items-center justify-center mt-20 max-w-2xl mx-auto">
                    <img src={empty} alt="empty quotes" className="h-50" />

                    <p className="text-center font-bold text-green-600 text-lg mb-1">
                      No courier services available
                    </p>
                    <p className="text-center text-gray-600 text-sm">
                      Use the form above to search for courier services by
                      entering your pickup location, destination, and package
                      details.
                    </p>
                  </div>
                )}

                {filteredAndSortedData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-center font-bold text-gray-600 text-lg mb-2">
                      No results match your filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-green-700 hover:text-green-800 font-semibold text-sm underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {filteredAndSortedData.length > 0 && (
                  <div className="flex flex-col gap-4 max-h-[70vh] pt-8 overflow-y-auto pr-1">
                    {filteredAndSortedData.map((item, globalIndex) => (
                      <div
                        key={item?.id ?? globalIndex}
                        className=" bg-white rounded-xl overflow-hidden border-2 border-gray-300 shadow-md
                          transition-all duration-300 shrink-0
                          hover:shadow-lg hover:-translate-y-1 hover:border-green800"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-5 lg:p-8 gap-6">
                          {/* Left - Courier Logo & Info */}
                          <div className="xl:w-1/4">
                            <div className="flex-1 flex items-center gap-1">
                              {item?.courier?.logo ? (
                                <img
                                  src={item?.courier?.logo}
                                  alt=""
                                  className="w-[47px] lg:w-[57px] rounded-lg"
                                />
                              ) : (
                                <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                                  <Box className="w-8 h-8 text-gray-700" />
                                </div>
                              )}
                              <div className="flex flex-col gap-2">
                                <h3 className="text-xs lg:text-lg font-bold text-gray-900">
                                  {item?.courier?.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                  <Rating
                                    value={item?.courier?.averageRatingScore}
                                    readOnly
                                  />
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <p>({item?.courier?.totalRatings})</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs flex items-center gap-2 mt-4 font-semibold w-fit text-green100 px-2 py-1 bg-green-100 rounded-sm">
                              <ShieldCheck size={14} /> Verified
                            </div>
                          </div>

                          {/* Center - Pickup/Delivery Timeline */}
                          <div className="xl:w-1/2 ">
                            <div className="flex lg:flex-row items-center justify-center gap-8">
                              <div className="lg:text-left text-center">
                                <p className="text-xs lg:text-sm font-semibold text-brand uppercase mb-1">
                                  {item?.pudoMode === "STORE_DROPOFF"
                                    ? "STORE DROP-OFF"
                                    : "DOORSTEP PICKUP"}
                                </p>
                                <p className="text-xs lg:text-sm font-bold text-gray150 lg:text-gray-900">
                                  {item?.pickUpdateDate || "Not specified"}
                                </p>
                              </div>

                              <div className="flex flex-col justify-center items-center gap-2 -mt-1 lg:mt-0">
                                <p className="text-xs text-gray-600 font-semibold pt-2">
                                  {item?.serviceLevelAgreements?.[0] ||
                                    "Standard Delivery"}
                                </p>
                                <div className="min-w-[100px] h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                                <p>{``}</p>
                              </div>

                              <div className="hidden lg:block lg:text-left text-center mt-3 lg:mt-0">
                                <p className="text-xs lg:text-sm font-semibold text-brand uppercase mb-1">
                                  DELIVERY
                                </p>
                                <p className="text-xs lg:text-sm font-bold lg:text-gray-900 text-gray150">
                                  {item?.estimatedDeliveryDate ||
                                    "Not specified"}
                                </p>
                              </div>
                            </div>

                            <div className="block lg:hidden lg:text-left text-center mt-3">
                              <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase mb-1">
                                DELIVERY
                              </p>
                              <p className="text-xs lg:text-sm font-bold lg:text-gray-900 text-gray150">
                                {item?.estimatedDeliveryDate || "Not specified"}
                              </p>
                            </div>
                          </div>

                          {/* Right - Price & CTA */}
                          <div className="flex flex-col md:items-end items-center justify-between xl:w-1/4 -mt-3">
                            <div className="mb-4">
                              {item?.discount > 0 && (
                                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                                  {item.discount}% off
                                </span>
                              )}
                              <p className="text-2xl font-arial tracking-tighter md:text-3xl font-bold text-green100">
                                ₦{parsePrice(item.price).toLocaleString()}
                              </p>
                            </div>

                            <Button
                              onClick={() => handleClick(item)}
                              className={cn(
                                globalIndex === 0
                                  ? "bg-green100 hover:bg-green800 submit-btn-shadow"
                                  : "bg-white text-green100 border-2",
                                "rounded-2xl md:w-[170px] w-full",
                              )}
                            >
                              {globalIndex === 0 ? (
                                <span className="flex items-center gap-2">
                                  Select Option <ArrowRight />
                                </span>
                              ) : (
                                "Select"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {hasNextPage && (
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore || isFetchingQuotes}
                        className="shrink-0 w-full flex items-center justify-center gap-3
                          rounded-2xl border border-[#D1D5DB] bg-white
                          py-4 text-sm font-semibold text-green100
                          shadow-sm transition-colors
                          disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoadingMore || isFetchingQuotes
                          ? "Loading more options..."
                          : `Show ${PAGE_SIZE} more options`}
                        <ChevronDown size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {mode === "gosendeet" && hasQuotes && (
        <div className="max-w-3xl mx-auto my-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 mb-8">
              <img
                src={logo}
                alt="logo"
                className="h-8 md:h-10 lg:h-12 w-auto"
              />
              <h1 className=" font-semibold text-xl text-brand">
                Direct Quote
              </h1>
            </div>
            <Button
              className="w-fit bg-brand"
              loading={shareLoading}
              onClick={shareUrl ? copyUrl : handleShare}
            >
              {shareUrl ? <Copy /> : <Share2 />}
              {shareUrl ? "Copy Link" : "Share Quote"}
            </Button>
          </div>

          {/* Service Level Options */}
          {quoteContent.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {quoteContent.map((quote: any, idx: number) => {
                const sla =
                  quote?.serviceLevelAgreements?.[0] ?? `Option ${idx + 1}`;
                const pudo =
                  quote?.pudoMode === "STORE_DROPOFF"
                    ? "Store Drop-off"
                    : "Doorstep Pickup";
                const isSelected = selectedDirectQuoteIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDirectQuoteIndex(idx)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
                      isSelected
                        ? "border-brand bg-brand text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand",
                    )}
                  >
                    <span>{sla}</span>
                    <p
                      className={cn(
                        "text-xs mt-0.5 font-normal",
                        isSelected ? "text-white/80" : "text-gray-400",
                      )}
                    >
                      {pudo}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5 font-normal",
                        isSelected ? "text-white/80" : "text-gray-400",
                      )}
                    >
                      ₦{CurrencyFormatter(parsePrice(quote?.price).toFixed(2))}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Quote Details */}
            <div className="px-8 py-6 space-y-6">
              {/* Route Info */}
              <div className="">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="text-brand" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          From
                        </p>
                        <p className="text-base font-medium text-[#1a1a1a]">
                          {bookingRequest?.pickupLocation || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="text-brand" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          To
                        </p>
                        <p className="text-base font-medium text-[#1a1a1a]">
                          {bookingRequest?.dropOffLocation || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center justify-between p-4 bg-brand-light rounded-xl border border-brand-light">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Estimated Delivery Date
                  </p>
                  <p className="text-lg font-bold text-[#1a1a1a]">
                    {
                      quoteContent[selectedDirectQuoteIndex]
                        ?.estimatedDeliveryDate
                    }
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {quoteContent[selectedDirectQuoteIndex]?.pickupOptions?.[0]}
                </span>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                {(() => {
                  const selectedQuote = quoteContent[selectedDirectQuoteIndex];
                  const discountedPrice = parsePrice(selectedQuote?.price);
                  const discountPct = selectedQuote?.discount ?? 0;
                  const originalPrice =
                    discountPct > 0
                      ? discountedPrice / (1 - discountPct / 100)
                      : discountedPrice;
                  const savings = originalPrice - discountedPrice;
                  const serviceCharge =
                    selectedQuote?.serviceCharge ?? discountedPrice * 0.005;
                  const total = discountedPrice + serviceCharge;
                  return (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">
                          Delivery Fee
                          {discountPct > 0 ? " (before discount)" : ""}
                        </span>
                        <span
                          className={
                            discountPct > 0
                              ? "text-gray-400 line-through font-medium"
                              : "text-[#1a1a1a] font-bold"
                          }
                        >
                          ₦{CurrencyFormatter(originalPrice.toFixed(2))}
                        </span>
                      </div>
                      {discountPct > 0 && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-emerald-600 font-medium">
                              Discount ({discountPct}%)
                              {selectedQuote?.discountDescription && (
                                <span className="block text-xs text-gray-400 font-normal">
                                  {selectedQuote.discountDescription}
                                </span>
                              )}
                            </span>
                            <span className="text-emerald-600 font-bold">
                              -₦{CurrencyFormatter(savings.toFixed(2))}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700 font-medium">
                              Delivery Fee (after discount)
                            </span>
                            <span className="text-[#1a1a1a] font-bold">
                              ₦{CurrencyFormatter(discountedPrice.toFixed(2))}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">
                          Service Charge
                        </span>
                        <span className="text-[#1a1a1a] font-bold">
                          ₦
                          {CurrencyFormatter(
                            parsePrice(serviceCharge).toFixed(2),
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">
                          Total Cost
                        </span>
                        <span className="text-brand font-bold">
                          ₦{CurrencyFormatter(total.toFixed(2))}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Book Now Button */}
              <Button
                onClick={() => {
                  const quoteItem = quoteContent[selectedDirectQuoteIndex];
                  handleClick(quoteItem);
                }}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-base",
                  "bg-brand hover:bg-[#1a1a1a]",
                  "text-white transition-all duration-300",
                  "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]",
                )}
              >
                Book Now
              </Button>

              {/* Insurance Info */}
              <div className="p-4 bg-brand-light rounded-xl border border-brand">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-1">
                      Insurance included for packages under ₦100,000
                    </p>
                    <p className="text-xs text-gray-600">
                      Your package is protected against loss or damage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
