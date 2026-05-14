import {
  getFranchiseNotifications,
  markAllFranchiseNotificationsRead,
  markFranchiseNotificationRead,
} from "@/services/franchise";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const franchiseNotificationsKey = (page = 0, size = 20) => [
  "franchise_notifications",
  page,
  size,
];

export const useGetFranchiseNotifications = (page = 0, size = 20) =>
  useQuery({
    queryKey: franchiseNotificationsKey(page, size),
    queryFn: () => getFranchiseNotifications({ page, size }),
  });

export const useMarkAllFranchiseNotificationsRead = (page = 0, size = 20) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllFranchiseNotificationsRead,
    onSuccess: () => {
      toast.success("Notifications marked as read");
      queryClient.invalidateQueries({
        queryKey: franchiseNotificationsKey(page, size),
      });
      queryClient.invalidateQueries({
        queryKey: ["franchise_dashboard_summary"],
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to mark notifications as read");
    },
  });
};

export const useMarkFranchiseNotificationRead = (page = 0, size = 20) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markFranchiseNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: franchiseNotificationsKey(page, size),
      });
      queryClient.invalidateQueries({
        queryKey: ["franchise_dashboard_summary"],
      });
    },
  });
};
