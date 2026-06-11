import { Button } from "@/components/ui/button";
import CurrencyFormatter from "@/components/CurrencyFormatter";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/gosendeet-black-logo.png";
import { FiPackage } from "react-icons/fi";
import { Copy, MapPin, Share2, Shield } from "lucide-react";
import { parsePrice } from "../quoteUtils";

interface DirectQuotePanelProps {
  bookingRequest: any;
  copyUrl: () => void;
  handleClick: (selectedQuote: any) => void;
  handleShare: () => void;
  quoteContent: any[];
  quoteDetailsRef: React.RefObject<HTMLDivElement | null>;
  selectedDirectQuoteIndex: number;
  setSelectedDirectQuoteIndex: (index: number) => void;
  shareLoading: boolean;
  shareUrl: string | null;
}

const DirectQuotePanel = ({
  bookingRequest,
  copyUrl,
  handleClick,
  handleShare,
  quoteContent,
  quoteDetailsRef,
  selectedDirectQuoteIndex,
  setSelectedDirectQuoteIndex,
  shareLoading,
  shareUrl,
}: DirectQuotePanelProps) => (
  <div ref={quoteDetailsRef} className="max-w-3xl mx-auto my-8">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
      <div className="flex items-center gap-6 mb-4">
        <img src={logo} alt="logo" className="h-8 md:h-10 lg:h-12 w-auto" />
        <h1 className=" font-semibold text-xl text-brand">Direct Quote</h1>
      </div>
      <Button
        className="w-fit bg-brand mb-4"
        loading={shareLoading}
        onClick={shareUrl ? copyUrl : handleShare}
      >
        {shareUrl ? <Copy /> : <Share2 />}
        {shareUrl ? "Copy Link" : "Share Quote"}
      </Button>
    </div>

    {quoteContent.length > 1 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {quoteContent.map((quote: any, idx: number) => {
          const sla = quote?.serviceLevelAgreements?.[0] ?? `Option ${idx + 1}`;
          const pudo =
            quote?.pudoMode === "STORE_DROPOFF"
              ? "Store Drop-off"
              : "Doorstep Pickup";
          const isSelected = selectedDirectQuoteIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDirectQuoteIndex(idx)}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
                isSelected
                  ? "border-brand bg-brand text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand",
              )}
            >
              <span>{sla}</span>
              <p
                className={cn(
                  "text-xs mt-0.5 font-normal",
                  isSelected ? "text-white/80" : "text-gray-400",
                )}
              >
                {pudo}
              </p>
              <p
                className={cn(
                  "text-xs mt-0.5 font-normal",
                  isSelected ? "text-white/80" : "text-gray-400",
                )}
              >
                ₦{CurrencyFormatter(parsePrice(quote?.price).toFixed(2))}
              </p>
            </button>
          );
        })}
      </div>
    )}

    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="px-4 lg:px-5 py-6 space-y-6">
        <div>
          <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-brand" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="text-brand shrink-0" size={20} />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    From
                  </p>
                  <p className="text-sm lg:text-base font-medium text-[#1a1a1a]">
                    {bookingRequest?.pickupLocation || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="text-brand shrink-0" size={20} />
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    To
                  </p>
                  <p className="text-sm lg:text-base font-medium text-[#1a1a1a]">
                    {bookingRequest?.dropOffLocation || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-brand-light rounded-xl border border-brand-light">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Estimated Delivery Date
            </p>
            <p className="text-lg font-bold text-[#1a1a1a]">
              {quoteContent[selectedDirectQuoteIndex]?.estimatedDeliveryDate}
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
            {quoteContent[selectedDirectQuoteIndex]?.pickupOptions?.[0]}
          </span>
        </div>

        <div className="space-y-3">
          {(() => {
            const selectedQuote = quoteContent[selectedDirectQuoteIndex];
            const discountedPrice = parsePrice(selectedQuote?.price);
            const discountPct = selectedQuote?.discount ?? 0;
            const originalPrice =
              discountPct > 0
                ? discountedPrice / (1 - discountPct / 100)
                : discountedPrice;
            const savings = originalPrice - discountedPrice;
            const serviceCharge =
              selectedQuote?.serviceCharge ?? discountedPrice * 0.005;
            const total = discountedPrice + serviceCharge;
            return (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">
                    Delivery Fee{discountPct > 0 ? " (before discount)" : ""}
                  </span>
                  <span
                    className={
                      discountPct > 0
                        ? "text-gray-400 line-through font-medium"
                        : "text-[#1a1a1a] font-bold"
                    }
                  >
                    ₦{CurrencyFormatter(originalPrice.toFixed(2))}
                  </span>
                </div>
                {discountPct > 0 && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-emerald-600 font-medium">
                        Discount ({discountPct}%)
                        {selectedQuote?.discountDescription && (
                          <span className="block text-xs text-gray-400 font-normal">
                            {selectedQuote.discountDescription}
                          </span>
                        )}
                      </span>
                      <span className="text-emerald-600 font-bold">
                        -₦{CurrencyFormatter(savings.toFixed(2))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700 font-medium">
                        Delivery Fee (after discount)
                      </span>
                      <span className="text-[#1a1a1a] font-bold">
                        ₦{CurrencyFormatter(discountedPrice.toFixed(2))}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Service Charge</span>
                  <span className="text-[#1a1a1a] font-bold">
                    ₦{CurrencyFormatter(parsePrice(serviceCharge).toFixed(2))}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Total Cost</span>
                  <span className="text-brand font-bold">
                    ₦{CurrencyFormatter(total.toFixed(2))}
                  </span>
                </div>
              </>
            );
          })()}
        </div>

        <Button
          onClick={() => {
            const quoteItem = quoteContent[selectedDirectQuoteIndex];
            handleClick(quoteItem);
          }}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-base",
            "bg-brand hover:bg-[#1a1a1a]",
            "text-white transition-all duration-300",
            "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]",
          )}
        >
          Book Now
        </Button>

        <div className="p-4 bg-brand-light rounded-xl border border-brand">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-brand" />
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
);

export default DirectQuotePanel;
