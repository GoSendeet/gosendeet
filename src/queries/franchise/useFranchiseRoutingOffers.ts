import {
  acceptRoutingOffer,
  declineRoutingOffer,
  getPendingRoutingOffers,
} from "@/services/franchise";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const pendingRoutingOffersKey = ["franchise_pending_routing_offers"];

export const useGetPendingRoutingOffers = () =>
  useQuery({
    queryKey: pendingRoutingOffersKey,
    queryFn: getPendingRoutingOffers,
    refetchInterval: 3_000, // poll every 3s — offers expire in 90s, franchise must see them quickly
    select: (data) => (Array.isArray(data) ? data : []),
  });

export const useAcceptRoutingOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => acceptRoutingOffer(offerId),
    onSuccess: () => {
      toast.success("Offer accepted! The booking has been assigned to you.");
      queryClient.invalidateQueries({ queryKey: pendingRoutingOffersKey });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not accept offer. It may have expired.");
    },
  });
};

export const useDeclineRoutingOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, reason }: { offerId: string; reason?: string }) =>
      declineRoutingOffer({ offerId, reason }),
    onSuccess: () => {
      toast.info("Offer declined.");
      queryClient.invalidateQueries({ queryKey: pendingRoutingOffersKey });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not decline offer.");
    },
  });
};
