import * as React from "react";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import "react-day-picker/style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DateRangePicker({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}) {
  const [range, setRange] = React.useState<DateRange | undefined>(value);

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);
    onChange?.(selected);
  };

  const displayLabel = range?.from
    ? range.to
      ? `${format(range.from, "MMM d, yyyy")} - ${format(
          range.to,
          "MMM d, yyyy"
        )}`
      : format(range.from, "MMM d, yyyy")
    : "Select date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"ghost"}
          className={cn(
            "justify-start text-left font-normal border-2 px-3 py-2 min-w-[200px] max-w-[350px]",
            !range?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className=" h-4 w-4" />
          <span className="text-sm text-neutral500">{displayLabel}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-4 w-full">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          pagedNavigation
          disabled={{ after: new Date() }} // disables all dates after today
          className="text-sm" // smaller text
          styles={{
            day: {
              fontSize: "0.75rem", // smaller text
            },
          }}
          classNames={{
            // remove default blue; apply brand palette
            selected: "bg-brand text-brand",
            range_start: "bg-brand text-white rounded-full",
            range_end: "bg-brand text-white rounded-full",
            range_middle: "bg-brand-light text-brand",
            today: "text-brand",
            caption: "text-brand font-semibold",
            caption_label: "text-brand",
            // add more overrides here
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
