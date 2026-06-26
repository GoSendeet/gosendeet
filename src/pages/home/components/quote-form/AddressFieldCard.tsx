import { forwardRef } from "react";
import type { ComponentType, KeyboardEvent } from "react";
import type { FieldError } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface AddressFieldCardProps {
  id: string;
  label: string;
  mobileLabel?: string;
  value: string;
  placeholder: string;
  icon: ComponentType<{ size?: number }>;
  className?: string;
  labelClassName: string;
  isActive?: boolean;
  showCursorHint?: boolean;
  error?: FieldError;
  onActivate: () => void;
  onChange: (value: string) => void;
  onHideCursorHint: () => void;
}

export const AddressFieldCard = forwardRef<HTMLInputElement, AddressFieldCardProps>(
  (
    {
      id,
      label,
      mobileLabel,
      value,
      placeholder,
      icon: Icon,
      className,
      labelClassName,
      isActive,
      showCursorHint,
      error,
      onActivate,
      onChange,
      onHideCursorHint,
    },
    ref,
  ) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    };

    return (
      <div
        className={cn(className, isActive && "ring-2 ring-brand/40")}
        onClick={onActivate}
      >
        <label
          htmlFor={id}
          className={cn(labelClassName, "flex items-center justify-between gap-2")}
        >
          {mobileLabel ? (
            <>
              <p className="hidden lg:block font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                {label}
              </p>
              <p className="block lg:hidden font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
                {mobileLabel}
              </p>
            </>
          ) : (
            <p className="font-arial lg:font-inter uppercase text-[#90A1B9] lg:text-[#2C2C2C] text-xs tracking-widest">
              {label}
            </p>
          )}
          <span className="h-2 w-2 rounded-full bg-brand" />
        </label>

        <div className="w-full flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] text-brand">
            <Icon size={18} />
          </span>
          <div className="relative min-w-0 flex-1">
            <input
              ref={ref}
              id={id}
              type="text"
              value={value}
              onFocus={onActivate}
              onChange={(event) => {
                onHideCursorHint();
                onChange(event.target.value);
                onActivate();
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent font-arial text-sm text-[#1a1a1a] outline-none placeholder:text-[#9ca3af]"
            />
            {showCursorHint && !value && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[20px] w-[3px] rounded-full bg-gray-600"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </div>
          <FiSearch className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        )}
      </div>
    );
  },
);

AddressFieldCard.displayName = "AddressFieldCard";
