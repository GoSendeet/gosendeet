import { TriangleAlert, XCircle } from "lucide-react";

type FlagType = "ON HOLD" | "PENALTY" | "WARNING";

export type FlaggedDelivery = {
  id: string;
  trackingId: string;
  flag: FlagType;
  reason: string;
  date: string;
};

const MOCK_FLAGGED_DELIVERIES: FlaggedDelivery[] = [
  {
    id: "f1",
    trackingId: "GS-LMN222",
    flag: "ON HOLD",
    reason: "Low customer rating (2/5)",
    date: "Feb 26, 2026",
  },
  {
    id: "f2",
    trackingId: "GS-QRS444",
    flag: "PENALTY",
    reason: "Late delivery (45 min past window)",
    date: "Feb 20, 2026",
  },
];

const flagStyles: Record<
  FlagType,
  { pill: string; border: string; bg: string }
> = {
  "ON HOLD": {
    pill: "bg-amber-100 text-amber-600",
    border: "border-red-100",
    bg: "bg-red-50/60",
  },
  PENALTY: {
    pill: "bg-red-100 text-red-600",
    border: "border-red-100",
    bg: "bg-red-50/60",
  },
  WARNING: {
    pill: "bg-orange-100 text-orange-600",
    border: "border-orange-100",
    bg: "bg-orange-50/60",
  },
};

type Props = {
    data?: FlaggedDelivery[];
}

const FlaggedDeliveries = ({ data = MOCK_FLAGGED_DELIVERIES }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-100">
        <TriangleAlert size={15} className="text-amber-500" />
        <h2 className="text-sm font-bold text-gray-800">Flagged Deliveries</h2>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {data.map((item) => {
          const f = flagStyles[item.flag];
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-xl border p-3.5 ${f.bg} ${f.border}`}
            >
              <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 text-sm tracking-wide">
                    {item.trackingId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.pill}`}
                  >
                    {item.flag}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.reason}</p>
                <p className="text-[11px] text-gray-400">{item.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlaggedDeliveries;
