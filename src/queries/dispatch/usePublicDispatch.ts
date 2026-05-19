import { useQuery } from "@tanstack/react-query";
import { viewDispatch } from "@/services/dispatchPublic";

export const usePublicDispatch = (enabled: boolean) => {
  return useQuery({
    queryKey: ["public-dispatch-session"],
    queryFn: () => viewDispatch(),
    enabled,
  });
};
