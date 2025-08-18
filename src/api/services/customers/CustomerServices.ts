import {
  CustomerDataCompletionPayload,
  CustomerProfilePayload,
  CustomerResponse,
  LocationPayload,
} from '../../../@types/customer';
import {
  BranchesParams,
  BranchesResponse,
  DistrictsDetailResponse,
  DistrictsParams,
  DistrictsResponse,
  ProvinceParams,
  ProvincesDetailResponse,
  ProvincesResponse,
  RegenciesDetailResponse,
  RegenciesParams,
  RegenciesResponse,
  VillagesDetailResponse,
  VillagesParams,
  VillagesResponse,
} from '../../../@types/location';
import ApiClient from '../../ApiClient';
import {AxiosRequestConfig} from 'axios';
import {
  DeleteCustomerAccountPayload,
  DeleteCustomerAccountResponse,
} from '../../../@types/customer';

export const getCustomer = async (config?: AxiosRequestConfig) => {
  try {
    const response: CustomerResponse = await ApiClient.get(
      '/api/v1/customer/profile',
      config,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDataCompletionCustomer = async (
  req: CustomerDataCompletionPayload,
): Promise<CustomerResponse> => {
  try {
    const response: CustomerResponse = await ApiClient.put(
      '/api/v1/customer/address',
      req,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerProfile = async (
  req: CustomerProfilePayload,
): Promise<CustomerResponse> => {
  try {
    const response: CustomerResponse = await ApiClient.put(
      '/api/v1/customer/profile',
      req,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateLocation = async (
  req: LocationPayload,
): Promise<CustomerResponse> => {
  try {
    const response: CustomerResponse = await ApiClient.put(
      '/api/v1/customer/address',
      req,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProvinces = async (
  params: ProvinceParams,
): Promise<ProvincesResponse> => {
  try {
    const response: ProvincesResponse = await ApiClient.get(
      '/api/v1/region/province',
      {
        params,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getProvincesDetail = async (
  code: string,
): Promise<ProvincesDetailResponse> => {
  try {
    const response: ProvincesDetailResponse = await ApiClient.get(
      `/api/v1/region/province/${code}`,
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getRegencies = async (
  params: RegenciesParams,
): Promise<RegenciesResponse> => {
  try {
    const response: RegenciesResponse = await ApiClient.get(
      '/api/v1/region/regency',
      {
        params,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getRegenciesDetail = async (
  code: string,
): Promise<RegenciesDetailResponse> => {
  try {
    const response: RegenciesDetailResponse = await ApiClient.get(
      `/api/v1/region/regency/${code}`,
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getDistricts = async (
  params: DistrictsParams,
): Promise<DistrictsResponse> => {
  try {
    const response: DistrictsResponse = await ApiClient.get(
      '/api/v1/region/district',
      {
        params,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getDistrictsDetail = async (
  code: string,
): Promise<DistrictsDetailResponse> => {
  try {
    const response: DistrictsDetailResponse = await ApiClient.get(
      `/api/v1/region/district/${code}`,
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getVillages = async (
  params: VillagesParams,
): Promise<VillagesResponse> => {
  try {
    const response: VillagesResponse = await ApiClient.get(
      '/api/v1/region/village',
      {
        params,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getVillagesDetail = async (
  code: string,
): Promise<VillagesDetailResponse> => {
  try {
    const response: VillagesDetailResponse = await ApiClient.get(
      `/api/v1/region/village/${code}`,
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getBranches = async (
  params: BranchesParams,
): Promise<BranchesResponse> => {
  try {
    const response: BranchesResponse = await ApiClient.get(
      '/api/v1/branch/by-city',
      {
        params,
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getBranchesDetail = async (
  branchId: string,
): Promise<BranchesResponse> => {
  try {
    const response: BranchesResponse = await ApiClient.get(
      `/api/v1/branch/${branchId}`,
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomerAccount = async (
  payload: DeleteCustomerAccountPayload,
): Promise<DeleteCustomerAccountResponse> => {
  try {
    const response: DeleteCustomerAccountResponse = await ApiClient.delete(
      '/api/v1/customer/profile',
      {data: payload},
    );
    return response;
  } catch (error) {
    throw error;
  }
};
