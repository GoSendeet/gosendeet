import { Locate, MapPin, MoveRight, SlidersHorizontal } from "lucide-react";
import { FiPackage } from "react-icons/fi";

interface CompareResultsHeaderProps {
  bookingRequest: any;
  copyUrl: () => void;
  filteredCount: number;
  isEmbedded: boolean;
  onBack?: () => void;
  packageSummary: string;
  routeDropOffState: string;
  routePickupState: string;
  shareLoading: boolean;
  shareUrl: string | null;
  handleShare: () => void;
  showActions: boolean;
  toggleMobileFilterBtn: (show: boolean) => void;
}

const CompareResultsHeader = ({
  bookingRequest,
  filteredCount,
  isEmbedded,
  onBack,
  packageSummary,
  routeDropOffState,
  routePickupState,
  showActions,
  toggleMobileFilterBtn,
}: CompareResultsHeaderProps) => {
  if (isEmbedded) {
    return (
      <div className="mb-5 space-y-4 font-arial">
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-3.5 md:p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="text-xs md:text-sm font-bold text-brand tracking-wider">
              Quote result for
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-[#F8FAFC] px-2 py-2.5 md:py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-brand">
                <Locate size={11} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] tracking-wider text-[#64748B]">
                  Pickup
                </p>
                <p className="mt-0.5 text-xs md:text-sm font-bold text-[#0F172A] truncate">
                  {routePickupState || "Not specified"}
                </p>
              </div>
            </div>
            <span className="text-[#64748B]">
              <MoveRight size={14} />
            </span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-brand">
                <MapPin size={11} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] tracking-wider text-[#64748B]">
                  Delivery
                </p>
                <p className="mt-0.5 text-xs md:text-sm font-bold text-[#0F172A] truncate">
                  {routeDropOffState || "Not specified"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-2xl bg-[#F0FDF4] px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-semibold text-[#064E3B]">
              <FiPackage className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
              <span className="min-w-0 truncate">
                {packageSummary || "1 package"}
              </span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="hidden md:flex h-8 max-w-full px-3 items-center justify-center gap-2 rounded-md border border-brand-color bg-white text-sm font-bold text-brand shadow-sm transition hover:border-brand"
            >
              Edit Quote
            </button>
          </div>
        </div>

        {showActions && (
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => toggleMobileFilterBtn(true)}
              className="flex h-10 md:h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white text-xs md:text-sm font-bold text-brand shadow-sm transition hover:border-brand"
            >
              <SlidersHorizontal size={16} />
              Filter & Sort
            </button>
          </div>
        )}

        <div className="hidden xl:block">
          <p className="text-sm text-[#475569]">
            <span className="font-bold text-[#0F172A]">{filteredCount}</span>{" "}
            available quote{filteredCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-0 lg:mb-6">
      <div className="flex flex-col px-3 md:px-6 space-y-1.5 lg:space-y-0 lg:flex-row items-start lg:items-center justify-between mb-1">
          {(bookingRequest?.pickupLocation || bookingRequest?.dropOffLocation) && (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-[10px] md:text-xs font-semibold text-brand bg-brabd-light2 rounded px-1.5 py-0.5 md:px-2 md:py-1">
                ROUTE
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-900 text-xs md:text-sm lg:text-lg">
                  {routePickupState}
                </span>
                <span className="mx-1.5 md:mx-3 text-gray150">→</span>
                <span className="font-semibold text-gray-900 text-xs md:text-sm lg:text-lg">
                  {routeDropOffState}
                </span>
              </div>
            </div>
          )}
          <p className="text-xs md:text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCount}</span>{" "}
            option{filteredCount !== 1 ? "s" : ""}
          </p>
      </div>
    </div>
  );
};

export default CompareResultsHeader;
