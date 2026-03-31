import { api } from "./axios";

export const createCompany = async (data: any) => {
  try {
    const res = await api.post(`/companies`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getCompanyList = async (
  page: number,
  size: number,
  companyStatus: string,
  serviceLevelId: string,
  search: string
) => {
  try {
    const res = await api.get(
      `/companies?page=${page}&size=${size}&status=${companyStatus}&serviceLevelId=${serviceLevelId}&search=${search}`
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getSingleCompany = async (id: string) => {
  try {
    const res = await api.get(`/companies/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateSingleCompany = async (id: string, data: any) => {
  try {
    const res = await api.put(`companies/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateCompanyStatus = async (status: string, data: any) => {
  try {
    const res = await api.put(
      `/companies/status/update?status=${status}`,
      data
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const createCompanyServices = async (data: any) => {
  try {
    const res = await api.post(`/company-route-configs`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getCompanyServices = async (id: string) => {
  try {
    const res = await api.get(`/company-route-configs?companyId=${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const deleteCompanyServices = async (id: string) => {
  try {
    const res = await api.delete(`/company-route-configs/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateCompanyServices = async (id: string, data: any) => {
  try {
    const res = await api.put(`/company-route-configs/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateRouteStatus = async (id: string, isActive: boolean) => {
  try {
    const res = await api.patch(`/company-route-configs/${id}/status?isActive=${isActive}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getCompanyStats = async () => {
  try {
    const res = await api.get(`/companies/stats/data`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getMyCompanyTransactions = async () => {
  try {
    const res = await api.get(`/companies/me/transactions`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getCompanyRatings = async (id: string, page: number) => {
  try {
    const res = await api.get(`/ratings?companyId=${id}&page=${page}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getCompanyRatingStats = async (id: string) => {
  try {
    const res = await api.get(`/ratings/stats?companyId=${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};
