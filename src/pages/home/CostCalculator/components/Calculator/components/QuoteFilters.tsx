import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICE_MIN, PRICE_STEP } from "../quoteUtils";

interface QuoteFiltersProps {
  activeFiltersCount: number;
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
  setSelectedDeliverySpeed: Dispatch<SetStateAction<string[]>>;
  setSelectedProviders: Dispatch<SetStateAction<string[]>>;
  showFilters: boolean;
  showFilterControls: boolean;
  toggleMobileFilterBtn: (show: boolean) => void;
  userHasSetPriceFilter: MutableRefObject<boolean>;
}

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
  <div className="mb-6">
    <h4 className="font-semibold text-sm text-gray150 mb-3 uppercase tracking-wider">
      Providers
    </h4>
    <div className={cn("w-full overflow-y-auto", scrollable && "h-[160px]")}>
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
            cursorPointer && "cursor-pointer",
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
);

const MobilePriceFilter = ({
  handleMaxInput,
  handleMinInput,
  maxPrice,
  minPrice,
  minPriceRef,
  priceMax,
  setMaxPrice,
  setMinPrice,
  userHasSetPriceFilter,
}: Pick<
  QuoteFiltersProps,
  | "handleMaxInput"
  | "handleMinInput"
  | "maxPrice"
  | "minPrice"
  | "minPriceRef"
  | "priceMax"
  | "setMaxPrice"
  | "setMinPrice"
  | "userHasSetPriceFilter"
>) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between ">
      <div className="bg-[#F9FAFB] p-3 rounded-lg w-28.75 border border-[#E5E7EB] focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
        <p className="text-xs text-[#99A1AF] text-capitalize font-semibold mb-1">
          MIN
        </p>
        <div className="flex item-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                userHasSetPriceFilter.current = true;
                setMinPrice(Math.max(PRICE_MIN, (minPrice || PRICE_MIN) - PRICE_STEP));
              }}
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
              onClick={() => {
                userHasSetPriceFilter.current = true;
                setMinPrice(Math.min(priceMax, (minPrice || PRICE_MIN) + PRICE_STEP));
              }}
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
            max={priceMax}
            step={PRICE_STEP}
          />
          <button
            onClick={() => {
              userHasSetPriceFilter.current = true;
              setMaxPrice(
                Math.max(
                  (minPrice || PRICE_MIN) + PRICE_STEP,
                  (maxPrice || priceMax) - PRICE_STEP,
                ),
              );
            }}
            className="font-semibold pr-1"
          >
            −
          </button>
        </div>
      </div>
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
  <div className="mb-6">
    <h4 className="font-semibold text-sm text-gray150 mb-6 uppercase tracking-wider">
      Price Range
    </h4>
    <div className="space-y-4">
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
);

const QuoteFilters = ({
  activeFiltersCount,
  clearFilters,
  deliverySpeedOptions,
  getPercent,
  handleMaxInput,
  handleMinInput,
  isEmbedded,
  maxPrice,
  minPrice,
  minPriceRef,
  priceMax,
  providerOptions,
  selectedDeliverySpeed,
  selectedProviders,
  setMaxPrice,
  setMinPrice,
  setSelectedDeliverySpeed,
  setSelectedProviders,
  showFilterControls,
  showFilters,
  toggleMobileFilterBtn,
  userHasSetPriceFilter,
}: QuoteFiltersProps) => (
  <>
    {showFilterControls && !isEmbedded && (
      <div
        className="md:hidden bg-white flex items-center justify-center gap-2 p-2 rounded-2xl mb-6 cursor-pointer shadow-md"
        onClick={() => toggleMobileFilterBtn(true)}
      >
        <TrendingUp color="#064E3B" />
        <h3 className="font-font text-sm text-brand">Filter & Sort</h3>
      </div>
    )}

    <div
      className={cn(
        "fixed inset-0 z-40 transition-all duration-500 ease-in-out",
        !isEmbedded && "md:hidden",
        showFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      style={{ touchAction: "pan-y" }}
      onClick={() => toggleMobileFilterBtn(false)}
    >
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
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
          <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
          <button
            onClick={() => toggleMobileFilterBtn(false)}
            className="text-2xl text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
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

            <MobilePriceFilter
              handleMaxInput={handleMaxInput}
              handleMinInput={handleMinInput}
              maxPrice={maxPrice}
              minPrice={minPrice}
              minPriceRef={minPriceRef}
              priceMax={priceMax}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              userHasSetPriceFilter={userHasSetPriceFilter}
            />
          </div>

          <ProviderFilter
            providerOptions={providerOptions}
            scrollable
            selectedProviders={selectedProviders}
            setSelectedProviders={setSelectedProviders}
          />
          <DeliverySpeedFilter
            deliverySpeedOptions={deliverySpeedOptions}
            selectedDeliverySpeed={selectedDeliverySpeed}
            setSelectedDeliverySpeed={setSelectedDeliverySpeed}
          />

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

    <div
      className={cn(
        "hidden xl:w-64 w-full shrink-0",
        showFilterControls && !isEmbedded ? "md:block" : "",
      )}
    >
      <div className="bg-white rounded-xl shadow-md p-6 border border-[#E2E8F0] sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand cursor-pointer hover:text-green-800 bg-brand-light py-1 px-2 rounded transition-colors"
          >
            Reset
          </button>
        </div>

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
        <ProviderFilter
          providerOptions={providerOptions}
          selectedProviders={selectedProviders}
          setSelectedProviders={setSelectedProviders}
        />
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

export default QuoteFilters;
