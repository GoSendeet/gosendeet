import {
  getFranchiseAlertPreferences,
  getFranchiseBankAccount,
  getFranchiseProfile,
  getFranchiseVehicleCapabilities,
  updateFranchiseAlertPreferences,
  updateFranchiseBankAccount,
  updateFranchiseProfile,
  updateFranchiseVehicleCapabilities,
} from "@/services/franchise";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const franchiseProfileKey = ["franchise_profile"];
export const franchiseBankAccountKey = ["franchise_bank_account"];
export const franchiseVehicleCapabilitiesKey = ["franchise_vehicle_capabilities"];
export const franchiseAlertPreferencesKey = ["franchise_alert_preferences"];

export const useGetFranchiseProfile = () =>
  useQuery({
    queryKey: franchiseProfileKey,
    queryFn: getFranchiseProfile,
  });

export const useUpdateFranchiseProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFranchiseProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: franchiseProfileKey });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to update profile");
    },
  });
};

export const useGetFranchiseBankAccount = () =>
  useQuery({
    queryKey: franchiseBankAccountKey,
    queryFn: getFranchiseBankAccount,
  });

export const useUpdateFranchiseBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFranchiseBankAccount,
    onSuccess: () => {
      toast.success("Bank account saved");
      queryClient.invalidateQueries({ queryKey: franchiseBankAccountKey });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to save bank account");
    },
  });
};

export const useGetFranchiseVehicleCapabilities = () =>
  useQuery({
    queryKey: franchiseVehicleCapabilitiesKey,
    queryFn: getFranchiseVehicleCapabilities,
  });

export const useUpdateFranchiseVehicleCapabilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFranchiseVehicleCapabilities,
    onSuccess: () => {
      toast.success("Vehicle capabilities saved");
      queryClient.invalidateQueries({ queryKey: franchiseVehicleCapabilitiesKey });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to save vehicle capabilities");
    },
  });
};

export const useGetFranchiseAlertPreferences = () =>
  useQuery({
    queryKey: franchiseAlertPreferencesKey,
    queryFn: getFranchiseAlertPreferences,
  });

export const useUpdateFranchiseAlertPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFranchiseAlertPreferences,
    onSuccess: () => {
      toast.success("Alert preferences saved");
      queryClient.invalidateQueries({ queryKey: franchiseAlertPreferencesKey });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to save alert preferences");
    },
  });
};
