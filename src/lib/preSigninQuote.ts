import type { FormMode } from "@/components/ModeSwitcher";

const MODE_KEY = "preSigninMode";
const RESULTS_KEY = "preSigninResults";
const INPUT_DATA_KEY = "preSigninInputData";

const isQuoteMode = (mode: string | null): mode is FormMode =>
  mode === "gosendeet" || mode === "compare";

export const savePreSigninQuote = ({
  mode,
  results,
  inputData,
}: {
  mode: FormMode;
  results: unknown;
  inputData: unknown;
}) => {
  if (!isQuoteMode(mode)) return;

  try {
    sessionStorage.setItem(MODE_KEY, mode);
    sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    sessionStorage.setItem(INPUT_DATA_KEY, JSON.stringify(inputData ?? {}));
  } catch (error) {
    console.error("Unable to save pre-signin quote context:", error);
  }
};

export const hasPreSigninQuote = () =>
  isQuoteMode(sessionStorage.getItem(MODE_KEY)) &&
  Boolean(sessionStorage.getItem(RESULTS_KEY));

export const consumePreSigninQuote = () => {
  const mode = sessionStorage.getItem(MODE_KEY);
  const resultsRaw = sessionStorage.getItem(RESULTS_KEY);
  const inputDataRaw = sessionStorage.getItem(INPUT_DATA_KEY);

  sessionStorage.removeItem(MODE_KEY);
  sessionStorage.removeItem(RESULTS_KEY);
  sessionStorage.removeItem(INPUT_DATA_KEY);
  sessionStorage.removeItem("unauthenticated");
  sessionStorage.removeItem("bookingMode");

  if (!isQuoteMode(mode) || !resultsRaw) return null;

  try {
    return {
      mode,
      results: JSON.parse(resultsRaw),
      inputData: inputDataRaw ? JSON.parse(inputDataRaw) : {},
    };
  } catch (error) {
    console.error("Unable to restore pre-signin quote context:", error);
    return null;
  }
};

export const peekPreSigninQuote = () => {
  const mode = sessionStorage.getItem(MODE_KEY);
  const resultsRaw = sessionStorage.getItem(RESULTS_KEY);
  const inputDataRaw = sessionStorage.getItem(INPUT_DATA_KEY);

  if (!isQuoteMode(mode) || !resultsRaw) return null;

  try {
    return {
      mode,
      results: JSON.parse(resultsRaw),
      inputData: inputDataRaw ? JSON.parse(inputDataRaw) : {},
    };
  } catch (error) {
    console.error("Unable to read pre-signin quote context:", error);
    return null;
  }
};

export const getPreSigninQuoteDashboardRoute = () => {
  if (!hasPreSigninQuote()) return null;

  sessionStorage.setItem("dashboardTab", "overview");

  return {
    pathname: "/dashboard",
    state: {
      restorePreSigninQuote: true,
    },
  };
};
