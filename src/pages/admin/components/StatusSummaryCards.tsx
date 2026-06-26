import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatusSummaryCardItem<T extends string = string> = {
  key: T;
  title: string;
  count: number;
  icon: ReactNode;
};

type StatusSummaryCardsProps<T extends string = string> = {
  items: StatusSummaryCardItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
  activeLabel?: string;
  className?: string;
};

export function StatusSummaryCards<T extends string = string>({
  items,
  activeKey,
  onChange,
  activeLabel = "Filtering",
  className,
}: StatusSummaryCardsProps<T>) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-2xl bg-neutral200 p-3 md:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = activeKey === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all",
              "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
              isActive
                ? "border-brand bg-white shadow-sm"
                : "border-transparent hover:bg-white/70",
            )}
            aria-pressed={isActive}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-brand" : "text-neutral500",
                )}
              >
                {item.title}
              </p>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  isActive ? "bg-brand-light text-brand" : "bg-white text-neutral500",
                )}
              >
                {item.icon}
              </span>
            </div>
            <div className="flex items-end justify-between gap-3">
              <p className={cn("font-inter text-2xl font-semibold",
                isActive ? "text-brand" : "text-neutral500",
              )}>
                {item.count}
              </p>
              {isActive && (
                <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">
                  {activeLabel}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
