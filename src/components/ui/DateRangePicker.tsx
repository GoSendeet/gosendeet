import { useState, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function formatDisplay(dateStr: string) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-");
  return `${d} ${MONTHS[parseInt(m) - 1].slice(0, 3)} ${y}`;
}

interface DateRangePickerProps {
  onRangeChange?: (from: string, to: string) => void;
}

export default function DateRangePicker({ onRangeChange }: DateRangePickerProps = {}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hovered, setHovered] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (dateStr: string) => {
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(dateStr);
      setToDate("");
    } else {
      if (dateStr < fromDate) { setFromDate(dateStr); setToDate(""); }
      else { setToDate(dateStr); setOpen(false); onRangeChange?.(fromDate, dateStr); }
    }
  };

  const isFrom = (d: string) => d === fromDate;
  const isTo = (d: string) => d === toDate;
  const inRange = (d: string) => {
    const end = toDate || hovered;
    if (!fromDate || !end) return false;
    const [lo, hi] = fromDate < end ? [fromDate, end] : [end, fromDate];
    return d > lo && d < hi;
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFromDate(""); setToDate(""); setHovered("");
    onRangeChange?.("", "");
  };

  const hasSelection = fromDate || toDate;
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium border transition-all duration-200 ${
          hasSelection
            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
            : "bg-gray-100 border-gray100 text-gray-500 hover:bg-gray-200 hover:border-gray-300"
        }`}
      >
        <Calendar size={15} className={hasSelection ? "text-emerald-500" : "text-gray-400"} />
        {hasSelection ? (
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-700 font-semibold">{formatDisplay(fromDate)}</span>
            {toDate && (
              <>
                <span className="text-emerald-400">→</span>
                <span className="text-emerald-700 font-semibold">{formatDisplay(toDate)}</span>
              </>
            )}
          </span>
        ) : (
          <span>Select date range</span>
        )}
        {hasSelection ? (
          <X size={13} className="text-emerald-400 hover:text-emerald-600 ml-1" onClick={clear} />
        ) : (
          <ChevronLeft
            size={13}
            className={`text-gray-400 transition-transform ${open ? "-rotate-90" : "rotate-[-90deg]"}`}
          />
        )}
      </button>

      {/* Dropdown Calendar */}
      {open && (
        <div
          className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl border border-gray-100 p-4 w-72"
          style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.10)" }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(viewYear, viewMonth, day);
              const from = isFrom(dateStr);
              const to = isTo(dateStr);
              const range = inRange(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={day}
                  className={`relative flex items-center justify-center
                    ${range ? "bg-emerald-50" : ""}
                    ${from && toDate ? "rounded-l-full" : ""}
                    ${to ? "rounded-r-full" : ""}
                  `}
                >
                  <button
                    onClick={() => handleDayClick(dateStr)}
                    onMouseEnter={() => !toDate && setHovered(dateStr)}
                    onMouseLeave={() => setHovered("")}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-150 relative z-10 ${
                      from || to
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                        : range
                        ? "text-emerald-700 hover:bg-emerald-100"
                        : isToday
                        ? "border border-emerald-400 text-emerald-600 hover:bg-emerald-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
            {!fromDate ? (
              "Select start date"
            ) : !toDate ? (
              "Now select end date"
            ) : (
              <span className="text-emerald-600 font-medium">
                {formatDisplay(fromDate)} → {formatDisplay(toDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
