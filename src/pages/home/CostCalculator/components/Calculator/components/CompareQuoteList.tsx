import { Button } from "@/components/ui/button";
import Rating from "@/components/Rating";
import { cn } from "@/lib/utils";
import empty from "@/assets/images/green-empty-bg.png";
import CompareCardSkeleton from "../CompareCardSkeleton";
import { ArrowRight, Box, ChevronDown, ShieldCheck } from "lucide-react";
import { PAGE_SIZE, parsePrice } from "../quoteUtils";

interface CompareQuoteListProps {
  clearFilters: () => void;
  filteredAndSortedData: any[];
  handleClick: (selectedQuote: any) => void;
  handleLoadMore: () => void;
  hasNextPage: boolean;
  hasQuotes: boolean;
  hasRouteQuery: boolean;
  isEmbedded: boolean;
  isFetchingQuotes: boolean;
  isLoadingMore: boolean;
}

const DashboardCompareQuoteCard = ({
  item,
  isRecommended,
  onSelect,
}: {
  item: any;
  isRecommended: boolean;
  onSelect: () => void;
}) => (
  <div
    className={cn(
      "shrink-0 rounded-[28px] border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
      isRecommended ? "border-[#CBD5E1] ring-1 ring-[#E2E8F0]" : "border-[#E2E8F0]",
    )}
  >
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
            isRecommended ? "border-brand" : "border-[#CBD5E1]",
          )}
        >
          {isRecommended && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
        </span>
        {item?.courier?.logo ? (
          <img
            src={item?.courier?.logo}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl object-contain"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#334155]">
            <Box className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-base font-extrabold text-[#0F172A]">
            {item?.courier?.name || "GoSendeet Direct"}
          </h3>
          <div className="mt-1 flex items-center gap-1">
            <Rating value={item?.courier?.averageRatingScore} readOnly />
            <span className="text-xs font-semibold text-[#64748B]">
              ({item?.courier?.totalRatings ?? 0})
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        {item?.discount > 0 && (
          <span className="mb-1 inline-block rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-bold text-brand">
            {item.discount}% off
          </span>
        )}
        <p className="text-2xl font-extrabold tracking-tight text-brand">
          ₦{parsePrice(item.price).toLocaleString()}
        </p>
      </div>
    </div>

    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="flex w-fit items-center gap-2 rounded-lg bg-[#D1FAE5] px-3 py-2 text-xs font-extrabold text-[#064E3B]">
        <ShieldCheck size={14} /> Verified
      </span>
      <span className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#475569]">
        {item?.serviceLevelAgreements?.[0] || "Standard Delivery"}
      </span>
    </div>

    <div className="rounded-2xl bg-[#F8FAFC] p-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand">
            {item?.pudoMode === "STORE_DROPOFF"
              ? "Store drop-off"
              : "Doorstep pickup"}
          </p>
          <p className="mt-1 text-sm font-bold text-[#64748B]">
            {item?.pickUpdateDate || "Not specified"}
          </p>
        </div>

        <div className="flex min-w-[80px] flex-col items-center gap-2">
          <p className="text-xs font-bold text-[#475569]">
            {item?.nextDayDelivery ? "Fast" : "Standard"}
          </p>
          <div className="h-1 w-full rounded-full bg-[#00C853]" />
        </div>

        <div className="text-right">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#475569]">
            Delivery
          </p>
          <p className="mt-1 text-sm font-bold text-[#64748B]">
            {item?.estimatedDeliveryDate || "Not specified"}
          </p>
        </div>
      </div>
    </div>

    <p className="mt-4 text-sm font-semibold text-[#475569]">
      Arrives{" "}
      <span className="text-[#0F172A]">
        {item?.estimatedDeliveryDate || "Not specified"}
      </span>
    </p>

    <Button
      onClick={onSelect}
      className="mt-5 h-12 w-full rounded-2xl bg-brand text-sm font-extrabold text-white hover:bg-green-800"
    >
      Select quote
    </Button>
  </div>
);

const PublicCompareQuoteCard = ({
  item,
  isRecommended,
  onSelect,
}: {
  item: any;
  isRecommended: boolean;
  onSelect: () => void;
}) => (
  <div
    className=" bg-white rounded-xl overflow-hidden border-2 border-gray-300 shadow-md
      transition-all duration-300 shrink-0 hover:shadow-lg hover:-translate-y-1 hover:border-green800"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 lg:p-8 gap-6">
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
              <Rating value={item?.courier?.averageRatingScore} readOnly />
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
              {item?.serviceLevelAgreements?.[0] || "Standard Delivery"}
            </p>
            <div className="min-w-[100px] h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
            <p>{``}</p>
          </div>

          <div className="hidden lg:block lg:text-left text-center mt-3 lg:mt-0">
            <p className="text-xs lg:text-sm font-semibold text-brand uppercase mb-1">
              DELIVERY
            </p>
            <p className="text-xs lg:text-sm font-bold lg:text-gray-900 text-gray150">
              {item?.estimatedDeliveryDate || "Not specified"}
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
          onClick={onSelect}
          className={cn(
            isRecommended
              ? "bg-green100 hover:bg-green800 submit-btn-shadow"
              : "bg-white text-green100 border-2",
            "rounded-2xl md:w-[170px] w-full",
          )}
        >
          {isRecommended ? (
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

const CompareQuoteList = ({
  clearFilters,
  filteredAndSortedData,
  handleClick,
  handleLoadMore,
  hasNextPage,
  hasQuotes,
  hasRouteQuery,
  isEmbedded,
  isFetchingQuotes,
  isLoadingMore,
}: CompareQuoteListProps) => (
  <div className="flex flex-col gap-4">
    {isFetchingQuotes && !isLoadingMore && (
      <div className="flex flex-col gap-4 pt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CompareCardSkeleton key={i} />
        ))}
      </div>
    )}

    {!hasQuotes && !isFetchingQuotes && !isLoadingMore && (
      <div className="flex flex-col items-center justify-center mt-20 max-w-2xl mx-auto">
        <img src={empty} alt="empty quotes" className="h-50" />

        <p className="text-center font-bold text-green-600 text-lg mb-1">
          {hasRouteQuery
            ? "No available quote for this route"
            : "No courier services available"}
        </p>
        <p className="text-center text-gray-600 text-sm">
          {hasRouteQuery
            ? "Try a different pickup/drop-off route or update package details."
            : "Use the form above to search for courier services by entering your pickup location, destination, and package details."}
        </p>
      </div>
    )}

    {hasQuotes && filteredAndSortedData.length === 0 && (
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
      <div
        className={cn(
          "flex flex-col gap-4 overflow-y-auto pr-1",
          isEmbedded ? "max-h-[72vh] pt-2" : "max-h-[70vh] pt-8",
        )}
      >
        {filteredAndSortedData.map((item, globalIndex) => {
          const isRecommended = globalIndex === 0;
          const cardProps = {
            item,
            isRecommended,
            onSelect: () => handleClick(item),
          };

          return isEmbedded ? (
            <DashboardCompareQuoteCard
              key={item?.id ?? globalIndex}
              {...cardProps}
            />
          ) : (
            <PublicCompareQuoteCard
              key={item?.id ?? globalIndex}
              {...cardProps}
            />
          );
        })}

        {hasNextPage && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore || isFetchingQuotes}
            className="shrink-0 w-full flex items-center justify-center gap-3 rounded-2xl border border-[#D1D5DB] bg-white py-4 text-sm font-semibold text-green100 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
);

export default CompareQuoteList;
