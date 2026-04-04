import { getMyCompanyTransactions } from "@/services/companies";
import { useQuery } from "@tanstack/react-query";

export const useGetFranchiseCompanyTransactions = () => {
  const query = useQuery({
    queryKey: ["franchise_company_transactions"],
    queryFn: getMyCompanyTransactions,
  });

  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};
