import { getAdminDimensionUnits, getAdminWeightUnits, getCoverageArea, getCrossAreaRoute, getDeliveryProgress, getLocationCode, getPackageType, getPickupOptions, getPromoCodes, getServiceLevel } from "@/services/adminSettings";
import { useQuery } from "@tanstack/react-query";

export const useGetServiceLevel = (options?: { page?: number; minimize?: boolean }) => {
  const query = useQuery({
    queryKey: ["service_level", options],
    queryFn: () => getServiceLevel(options),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetPickupOptions = (options?: { page?: number; minimize?: boolean }) => {
  const query = useQuery({
    queryKey: ["pickup_options", options],
    queryFn: () => getPickupOptions(options),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetCoverageArea = (options?: { page?: number; minimize?: boolean }) => {
  const query = useQuery({
    queryKey: ["coverage_areas", options],
    queryFn: () => getCoverageArea(options),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetLocationCode = (options?: { page?: number; minimize?: boolean }) => {
  const query = useQuery({
    queryKey: ["location_codes", options],
    queryFn: () => getLocationCode(options),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetDeliveryProgress = (options?: { page?: number; minimize?: boolean }) => {
  const query = useQuery({
    queryKey: ["delivery_progress", options],
    queryFn: () => getDeliveryProgress(options),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetPackageType = (options?: { page?: number; minimize?: boolean; search?:string }) => {
  const query = useQuery({
    queryKey: ["package_types", options],
    queryFn: () => getPackageType(options),
    enabled: !!options, // avoid running if no param is passed
  });

  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetAdminWeightUnits = () => {
  const query = useQuery({
    queryKey: ["weight_units"],
    queryFn: () => getAdminWeightUnits(),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetAdminDimensionUnits = () => {
  const query = useQuery({
    queryKey: ["dimension_units"],
    queryFn: () => getAdminDimensionUnits(),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};


export const useGetCrossAreaRoute = (options?: { page?: number; minimize?: boolean }) => {
  const query = useQuery({
    queryKey: ["cross_area_routes", options],
    queryFn: () => getCrossAreaRoute(options),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetPromoCodes = (options?: { page?: number; search?: string }) => {
  const query = useQuery({
    queryKey: ["promo_codes", options],
    queryFn: () => getPromoCodes(options),
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};
