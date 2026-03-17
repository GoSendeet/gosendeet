import {
  getCompanyList,
  getCompanyRatings,
  getCompanyRatingStats,
  getCompanyServices,
  getCompanyStats,
  getSingleCompany,
} from "@/services/companies";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetCompanyServices = (id: string) => {
  const query = useQuery({
    queryKey: ["company_services", id],
    queryFn: () => getCompanyServices(id),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetCompanyList = (
  page: number,
  size: number,
  companyStatus: string,
  serviceLevelId: string,
  search: string,
  options?: UseQueryOptions<any> // from react-query
) => {
  const query = useQuery({
    queryKey: ["companies", page, size, companyStatus, serviceLevelId, search],
    queryFn: () =>
      getCompanyList(page, size, companyStatus, serviceLevelId, search),
    ...options, // spread options last to allow overriding defaults
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};


export const useGetSingleCompany = (id: string) => {
  const query = useQuery({
    queryKey: ["single_company", id],
    queryFn: () => getSingleCompany(id),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetCompanyStats = () => {
  const query = useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanyStats(),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetCompanyRatings = (id: string, page: number) => {
  const query = useQuery({
    queryKey: ["company_ratings", id, page],
    queryFn: () => getCompanyRatings(id, page),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};

export const useGetCompanyRatingStats = (id: string) => {
  const query = useQuery({
    queryKey: ["company_ratings", id],
    queryFn: () => getCompanyRatingStats(id),
  });
  return {
    isLoading: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    data: query.data,
  };
};
