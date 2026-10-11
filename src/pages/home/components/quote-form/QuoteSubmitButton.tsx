import { GoArrowRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuoteSubmitButtonProps {
  loading: boolean;
  isDashboard: boolean;
  className?: string;
  onClick: () => void;
  appearance?: "default" | "landing";
}

export const QuoteSubmitButton = ({
  loading,
  isDashboard,
  className,
  onClick,
  appearance = "default",
}: QuoteSubmitButtonProps) => {
  return (
    <div className={isDashboard ? "mt-5 w-full" : "flex gap-3 items-end"}>
      <Button
        type="button"
        size="custom"
        className={cn(
          "font-bold bg-[#064E3B]",
          isDashboard ? "w-full px-6 py-3 justify-center" : "gosend-custom-button",
          className,
        )}
        loading={loading}
        onClick={onClick}
      >
        {appearance === "landing" ? (
          <span>Compare prices</span>
        ) : <><GoArrowRight
          className="text-white mr-1.5 w-5 h-5 sm:w-8 sm:h-8"
        />
        <span className="text-[#D0FAE5CC] font-arial font-bold text-xs uppercase">
          Get Quote
        </span>
        </>}
      </Button>
    </div>
  );
};
