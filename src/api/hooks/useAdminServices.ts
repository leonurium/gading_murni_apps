import {
  UseMutationResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  AdminServicesDetailResponse,
  AdminServicesParams,
  AdminServicesResponse,
  AfterServiceFormValues,
  AfterServiceItemsRequestPayload,
  AfterServiceRequestPayload,
  AssignTechnicianRequestPayload,
  CustomerDataFormValues,
  ServiceDetail,
  TechnicianOnLocationRequestPayload,
  UpdateBookingRequestPayload,
} from '../../@types/service';
import {ConfigInfiniteQuery, getQueryKey} from '../../@types/query';
import {
  acceptDetailAdminServices,
  afterServiceAdminServices,
  afterServiceItemsAdminServices,
  assignTechnicianAdminServices,
  getAdminServices,
  getDetailAdminServices,
  technicianOnLocationAdminServices,
  updateDetailAdminServices,
} from '../services/technicians/AdminServices';
import {
  getDistrictsDetail,
  getProvincesDetail,
  getRegenciesDetail,
  getVillagesDetail,
} from '../services/customers/CustomerServices';
import {
  AdminProfileDetailResponse,
  AdminProfilePayload,
  PasswordAdminPayload,
  PasswordAdminResponse,
} from '../../@types/adminUser';
import {
  getAdminProfile,
  updateAdminProfile,
  updatePasswordAdmin,
} from '../services/technicians/AdminUserServices';

