import { useState } from "react";
import Bookings from "../Bookings";
import { cn } from "@/lib/utils";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import SupportPanel from "@/components/SupportPanel";
import Calculator from "@/pages/home/CostCalculator/components/Calculator";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";

const Overview = ({ data }: { data: any }) => {
  const username = data?.data?.username;
  const userStatus = data?.data?.status;

  const [formMode, setFormMode] = useState<FormMode>("gosendeet");
  const [showQuotePanel, setShowQuotePanel] = useState(false);
  const [quotesInputData, setQuotesInputData] = useState<any>(null);
  // Only cache gosendeet results — compare auto-fetches via Calculator's effect
  const [gosendeetResults, setGosendeetResults] = useState<any>(undefined);

  const handleQuoteResult = (result: any, inputData: any, mode: FormMode) => {
    setFormMode(mode);
    setQuotesInputData(inputData);
    if (mode === "gosendeet") {
      setGosendeetResults(result);
    }
    setShowQuotePanel(true);
  };

  const handleModeChange = (newMode: FormMode) => {
    if (newMode === "tracking") {
      setFormMode("tracking");
      setShowQuotePanel(false);
      return;
    }
    if (newMode === formMode && showQuotePanel) {
      // Tapping the active mode while panel is open → go back to form
      setShowQuotePanel(false);
      return;
    }
    // Switching modes while the panel is open — clear cached gosendeet results so
    // Calculator always re-fetches fresh data for the target mode
    if (showQuotePanel) {
      setGosendeetResults(undefined);
    }
    setFormMode(newMode);
  };

  const handleBack = () => setShowQuotePanel(false);

  return (
    <div>
      <div className="flex items-center justify-between lg:-mt-6 lg:mb-10 mb-16 md:px-4 gap-3">
        <div className="hidden lg:block items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="font-clash text-brand uppercase tracking-widest font-semibold">
              {showQuotePanel ? "Available Quotes" : "Dashboard Overview"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="text-xs text-grey200 uppercase tracking-widest font-medium">
              Welcome back
            </p>
            <h2 className="font-clash font-semibold text-[22px] text-brand truncate">
              {username}
            </h2>
          </div>
          <span
            className={cn(
              userStatus === "active"
                ? "bg-brabd-light2 text-brand"
                : "bg-[#FEF2F2] text-[#EC2D30]",
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                userStatus === "active" ? "bg-brand" : "bg-[#EC2D30]",
              )}
            />
            {userStatus}
          </span>
        </div>
      </div>

      {showQuotePanel ? (
        <div className="mb-10">
          {/* Back button + ModeSwitcher on the same row */}
          <div className="flex flex-col items-start md:flex-row md:items-center gap-4 mb-6 px-1">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-green-800 transition-colors shrink-0"
            >
              ← Back
            </button>
            <div className="flex-1 flex items-center justify-center">
              <ModeSwitcher
                mode={formMode}
                onModeChange={handleModeChange}
                variant="pill"
                animate={false}
              />
            </div>
            {/* Spacer to keep ModeSwitcher visually centred */}
            <div className="w-14 shrink-0" />
          </div>

          {/* Embedded Calculator — results only, form + internal mode switcher hidden */}
          <Calculator
            externalResults={formMode === "gosendeet" ? gosendeetResults : undefined}
            externalInputData={quotesInputData}
            externalMode={formMode}
            hideForm={true}
          />
        </div>
      ) : (
        <div className="flex lg:flex-row flex-col gap-8 mb-10">
          <div className="lg:w-[60%] rounded-3xl text-sm">
            <FormHorizontalBar
              activeMode={formMode}
              onQuoteResult={handleQuoteResult}
              onModeChange={handleModeChange}
            />
          </div>
          <SupportPanel />
        </div>
      )}

      {!showQuotePanel && <Bookings />}
    </div>
  );
};

export default Overview;
