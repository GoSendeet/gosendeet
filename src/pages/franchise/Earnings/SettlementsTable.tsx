import { Eye, Download, AlertCircle, FileText, ReceiptText } from "lucide-react";

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

const statusStyles: Record<SettlementStatus, string> = {
  Draft:              "bg-gray-100 text-gray-500 border border-gray-200",
  "Pending Approval": "bg-amber-50 text-amber-600 border border-amber-200",
  Paid:               "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

// Dispute button only shows for non-Draft rows
const showDispute = (status: SettlementStatus) => status !== "Draft";


type Props = {
  data?: Settlement[];
  isLoading?: boolean;
  onView?: (settlement: Settlement) => void;
  onDownload?: (settlement: Settlement) => void;
  onDispute?: (settlement: Settlement) => void;
  actionPending?: boolean;
};


// ─── Mobile Card ──────────

const SettlementCard = ({
  row,
  onView,
  onDownload,
  onDispute,
  actionPending,
}: {
  row: Settlement;
  onView?: (settlement: Settlement) => void;
  onDownload?: (settlement: Settlement) => void;
  onDispute?: (settlement: Settlement) => void;
  actionPending?: boolean;
}) => (
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
      <button
        disabled={actionPending}
        onClick={() => onView?.(row)}
        className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <FileText size={13} />
        View PDF
      </button>
      <button
        disabled={actionPending}
        onClick={() => onDownload?.(row)}
        className="flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <Download size={13} />
        Download
      </button>
      {showDispute(row.status) && (
        <button
          disabled={actionPending}
          onClick={() => onDispute?.(row)}
          className="flex items-center justify-center gap-1.5 border border-amber-300 rounded-xl py-2.5 text-xs font-medium text-amber-500 hover:bg-amber-50 transition-colors disabled:opacity-60"
        >
          <AlertCircle size={13} />
          Dispute
        </button>
      )}
    </div>
  </div>
);

const SettlementsTable = ({
  data = [],
  isLoading = false,
  onView,
  onDownload,
  onDispute,
  actionPending = false,
}: Props) => {
  if (isLoading) {
    return (
      <div className="px-4 py-12 text-sm text-gray-400 text-center">
        Loading settlements...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <ReceiptText size={28} className="text-gray-200" />
        <p className="text-sm text-gray-400">No settlements yet</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile: cards (hidden on md+) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row) => (
          <SettlementCard
            key={row.id}
            row={row}
            onView={onView}
            onDownload={onDownload}
            onDispute={onDispute}
            actionPending={actionPending}
          />
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
                    <button
                      disabled={actionPending}
                      onClick={() => onView?.(row)}
                      className="hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-60"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      disabled={actionPending}
                      onClick={() => onDownload?.(row)}
                      className="hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-60"
                      title="Download"
                    >
                      <Download size={15} />
                    </button>
                    {row.status !== "Draft" && (
                      <button
                        disabled={actionPending}
                        onClick={() => onDispute?.(row)}
                        className="hover:text-amber-500 p-1 rounded hover:bg-amber-50 transition-colors text-amber-400 disabled:opacity-60"
                        title="Dispute"
                      >
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
