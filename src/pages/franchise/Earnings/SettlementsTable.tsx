import { Eye, Download, AlertCircle, FileText } from "lucide-react";

export type SettlementStatus = "Draft" | "Pending Approval" | "Paid";

export type Settlement = {
  id: string;
  period: string;
  dateRange: string;
  deliveries: number;
  gross: string;
  adjustments: string;
  netPayout: string;
  status: SettlementStatus;
};

// TODO: i will remove once backend is connected
const MOCK_SETTLEMENTS: Settlement[] = [
  { id: "s1", period: "Week 9", dateRange: "Feb 24 – Feb 28, 2026", deliveries: 18, gross: "₦86,400",  adjustments: "-₦2,500", netPayout: "₦83,900",  status: "Draft" },
  { id: "s2", period: "Week 8", dateRange: "Feb 17 – Feb 23, 2026", deliveries: 22, gross: "₦105,600", adjustments: "-₦1,800", netPayout: "₦103,800", status: "Pending Approval" },
  { id: "s3", period: "Week 7", dateRange: "Feb 10 – Feb 16, 2026", deliveries: 20, gross: "₦96,000",  adjustments: "-₦3,200", netPayout: "₦92,800",  status: "Paid" },
  { id: "s4", period: "Week 6", dateRange: "Feb 3 – Feb 9, 2026",   deliveries: 19, gross: "₦91,200",  adjustments: "-₦1,500", netPayout: "₦89,700",  status: "Paid" },
  { id: "s5", period: "Week 5", dateRange: "Jan 27 – Feb 2, 2026",  deliveries: 21, gross: "₦100,800", adjustments: "-₦2,100", netPayout: "₦98,700",  status: "Paid" },
];

const statusStyles: Record<SettlementStatus, string> = {
  Draft:              "bg-gray-100 text-gray-500 border border-gray-200",
  "Pending Approval": "bg-amber-50 text-amber-600 border border-amber-200",
  Paid:               "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

// Dispute button only shows for non-Draft rows
const showDispute = (status: SettlementStatus) => status !== "Draft";


type Props = {
  data?: Settlement[];
};


// ─── Mobile Card ──────────

const SettlementCard = ({ row }: { row: Settlement }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4">
    {/* Header: period + status */}
    <div className="flex items-start justify-between">
      <div>
        <p className="font-bold text-gray-800 text-sm">{row.period}</p>
        <p className="text-xs text-gray-400 mt-0.5">{row.dateRange}</p>
      </div>
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[row.status]}`}>
        {row.status}
      </span>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-2">
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Deliveries</p>
        <p className="text-sm font-bold text-gray-800">{row.deliveries}</p>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Gross</p>
        <p className="text-sm font-bold text-gray-800">{row.gross}</p>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Net Payout</p>
        <p className="text-sm font-bold text-emerald-600">{row.netPayout}</p>
      </div>
    </div>

    {/* Action buttons */}
    <div className={`grid gap-2 ${showDispute(row.status) ? "grid-cols-3" : "grid-cols-2"}`}>
      <button className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
        <FileText size={13} />
        View PDF
      </button>
      <button className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
        <Download size={13} />
        Download
      </button>
      {showDispute(row.status) && (
        <button className="flex items-center justify-center gap-1.5 border border-amber-300 rounded-xl py-2.5 text-xs font-medium text-amber-500 hover:bg-amber-50 transition-colors">
          <AlertCircle size={13} />
          Dispute
        </button>
      )}
    </div>
  </div>
);

const SettlementsTable = ({ data = MOCK_SETTLEMENTS }: Props) => {
  return (
    <>
      {/* ── Mobile: cards (hidden on md+) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row) => (
          <SettlementCard key={row.id} row={row} />
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Period", "Deliveries", "Gross", "Adjustments", "Net Payout", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-800 text-sm">{row.period}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{row.dateRange}</p>
                </td>
                <td className="px-4 py-4 text-gray-700 font-medium">{row.deliveries}</td>
                <td className="px-4 py-4 text-gray-700 font-medium">{row.gross}</td>
                <td className="px-4 py-4 font-medium text-red-500">{row.adjustments}</td>
                <td className="px-4 py-4 font-bold text-gray-800">{row.netPayout}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyles[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <button className="hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" title="View">
                      <Eye size={15} />
                    </button>
                    <button className="hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" title="Download">
                      <Download size={15} />
                    </button>
                    {row.status !== "Draft" && (
                      <button className="hover:text-amber-500 p-1 rounded hover:bg-amber-50 transition-colors text-amber-400" title="Info">
                        <AlertCircle size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SettlementsTable;
