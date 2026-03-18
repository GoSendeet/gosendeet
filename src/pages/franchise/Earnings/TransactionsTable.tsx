export type Transaction = {
  id: string;
  trackingId: string;
  customerPaid: string;
  yourFee: string;
  commission: string;
  date: string;
};

// TODO: i will remove once backend is connected
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", trackingId: "GS-JKL012", customerPaid: "₦6,500",  yourFee: "₦3,200", commission: "-₦650",   date: "Feb 27, 2026" },
  { id: "t2", trackingId: "GS-MNO345", customerPaid: "₦11,000", yourFee: "₦5,500", commission: "-₦1,100", date: "Feb 27, 2026" },
  { id: "t3", trackingId: "GS-PQR678", customerPaid: "₦8,400",  yourFee: "₦4,200", commission: "-₦840",   date: "Feb 26, 2026" },
  { id: "t4", trackingId: "GS-ABC999", customerPaid: "₦7,200",  yourFee: "₦3,600", commission: "-₦720",   date: "Feb 25, 2026" },
  { id: "t5", trackingId: "GS-XYZ111", customerPaid: "₦9,600",  yourFee: "₦4,800", commission: "-₦960",   date: "Feb 25, 2026" },
];

type Props = {
  data?: Transaction[];
};

const TransactionsTable = ({ data = MOCK_TRANSACTIONS }: Props) => {
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
