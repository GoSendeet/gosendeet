import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useMemo, useState, useRef } from "react";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import DirectQuoteCardSkeleton from "./DirectQuoteCardSkeleton";
import CompareQuoteList from "./components/CompareQuoteList";
import CompareResultsHeader from "./components/CompareResultsHeader";
import DirectQuotePanel from "./components/DirectQuotePanel";
import QuoteFilters from "./components/QuoteFilters";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";

import { cn } from "@/lib/utils";
import { useGetSharedQuotes } from "@/queries/user/useGetUserBookings";
import { track, EVENT } from "@/lib/analytics";
import { savePreSigninQuote } from "@/lib/preSigninQuote";
import {
  buildPackageSummary,
  buildQuotePayload,
  extractStateFromAddress,
  normalizeQuotesResponse,
  parsePrice,
} from "./quoteUtils";
import { useQuoteFetching } from "./hooks/useQuoteFetching";
import { useQuoteFilters } from "./hooks/useQuoteFilters";
import { useShareQuote } from "./hooks/useShareQuote";

interface CalculatorProps {
  externalResults?: any;
  externalInputData?: any;
  externalMode?: FormMode;
  onBack?: () => void;
  hideForm?: boolean;
}

const Calculator = ({
  externalResults,
  externalInputData,
  externalMode,
  onBack,
  hideForm,
}: CalculatorProps = {}) => {
  const isEmbedded = hideForm === true || onBack !== undefined;
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || "";
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get("shareId") || "";
  const { data: sharedQuote } = useGetSharedQuotes(shareId);
  const {
    results: stateResults,
    inputData: stateInputData,
    autoScrollToResults = false,
  } = location.state || {};
  const results = externalResults ?? stateResults;
  const [mode, setMode] = useState<FormMode>(
    externalMode ?? location?.state?.mode ?? "gosendeet",
  );
  const [embeddedInputData, setEmbeddedInputData] = useState<any>(
    externalInputData || null,
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
    sharedQuoteRequest || embeddedInputData || stateInputData || storedInputData || {};
  const hasRouteQuery = Boolean(
    inputData?.pickupLocation && inputData?.dropOffLocation,
  );

  const bookingRequest = inputData;
  const [data, setData] = useState(results || {});

  useEffect(() => {
    if (externalResults !== undefined) {
      setData(externalResults);
    } else if (isEmbedded) {
      // Clear stale data when no external results so the wrong mode's cards don't flash
      setData({});
      // Reset price state so stale gosendeet PRICE_MAX doesn't filter out compare quotes
      stablePriceMaxRef.current = 0;
      resetPriceFilterState();
    }
  }, [externalResults, isEmbedded]);

  useEffect(() => {
    if (externalMode !== undefined) setMode(externalMode);
  }, [externalMode]);

  useEffect(() => {
    if (externalInputData !== undefined) setEmbeddedInputData(externalInputData);
  }, [externalInputData]);
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
  const {
    activeFiltersCount,
    activeTab,
    clearFilters,
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
  } = useQuoteFilters({
    hasQuotes,
    priceMax: PRICE_MAX,
    quoteContent,
  });
  const isSharedView = Boolean(shareId);
  const quotePayload = useMemo(
    () => buildQuotePayload(bookingRequest),
    [bookingRequest],
  );
  const {
    fetchQuotesPage,
    handleLoadMore,
    hasNextPage,
    isFetchingQuotes,
    isLoadingMore,
    resetQuotePagination,
  } = useQuoteFetching({
    filterParams,
    isSharedView,
    mode,
    quotePayload,
    setData,
  });
  const [selectedDirectQuoteIndex, setSelectedDirectQuoteIndex] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);
  const quoteDetailsRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledToResultsRef = useRef(false);
  // Becomes true once any quotes have loaded — gates the gosendeet auto-fetch on public page
  const hasEverFetchedRef = useRef(false);
  const hasTrackedResultViewRef = useRef(false);

  useEffect(() => {
    if (!hasQuotes) return;
    if (!hasEverFetchedRef.current) hasEverFetchedRef.current = true;
    if (hasTrackedResultViewRef.current) return;
    hasTrackedResultViewRef.current = true;
    track(EVENT.QUOTE_RESULT_VIEWED, {
      mode,
      quote_count: quoteContent.length,
      pickup_location: bookingRequest?.pickupLocation,
      drop_off_location: bookingRequest?.dropOffLocation,
    });
  }, [hasQuotes]);

  useEffect(() => {
    if (shareId && sharedQuote) {
      setData(sharedQuote);
    } else if (results) {
      setData(results);
    }
  }, [results, sharedQuote, shareId]);

  useEffect(() => {
    if (!autoScrollToResults || hasAutoScrolledToResultsRef.current) return;
    if (mode === "tracking" || isFetchingQuotes || isLoadingMore) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const shouldWaitForQuoteDetails = mode === "gosendeet";
    if (shouldWaitForQuoteDetails && !hasQuotes) return;

    const hasFetchedResponse =
      hasQuotes ||
      Boolean((data && Object.keys(data).length > 0) || hasRouteQuery);
    if (!hasFetchedResponse) return;

    let retryTimeoutId: number | undefined;
    let attempts = 0;
    const maxAttempts = 12;

    const scrollToTarget = () => {
      const target =
        mode === "gosendeet"
          ? quoteDetailsRef.current
          : resultsSectionRef.current;

      if (!target) {
        if (attempts < maxAttempts) {
          attempts += 1;
          retryTimeoutId = window.setTimeout(scrollToTarget, 120);
        }
        return;
      }

      const navbarOffset = 88;
      const yPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: Math.max(0, yPosition), behavior: "smooth" });
      hasAutoScrolledToResultsRef.current = true;
    };

    const rafId = requestAnimationFrame(scrollToTarget);
    const timeoutId = window.setTimeout(scrollToTarget, 140);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, [
    autoScrollToResults,
    mode,
    isFetchingQuotes,
    isLoadingMore,
    hasQuotes,
    data,
    hasRouteQuery,
  ]);

  useEffect(() => {
    if (mode !== "compare" || isSharedView) return;
    if (quotePayload.length === 0) return;
    // Skip auto-fetch when compare results are explicitly provided externally
    if (externalResults !== undefined) return;
    resetQuotePagination();
    listRef.current?.scrollTo({ top: 0 });
    fetchQuotesPage(1, true);
  }, [
    mode,
    isSharedView,
    quotePayload,
    externalResults,
    selectedProviders,
    selectedDeliverySpeed,
    resetQuotePagination,
    fetchQuotesPage,
  ]);

  // Auto-fetch gosendeet quotes when no external results (e.g. switching back from compare)
  // On embedded (dashboard): always allowed when externalResults is cleared by mode switch
  // On public page: only after the user has gotten quotes before (hasEverFetchedRef guard)
  useEffect(() => {
    if (mode !== "gosendeet" || isSharedView) return;
    if (!isEmbedded && !hasEverFetchedRef.current) return;
    if (quotePayload.length === 0) return;
    if (externalResults !== undefined) return;
    fetchQuotesPage(1, true);
  }, [mode, isEmbedded, isSharedView, quotePayload, externalResults, fetchQuotesPage]);

  const handleClick = (selectedQuote: any) => {
    if (!userId) {
      toast.error("Please sign in to continue");
      savePreSigninQuote({ mode, results: data, inputData });
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } else {
      track(EVENT.COURIER_SELECTED, {
        courier_name: selectedQuote?.courier?.name,
        courier_id: selectedQuote?.courier?.id,
        price: parsePrice(selectedQuote?.price),
        pudo_mode: selectedQuote?.pudoMode,
        estimated_delivery_date: selectedQuote?.estimatedDeliveryDate,
      });
      navigate("/delivery", {
        state: { bookingDetails: selectedQuote, bookingRequest: bookingRequest },
      });
    }
  };

  const { copyUrl, handleShare, shareLoading, shareUrl } =
    useShareQuote(bookingRequest);

  const routePickupState = extractStateFromAddress(bookingRequest?.pickupLocation);
  const routeDropOffState = extractStateFromAddress(bookingRequest?.dropOffLocation);
  const packageSummary = buildPackageSummary(bookingRequest);
  const showCompareContext =
    stablePriceMaxRef.current > 0 || isFetchingQuotes || hasRouteQuery;
  const filterPriceMax = PRICE_MAX > 0 ? PRICE_MAX : 1;

  return (
    <div className={cn("md:px-6 bg-[#F8FAFC]", hideForm ? "pt-0 pb-8" : "py-12")}>
      {!hideForm && (
        <>
          {/* Mode Switcher Tabs - Top of Calculator */}
          <div className="w-full mb-6 flex justify-center">
            <ModeSwitcher
              mode={mode}
              onModeChange={(newMode) => {
                if (newMode !== mode) setData({});
                setMode(newMode);
              }}
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
              {...(isEmbedded && {
                forcedIsDashboard: false,
                onQuoteResult: (result: any, newInputData: any, newMode: FormMode) => {
                  setData(result);
                  setEmbeddedInputData(newInputData);
                  setMode(newMode);
                },
              })}
            />
          </div>
        </>
      )}

      {/* Results Section Header */}
      <div ref={resultsSectionRef}>
      {mode === "compare" && (
        <>
          <div
            className={cn(
              "flex flex-col gap-6 mb-6 font-arial",
              !isEmbedded && "xl:grid xl:grid-cols-[1fr_3fr]",
            )}
          >
            <QuoteFilters
              activeFiltersCount={activeFiltersCount}
              clearFilters={clearFilters}
              deliverySpeedOptions={deliverySpeedOptions}
              getPercent={getPercent}
              handleMaxInput={handleMaxInput}
              handleMinInput={handleMinInput}
              isEmbedded={isEmbedded}
              maxPrice={maxPrice}
              minPrice={minPrice}
              minPriceRef={minPriceRef}
              priceMax={filterPriceMax}
              providerOptions={providerOptions}
              selectedDeliverySpeed={selectedDeliverySpeed}
              selectedProviders={selectedProviders}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              setSelectedDeliverySpeed={setSelectedDeliverySpeed}
              setSelectedProviders={setSelectedProviders}
              showFilterControls={showCompareContext}
              showFilters={showFilters}
              toggleMobileFilterBtn={toggleMobileFilterBtn}
              userHasSetPriceFilter={userHasSetPriceFilter}
            />

            {/* Right Content Area */}
            <div className="flex-1">
              <CompareResultsHeader
                activeTab={activeTab}
                bookingRequest={bookingRequest}
                copyUrl={copyUrl}
                filteredCount={filteredAndSortedData.length}
                handleShare={handleShare}
                isEmbedded={isEmbedded}
                onBack={onBack}
                packageSummary={packageSummary}
                routeDropOffState={routeDropOffState}
                routePickupState={routePickupState}
                setActiveTab={setActiveTab}
                setSortBy={setSortBy}
                shareLoading={shareLoading}
                shareUrl={shareUrl}
                showActions={showCompareContext}
                toggleMobileFilterBtn={toggleMobileFilterBtn}
              />

              {/* Results Cards */}
              <CompareQuoteList
                clearFilters={clearFilters}
                filteredAndSortedData={filteredAndSortedData}
                handleClick={handleClick}
                handleLoadMore={handleLoadMore}
                hasNextPage={hasNextPage}
                hasQuotes={hasQuotes}
                hasRouteQuery={hasRouteQuery}
                isEmbedded={isEmbedded}
                isFetchingQuotes={isFetchingQuotes}
                isLoadingMore={isLoadingMore}
              />
            </div>
          </div>
        </>
      )}

      {mode === "gosendeet" && isFetchingQuotes && <DirectQuoteCardSkeleton />}

      {mode === "gosendeet" && hasQuotes && !isFetchingQuotes && (
        <DirectQuotePanel
          bookingRequest={bookingRequest}
          copyUrl={copyUrl}
          handleClick={handleClick}
          handleShare={handleShare}
          quoteContent={quoteContent}
          quoteDetailsRef={quoteDetailsRef}
          selectedDirectQuoteIndex={selectedDirectQuoteIndex}
          setSelectedDirectQuoteIndex={setSelectedDirectQuoteIndex}
          shareLoading={shareLoading}
          shareUrl={shareUrl}
        />
      )}
      </div>
    </div>
  );
};

export default Calculator;
