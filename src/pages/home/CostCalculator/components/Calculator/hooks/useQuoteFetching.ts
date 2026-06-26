import { useCallback, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { getQuotes } from "@/services/user";
import { PAGE_SIZE, normalizeQuotesResponse } from "../quoteUtils";

interface UseQuoteFetchingArgs {
  filterParams: {
    search?: undefined;
    minPrice?: number;
    maxPrice?: number;
    companyName?: string;
    hasNextDay?: boolean;
  };
  isSharedView: boolean;
  mode: string;
  quotePayload: any[];
  setData: Dispatch<SetStateAction<any>>;
}

export const useQuoteFetching = ({
  filterParams,
  isSharedView,
  mode,
  quotePayload,
  setData,
}: UseQuoteFetchingArgs) => {
  const pageRef = useRef(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchQuotesPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (isSharedView || quotePayload.length === 0 || mode === "tracking") {
        return;
      }

      replace ? setIsFetchingQuotes(true) : setIsLoadingMore(true);

      try {
        const response = await getQuotes(quotePayload, mode === "gosendeet", {
          ...filterParams,
          page: pageToLoad,
          size: PAGE_SIZE,
        });

        const newQuotes = normalizeQuotesResponse(response);
        setHasNextPage(newQuotes.length === PAGE_SIZE);

        setData((prev: any) => {
          const prevQuotes = replace ? [] : normalizeQuotesResponse(prev);
          return {
            ...response,
            data: [...prevQuotes, ...newQuotes],
          };
        });
      } catch (error: any) {
        toast.error(error?.message || "Unable to fetch quotes");
      } finally {
        setIsFetchingQuotes(false);
        setIsLoadingMore(false);
      }
    },
    [filterParams, isSharedView, mode, quotePayload, setData],
  );

  const resetQuotePagination = useCallback(() => {
    pageRef.current = 1;
    setHasNextPage(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || isFetchingQuotes || !hasNextPage) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchQuotesPage(nextPage, false);
  }, [fetchQuotesPage, hasNextPage, isFetchingQuotes, isLoadingMore]);

  return {
    fetchQuotesPage,
    handleLoadMore,
    hasNextPage,
    isFetchingQuotes,
    isLoadingMore,
    resetQuotePagination,
  };
};
