import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FiClock } from "react-icons/fi";
import { Settings2, X } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import CompareQuoteList from "./components/CompareQuoteList";
import CompareResultsHeader from "./components/CompareResultsHeader";
import QuoteFilters from "./components/QuoteFilters";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import DeliveryFormModeSwitcher from "@/pages/home/components/DeliveryFormModeSwitcher";
import { readSavedBookingQuote } from "@/pages/home/components/quote-form/quoteFormData";

import { cn } from "@/lib/utils";
import { useGetSharedQuotes } from "@/queries/user/useGetUserBookings";
import { track, EVENT } from "@/lib/analytics";
import { savePreSigninQuote } from "@/lib/preSigninQuote";
import {
  buildPackageSummary,
  buildQuotePayload,
  extractStateFromAddress,
  normalizeQuotesResponse,
  PAGE_SIZE,
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
    externalMode ?? location?.state?.mode ?? "compare",
  );
  const [embeddedInputData, setEmbeddedInputData] = useState<any>(
    externalInputData || null,
  );
  const [showMobileForm, setShowMobileForm] = useState(false);

  const storedInputData = useMemo(readSavedBookingQuote, []);

  const routePreset = location.state?.routePreset;
  const presetInputData = useMemo(() => routePreset ? {
    ...storedInputData,
    pickupLocation: "",
    dropOffLocation: "",
  } : null, [routePreset, storedInputData]);
  const sharedQuoteRequest = sharedQuote?.quoteRequests[0];

  const inputData =
    sharedQuoteRequest || embeddedInputData || stateInputData || presetInputData || storedInputData || {};
  const hasRouteQuery = Boolean(
    inputData?.pickupLocation && inputData?.dropOffLocation,
  );

  const bookingRequest = inputData;
  const [data, setData] = useState(results || {});
  const handleModeChange = (newMode: FormMode) => {
    if (newMode !== mode) {
      setData({});
      lastComparisonRequestRef.current = null;
    }
    setMode(newMode);
  };

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

  useEffect(() => {
    document.body.style.overflow = showMobileForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showMobileForm]);
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
    setHasNextPage,
  } = useQuoteFetching({
    filterParams,
    isSharedView,
    mode,
    quotePayload,
    setData,
  });
  const listRef = useRef<HTMLDivElement | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledToResultsRef = useRef(false);
  // Becomes true once any quotes have loaded — gates the gosendeet auto-fetch on public page
  const hasEverFetchedRef = useRef(false);
  const hasTrackedResultViewRef = useRef(false);
  // True only when user explicitly submitted the form (navigated here with results in state, or submitted on-page)
  const hasUserInitiatedFetchRef = useRef(Boolean(stateResults));
  const lastComparisonRequestRef = useRef<string | null>(null);

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
      setHasNextPage(normalizeQuotesResponse(sharedQuote).length >= PAGE_SIZE);
    } else if (results) {
      hasUserInitiatedFetchRef.current = true;
      // Navigation already supplied this unfiltered response from the form.
      lastComparisonRequestRef.current = JSON.stringify({ payload: quotePayload, filters: {} });
      setData(results);
      setHasNextPage(normalizeQuotesResponse(results).length >= PAGE_SIZE);
    }
  }, [results, sharedQuote, shareId, quotePayload, setHasNextPage]);

  useEffect(() => {
    if (!autoScrollToResults || hasAutoScrolledToResultsRef.current) return;
    if (mode === "tracking" || isFetchingQuotes || isLoadingMore) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const hasFetchedResponse =
      hasQuotes ||
      Boolean((data && Object.keys(data).length > 0) || hasRouteQuery);
    if (!hasFetchedResponse) return;

    let retryTimeoutId: number | undefined;
    let attempts = 0;
    const maxAttempts = 12;

    const scrollToTarget = () => {
      const target = resultsSectionRef.current;

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
    // Don't auto-fetch on page load if the user hasn't submitted the form yet
    if (!hasUserInitiatedFetchRef.current) return;
    const requestKey = JSON.stringify({ payload: quotePayload, filters: filterParams });
    if (lastComparisonRequestRef.current === requestKey) return;
    lastComparisonRequestRef.current = requestKey;
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
    filterParams,
    resetQuotePagination,
    fetchQuotesPage,
  ]);

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
  const showCompareContext = hasQuotes || isFetchingQuotes;
  const filterPriceMax = PRICE_MAX > 0 ? PRICE_MAX : 1;

  return (
    <div className={cn(
      "md:px-6 bg-[#F8FAFC]",
      hideForm
        ? "pt-0 pb-8"
        : showCompareContext && !isEmbedded
          ? "pt-4 pb-8 md:py-12"
          : "py-12",
    )}>
      {!hideForm && (
        <div className={cn(
          !isEmbedded ? "quote-form-section w-full mb-20" : undefined,
          showCompareContext && !isEmbedded ? "hidden xl:block" : undefined,
        )}>
          <div className={!isEmbedded ? "landing-booking-panel" : undefined}>
          {/* Mode Switcher Tabs - Top of Calculator */}
          <div className={isEmbedded ? "w-full mb-6 flex justify-center" : undefined}>
            {isEmbedded ? <ModeSwitcher
              mode={mode}
              onModeChange={handleModeChange}
              variant="pill"
              animate
            /> : <DeliveryFormModeSwitcher
              mode={mode}
              onModeChange={handleModeChange}
            />}
          </div>

          <div className={isEmbedded ? "w-full mb-20" : undefined}>
            <FormHorizontalBar
              variant="minimal"
              appearance={isEmbedded ? "default" : "landing"}
              activeMode={mode}
              bookingRequest={bookingRequest}
              addressSearchPreset={isEmbedded ? undefined : routePreset}
              setData={setData}
              {...(isEmbedded && {
                forcedIsDashboard: false,
                onQuoteResult: (result: any, newInputData: any, newMode: FormMode) => {
                  hasUserInitiatedFetchRef.current = true;
                  setData(result);
                  setEmbeddedInputData(newInputData);
                  setMode(newMode);
                },
              })}
            />
          </div>
          </div>
          {!isEmbedded && mode === "compare" && <p className="landing-delivery-note"><FiClock aria-hidden="true" /><span>Book before <strong>12 pm</strong> for same-day delivery.</span></p>}
        </div>
      )}

      {/* Results Section Header */}
      <div ref={resultsSectionRef} className={!isEmbedded ? "quote-results-section" : undefined}>
      {mode === "compare" && (
        <>
          {/* Mobile — Customise Result button (opens form drawer) */}
          {!isEmbedded && showCompareContext && (
            <div className="xl:hidden mb-4">
              <button
                type="button"
                onClick={() => setShowMobileForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#D1FAE5] shadow-sm transition-colors hover:border-brand"
              >
                <Settings2 size={16} color="#064E3B" />
                <span className="font-bold text-sm text-brand">Edit Delivery Details</span>
              </button>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-6 mb-6 font-arial",
              showCompareContext &&
                "xl:grid xl:grid-cols-[270px_minmax(0,1fr)]",
            )}
          >
            <QuoteFilters
              activeFiltersCount={activeFiltersCount}
              activeTab={activeTab}
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
              setActiveTab={setActiveTab}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              setSelectedDeliverySpeed={setSelectedDeliverySpeed}
              setSelectedProviders={setSelectedProviders}
              setSortBy={setSortBy}
              showFilterControls={showCompareContext}
              showFilters={showFilters}
              toggleMobileFilterBtn={toggleMobileFilterBtn}
              userHasSetPriceFilter={userHasSetPriceFilter}
            />

            {/* Right Content Area */}
            <div className="flex-1">
              {(isEmbedded || showCompareContext) && (
                <CompareResultsHeader
                  bookingRequest={bookingRequest}
                  copyUrl={copyUrl}
                  filteredCount={filteredAndSortedData.length}
                  handleShare={handleShare}
                  isEmbedded={isEmbedded}
                  onBack={onBack}
                  packageSummary={packageSummary}
                  routeDropOffState={routeDropOffState}
                  routePickupState={routePickupState}
                  shareLoading={shareLoading}
                  shareUrl={shareUrl}
                  showActions={showCompareContext}
                  toggleMobileFilterBtn={toggleMobileFilterBtn}
                />
              )}

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

      </div>

      {/* Mobile form bottom sheet — "Customise Result" drawer */}
      {!isEmbedded && !hideForm && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "xl:hidden fixed inset-0 z-40 transition-opacity duration-300",
              showMobileForm ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            )}
            onClick={() => setShowMobileForm(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Sheet */}
          <div
            className={cn(
              "xl:hidden fixed bottom-0 left-0 right-0 z-50 flex max-h-[82vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out",
              showMobileForm ? "translate-y-0" : "translate-y-full",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="h-1.5 w-10 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-base text-brand">Edit Delivery Details</h3>
              <button
                onClick={() => setShowMobileForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-brand"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FormHorizontalBar
                variant="minimal"
                appearance="default"
                activeMode={mode}
                bookingRequest={bookingRequest}
                setData={setData}
                forcedIsDashboard={false}
                onQuoteResult={(result: any, newInputData: any, newMode: FormMode) => {
                  hasUserInitiatedFetchRef.current = true;
                  setData(result);
                  setEmbeddedInputData(newInputData);
                  setMode(newMode);
                  setShowMobileForm(false);
                }}
              />
              {mode === "compare" && (
                <p className="landing-delivery-note mt-4">
                  <FiClock aria-hidden="true" />
                  <span>Book before <strong>12 pm</strong> for same-day delivery.</span>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calculator;
