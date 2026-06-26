import type { FormEvent } from "react";
import { GoArrowRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrackingNumberFormProps {
  trackingNumber: string;
  loading: boolean;
  isDashboard: boolean;
  labelClassName: string;
  inputClassName: string;
  onTrackingNumberChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export const TrackingNumberForm = ({
  trackingNumber,
  loading,
  isDashboard,
  labelClassName,
  inputClassName,
  onTrackingNumberChange,
  onSubmit,
}: TrackingNumberFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div
        className={cn(
          isDashboard
            ? "flex flex-col gap-4"
            : "flex flex-col lg:flex-row lg:items-end gap-4",
        )}
      >
        <div className={isDashboard ? "mt-4 w-full" : "flex-1"}>
          <div className="tracking-section focus-within:outline-2 focus-within:outline-[#fbbf24] focus-within:outline-offset-2">
            <label
              htmlFor="trackingNumber"
              className={cn(labelClassName, "flex justify-between items-center")}
            >
              <p className="text-[#90A1B9] font-arial text-xs tracking-widest uppercase">
                Tracking Number
              </p>
              <div className="border-2 border-[#CAD5E2] p-1 rounded-full w-4 h-4" />
            </label>
            <input
              id="trackingNumber"
              type="text"
              value={trackingNumber}
              onChange={(event) => onTrackingNumberChange(event.target.value)}
              placeholder="Enter tracking number (GOS*****)"
              className={cn(inputClassName, "focus:outline-none")}
            />
          </div>
        </div>
        <Button
          type="submit"
          loading={loading}
          size="custom"
          className={cn(
            "font-bold bg-[#064E3B]",
            isDashboard ? "w-full px-6 py-3 justify-center" : "gosend-custom-button",
          )}
        >
          <GoArrowRight
            className="text-white mr-1.5"
            style={{ width: "32px", height: "32px" }}
          />
          <span className="text-[#D0FAE5CC] font-arial font-bold text-xs">
            {isDashboard ? (
              <span className="capitalize">Track Shipment</span>
            ) : (
              <span className="uppercase">Track</span>
            )}
          </span>
        </Button>
      </div>
    </form>
  );
};
