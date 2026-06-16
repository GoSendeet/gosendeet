import { CSSProperties, ReactNode } from "react";

import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/utils";

export type AdminDataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
};

type AdminDataTableProps<T> = {
  rows: T[];
  columns: AdminDataTableColumn<T>[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
};

export function AdminDataTable<T>({
  rows,
  columns,
  getRowKey,
  isLoading = false,
  isError = false,
  emptyMessage = "No records match the current filters.",
  errorMessage = "We couldn't load this data right now.",
}: AdminDataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {isLoading ? (
        <div className="flex justify-center p-10">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="p-10 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-sm text-neutral500">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div
            className="hidden gap-4 border-b border-neutral200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral500 lg:grid lg:[grid-template-columns:var(--admin-table-columns)]"
            style={{
              "--admin-table-columns": columns
                .map((column) => column.className || "1fr")
                .join(" "),
            } as CSSProperties}
          >
            {columns.map((column) => (
              <div key={column.key}>{column.header}</div>
            ))}
          </div>

          <div className="divide-y divide-neutral200">
            {rows.map((row) => (
              <div
                key={getRowKey(row)}
                className="grid gap-4 px-6 py-5 lg:items-center lg:[grid-template-columns:var(--admin-table-columns)]"
                style={{
                  "--admin-table-columns": columns
                    .map((column) => column.className || "1fr")
                    .join(" "),
                } as CSSProperties}
              >
                {columns.map((column) => (
                  <div key={column.key} className={cn("min-w-0")}>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral500 lg:hidden">
                      {column.header}
                    </p>
                    {column.render(row)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
