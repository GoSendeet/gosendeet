import { useState, useEffect } from "react";
import Bookings from "../Bookings";
import { cn } from "@/lib/utils";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import SupportPanel from "@/components/SupportPanel";
import Calculator from "@/pages/home/CostCalculator/components/Calculator";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import {
  consumePreSigninQuote,
  peekPreSigninQuote,
} from "@/lib/preSigninQuote";
import { ArrowLeft } from "lucide-react";

const Overview = ({ data }: { data: any }) => {
  const username = data?.data?.username;
  const userStatus = data?.data?.status;
  const [pendingPreSigninQuote] = useState(() => peekPreSigninQuote());

  const [formMode, setFormMode] = useState<FormMode>("gosendeet");
  const [showQuotePanel, setShowQuotePanel] = useState(false);
  const [quotesInputData, setQuotesInputData] = useState<any>(null);
  const [quoteResults, setQuoteResults] = useState<any>(undefined);

  // Starts true when pre-signin quote data exists — prevents form flash before restoration
  const [isRestoringSession, setIsRestoringSession] = useState(
    () => Boolean(pendingPreSigninQuote),
  );

  useEffect(() => {
    if (!pendingPreSigninQuote) {
      setIsRestoringSession(false);
      return;
    }

    setFormMode(pendingPreSigninQuote.mode);
    setQuotesInputData(pendingPreSigninQuote.inputData);
    setQuoteResults(pendingPreSigninQuote.results);
    setShowQuotePanel(true);
    setIsRestoringSession(false);
    consumePreSigninQuote();
  }, [pendingPreSigninQuote]);

  const handleQuoteResult = (result: any, inputData: any, mode: FormMode) => {
    setFormMode(mode);
    setQuotesInputData(inputData);
    setQuoteResults(result);
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
      setQuoteResults(undefined);
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
              {showQuotePanel || isRestoringSession ? "Available Quotes" : "Dashboard Overview"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="text-xs text-grey200 uppercase tracking-widest font-medium">
              {/* Welcome back */}
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

      {isRestoringSession ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          <p className="text-sm font-medium text-grey200">Restoring your quotes...</p>
        </div>
      ) : showQuotePanel ? (
        <div className="mb-10">
          {/* Back button + ModeSwitcher on the same row */}
          <div className="mb-6 flex flex-col gap-4 px-1">
            <button
              onClick={handleBack}
              className="flex w-fit items-center gap-1.5 text-sm font-semibold text-brand hover:text-green-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex justify-center">
              <ModeSwitcher
                mode={formMode}
                onModeChange={handleModeChange}
                variant="pill"
                animate={false}
              />
            </div>
          </div>

          {/* Embedded Calculator — results only, form + internal mode switcher hidden */}
          <Calculator
            externalResults={quoteResults}
            externalInputData={quotesInputData}
            externalMode={formMode}
            hideForm={true}
            onBack={handleBack}
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

      {!showQuotePanel && !isRestoringSession && <Bookings />}
    </div>
  );
};

export default Overview;
