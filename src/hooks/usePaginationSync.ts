import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PaginationResult {
  currentPage: number;
  updatePage: (page: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const usePaginationSync = (lastPage: number): PaginationResult => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page") ?? "1", 10);
    return !isNaN(pageParam) && pageParam > 0
      ? Math.min(pageParam, lastPage)
      : 1;
  });

  // When the URL changes, update the local state immediately
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page") ?? "1", 10);

    if (!isNaN(pageParam) && pageParam !== currentPage) {
      setCurrentPage(Math.min(pageParam, lastPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, lastPage]);

  const updatePage = useCallback((newPage: number): void => {
    if (newPage > 0 && newPage <= lastPage) {
      navigate(`?page=${newPage}`, { replace: false });
    }
  }, [lastPage, navigate]);

  return { currentPage, updatePage, setCurrentPage };
};

export { usePaginationSync };
