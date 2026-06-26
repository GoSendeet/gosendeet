import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { FormMode } from "@/components/ModeSwitcher";
import { EVENT, track } from "@/lib/analytics";
import { hasAuthSession } from "@/lib/authSession";
import { savePreSigninQuote } from "@/lib/preSigninQuote";
import { getQuotes } from "@/services/user";
import {
  normalizeBookingQuoteData,
  type BookingQuoteFormData,
} from "./useBookingQuoteForm";

interface QuoteMutationVariables {
  data: any;
  direct?: boolean;
  inputData: BookingQuoteFormData;
  mode: FormMode;
}

interface UseQuoteSubmissionArgs {
  isDashboard: boolean;
  onQuoteResult?: (result: any, inputData: any, mode: FormMode) => void;
  setData?: any;
}

export const useQuoteSubmission = ({
  isDashboard,
  onQuoteResult,
  setData,
}: UseQuoteSubmissionArgs) => {
  const navigate = useNavigate();

  const {
    mutate: getQuotesDirectly,
    isPending: isQuoteLoading,
    reset: resetQuoteMutation,
  } = useMutation({
    mutationFn: (vars: QuoteMutationVariables) =>
      getQuotes(vars.data, vars.direct),

    onSuccess: (response: any, variables) => {
      const quotes = Array.isArray(response?.data?.content)
        ? response.data.content
        : Array.isArray(response?.data)
          ? response.data
          : [];

      track(EVENT.QUOTE_COMPLETED, {
        mode: variables.mode,
        quote_count: quotes.length,
        pickup_location: variables.inputData?.pickupLocation,
        drop_off_location: variables.inputData?.dropOffLocation,
      });

      if (quotes.length === 0) {
        toast.success("No quotes available for the provided details.");
      } else {
        toast.success("Successful");
      }

      if (
        !hasAuthSession() &&
        (variables.mode === "gosendeet" || variables.mode === "compare")
      ) {
        savePreSigninQuote({
          mode: variables.mode,
          results: response,
          inputData: variables.inputData,
        });
      }

      if (typeof onQuoteResult === "function") {
        onQuoteResult(response, variables.inputData, variables.mode);
      } else {
        navigate("/cost-calculator", {
          state: {
            inputData: variables.inputData,
            results: response,
            mode: variables.mode,
            autoScrollToResults: isDashboard,
          },
        });
      }

      if (typeof setData === "function") {
        setData(response);
      }

      resetQuoteMutation();
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong.");
      resetQuoteMutation();
    },
  });

  const submitQuote = ({
    data,
    direct,
    mode,
  }: {
    data: BookingQuoteFormData;
    direct: boolean;
    mode: FormMode;
  }) => {
    track(EVENT.QUOTE_STARTED, {
      mode,
      pickup_location: data.pickupLocation,
      drop_off_location: data.dropOffLocation,
      package_type_id: data.packageTypeId,
      weight: data.weight,
    });

    getQuotesDirectly({
      data: [
        {
          ...data,
          itemValue: Number(data.itemPrice) || 0,
          quantity: 1,
          packageDescription: {
            isFragile: false,
            isPerishable: false,
            isExclusive: false,
            isHazardous: false,
          },
        },
      ],
      direct,
      inputData: data,
      mode,
    });
  };

  useEffect(() => {
    const isUnauthenticated =
      sessionStorage.getItem("unauthenticated") === "true";
    if (!isUnauthenticated) return;

    const stored = sessionStorage.getItem("bookingInputData");
    if (!stored) return;

    let parsed: BookingQuoteFormData;
    try {
      parsed = normalizeBookingQuoteData(JSON.parse(stored));
    } catch {
      console.error("Invalid bookingInputData in sessionStorage");
      return;
    }

    const storedMode = (sessionStorage.getItem("bookingMode") ||
      "gosendeet") as FormMode;

    getQuotesDirectly({
      data: [
        {
          ...parsed,
          quantity: 1,
          itemValue: Number(parsed.itemPrice) || 0,
          packageDescription: {
            isFragile: false,
            isPerishable: false,
            isExclusive: false,
            isHazardous: false,
          },
        },
      ],
      direct: storedMode === "gosendeet",
      inputData: parsed,
      mode: storedMode,
    });

    sessionStorage.removeItem("unauthenticated");
    sessionStorage.removeItem("bookingMode");
  }, [getQuotesDirectly]);

  return {
    isQuoteLoading,
    submitQuote,
  };
};
