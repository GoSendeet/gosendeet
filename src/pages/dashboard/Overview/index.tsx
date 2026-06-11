import { useState, useEffect } from "react";
import Bookings from "../Bookings";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import SupportPanel from "@/components/SupportPanel";
import Calculator from "@/pages/home/CostCalculator/components/Calculator";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import {
  consumePreSigninQuote,
  peekPreSigninQuote,
} from "@/lib/preSigninQuote";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MODE_HEADER_COPY: Record<FormMode, { title: string; subtitle: string }> = {
  gosendeet: {
    title: "Book Direct Delivery",
    subtitle:
      "Send with GoSendeet Direct and get a guided quote for your delivery.",
  },
  compare: {
    title: "Compare Delivery Quotes",
    subtitle:
      "Get instant quotes for your delivery needs and find the best option.",
  },
  tracking: {
    title: "Track Your Delivery",
    subtitle: "Check delivery progress and stay updated from pickup to drop-off.",
  },
};

const Overview = ({ data: _data }: { data: any }) => {
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
  const headerCopy = MODE_HEADER_COPY[formMode];

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
        <div>
          <h1 className="text-2xl font-bold text-brand">{headerCopy.title}</h1>
          <p className="text-sm text-gray-500">
            {headerCopy.subtitle}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {isRestoringSession ? (
          <motion.div
            key="restoring"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center min-h-[400px] gap-4"
          >
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            <p className="text-sm font-medium text-grey200">Restoring your quotes...</p>
          </motion.div>
        ) : showQuotePanel ? (
          <motion.div
            key="quote-panel"
            initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className="mb-6 flex flex-col gap-4 px-1">
              <div className="flex justify-center">
                <ModeSwitcher
                  mode={formMode}
                  onModeChange={handleModeChange}
                  variant="pill"
                  animate={false}
                />
              </div>
              <button
                onClick={handleBack}
                className="flex w-fit items-center gap-1.5 text-sm font-semibold text-brand hover:text-green-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <Calculator
              externalResults={quoteResults}
              externalInputData={quotesInputData}
              externalMode={formMode}
              hideForm={true}
              onBack={handleBack}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-form"
            initial={{ opacity: 0, y: -18, scale: 0.99, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, scale: 0.99, filter: "blur(6px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
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
            <Bookings />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Overview;
