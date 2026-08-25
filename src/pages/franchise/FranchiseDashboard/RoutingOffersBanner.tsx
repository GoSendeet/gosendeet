import { useState, useEffect } from "react";
import { MapPin, Clock, Package, CheckCircle, XCircle } from "lucide-react";
import { RoutingOffer } from "@/services/franchise";
import {
  useAcceptRoutingOffer,
  useDeclineRoutingOffer,
} from "@/queries/franchise/useFranchiseRoutingOffers";

const getSecondsLeft = (expiresAt: string) =>
  Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsLeft(expiresAt));

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft(getSecondsLeft(expiresAt)), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const pct = Math.min(100, (secondsLeft / 90) * 100);
  const isUrgent = secondsLeft <= 20;

  return (
    <div className="flex items-center gap-2 min-w-22.5">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke="#E5E7EB" strokeWidth="3" />
          <circle
            cx="16" cy="16" r="13"
            fill="none"
            stroke={isUrgent ? "#EF4444" : "#1fac53"}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${isUrgent ? "text-red-500" : "text-gray-700"}`}>
          {secondsLeft}s
        </span>
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: RoutingOffer }) {
  const acceptMutation = useAcceptRoutingOffer();
  const declineMutation = useDeclineRoutingOffer();
  const isExpired = new Date(offer.expiresAt).getTime() < Date.now();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-semibold text-brand bg-green-50 px-2 py-0.5 rounded-full mb-1">
            #{offer.trackingNumber}
          </span>
          <div className="flex items-start gap-1.5 text-sm text-gray-700 mt-1">
            <MapPin size={14} className="text-brand mt-0.5 shrink-0" />
            <span className="truncate">{offer.pickupLocation}</span>
          </div>
          <div className="flex items-start gap-1.5 text-sm text-gray-500 mt-1">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <span className="truncate">{offer.destination}</span>
          </div>
        </div>
        {!isExpired && <Countdown expiresAt={offer.expiresAt} />}
        {isExpired && (
          <span className="text-xs text-red-500 font-medium shrink-0">Expired</span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => acceptMutation.mutate(offer.id)}
          disabled={acceptMutation.isPending || declineMutation.isPending || isExpired}
          className="flex-1 flex items-center justify-center gap-1.5 bg-brand text-white text-sm font-medium py-2 rounded-xl disabled:opacity-50 cursor-pointer"
        >
          <CheckCircle size={15} />
          {acceptMutation.isPending ? "Accepting…" : "Accept"}
        </button>
        <button
          onClick={() => declineMutation.mutate({ offerId: offer.id })}
          disabled={acceptMutation.isPending || declineMutation.isPending || isExpired}
          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-xl disabled:opacity-50 cursor-pointer"
        >
          <XCircle size={15} />
          {declineMutation.isPending ? "Declining…" : "Decline"}
        </button>
      </div>
    </div>
  );
}

export default function RoutingOffersBanner({ offers }: { offers: RoutingOffer[] }) {
  if (!Array.isArray(offers) || offers.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-brand" />
        <h2 className="text-sm font-semibold text-gray-800">
          New Delivery Offers
        </h2>
        <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {offers.length}
        </span>
        <div className="flex items-center gap-1 ml-auto text-xs text-gray-400">
          <Clock size={12} />
          <span>Respond before they expire</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
