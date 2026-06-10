import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";
import { FiPackage } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface PackageFieldCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  packageName: string;
  weight: string;
  weightUnit?: string;
  labelClassName: string;
  packageError?: FieldError;
  weightError?: FieldError;
}

export const PackageFieldCard = forwardRef<
  HTMLButtonElement,
  PackageFieldCardProps
>(
  (
    {
      packageName,
      weight,
      weightUnit,
      className,
      labelClassName,
      packageError,
      weightError,
      type = "button",
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(className, "text-left")}
        {...buttonProps}
      >
        <label
          className={cn(labelClassName, "flex items-center justify-between gap-2")}
        >
          <p className="lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
            Package
          </p>

          <span className="h-2 w-2 rounded-full bg-brand" />
        </label>
        <div className="w-full flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] text-brand">
            <FiPackage size={18} />
          </span>
          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
            {packageName ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-[#1a1a1a]">
                  {packageName}
                </span>
                {weight && (
                  <span className="block truncate text-xs text-[#64748B]">
                    {weight}
                    {weightUnit || "kg"}
                  </span>
                )}
              </span>
            ) : (
              <span className="min-w-0 truncate font-arial text-sm text-[#9ca3af]">
                Select package
              </span>
            )}
            <FaAngleDown size={18} className="shrink-0 text-[#CAD5E2]" />
          </span>
        </div>

        {(packageError || weightError) && (
          <p className="text-xs text-red-500 mt-1">
            {packageError?.message || weightError?.message}
          </p>
        )}
      </button>
    );
  },
);

PackageFieldCard.displayName = "PackageFieldCard";
