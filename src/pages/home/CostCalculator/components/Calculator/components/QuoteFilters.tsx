import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpDown,
  CheckCircle2,
  Clock3,
  Circle,
  RotateCcw,
  Wallet,
  Users,
  Timer,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICE_MIN, PRICE_STEP } from "../quoteUtils";

const SORT_TABS = [
  { key: "recommended", label: "Recommended", sort: "price-asc" },
  { key: "cheapest", label: "Cheapest", sort: "price-asc" },
  { key: "fastest", label: "Fastest", sort: "delivery-fastest" },
] as const;

const SortTabs = ({
  activeTab,
  setActiveTab,
  setSortBy,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSortBy: (sort: string) => void;
}) => (
  <div className="mb-4 space-y-1.5">
    <FilterSectionHeader
      description="Sort quotes by your preference"
      icon={ArrowUpDown}
      title="Sort by"
    />
    <div className="flex flex-wrap items-start gap-2">
      {SORT_TABS.map(({ key, label, sort }) => (
        <button
          key={key}
          type="button"
          onClick={() => { setActiveTab(key); setSortBy(sort); }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all",
            activeTab === key
              ? "border-[#86EFAC] bg-[#ECFDF5] text-brand shadow-sm"
              : "border-[#D1D5DB] bg-white text-[#0F172A] hover:border-brand hover:bg-[#F8FAFC]",
          )}
        >
          {activeTab === key ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" fill="#064E3B" stroke="white" />
          ) : (
            <Circle className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
          )}
          {label}
        </button>
      ))}
    </div>
  </div>
);

interface QuoteFiltersProps {
  activeFiltersCount: number;
  activeTab: string;
  clearFilters: () => void;
  deliverySpeedOptions: string[];
  getPercent: (value: number) => number;
  handleMaxInput: (value: string) => void;
  handleMinInput: (value: string) => void;
  isEmbedded: boolean;
  maxPrice: number | "";
  minPrice: number | "";
  minPriceRef: RefObject<HTMLInputElement | null>;
  priceMax: number;
  providerOptions: string[];
  selectedDeliverySpeed: string[];
  selectedProviders: string[];
  setMaxPrice: Dispatch<SetStateAction<number | "">>;
  setMinPrice: Dispatch<SetStateAction<number | "">>;
  setActiveTab: (tab: string) => void;
  setSelectedDeliverySpeed: Dispatch<SetStateAction<string[]>>;
  setSelectedProviders: Dispatch<SetStateAction<string[]>>;
  setSortBy: (sort: string) => void;
  showFilters: boolean;
  showFilterControls: boolean;
  toggleMobileFilterBtn: (show: boolean) => void;
  userHasSetPriceFilter: MutableRefObject<boolean>;
}

const FilterSectionHeader = ({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) => (
  <div className="flex items-center gap-2">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#DCFCE7] text-brand">
      <Icon size={13} />
    </span>
    <div>
      <h4 className="font-semibold text-xs text-dark tracking-wider">
        {title}
      </h4>
      <h3 className="text-[12px] text-gray-600">{description}</h3>
    </div>
  </div>
);

const ProviderFilter = ({
  providerOptions,
  selectedProviders,
  setSelectedProviders,
  scrollable,
}: {
  providerOptions: string[];
  selectedProviders: string[];
  setSelectedProviders: Dispatch<SetStateAction<string[]>>;
  scrollable?: boolean;
}) => (
  <div className="mb-4 space-y-1.5">
    <FilterSectionHeader
      description="Select one or more providers to filter quotes"
      icon={Users}
      title="Providers"
    />
    <div className={cn("w-full overflow-y-auto", scrollable && "h-[160px]")}>
      <div className="flex flex-wrap items-start gap-3">
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
              "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-normal transition-all",
              selectedProviders.includes(provider)
                ? "border-[#86EFAC] bg-[#ECFDF5] text-brand shadow-sm"
                : "border-[#D1D5DB] bg-white text-[#0F172A] hover:border-brand hover:bg-[#F8FAFC]",
            )}
          >
            {selectedProviders.includes(provider) ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" fill="#064E3B" stroke="white" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
            )}
            {provider}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const DeliverySpeedFilter = ({
  deliverySpeedOptions,
  selectedDeliverySpeed,
  setSelectedDeliverySpeed,
  cursorPointer,
}: {
  deliverySpeedOptions: string[];
  selectedDeliverySpeed: string[];
  setSelectedDeliverySpeed: Dispatch<SetStateAction<string[]>>;
  cursorPointer?: boolean;
}) => (
  <div className="mb-4 space-y-1.5">
    <FilterSectionHeader
      description="Choose how quickly you want the delivery completed"
      icon={Timer}
      title="Delivery Speed"
    />
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
            "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-bold transition-all",
            cursorPointer && "cursor-pointer",
            selectedDeliverySpeed.includes(speed)
              ? "border-[#86EFAC] bg-[#ECFDF5] text-brand shadow-sm"
              : "border-[#D1D5DB] bg-white text-[#475569] hover:border-brand hover:bg-[#F8FAFC]",
          )}
        >
          {selectedDeliverySpeed.includes(speed) ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand" fill="#064E3B" stroke="white" />
          ) : (
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
          )}
          {speed}
        </button>
      ))}
    </div>
  </div>
);

