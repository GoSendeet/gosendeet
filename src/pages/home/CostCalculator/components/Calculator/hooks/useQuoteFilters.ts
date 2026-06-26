import { useEffect, useMemo, useRef, useState } from "react";
import {
  PRICE_MIN,
  PRICE_STEP,
  getDeliverySpeedFromBoolean,
  parsePrice,
  sortQuotes,
} from "../quoteUtils";

interface UseQuoteFiltersArgs {
  hasQuotes: boolean;
  priceMax: number;
  quoteContent: any[];
}

export const useQuoteFilters = ({
  hasQuotes,
  priceMax,
  quoteContent,
}: UseQuoteFiltersArgs) => {
  const [sortBy, setSortBy] = useState("price-asc");
  const [filterPickupDate, setFilterPickupDate] = useState("");
  const [filterDeliveryDate, setFilterDeliveryDate] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState<number | "">(priceMax);
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState<string[]>(
    [],
  );
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const minPriceRef = useRef<HTMLInputElement | null>(null);
  const maxPriceInitializedRef = useRef(false);
  const userHasSetPriceFilter = useRef(false);

  useEffect(() => {
    if (priceMax > 0 && !maxPriceInitializedRef.current) {
      setMaxPrice(priceMax);
      maxPriceInitializedRef.current = true;
    }
  }, [priceMax]);

  useEffect(() => {
    if (showFilters) {
      setTimeout(() => {
        minPriceRef.current?.focus();
      }, 300);
    }
  }, [showFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const clamped = Math.min(
        Math.max(minPrice || PRICE_MIN, PRICE_MIN),
        (maxPrice || priceMax) - PRICE_STEP,
      );
      setDebouncedMinPrice(clamped);
    }, 400);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, priceMax]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const clamped = Math.max(
        Math.min(maxPrice || priceMax, priceMax),
        (minPrice || PRICE_MIN) + PRICE_STEP,
      );
      setDebouncedMaxPrice(clamped);
    }, 400);
    return () => clearTimeout(timer);
  }, [maxPrice, minPrice, priceMax]);

  const handleMinInput = (value: string) => {
    userHasSetPriceFilter.current = true;
    if (value === "") {
      setMinPrice("");
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) setMinPrice(num);
  };

  const handleMaxInput = (value: string) => {
    userHasSetPriceFilter.current = true;
    if (value === "") {
      setMaxPrice("");
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) setMaxPrice(Math.min(num, priceMax));
  };

  const getPercent = (value: number) => {
    return ((value - PRICE_MIN) / (priceMax - PRICE_MIN)) * 100;
  };

  const toggleMobileFilterBtn = (show: boolean) => {
    setShowFilters(show);
  };

  const derivedHasNextDay = useMemo(() => {
    const speeds = selectedDeliverySpeed.filter((s) => s !== "Any Speed");
    if (speeds.length === 0 || speeds.length > 1) return undefined;
    return speeds[0] === "Next Day";
  }, [selectedDeliverySpeed]);

  const filterParams = useMemo(() => {
    const companyName =
      selectedProviders.length > 0 ? selectedProviders.join(",") : undefined;
    const minPriceParam =
      userHasSetPriceFilter.current && typeof debouncedMinPrice === "number"
        ? debouncedMinPrice
        : undefined;
    const maxPriceParam =
      userHasSetPriceFilter.current && typeof debouncedMaxPrice === "number"
        ? debouncedMaxPrice
        : undefined;

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

  const uniqueDeliverySpeeds = useMemo(() => {
    if (!hasQuotes) return [];
    const speeds: string[] = [
      ...new Set(
        quoteContent.map((item: any) =>
          getDeliverySpeedFromBoolean(item?.nextDayDelivery),
        ),
      ),
    ].filter(Boolean) as string[];
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

  const filteredAndSortedData = useMemo(() => {
    if (!hasQuotes) return [];

    let filtered = [...quoteContent];

    if (filterPickupDate) {
      filtered = filtered.filter(
        (item: any) => item?.pickUpdateDate === filterPickupDate,
      );
    }

    if (filterDeliveryDate) {
      filtered = filtered.filter(
        (item: any) => item?.estimatedDeliveryDate === filterDeliveryDate,
      );
    }

    if (userHasSetPriceFilter.current) {
      const min =
        typeof debouncedMinPrice === "number" ? debouncedMinPrice : PRICE_MIN;
      const max =
        typeof debouncedMaxPrice === "number" && debouncedMaxPrice > 0
          ? debouncedMaxPrice
          : priceMax;

      filtered = filtered.filter((item: any) => {
        const price = parsePrice(item?.price);
        return price >= min && price <= max;
      });
    }

    if (selectedProviders.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectedProviders.includes(item?.courier?.name),
      );
    }

    const speedsWithoutAnySpeed = selectedDeliverySpeed.filter(
      (s) => s !== "Any Speed",
    );
    if (speedsWithoutAnySpeed.length > 0) {
      filtered = filtered.filter((item: any) => {
        const speed = getDeliverySpeedFromBoolean(item?.nextDayDelivery);
        return speedsWithoutAnySpeed.includes(speed);
      });
    }

    return sortQuotes(filtered, sortBy);
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
    priceMax,
  ]);

  const clearFilters = () => {
    setFilterPickupDate("");
    setFilterDeliveryDate("");
    setMinPrice(PRICE_MIN);
    setMaxPrice(priceMax);
    setSelectedProviders([]);
    setSelectedDeliverySpeed([]);
    setSortBy("price-asc");
    userHasSetPriceFilter.current = false;
  };

  const resetPriceFilterState = () => {
    maxPriceInitializedRef.current = false;
    userHasSetPriceFilter.current = false;
    setMinPrice(PRICE_MIN);
    setMaxPrice(0);
  };

  const activeFiltersCount = [
    filterPickupDate,
    filterDeliveryDate,
    (minPrice || PRICE_MIN) > PRICE_MIN || (maxPrice || priceMax) < priceMax,
    selectedProviders.length > 0,
    selectedDeliverySpeed.length > 0,
  ].filter(Boolean).length;

  return {
    activeFiltersCount,
    activeTab,
    clearFilters,
    debouncedMaxPrice,
    debouncedMinPrice,
    deliverySpeedOptions,
    filterParams,
    filteredAndSortedData,
    getPercent,
    handleMaxInput,
    handleMinInput,
    maxPrice,
    minPrice,
    minPriceRef,
    providerOptions,
    resetPriceFilterState,
    selectedDeliverySpeed,
    selectedProviders,
    setActiveTab,
    setMaxPrice,
    setMinPrice,
    setSelectedDeliverySpeed,
    setSelectedProviders,
    setSortBy,
    showFilters,
    toggleMobileFilterBtn,
    userHasSetPriceFilter,
  };
};
