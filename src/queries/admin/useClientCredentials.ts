import { useQuery } from "@tanstack/react-query";

import { getClientCredentials } from "@/services/clientCredentials";

export const useGetClientCredentials = () => {
  const query = useQuery({
    queryKey: ["client_credentials"],
    queryFn: getClientCredentials,
  });

  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data ?? [],
  };
};
