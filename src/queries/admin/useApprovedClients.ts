import { useQuery } from "@tanstack/react-query";

import { getApprovedClients } from "@/services/approvedClients";

export const useGetApprovedClients = () => {
  const query = useQuery({
    queryKey: ["approved_clients"],
    queryFn: getApprovedClients,
  });

  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data ?? [],
  };
};
