import { ReceiptText } from "lucide-react";

export type Transaction = {
  id: string;
  trackingId: string;
  customerPaid: string;
  yourFee: string;
  commission: string;
  date: string;
};

type Props = {
  data?: Transaction[];
  isLoading?: boolean;
};

const TransactionsTable = ({ data = [], isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="px-4 py-12 text-sm text-gray-400 text-center">
        Loading transactions...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <ReceiptText size={28} className="text-gray-200" />
        <p className="text-sm text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Tracking ID", "Customer Paid", "Your Fee", "Commission", "Date"].map((h) => (
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
                <span className="font-semibold text-emerald-500 tracking-wide hover:text-emerald-600 cursor-pointer transition-colors">
                  {row.trackingId}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-700 font-medium">{row.customerPaid}</td>
              <td className="px-4 py-4 font-bold text-gray-800">{row.yourFee}</td>
              <td className="px-4 py-4 font-medium text-red-500">{row.commission}</td>
              <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
