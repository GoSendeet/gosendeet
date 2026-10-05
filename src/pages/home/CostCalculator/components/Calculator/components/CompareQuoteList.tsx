import { Button } from "@/components/ui/button";
import Rating from "@/components/Rating";
import { cn } from "@/lib/utils";
import empty from "@/assets/images/green-empty-bg.png";
import CompareCardSkeleton from "../CompareCardSkeleton";
import {
  Box,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  Home,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";
import { parsePrice } from "../quoteUtils";

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
  isGosendeet,
  onSelect,
}: {
  item: any;
  isRecommended: boolean;
  isGosendeet: boolean;
  onSelect: () => void;
}) => (
  <div
    className={cn(
      "relative overflow-hidden shrink-0 rounded-[20px] gap-4 justify-center border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
      isGosendeet
        ? "border-brand ring-2 ring-brand/20"
        : isRecommended
          ? "border-[#CBD5E1] ring-1 ring-[#E2E8F0]"
          : "border-[#E2E8F0]",
    )}
  >
    {isGosendeet && (
      <div className="absolute top-0 right-0 bg-green100 text-white rounded-bl-xl rounded-tr-[18px] px-2 py-1.5 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 fill-white stroke-none shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wide">DIRECT</span>
        </div>
        {item?.discount > 0 && (
          <span className="text-[9px] font-semibold opacity-90 whitespace-nowrap">
            {item.discount}% Savings
          </span>
        )}
      </div>
    )}

    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          
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
            <span className="flex w-fit items-center gap-2 rounded-lg bg-[#D1FAE5] px-3 py-2 text-xs font-extrabold text-[#064E3B]">
              <ShieldCheck size={14} /> Verified
            </span>
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
        <div className="flex items-center gap-2 bg-[#F0FDF4] px-4 py-2 rounded-lg w-fit mb-4 text-[#475569]">
        <CalendarRange size={14} />
        <p className="text-sm font-semibold ">
        Arrives{" "}
        <span className="">
          {item?.estimatedDeliveryDate || "Not specified"}
        </span>
      </p>
      </div>
      <div className="mt-5 rounded-[24px] border border-[#E2E8F0] bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#ECFDF5] px-4 py-2 text-sm font-bold text-brand">
            <CheckCircle2 className="h-4 w-4" />
            {item?.serviceLevelAgreements?.[0] || "Standard Delivery"}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_232px] md:items-center">
          <div className="grid grid-cols-[42px_1fr] gap-x-4">
            <div className="relative row-span-2 flex flex-col items-center">
              <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#DDFBE8] bg-[#12A65A] text-white shadow-sm">
                {item?.pudoMode === "STORE_DROPOFF" ? (
                  <Store className="h-4 w-4" />
                ) : (
                  <Home className="h-4 w-4" />
                )}
              </span>
            </div>

            <div className="pb-6">
              <p className="text-lg font-extrabold leading-none text-[#0F172A]">
                {item?.pudoMode === "STORE_DROPOFF"
                  ? "Store drop-off"
                  : "Doorstep pickup"}
              </p>
              <p className="mt-2 text-base font-bold text-[#64748B]">
                {item?.pickUpdateDate || "Not specified"}
              </p>
            </div>
          </div>

          <Button
            onClick={onSelect}
            className="group h-16 w-full rounded-xl bg-brand text-lg font-extrabold text-white shadow-[0_12px_28px_rgba(0,107,79,0.22)] transition-all hover:bg-[#005C43] hover:shadow-[0_16px_32px_rgba(0,107,79,0.28)]"
          >
            Select quote
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const PublicCompareQuoteCard = ({
  item,
  isRecommended,
  isGosendeet,
  onSelect,
}: {
  item: any;
  isRecommended: boolean;
  isGosendeet: boolean;
  onSelect: () => void;
}) => (
  <div
    className={cn(
      "relative bg-white rounded-xl overflow-hidden shrink-0 border-2 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      isGosendeet
        ? "border-brand"
        : isRecommended
          ? "border-gray-300 hover:border-brand"
          : "border-gray-200 hover:border-brand",
    )}
  >
    {isGosendeet && (
      <div className="absolute top-0 right-0 bg-green100 text-white rounded-bl-xl rounded-tr-xl px-2 py-1.5 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 fill-white stroke-none shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wide">DIRECT</span>
        </div>
        {item?.discount > 0 && (
          <span className="text-[9px] font-semibold opacity-90 whitespace-nowrap">
            {item.discount}% Savings
          </span>
        )}
      </div>
    )}

    {/* ── Mobile layout (< md) ── */}
    <div className="md:hidden px-4 py-6">
      {/* Row 1: courier identity + price */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {item?.courier?.logo ? (
            <img
              src={item?.courier?.logo}
              alt=""
              className="w-10 h-10 rounded-lg object-contain shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
              <Box className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">
              {item?.courier?.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Rating value={item?.courier?.averageRatingScore} readOnly />
              <span className="text-xs text-gray-500">({item?.courier?.totalRatings ?? 0})</span>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green100 bg-green-100 px-2 py-0.5 rounded-sm">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <p className={cn("text-xl font-bold text-green100 tracking-tight", isGosendeet && "mt-6")}>
            ₦{parsePrice(item.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Row 2: pickup → SLA → delivery timeline */}
      <div className="flex items-center gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-brand uppercase mb-0.5">
            {item?.pudoMode === "STORE_DROPOFF" ? "DROP-OFF" : "PICKUP"}
          </p>
          <p className="text-xs font-bold text-gray-900">
            {item?.pickUpdateDate || "Not specified"}
          </p>
        </div>

        <div className="flex flex-col items-center flex-1 gap-0.5 min-w-0">
          <p className="text-[10px] text-gray-500 font-medium text-center leading-tight px-1 truncate w-full">
            {item?.serviceLevelAgreements?.[0] || "Standard Delivery"}
          </p>
          <div className="w-full h-0.5 bg-brand rounded-full" />
        </div>

        <div className="text-right min-w-0">
          <p className="text-[10px] font-semibold text-brand uppercase mb-0.5">DELIVERY</p>
          <p className="text-xs font-bold text-gray-900">
            {item?.estimatedDeliveryDate || "Not specified"}
          </p>
        </div>
      </div>

      {/* Row 3: full-width CTA */}
      <Button
        onClick={onSelect}
        className={cn(
          "w-full rounded-xl py-3 font-semibold",
          isRecommended
            ? "bg-green100 hover:bg-green800 submit-btn-shadow text-white"
            : "bg-white text-green100 border-2 border-green100 hover:bg-green-50",
        )}
      >
        {isRecommended ? "Select Option" : "Select"}
      </Button>
    </div>

    {/* ── Desktop layout (md+): horizontal row ── */}
    <div className="hidden md:flex md:items-center justify-between p-5 lg:p-8 gap-6">
      {/* Courier identity */}
      <div className="w-1/4 shrink-0">
        <div className="flex items-center gap-3">
          {item?.courier?.logo ? (
            <img
              src={item?.courier?.logo}
              alt=""
              className="w-[52px] rounded-lg object-contain shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0">
              <Box className="w-8 h-8 text-gray-700" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {item?.courier?.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Rating value={item?.courier?.averageRatingScore} readOnly />
              <span className="text-xs text-gray-600">({item?.courier?.totalRatings ?? 0})</span>
            </div>
          </div>
        </div>
        <div className="text-xs flex items-center gap-2 mt-3 font-semibold w-fit text-green100 px-2 py-1 bg-green-100 rounded-sm">
          <ShieldCheck size={14} /> Verified
        </div>
      </div>

      {/* Delivery timeline */}
      <div className="flex-1">
        <div className="flex items-center gap-6 justify-between">
          <div>
            <p className="text-xs font-semibold text-brand uppercase mb-1">
              {item?.pudoMode === "STORE_DROPOFF" ? "STORE DROP-OFF" : "DOORSTEP PICKUP"}
            </p>
            <p className="text-sm font-bold text-gray-900">
              {item?.pickUpdateDate || "Not specified"}
            </p>
          </div>

          <div className="flex flex-col items-center flex-1 gap-1">
            <p className="text-xs text-gray-600 font-semibold">
              {item?.serviceLevelAgreements?.[0] || "Standard Delivery"}
            </p>
            <div className="w-full h-0.5 bg-brand rounded-full" />
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-brand uppercase mb-1">DELIVERY</p>
            <p className="text-sm font-bold text-gray-900">
              {item?.estimatedDeliveryDate || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex flex-col items-end gap-3 w-[180px] shrink-0">
        <div className="text-left">
          {item?.discount > 0 && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mb-1 inline-block">
              {item.discount}% off
            </span>
          )}
          <p className="text-2xl lg:text-3xl font-bold text-green100 tracking-tight">
            ₦{parsePrice(item.price).toLocaleString()}
          </p>
        </div>
        <Button
          onClick={onSelect}
          className={cn(
            "w-full rounded-2xl",
            isRecommended
              ? "bg-green100 hover:bg-green800 submit-btn-shadow text-white"
              : "bg-white text-green100 border-2 border-green100 hover:bg-green-50",
          )}
        >
          {isRecommended ? "Select Option" : "Select"}
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
          "flex flex-col gap-4 overflow-y-auto pr-1 md:px-0",
          isEmbedded ? "max-h-[72vh] pt-2 px-1" : "max-h-[70vh] pt-8 px-4",
        )}
      >
        {(() => {
          const gosendeetIdx = filteredAndSortedData.findIndex((item) =>
            item?.courier?.name?.toLowerCase().includes("gosendeet"),
          );
          const pinned =
            gosendeetIdx > 0
              ? [
                  filteredAndSortedData[gosendeetIdx],
                  ...filteredAndSortedData.filter((_, i) => i !== gosendeetIdx),
                ]
              : filteredAndSortedData;

          return pinned.map((item, globalIndex) => {
            const isGosendeet = item?.courier?.name?.toLowerCase().includes("gosendeet");
            const isRecommended = globalIndex === 0;
            const cardProps = {
              item,
              isRecommended,
              isGosendeet,
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
          });
        })()}

        {hasNextPage && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore || isFetchingQuotes}
            className="sticky bottom-0 z-20 shrink-0 w-full flex items-center justify-center gap-3 rounded-2xl border border-[#D1D5DB] bg-white py-4 text-sm font-semibold text-green100 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoadingMore || isFetchingQuotes
              ? "Loading more options..."
              : "Show more options"}
            <ChevronDown size={18} />
          </button>
        )}
      </div>
    )}
  </div>
);

export default CompareQuoteList;