const DesktopPriceFilter = ({
  getPercent,
  handleMaxInput,
  handleMinInput,
  maxPrice,
  minPrice,
  priceMax,
  setMaxPrice,
  setMinPrice,
  userHasSetPriceFilter,
}: Pick<
  QuoteFiltersProps,
  | "getPercent"
  | "handleMaxInput"
  | "handleMinInput"
  | "maxPrice"
  | "minPrice"
  | "priceMax"
  | "setMaxPrice"
  | "setMinPrice"
  | "userHasSetPriceFilter"
>) => (
  <div className="mb-4">
    <div className="space-y-3">
      <FilterSectionHeader
        description="Select the minimum and maximum price for quotes"
        icon={Wallet}
        title="Price Range"
      />
      <div className="flex items-center justify-between gap-2">
        <div className="bg-[#F9FAFB] p-2 rounded-lg flex-1 min-w-0 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
          <p className="text-[10px] text-[#99A1AF] text-capitalize font-semibold mb-0.5 text-center">
            MIN
          </p>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => handleMinInput(e.target.value)}
            className="price-input w-full text-xs font-bold text-brand bg-transparent outline-none cursor-text"
            step={PRICE_STEP}
          />
        </div>
        <div className="text-gray-400 shrink-0 text-xs">→</div>
        <div className="text-right bg-[#F9FAFB] p-2 rounded-lg flex-1 min-w-0 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
          <p className="text-[10px] text-[#99A1AF] text-capitalize font-semibold mb-0.5 text-center">
            MAX
          </p>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => handleMaxInput(e.target.value)}
            className="price-input w-full text-xs font-bold text-brand bg-transparent outline-none text-right cursor-text"
            step={PRICE_STEP}
          />
        </div>
      </div>

      <div className="relative w-full h-6">
        <div className="absolute -top-0.1 w-full h-2.5 bg-gray-200 rounded-lg" />

        <div
          className="absolute -top-0.1 h-2.5 bg-brand rounded-lg"
          style={{
            left: `${getPercent(minPrice === "" ? PRICE_MIN : minPrice)}%`,
            width: `${Math.max(0, getPercent(maxPrice === "" ? priceMax : maxPrice) - getPercent(minPrice === "" ? PRICE_MIN : minPrice))}%`,
          }}
        />

        <input
          type="range"
          min={PRICE_MIN}
          max={priceMax}
          step={PRICE_STEP}
          value={minPrice === "" ? PRICE_MIN : Math.min(minPrice, priceMax)}
          onChange={(e) => {
            userHasSetPriceFilter.current = true;
            const value = Math.min(
              Number(e.target.value),
              (maxPrice === "" ? priceMax : maxPrice) - PRICE_STEP,
            );
            setMinPrice(value);
          }}
          style={{
            zIndex:
              (minPrice === "" ? PRICE_MIN : minPrice) >= priceMax - PRICE_STEP
                ? 5
                : 3,
          }}
          className="absolute w-full h-3.5 -top-0.5 appearance-none bg-transparent pointer-events-none slider-thumb"
        />

        <input
          type="range"
          min={PRICE_MIN}
          max={priceMax}
          step={PRICE_STEP}
          value={
            maxPrice === ""
              ? priceMax
              : Math.max(PRICE_MIN + PRICE_STEP, Math.min(maxPrice, priceMax))
          }
          onChange={(e) => {
            userHasSetPriceFilter.current = true;
            const value = Math.max(
              Number(e.target.value),
              (minPrice === "" ? PRICE_MIN : minPrice) + PRICE_STEP,
            );
            setMaxPrice(value);
          }}
          style={{ zIndex: 4 }}
          className="absolute w-full h-3.5 -top-0.5 appearance-none bg-transparent pointer-events-none slider-thumb"
        />
      </div>


    </div>
  </div>
);

