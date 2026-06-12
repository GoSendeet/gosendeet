import { cn } from "@/lib/utils";
import { Copy, Locate, MapPin, MoveRight, Share2, SlidersHorizontal } from "lucide-react";
import { FiPackage } from "react-icons/fi";

const tabs = [
  ["recommended", "Recommended", "price-asc"],
  ["cheapest", "Cheapest", "price-asc"],
  ["fastest", "Fastest", "delivery-fastest"],
];

interface CompareResultsHeaderProps {
  activeTab: string;
  bookingRequest: any;
  copyUrl: () => void;
  filteredCount: number;
  isEmbedded: boolean;
  onBack?: () => void;
  packageSummary: string;
  routeDropOffState: string;
  routePickupState: string;
  setActiveTab: (tab: string) => void;
  setSortBy: (sort: string) => void;
  shareLoading: boolean;
  shareUrl: string | null;
  handleShare: () => void;
  showActions: boolean;
  toggleMobileFilterBtn: (show: boolean) => void;
}

const CompareTabs = ({
  activeTab,
  embedded,
  setActiveTab,
  setSortBy,
}: {
  activeTab: string;
  embedded?: boolean;
  setActiveTab: (tab: string) => void;
  setSortBy: (sort: string) => void;
}) => (
  <div
    className={
      embedded
        ? "mt-4 flex items-center justify-between rounded-2xl bg-[#F3F4F6] p-1"
        : "flex items-center justify-between mb-6 bg-[#F3F4F6CC] px-2 py-1 rounded-md mt-2 lg:mt-0"
    }
  >
    {tabs.map(([key, label, sort]) => (
      <button
        key={key}
        type="button"
        onClick={() => {
          setActiveTab(key);
          setSortBy(sort);
        }}
        className={cn(
          embedded
            ? "h-11 flex-1 rounded-xl px-2 text-sm font-bold transition-all"
            : "md:px-6 px-3 py-2.5 md:font-bold font-medium text-sm rounded-md transition-all",
          activeTab === key
            ? embedded
              ? "bg-white text-brand shadow-sm ring-1 ring-[#E2E8F0]"
              : "bg-white border border-gray-200 text-green100 shadow-sm"
            : embedded
              ? "text-[#64748B] hover:text-[#0F172A]"
              : "text-gray-500 hover:text-gray-700",
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

const CompareResultsHeader = ({
  activeTab,
  bookingRequest,
  copyUrl,
  filteredCount,
  isEmbedded,
  onBack,
  packageSummary,
  routeDropOffState,
  routePickupState,
  setActiveTab,
  setSortBy,
  shareLoading,
  shareUrl,
  handleShare,
  showActions,
  toggleMobileFilterBtn,
}: CompareResultsHeaderProps) => {
  if (isEmbedded) {
    return (
      <div className="mb-5 space-y-4 font-arial">
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="text-md font-bold text-brand tracking-wider">
              Your route
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-[#F8FAFC] px-2 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-brand">
                <Locate size={12} />
              </div>
              <div>
                <p className="text-[11px] tracking-wider text-[#64748B]">
                  Pickup
                </p>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">
                  {routePickupState || "Not specified"}
                </p>
              </div>
            </div>
            <span className="text-[#64748B]">
              <MoveRight size={16} />
            </span>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-brand">
                <MapPin size={12} />
              </div>
              <div>
                <p className="text-[11px] tracking-wider text-[#64748B]">
                  Delivery
                </p>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">
                  {routeDropOffState || "Not specified"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className=" flex items-center gap-2 rounded-2xl bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#064E3B]">
              <FiPackage className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate">
                {packageSummary || "1 package"}
              </span>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 max-w-full px-3 items-center justify-center gap-2 rounded-md border border-brand-color bg-white text-sm font-bold text-brand shadow-sm transition hover:border-brand"
            >
              Edit Details
            </button>
          </div>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toggleMobileFilterBtn(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white text-sm font-bold text-brand shadow-sm transition hover:border-brand"
            >
              <SlidersHorizontal size={18} />
              Filter & Sort
            </button>
            <button
              type="button"
              disabled={shareLoading}
              onClick={shareUrl ? copyUrl : handleShare}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#064E3B] text-sm font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {shareUrl ? <Copy size={18} /> : <Share2 size={18} />}
              {shareUrl ? "Copy Link" : "Share Quote"}
            </button>
          </div>
        )}

        <div>
          <p className="text-sm text-[#475569]">
            <span className="font-bold text-[#0F172A]">{filteredCount}</span>{" "}
            available quote{filteredCount !== 1 ? "s" : ""}
          </p>
          <CompareTabs
            activeTab={activeTab}
            embedded
            setActiveTab={setActiveTab}
            setSortBy={setSortBy}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1 lg:mb-6">
      <div className="flex items-center justify-end gap-2 mb-2">
        {/* <Button
          className="w-fit bg-brand hover:bg-green-800"
          loading={shareLoading}
          onClick={shareUrl ? copyUrl : handleShare}
        > */}
          {/* {shareUrl ? <Copy size={16} /> : <Share2 size={16} />} */}
          {/* <span className="ml-2">{shareUrl ? "Copy Link" : "Share Quote"}</span>
        </Button> */}
      </div>
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row items-start lg:items-center justify-between mb-1">
        <div>
          {(bookingRequest?.pickupLocation || bookingRequest?.dropOffLocation) && (
            <div className="flex items-center gap-4 mb-1 ">
              <div className="text-xs font-semibold text-brand bg-brabd-light2 rounded px-2 py-1">
                ROUTE
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-sm md:text-lg">
                  {routePickupState}
                </span>
                <span className="mx-3 text-gray150">→</span>
                <span className="font-semibold text-gray-900 text-sm md:text-lg">
                  {routeDropOffState}
                </span>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCount}</span>{" "}
            option{filteredCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="w-full lg:w-fit">
          <CompareTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSortBy={setSortBy}
          />
        </div>
      </div>
    </div>
  );
};

export default CompareResultsHeader;
