import { DateRange } from "react-day-picker";
import { X } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";

import { DateRangePicker } from "@/components/DateRangePicker.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrdersFiltersProps = {
  activeStatusLabel: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  packageTypeId: string;
  onPackageTypeChange: (value: string) => void;
  packages?: any[];
  range?: DateRange;
  onRangeChange: (range: DateRange | undefined) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export function OrdersFilters({
  activeStatusLabel,
  searchTerm,
  onSearchTermChange,
  packageTypeId,
  onPackageTypeChange,
  packages,
  range,
  onRangeChange,
  hasActiveFilters,
  onClearFilters,
}: OrdersFiltersProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
      <div>
        <p className="text-sm font-semibold text-brand">Order list</p>
        <p className="text-xs text-neutral500">
          Showing {activeStatusLabel.toLowerCase()} orders
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-[40px] items-center gap-2 rounded-lg border-2 px-2 py-2">
          <IoSearchOutline className="text-neutral500" />
          <input
            type="text"
            role="search"
            value={searchTerm}
            className="w-[150px] border-0 text-sm text-neutral600 outline-0"
            placeholder="Search order"
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </div>

        <Select
          value={packageTypeId || "all"}
          onValueChange={(value) =>
            onPackageTypeChange(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="h-[40px] min-w-[200px] max-w-[300px] rounded-lg border-2">
            <SelectValue placeholder="Package Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {packages?.map((item: any) => (
              <SelectItem value={item.id} key={item.id}>
                {item?.name} ({item?.maxWeight} {item?.weightUnit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker value={range} onChange={onRangeChange} />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex h-10 items-center gap-2 rounded-lg border border-brand/20 bg-brand-light px-3 text-sm font-semibold text-brand transition-colors hover:bg-[#DCFCE7]"
          >
            <X size={16} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
