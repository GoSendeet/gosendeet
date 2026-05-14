import React from "react";
import { Star, TriangleAlert, CircleCheck } from "lucide-react";

type WeekStatus = "Good" | "Below Target" | "At Risk";

export type WeeklyTrendRow = {
  id: string;
  week: string;
  onTimePercent: number;
  rating: number;
  status: WeekStatus;
};

const weekStatusStyles: Record<
  WeekStatus,
  { text: string; bg: string, icon: React.ReactNode }
> = {
  Good: {
    text: "text-emerald-500",
    icon: <CircleCheck size={13} className="text-emerald-500" />,
    bg: "bg-emerald-50 text-emerald-600 w-fit px-2 py-1 rounded-full",
  },
  "Below Target": {
    text: "text-amber-500",
    icon: <TriangleAlert size={13} className="text-amber-500" />,
    bg: "bg-amber-50 text-amber-600 w-fit px-2 py-1 rounded-full",
  },
  "At Risk": {
    text: "text-red-500",
    icon: <TriangleAlert size={13} className="text-red-500" />,
    bg: "bg-red-100 text-red-600 w-fit px-2 py-1 rounded-full",
  },
};

const StarIcon = () => (
  <Star size={13} className="text-amber-400 fill-amber-400 shrink-0" />
);

type Props = {
    data?: WeeklyTrendRow[];
    isLoading?: boolean;
}

const WeeklyTrendTable = ({ data = [], isLoading = false }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-sm font-bold text-gray-800">Weekly Trend</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-b border-gray-100">
              {["Week", "On-Time %", "Rating", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                  Loading weekly trend...
                </td>
              </tr>
            )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                  No trend data yet
                </td>
              </tr>
            )}

            {data.map((row) => {
              const s = weekStatusStyles[row.status];
              return (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-gray-700 text-sm">
                    {row.week}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-500">
                    {row.onTimePercent}%
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <StarIcon />
                      <span className="font-medium text-gray-700">
                        {row.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div
                      className={`flex items-center gap-1.5 font-medium text-sm ${s.text} ${s.bg}`}
                    >
                      {s.icon}
                      {row.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-50">
        {isLoading && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            Loading weekly trend...
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            No trend data yet
          </div>
        )}

        {data.map((row) => {
          const s = weekStatusStyles[row.status];
          return (
            <div
              key={row.id}
              className="px-5 py-3.5 flex items-center justify-between"
            >
              <span className="font-bold text-gray-700 w-10">{row.week}</span>
              <span className="font-bold text-emerald-500 text-sm">
                {row.onTimePercent}%
              </span>
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="text-sm font-medium text-gray-700">
                  {row.rating.toFixed(1)}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${s.text}`}
              >
                {s.icon}
                <span className="hidden xs:inline">{row.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyTrendTable;
