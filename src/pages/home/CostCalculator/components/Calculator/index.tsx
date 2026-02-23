import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import empty from "@/assets/images/green-empty-bg.png";
import Rating from "@/components/Rating";
import { FiPackage } from "react-icons/fi";
// import { SiFedex, SiDhl, SiUps } from "react-icons/si";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Box,
  Copy,
  MapPin,
  Share2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { shareQuotes } from "@/services/user";
import { APP_BASE_URL } from "@/services/axios";
import { useGetSharedQuotes } from "@/queries/user/useGetUserBookings";
import logo from "@/assets/images/gosendeet-black-logo.png";

const parsePrice = (price: string | number | undefined | null): number => {
  if (!price) return 0;
  if (typeof price === "number") return price;
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

  const bookingRequest = inputData;
  const [data, setData] = useState(results || {});
  const [sortBy, setSortBy] = useState("price-asc");
  const [filterPickupDate, setFilterPickupDate] = useState("");
  const [filterDeliveryDate, setFilterDeliveryDate] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [activeTab, setActiveTab] = useState("recommended");

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
    setPriceRange("all");
    setSortBy("price-asc");
  };

  const activeFiltersCount = [
    filterPickupDate,
    filterDeliveryDate,
    priceRange !== "all",
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
    <div className="md:px-20 px-6 py-4 bg-white min-h-screen">
      {/* Mode Switcher Tabs - Top of Calculator */}
      <div className="w-full mb-6 flex justify-center">
        <ModeSwitcher
          mode={mode}
          onModeChange={setMode}
          variant="pill"
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

          <p className="text-center font-bold text-green-600 text-lg mb-1">
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
            <div className="flex xl:flex-row md:flex-col gap-6 mb-6">
              {/* Left Sidebar - Filters */}
              <div className="hidden md:block xl:w-64 w-full flex-shrink-0">
                <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">
                      Price Range
                    </h4>
                    <div className="space-y-2">
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="all">All prices</option>
                        <option value="0-5000">₦0 - ₦5,000</option>
                        <option value="5000-10000">₦5,000 - ₦10,000</option>
                        <option value="10000-20000">₦10,000 - ₦20,000</option>
                        <option value="20000+">₦20,000+</option>
                      </select>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">
                      Sort By
                    </h4>
                    <div className="space-y-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="delivery-fastest">
                          Fastest Delivery
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {/* <h2 className="text-lg font-semibold text-gray-600 mb-1">
                        <span className="text-gray-500">ROUTE</span>{" "}
                        {bookingRequest?.pickupLocation} —{" "}
                        {bookingRequest?.dropOffLocation}
                      </h2> */}
                      <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                          {filteredAndSortedData.length}
                        </span>{" "}
                        option{filteredAndSortedData.length !== 1 ? "s" : ""}{" "}
                        available
                      </p>
                    </div>
                    <Button
                      className="w-fit bg-green800 hover:bg-green-800"
                      loading={shareLoading}
                      onClick={shareUrl ? copyUrl : handleShare}
                    >
                      {shareUrl ? <Copy size={16} /> : <Share2 size={16} />}
                      <span className="ml-2">
                        {shareUrl ? "Copy Link" : "Share Quote"}
                      </span>
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-3 mb-6 bg-neutral900 w-fit px-2 py-2 rounded-3xl">
                    <button
                      onClick={() => {
                        setActiveTab("recommended");
                        setSortBy("price-asc");
                      }}
                      className={`md:px-6 px-2 py-2 md:font-bold font-medium text-sm rounded-2xl transition-all ${
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
                      className={`md:px-6 px-2 py-2 md:font-bold font-medium text-sm rounded-2xl transition-all ${
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
                      className={`md:px-6 px-2 py-2 md:font-bold font-medium text-sm rounded-2xl transition-all ${
                        activeTab === "fastest"
                          ? "bg-white border border-gray-200 text-green100 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Fastest
                    </button>
                  </div>
                </div>

                {/* Results Cards */}
                <div className="flex flex-col gap-4">
                  {filteredAndSortedData.length === 0 &&
                    data?.data &&
                    data?.data?.length > 0 && (
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

                  {filteredAndSortedData.map((item: any, index: number) => {
                    // const badgeType =
                    //   index === 0
                    //     ? "TOP PICK"
                    //     : index === 1
                    //       ? "BEST"
                    //       : index === 2
                    //         ? "FASTEST"
                    //         : "STANDARD";
                    // const badgeColor =
                    //   badgeType === "TOP PICK"
                    //     ? "bg-green-600"
                    //     : badgeType === "BEST"
                    //       ? "bg-green-700"
                    //       : badgeType === "FASTEST"
                    //         ? "bg-gray-900"
                    //         : "bg-gray-600";

                    return (
                      <div
                        key={index}
                        className={cn(
                          "bg-white rounded-xl overflow-hidden",
                          "border-2 border-gray-300",
                          "shadow-md",
                          "transition-all duration-300",
                          "hover:shadow-lg hover:-translate-y-1 hover:border-green800",
                          "relative",
                        )}
                      >
                        {/* Top Badge */}
                        {/* <div className="absolute top-4 right-4 z-10">
                          <span
                            className={`${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                          >
                            {badgeType}
                          </span>
                        </div> */}

                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                          {/* Left - Courier Logo & Info */}
                          <div className="xl:w-1/4">
                            <div className="flex-1 flex items-center gap-1">
                              {item?.courier?.logo ? (
                                <img
                                  src={item?.courier?.logo}
                                  alt=""
                                  className="w-[57px] rounded-lg"
                                />
                              ) : (
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                                  <Box className="w-8 h-8 text-gray-700" />
                                </div>
                              )}
                              <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-gray-900">
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
                            <div className="text-xs flex items-center gap-2 mt-4 font-semibold w-fit text-green100 px-2 py-1 bg-green-100 rounded-2xl">
                              <ShieldCheck size={14} /> Verified
                            </div>
                          </div>

                          {/* Center - Pickup/Delivery Timeline */}
                          <div className="xl:w-1/2 ">
                            <div className="flex lg:flex-row flex-col items-center justify-center gap-6">
                              <div className="lg:text-left text-center">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                                  PICKUP
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                  {item?.pickUpdateDate || "Not specified"}
                                </p>
                              </div>

                              <div className="flex flex-col justify-center items-center gap-2">
                                <p className="text-xs text-gray-600 font-semibold pt-2">
                                  {item?.pickupOptions?.[0] ||
                                    "Standard Delivery"}
                                </p>
                                <div className="min-w-[100px] h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                              </div>

                              <div className="lg:text-left text-center">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                                  DELIVERY
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                  {item?.estimatedDeliveryDate ||
                                    "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right - Price & CTA */}
                          <div className="flex flex-col md:items-end items-center justify-between xl:w-1/4">
                            <div className="mb-4">
                              <p className="text-2xl font-arial tracking-tighter md:text-3xl font-bold text-green100">
                                ₦{parsePrice(item.price).toLocaleString()}
                              </p>
                              {/* {index === 0 && (
                                <p className="text-xs font-bold text-green-700 mt-1">
                                  15% Savings
                                </p>
                              )} */}
                            </div>

                            <Button
                              onClick={() => handleClick(item)}
                              className={cn(
                                index === 0
                                  ? "bg-green100 hover:bg-green800 submit-btn-shadow"
                                  : "bg-white text-green100 border-2",
                                "rounded-2xl md:w-[170px] w-full",
                              )}
                            >
                              {index === 0 ? (
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
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
              className="w-fit bg-green800"
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
                  "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]",
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
