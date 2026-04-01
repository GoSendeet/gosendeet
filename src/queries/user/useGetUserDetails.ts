import { userDetails } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUserDetails = (id: string) => {
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: () => userDetails(id),
    enabled: Boolean(id),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
    refetchUserData: query.refetch,
  };
};
