import { GoArrowRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuoteSubmitButtonProps {
  loading: boolean;
  isDashboard: boolean;
  className?: string;
  onClick: () => void;
}

export const QuoteSubmitButton = ({
  loading,
  isDashboard,
  className,
  onClick,
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
        <GoArrowRight
          className="text-white mr-1.5"
          style={{ width: "32px", height: "32px" }}
        />
        <span className="text-[#D0FAE5CC] font-arial font-bold text-xs uppercase">
          Get Quote
        </span>
      </Button>
    </div>
  );
};
