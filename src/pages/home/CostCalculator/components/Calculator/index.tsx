import purple from "@/assets/icons/purple-checkmark.png";
import green from "@/assets/icons/green-checkmark.png";
// import avatar1 from "@/assets/images/avatar1.png";
// import { DetailsModal } from "./modals/details";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import empty from "@/assets/images/white-empty.png";
import Rating from "@/components/Rating";
import { FiCalendar, FiTruck, FiFilter, FiX, FiPackage } from "react-icons/fi";
import { SiFedex, SiDhl, SiUps } from "react-icons/si";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, MapPin, Share2, Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { shareQuotes } from "@/services/user";
import { LIVE_URL } from "@/services/axios";
import { useGetSharedQuotes } from "@/queries/user/useGetUserBookings";
import logo from "@/assets/images/sendeet-logo.png";

const parsePrice = (price: string | number | undefined | null): number => {
  if (!price) return 0;
  if (typeof price === 'number') return price;
  return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
};

const Calculator = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || "";

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const shareId = searchParams.get("shareId") || "";

  const { data: sharedQuote } = useGetSharedQuotes(shareId);

  const { results, inputData: stateInputData } = location.state || {};
  const [mode, setMode] = useState<FormMode>(location?.state?.mode ?? "gosendeet");

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

  const bookingRequest = inputData;
  const [data, setData] = useState(results || {});
  const [sortBy, setSortBy] = useState("price-asc");
  const [filterPickupDate, setFilterPickupDate] = useState("");
  const [filterDeliveryDate, setFilterDeliveryDate] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    if (shareId && sharedQuote) {
      setData(sharedQuote);
    } else if (results) {
      setData(results);
    }
  }, [results, sharedQuote, shareId]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!data?.data || data?.data?.length === 0) return [];

    let filtered = [...data.data];

    // Filter by pickup date
    if (filterPickupDate) {
      filtered = filtered.filter(
        (item: any) => item?.pickUpdateDate === filterPickupDate
      );
    }

    // Filter by delivery date
    if (filterDeliveryDate) {
      filtered = filtered.filter(
        (item: any) => item?.estimatedDeliveryDate === filterDeliveryDate
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter((item: any) => {
        const price = parsePrice(item?.price);
        if (priceRange === "0-5000") return price <= 5000;
        if (priceRange === "5000-10000") return price > 5000 && price <= 10000;
        if (priceRange === "10000-20000")
          return price > 10000 && price <= 20000;
        if (priceRange === "20000+") return price > 20000;
        return true;
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
      // Sort by delivery date (earliest first)
      filtered.sort((a: any, b: any) => {
        return (
          new Date(a?.estimatedDeliveryDate).getTime() -
          new Date(b?.estimatedDeliveryDate).getTime()
        );
      });
    }

    return filtered;
  }, [data, sortBy, filterPickupDate, filterDeliveryDate, priceRange]);

  // Get unique pickup dates for filter
  const uniquePickupDates = useMemo(() => {
    if (!data?.data) return [];
    return [
      ...new Set(data.data.map((item: any) => item?.pickUpdateDate)),
    ].filter(Boolean);
  }, [data]);

  // Get unique delivery dates for filter
  const uniqueDeliveryDates = useMemo(() => {
    if (!data?.data) return [];
    return [
      ...new Set(data.data.map((item: any) => item?.estimatedDeliveryDate)),
    ].filter(Boolean);
  }, [data]);

  const clearFilters = () => {
    setFilterPickupDate("");
    setFilterDeliveryDate("");
    setPriceRange("all");
    setSortBy("price-asc");
  };

  const activeFiltersCount = [
    filterPickupDate,
    filterDeliveryDate,
    priceRange !== "all",
  ].filter(Boolean).length;

  // Get courier logo based on name
  const getCourierLogo = (courierName: string) => {
    const name = courierName?.toLowerCase() || "";

    // Match known courier services with their icons
    if (name.includes("fedex")) return SiFedex;
    if (name.includes("dhl")) return SiDhl;
    if (name.includes("ups")) return SiUps;

    // Default fallback icon
    return FiPackage;
  };

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
      setShareUrl(`${LIVE_URL}/cost-calculator?shareId=${shareId}`);
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
    <div className="md:px-20 px-6 py-4 bg-white min-h-screen">
      {/* Mode Switcher Tabs - Top of Calculator */}
      <div className="w-full -mb-12 flex justify-center">
        <ModeSwitcher
          mode={mode}
          onModeChange={setMode}
          variant="card"
          animate
        />
      </div>

      <div className="w-full mb-12">
        <FormHorizontalBar
          variant="minimal"
          activeMode={mode}
          bookingRequest={bookingRequest}
          setData={setData}
        />
      </div>

      {(!data?.data || data?.data?.length === 0) && (
        <div className="flex flex-col items-center justify-center mt-20 max-w-2xl mx-auto">
          <img src={empty} alt="empty quotes" className="h-[200px]" />

          <p className="text-center font-bold text-amber-600 text-lg mb-1">
            No courier services available
          </p>
          <p className="text-center text-gray-600 text-sm">
            Use the form above to search for courier services by entering your
            pickup location, destination, and package details.
          </p>
        </div>
      )}

      {/* Results Section Header */}

      {mode === "compare" && (
        <>
          {data?.data && data?.data?.length > 0 && (
            <div className="max-w-5xl mx-auto mt-4 mb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div className="md:w-5xl">
                  <h2 className="font-clash font-bold text-2xl md:text-3xl text-[#1a1a1a] mb-2">
                    Available Courier Services
                  </h2>
                  <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center">
                    <p className="text-gray-600 text-sm md:text-base">
                      Found{" "}
                      <span className="font-bold text-amber-600">
                        {filteredAndSortedData.length}
                      </span>{" "}
                      courier{filteredAndSortedData.length !== 1 ? "s" : ""} for
                      your route
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({activeFiltersCount} filter
                          {activeFiltersCount !== 1 ? "s" : ""} active)
                        </span>
                      )}
                    </p>

                    <Button
                      className="w-fit"
                      loading={shareLoading}
                      onClick={shareUrl ? copyUrl : handleShare}
                    >
                      {shareUrl ? <Copy /> : <Share2 />}
                      {shareUrl ? "Copy Link" : "Share Quote"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters & Sort Section */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FiFilter className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-sm text-gray-700">
                    Filter & Sort Results
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                    >
                      <FiX className="w-3 h-3" />
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Sort By */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-9 text-sm bg-white border-gray-300">
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-asc">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-desc">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="delivery-fastest">
                          Fastest Delivery
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pickup Date Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Pickup Date
                    </label>
                    <Select
                      value={filterPickupDate || "all"}
                      onValueChange={(val) =>
                        setFilterPickupDate(val === "all" ? "" : val)
                      }
                    >
                      <SelectTrigger className="h-9 text-sm bg-white border-gray-300">
                        <SelectValue placeholder="All dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All dates</SelectItem>
                        {uniquePickupDates.map((date: any) => (
                          <SelectItem key={date} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Delivery Date Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Delivery Date
                    </label>
                    <Select
                      value={filterDeliveryDate || "all"}
                      onValueChange={(val) =>
                        setFilterDeliveryDate(val === "all" ? "" : val)
                      }
                    >
                      <SelectTrigger className="h-9 text-sm bg-white border-gray-300">
                        <SelectValue placeholder="All dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All dates</SelectItem>
                        {uniqueDeliveryDates.map((date: any) => (
                          <SelectItem key={date} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                      Price Range
                    </label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="h-9 text-sm bg-white border-gray-300">
                        <SelectValue placeholder="All prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All prices</SelectItem>
                        <SelectItem value="0-5000">₦0 - ₦5,000</SelectItem>
                        <SelectItem value="5000-10000">
                          ₦5,000 - ₦10,000
                        </SelectItem>
                        <SelectItem value="10000-20000">
                          ₦10,000 - ₦20,000
                        </SelectItem>
                        <SelectItem value="20000+">₦20,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6 max-w-5xl mx-auto">
            {filteredAndSortedData.length === 0 &&
              data?.data &&
              data?.data?.length > 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-center font-bold text-gray-600 text-lg mb-2">
                    No results match your filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-amber-600 hover:text-amber-700 font-semibold text-sm underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            {filteredAndSortedData.map((item: any, index: number) => (
              <div
                className={cn(
                  "bg-white rounded-2xl overflow-hidden",
                  "border-2 border-gray-200",
                  "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
                  "transition-all duration-300",
                  "hover:shadow-[0_12px_40px_rgba(251,146,60,0.25)] hover:border-amber-300 hover:-translate-y-1"
                )}
                key={index}
              >
                {/* Header Section - Courier Info & Price */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Courier Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Courier Logo */}
                        {(() => {
                          const LogoIcon = getCourierLogo(item?.courier?.name);
                          return (
                            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center">
                              <LogoIcon className="w-9 h-9 text-gray-700" />
                            </div>
                          );
                        })()}

                        {/* Courier Name & Rating */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h3 className="font-clash font-bold text-xl text-[#1a1a1a]">
                              {item?.courier?.name}
                            </h3>
                            <Rating
                              value={item?.courier?.totalRatings}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Pickup & Delivery Info */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiCalendar className="w-4 h-4 text-blue-500" />
                          <span>
                            Pickup Date:{" "}
                            <span className="font-semibold text-[#1a1a1a]">
                              {item?.pickUpdateDate}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiTruck className="w-4 h-4 text-emerald-500" />
                          <span>
                            Estimated Delivery:{" "}
                            <span className="font-semibold text-[#1a1a1a]">
                              {item?.estimatedDeliveryDate}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Badge Section */}
                    <div className="flex flex-col gap-3 items-end">
                      {/* Price - Prominent Position */}
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Total Cost
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-semibold text-gray-500">
                            ₦
                          </span>
                          <p className="text-2xl md:text-3xl font-clash font-bold text-amber-600">
                            {parsePrice(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Next Day Delivery Badge */}
                      {item?.nextDayDelivery && (
                        <div className="flex gap-2 items-center bg-gradient-to-r from-emerald-50 to-teal-50 py-2 px-3 rounded-full border border-emerald-300/50">
                          <img
                            src={green}
                            alt="check"
                            className="w-[16px] h-[16px] rounded-full"
                          />
                          <p className="text-xs font-bold text-emerald-700">
                            Next Day
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                {item?.pickupOptions && item?.pickupOptions.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50/50">
                    <div className="flex flex-wrap gap-3">
                      {item?.pickupOptions?.map(
                        (option: string, idx: number) => (
                          <div
                            className="flex gap-2 items-center bg-white py-2 px-3 rounded-lg border border-amber-200/50 shadow-sm"
                            key={idx}
                          >
                            <img
                              src={purple}
                              alt="check"
                              className="w-[16px] h-[16px] rounded-full"
                            />
                            <p className="text-xs font-semibold text-gray-700">
                              {option}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Section - CTA */}
                <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-amber-50/30">
                  <div className="flex items-center justify-between gap-4">
                    {/* Additional Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiTruck className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">
                        Fast & Reliable Service
                      </span>
                    </div>

                    {/* Book Now Button - Modern Design */}
                    <Button
                      onClick={() => {
                        handleClick(item);
                      }}
                      className={cn(
                        "group relative px-8 py-2.5 rounded-xl font-bold text-sm",
                        "bg-[#1a1a1a] hover:bg-amber-600",
                        "text-white transition-all duration-300",
                        "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(251,146,60,0.4)]",
                        "border border-transparent hover:border-amber-400",
                        "outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
                        "overflow-hidden"
                      )}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span>Book Now</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === "gosendeet" && data?.data && data?.data?.length > 0 && (
        <div className="max-w-3xl mx-auto my-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 mb-8">
              <img
                src={logo}
                alt="logo"
                className="h-8 md:h-10 lg:h-12 w-auto"
              />
              <h1 className=" font-semibold text-xl text-[#1a1a1a]">
                Direct Quote
              </h1>
            </div>
            <Button
              className="w-fit"
              loading={shareLoading}
              onClick={shareUrl ? copyUrl : handleShare}
            >
              {shareUrl ? <Copy /> : <Share2 />}
              {shareUrl ? "Copy Link" : "Share Quote"}
            </Button>
          </div>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Quote Details */}
            <div className="px-8 py-6 space-y-6">
              {/* Route Info */}
              <div className="">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <MapPin className="text-gray-500" />
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
                      <MapPin className="text-gray-500" />
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
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Estimated Delivery Date
                  </p>
                  <p className="text-lg font-bold text-[#1a1a1a]">
                    {data?.data?.[0]?.estimatedDeliveryDate}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {data?.data?.[0]?.pickupOptions[0]}
                </span>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">
                    Delivery Fee
                  </span>
                  <span className="text-[#1a1a1a] font-bold">
                    ₦{data?.data?.[0]?.deliveryFee || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">
                    Service Charge
                  </span>
                  <span className="text-[#1a1a1a] font-bold">
                    ₦{data?.data?.[0]?.serviceCharge || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Total Cost</span>
                  <span className="text-blue-500 font-bold">
                    {/* removes NGN */}₦{" "}
                    {parsePrice(data?.data?.[0]?.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Book Now Button */}
              <Button
                onClick={() => {
                  const quoteItem = data?.data?.[0];
                  handleClick(quoteItem);
                }}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-base",
                  "bg-[#1a1a1a] hover:bg-amber-600",
                  "text-white transition-all duration-300",
                  "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
                )}
              >
                Book Now
              </Button>

              {/* Insurance Info */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-500" />
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