export const useAdminServices = (
  params: AdminServicesParams,
  config?: ConfigInfiniteQuery<AdminServicesResponse, ServiceDetail>,
) =>
  useInfiniteQuery({
    ...config,
    queryKey: getQueryKey('admin-services', params),
    queryFn: ({pageParam}) =>
      getAdminServices({
        page: pageParam as number,
        ...params,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, AllPages) => {
      const morePagesExist =
        lastPage.data_body.services_paginated.current_page !==
        Math.ceil(lastPage.data_body.services_paginated.total / params.size!);
      if (!morePagesExist) {
        return undefined;
      }

      return AllPages.length + 1;
    },
    select: data => ({
      ...data,
      pages: data.pages.flatMap(page => page.data_body.services_paginated.data),
    }),
  });

export const useAdminServicesDetail = (
  id: string,
): UseQueryResult<AdminServicesDetailResponse, Error> =>
  useQuery({
    queryKey: getQueryKey('admin-services-detail'),
    queryFn: () => getDetailAdminServices(id),
  });

export const useAdminServicesDefaultValuesCustomerData = (
  id: string,
): UseQueryResult<CustomerDataFormValues, Error> =>
  useQuery({
    queryKey: getQueryKey('admin-services-default-values-customer-data'),
    queryFn: async () => {
      const response = await getDetailAdminServices(id);
      const [province, regency, district, village] = await Promise.all([
        getProvincesDetail(
          String(response.data_body.service.customer.address_province_id),
        ),
        getRegenciesDetail(
          String(response.data_body.service.customer.address_city_id),
        ),
        getDistrictsDetail(
          String(response.data_body.service.customer.address_district_id),
        ),
        getVillagesDetail(
          String(response.data_body.service.customer.address_village_id),
        ),
      ]);
      const newResponse: CustomerDataFormValues = {
        bookingDate: response.data_body.service.booking_datetime.split(' ')[0],
        bookingTime: response.data_body.service.booking_datetime.split(' ')[1],
        bookingNumber: response.data_body.service.booking_code,
        fullName: response.data_body.service.customer.name,
        companyName: response.data_body.service.customer.company_name,
        email: response.data_body.service.customer.email,
        phoneNumber: response.data_body.service.customer.mobile_number,
        nearestBranch: response.data_body.service.customer.branches[0],
        province: province.data_body.province,
        regency: regency.data_body.regency,
        district: district.data_body.district,
        village: village.data_body.village,
        postalCode: village.data_body.village.postalCode,
        location: response.data_body.service.customer.address_detail,
        machine_id: response.data_body.service.machine_id,
        master_machine: response.data_body.service.machine.master_machine,
        serialNumber: response.data_body.service.machine.serial_number,
        purchaseDate: response.data_body.service.machine.purchased_date,
        serviceSchedule: '',
        serviceTimeSchedule: '',
      };

      return newResponse as CustomerDataFormValues;
    },
  });

export const useAcceptAdminServicesDetail = (): UseMutationResult<
  AdminServicesDetailResponse,
  Error,
  {id: string; data: UpdateBookingRequestPayload; updateOnly?: boolean}
> =>
  useMutation({
    mutationFn: async (payload: {
      id: string;
      data: UpdateBookingRequestPayload;
      updateOnly?: boolean;
    }) => {
      const {id, data, updateOnly = false} = payload;
      const response = await updateDetailAdminServices(id, data);
      if (!updateOnly) {
        await acceptDetailAdminServices(payload.id);
      }

      return response;
    },
    mutationKey: ['update-detail-admin-services'],
  });

export const useAssignTechnicianAdminServicesDetail = (): UseMutationResult<
  AdminServicesDetailResponse,
  Error,
  {id: string; data: AssignTechnicianRequestPayload}
> =>
  useMutation({
    mutationFn: async (payload: {
      id: string;
      data: AssignTechnicianRequestPayload;
    }) => assignTechnicianAdminServices(payload.id, payload.data),
    mutationKey: ['assign-technisian-admin-services'],
  });

export const useTechnicianOnLocationAdminServices = (): UseMutationResult<
  AdminServicesDetailResponse,
  Error,
  {id: string; data: TechnicianOnLocationRequestPayload}
> =>
  useMutation({
    mutationFn: async (payload: {
      id: string;
      data: TechnicianOnLocationRequestPayload;
    }) => technicianOnLocationAdminServices(payload.id, payload.data),
    mutationKey: ['technisian-on-location-admin-services'],
  });

export const useAfterServiceAdminServices = (): UseMutationResult<
  AdminServicesDetailResponse,
  Error,
  {id: string; data: AfterServiceFormValues}
> =>
  useMutation({
    mutationFn: async (payload: {id: string; data: AfterServiceFormValues}) => {
      const reqAfterServiceItem: AfterServiceItemsRequestPayload = {
        service_cost: Number(payload.data.serviceItems.serviceCost),
        list: payload.data.serviceItems.list.map(item => ({
          sparepart_name: item.sparepartName,
          note: item.note ?? '',
          type: item.type,
          cost: Number(item.cost),
          amount: Number(item.amount),
        })),
      };

      const reqAfterService: AfterServiceRequestPayload = {
        description: payload.data.description,
        feedback: payload.data.feedback,
        photos: payload.data.photos.map(item => item.imagePath),
      };

      await afterServiceItemsAdminServices(payload.id, reqAfterServiceItem);

      const afterService = await afterServiceAdminServices(
        payload.id,
        reqAfterService,
      );

      return afterService;
    },
    mutationKey: ['after-service-admin-services'],
  });

export const useAdminProfile = () =>
  useMutation({
    mutationKey: ['admin-profile'],
    mutationFn: (payload: AdminProfilePayload) => updateAdminProfile(payload),
  });

export const useAdminProfileDetail = (): UseQueryResult<
  AdminProfileDetailResponse,
  Error
> =>
  useQuery({
    queryKey: getQueryKey('admin-detail'),
    queryFn: () => getAdminProfile(),
  });

export const useAdminUpdatePassword = (): UseMutationResult<
  PasswordAdminResponse,
  Error,
  PasswordAdminPayload
> =>
  useMutation({
    mutationKey: getQueryKey('update-password-admin'),
    mutationFn: (payload: PasswordAdminPayload) => updatePasswordAdmin(payload),
  });
