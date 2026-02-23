import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";

interface PickupDateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (date: string) => void;
}

export function PickupDateModal({
  open,
  onOpenChange,
  value,
  onSelect,
}: PickupDateModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10am-2pm");

  useEffect(() => {
    if (open && value) {
      // Parse existing value if it contains a time slot
      const parts = value.split(' ');
      if (parts.length >= 2) {
        setSelectedDate(parts[0]);
        // Check if the time slot matches our options
        const timeSlot = parts.slice(1).join(' ');
        if (timeSlot === "10am-2pm" || timeSlot === "2pm-6pm") {
          setSelectedTimeSlot(timeSlot);
        }
      } else {
        setSelectedDate(value);
      }
    }
  }, [open, value]);

  // Generate next 3 days (today, tomorrow, day after)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getDayLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const diffTime = compareDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return "";
  };

  const timeSlots = ["10am-2pm", "2pm-6pm"];

  const handleConfirm = () => {
    if (selectedDate) {
      const fullDateTime = `${selectedDate} ${selectedTimeSlot}`;
      onSelect(fullDateTime);
      onOpenChange(false);
    }
  };

  // Centralized focus border color for all inputs
  const INPUT_FOCUS_BORDER = "focus:border-[#0A4F32]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogTitle className="text-lg font-clash font-bold text-gray-900">
          Pickup
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Choose when you want your package to be picked up
        </DialogDescription>

        <div className="space-y-4 mt-3">
          {/* Date Selection - 3 cards */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FiCalendar className="w-3.5 h-3.5" />
              Select Date
            </p>
            <div className="grid grid-cols-3 gap-2">
              {dates.map((date) => {
                const dateStr = formatDate(date);
                const isSelected = selectedDate === dateStr;
                const dayLabel = getDayLabel(date);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-center",
                      isSelected
                        ? `${INPUT_FOCUS_BORDER} bg-[#ECFDF5] border-[#0A4F32]`
                        : "border-gray-200 hover:border-[#0A4F32] hover:bg-[#ECFDF5]"
                    )}
                  >
                    {dayLabel && (
                      <div className={cn(
                        "text-xs font-bold mb-1",
                        isSelected ? "text-[#0A4F32]" : "text-gray-500"
                      )}>
                        {dayLabel}
                      </div>
                    )}
                    <div className={cn(
                      "text-xs font-medium mb-0.5",
                      isSelected ? "text-[#0A4F32]" : "text-gray-500"
                    )}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={cn(
                      "text-lg font-bold",
                      isSelected ? "text-[#0A4F32]" : "text-gray-900"
                    )}>
                      {date.getDate()}
                    </div>
                    <div className={cn(
                      "text-xs",
                      isSelected ? "text-[#0A4F32]" : "text-gray-500"
                    )}>
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FiClock className="w-3.5 h-3.5" />
                Select Time
              </p>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(time)}
                    className={cn(
                      "py-3 px-4 rounded-xl border-2 transition-all font-semibold text-sm",
                      selectedTimeSlot === time
                        ? `${INPUT_FOCUS_BORDER} bg-[#ECFDF5] text-[#0A4F32] border-[#0A4F32]`
                        : "border-gray-200 hover:border-[#0A4F32] hover:bg-[#ECFDF5] text-gray-700"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Summary */}
          {selectedDate && (
            <div className="p-3 bg-[#ECFDF5] border border-[#0A4F32] rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0A4F32] mb-1">
                <FiCalendar className="w-3.5 h-3.5" />
                Selected Pickup
              </div>
              <p className="text-gray-900 font-bold text-base">
                {formatDisplayDate(new Date(selectedDate))} • {selectedTimeSlot}
              </p>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            type="button"
            onClick={handleConfirm}
            variant="secondary"
            size="custom"
            className="w-full py-2.5 text-sm font-bold"
            disabled={!selectedDate}
          >
            Confirm Pickup
          </Button>
        </div>

        {/* Help Text */}
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
          <FiCalendar className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p>Select your preferred pickup date and time window.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
