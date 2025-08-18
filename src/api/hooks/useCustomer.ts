import {
  useQuery,
  useMutation,
  UseQueryResult,
  useInfiniteQuery,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  getBranches,
  getCustomer,
  getDistricts,
  getDistrictsDetail,
  getProvinces,
  getProvincesDetail,
  getRegencies,
  getRegenciesDetail,
  getVillages,
  getVillagesDetail,
  updateCustomerProfile,
  updateDataCompletionCustomer,
  deleteCustomerAccount,
} from '../services/customers/CustomerServices';
import {
  CustomerDataCompletionPayload,
  CustomerProfilePayload,
  CustomerResponse,
  LocationPayload,
  DeleteCustomerAccountPayload,
  DeleteCustomerAccountResponse,
} from '../../@types/customer';
import {ConfigInfiniteQuery, getQueryKey} from '../../@types/query';
import {
  BranchesParams,
  BranchesResponse,
  District,
  DistrictsParams,
  DistrictsResponse,
  LocationForm,
  Province,
  ProvinceParams,
  ProvincesResponse,
  RegenciesParams,
  RegenciesResponse,
  Regency,
  Village,
  VillagesParams,
  VillagesResponse,
} from '../../@types/location';

export const useCustomer = (token?: boolean) =>
  useQuery({
    queryKey: ['get-customer'],
    queryFn: () => getCustomer({}),
    enabled: token,
  });

export const useCustomerDetail = (
): UseQueryResult<CustomerResponse, Error> =>
  useQuery({
    queryKey: getQueryKey('customer-detail'),
    queryFn: () => getCustomer(),
  });

export const useCustomerProfile = () =>
  useMutation({
    mutationKey: ['customer-profile'],
    mutationFn: (payload: CustomerProfilePayload) =>
      updateCustomerProfile(payload),
  });

export const useDeleteCustomerAccount = (): UseMutationResult<
  DeleteCustomerAccountResponse,
  Error,
  DeleteCustomerAccountPayload
> =>
  useMutation({
    mutationKey: ['delete-customer-account'],
    mutationFn: (payload: DeleteCustomerAccountPayload) =>
      deleteCustomerAccount(payload),
  });

export const useGetLocation = () =>
  useQuery<LocationForm>({
    queryKey: ['get-location'],
    queryFn: async () => {
      let response: LocationForm | {} = {};
      const customerResponse: CustomerResponse = await getCustomer({});
      response = {
        ...response,
        fullAddress: customerResponse.data_body.user.profile?.address_detail,
        nearestBranch: customerResponse.data_body.user.branches!![0],
        longlat: {
          latitude: customerResponse.data_body.user.customer?.geo_latitude,
          longitude: customerResponse.data_body.user.customer?.geo_longitude,
        },
      };
      if (customerResponse.data_body.user.profile) {
        const [province, regency, district, village] = await Promise.all([
          getProvincesDetail(
            String(customerResponse.data_body.user.profile.address_province_id),
          ),
          getRegenciesDetail(
            String(customerResponse.data_body.user.profile.address_city_id),
          ),
          getDistrictsDetail(
            String(customerResponse.data_body.user.profile.address_district_id),
          ),
          getVillagesDetail(
            String(customerResponse.data_body.user.profile.address_village_id),
          ),
        ]);
        response = {
          ...response,
          province: province.data_body.province,
          regency: regency.data_body.regency,
          district: district.data_body.district,
          village: village.data_body.village,
          postalCode: village.data_body.village.postalCode,
        };
      }
      return response as LocationForm;
    },
  });

export const useUpdateLocation = (): UseMutationResult<
  CustomerResponse,
  Error,
  LocationPayload
> =>
  useMutation({
    mutationKey: getQueryKey('update-location'),
    mutationFn: (payload: LocationPayload) =>
      updateDataCompletionCustomer(payload),
  });

export const useProvinces = (
  params: ProvinceParams,
  config?: ConfigInfiniteQuery<ProvincesResponse, Province>,
) =>
  useInfiniteQuery({
    ...config,
    queryKey: getQueryKey('provinces', params),
    queryFn: ({pageParam}) =>
      getProvinces({page: pageParam as number, ...params}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, AllPages) => {
      const morePagesExist =
        AllPages.length !==
        Math.ceil(
          lastPage.data_body.provinces_paginated.meta.total / params.limit!,
        );
      if (!morePagesExist) {
        return undefined;
      }

      return AllPages.length + 1;
    },
    select: data => ({
      ...data,
      pages: data.pages.flatMap(
        page => page.data_body.provinces_paginated.data,
      ),
    }),
  });

export const useRegencies = (
  params: RegenciesParams,
  config?: ConfigInfiniteQuery<RegenciesResponse, Regency>,
) =>
  useInfiniteQuery({
    ...config,
    queryKey: getQueryKey('regencies', params),
    queryFn: ({pageParam}) =>
      getRegencies({page: pageParam as number, ...params}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, AllPages) => {
      const morePagesExist =
        AllPages.length !==
        Math.ceil(
          lastPage.data_body.regencies_paginated.meta.total / params.limit!,
        );
      if (!morePagesExist) {
        return undefined;
      }

      return AllPages.length + 1;
    },
    select: data => ({
      ...data,
      pages: data.pages.flatMap(
        page => page.data_body.regencies_paginated.data,
      ),
    }),
    enabled: Boolean(params.provinceCode.length),
  });

export const useDistricts = (
  params: DistrictsParams,
  config?: ConfigInfiniteQuery<DistrictsResponse, District>,
) =>
  useInfiniteQuery({
    ...config,
    queryKey: getQueryKey('districts', params),
    queryFn: ({pageParam}) =>
      getDistricts({page: pageParam as number, ...params}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, AllPages) => {
      const morePagesExist =
        AllPages.length !==
        Math.ceil(
          lastPage.data_body.districts_paginated.meta.total / params.limit!,
        );
      if (!morePagesExist) {
        return undefined;
      }

      return AllPages.length + 1;
    },
    select: data => ({
      ...data,
      pages: data.pages.flatMap(
        page => page.data_body.districts_paginated.data,
      ),
    }),
    enabled: Boolean(params.regencyCode.length),
  });

export const useVillages = (
  params: VillagesParams,
  config?: ConfigInfiniteQuery<VillagesResponse, Village>,
) =>
  useInfiniteQuery({
    ...config,
    queryKey: getQueryKey('villages', params),
    queryFn: ({pageParam}) =>
      getVillages({page: pageParam as number, ...params}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, AllPages) => {
      const morePagesExist =
        AllPages.length !==
        Math.ceil(
          lastPage.data_body.villages_paginated.meta.total / params.limit!,
        );
      if (!morePagesExist) {
        return undefined;
      }

      return AllPages.length + 1;
    },
    select: data => ({
      ...data,
      pages: data.pages.flatMap(page => page.data_body.villages_paginated.data),
    }),
    enabled: Boolean(params.districtCode.length),
  });

export const useBranches = (
  params: BranchesParams,
): UseQueryResult<BranchesResponse, Error> =>
  useQuery({
    queryKey: getQueryKey('branches', params),
    queryFn: () => getBranches(params),
    enabled: Boolean(params.city?.length || params.city_id?.length),
  });