const QuoteFilters = ({
  activeFiltersCount,
  activeTab,
  clearFilters,
  deliverySpeedOptions,
  getPercent,
  handleMaxInput,
  handleMinInput,
  isEmbedded,
  maxPrice,
  minPrice,
  priceMax,
  providerOptions,
  selectedDeliverySpeed,
  selectedProviders,
  setActiveTab,
  setMaxPrice,
  setMinPrice,
  setSelectedDeliverySpeed,
  setSelectedProviders,
  setSortBy,
  showFilterControls,
  showFilters,
  toggleMobileFilterBtn,
  userHasSetPriceFilter,
}: QuoteFiltersProps) => {
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showFilters]);

  return (
  <>
    {showFilterControls && !isEmbedded && (
      <button
        type="button"
        className="xl:hidden flex items-center max-w-40 gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#D1FAE5] shadow-sm cursor-pointer mb-2 transition-colors hover:border-brand"
        onClick={() => toggleMobileFilterBtn(true)}
      >
        <SlidersHorizontal size={16} color="#064E3B" />
        <span className="font-bold text-sm text-brand">Filter & Sort</span>
        {activeFiltersCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
            {activeFiltersCount}
          </span>
        )}
      </button>
    )}

    {/* Portal: renders directly into document.body so fixed positioning isn't trapped by a transformed ancestor (e.g. dashboard layout) */}
    {createPortal(
      <>
      {/* Mobile bottom-sheet overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          !isEmbedded && "xl:hidden",
          showFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => toggleMobileFilterBtn(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex max-h-[88vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out",
          !isEmbedded && "xl:hidden",
          showFilters ? "translate-y-0" : "translate-y-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1 shrink-0">
        <div className="h-1.5 w-10 rounded-full bg-gray-200" />
      </div>

      {/* Sheet header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base text-brand">Filter quotes</h3>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg border border-brand-light px-2.5 py-1 text-xs font-semibold text-brand transition-colors hover:text-green-800"
            variant="outline"
            size="sm"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </Button>
          <button
            onClick={() => toggleMobileFilterBtn(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-brand"
            aria-label="Close filters"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <SortTabs activeTab={activeTab} setActiveTab={setActiveTab} setSortBy={setSortBy} />
        <hr className="my-4 border-gray-100" />
        <DesktopPriceFilter
          getPercent={getPercent}
          handleMaxInput={handleMaxInput}
          handleMinInput={handleMinInput}
          maxPrice={maxPrice}
          minPrice={minPrice}
          priceMax={priceMax}
          setMaxPrice={setMaxPrice}
          setMinPrice={setMinPrice}
          userHasSetPriceFilter={userHasSetPriceFilter}
        />
        <hr className="my-4 border-gray-100" />
        <ProviderFilter
          providerOptions={providerOptions}
          selectedProviders={selectedProviders}
          setSelectedProviders={setSelectedProviders}
        />
        <hr className="my-4 border-gray-100" />
        <DeliverySpeedFilter
          cursorPointer
          deliverySpeedOptions={deliverySpeedOptions}
          selectedDeliverySpeed={selectedDeliverySpeed}
          setSelectedDeliverySpeed={setSelectedDeliverySpeed}
        />
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-gray-100 px-5 pt-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}>
        <button
          onClick={() => toggleMobileFilterBtn(false)}
          className="w-full cursor-pointer rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
        >
          Apply Filters
        </button>
      </div>
    </div>
      </>,
      document.body,
    )}

    <div
      className={cn(
        "hidden w-full shrink-0",
        showFilterControls && "xl:block",
      )}
    >
      <div className="bg-white rounded-xl shadow-md p-6 border border-[#E2E8F0] sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-brand">Filter quotes</h3>

          <Button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand cursor-pointer hover:text-green-800  border border-brand-light py-1 px-2 rounded transition-colors flex items-center gap-1"
            variant="outline"
            size="sm"
          >
            <RotateCcw size={14} />
            <span>
              Reset
            </span>
          </Button>
        </div>

        <SortTabs activeTab={activeTab} setActiveTab={setActiveTab} setSortBy={setSortBy} />
        <hr className="my-6 border-gray-200" />
        <DesktopPriceFilter
          getPercent={getPercent}
          handleMaxInput={handleMaxInput}
          handleMinInput={handleMinInput}
          maxPrice={maxPrice}
          minPrice={minPrice}
          priceMax={priceMax}
          setMaxPrice={setMaxPrice}
          setMinPrice={setMinPrice}
          userHasSetPriceFilter={userHasSetPriceFilter}
        />
        <hr className="my-6 border-gray-200" />
        <ProviderFilter
          providerOptions={providerOptions}
          selectedProviders={selectedProviders}
          setSelectedProviders={setSelectedProviders}
        />
        <hr className="my-6 border-gray-200" />
        <DeliverySpeedFilter
          cursorPointer
          deliverySpeedOptions={deliverySpeedOptions}
          selectedDeliverySpeed={selectedDeliverySpeed}
          setSelectedDeliverySpeed={setSelectedDeliverySpeed}
        />
      </div>
    </div>
  </>
  );
};

export default QuoteFilters;
