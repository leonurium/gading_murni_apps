import {ApiResponse} from './apiResponse';

export type CustomerLocation = {
  user_id: string;
  full_name: string | null;
  image_path: string | null;
  address_detail: string | null;
  address_city_id: string;
  created_at: string;
  updated_at: string;
  address_province: string;
  address_city: string;
  address_district: string;
  address_village: string;
  address_postal_code: string;
  address_province_id: number;
  address_district_id: number;
  address_village_id: number;
};

export type CustomerDataCompleteness = {
  user_id: string;
  geo_latitude: number | null;
  geo_longitude: number | null;
  geo_url: string | null;
  company_name: string;
  is_completed: number;
  created_at: string;
  updated_at: string;
};

export interface Branch {
  id: string;
  name: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  pivot: BranchPivot;
}

export type BranchPivot = {
  user_id: string;
  branch_id: string;
};

export type CustomerDetail = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  is_otp_verified: boolean;
  is_default_password: boolean;
  mobile_number: string;
  type: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string;
  profile?: CustomerLocation;
  customer?: CustomerDataCompleteness;
  branches?: Branch[];
};

export type CustomerDataBody = {
  user: CustomerDetail;
};

export type CustomerResponse = ApiResponse<CustomerDataBody>;

export type CustomerDataCompletionPayload = {
  address_detail: string;
  address_province: string;
  address_city: string;
  address_district: string;
  address_village: string;
  address_postal_code: string;
  address_province_id: number;
  address_city_id: number;
  address_district_id: number;
  address_village_id: number;
  branch_id: string;
  geo_latitude: string;
  geo_longitude: string;
};

export type CustomerProfilePayload = {
  full_name: string;
  email: string;
  mobile_number: string;
  company_name: string;
  image_path?: string;
};

export type LocationPayload = {
  address_detail: string;
  address_province: string;
  address_city: string;
  address_district: string;
  address_village: string;
  address_postal_code: string;
  address_province_id: number;
  address_city_id: number;
  address_district_id: number;
  address_village_id: number;
  branch_id: string;
  geo_latitude: string;
  geo_longitude: string;
};

export type DeleteCustomerAccountPayload = {
  confirmation: 'DELETE_ACCOUNT';
  reason?: string;
};

export type DeleteCustomerAccountResponse = {
  success: boolean;
  message: string;
  data: unknown | null;
};
