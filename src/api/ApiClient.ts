/* eslint-disable @typescript-eslint/no-shadow */
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from 'axios';
import {RootState, store} from '../store/store';
import {ApiResponse} from '../@types/apiResponse';
import Toast from 'react-native-simple-toast';
import {config} from '../constants/Configs';
import {navigationRef} from '../navigations/navigationService';
import {startNetworkLogging} from 'react-native-network-logger';

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const onRequest = async (
  config: AdaptAxiosRequestConfig,
): Promise<AdaptAxiosRequestConfig> => {
  const state = store.getState() as RootState;
  const token = state.user.token;
  if (token) {
    config!.headers!.Authorization = `Bearer ${token}`;
  }
  // console.info(`[request: ${config.url}] [${JSON.stringify(config, null, 2)}]`);
  return config;
};

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.log(
  //   `[response: ${response.config.url}] [${JSON.stringify(
  //     response.data,
  //     null,
  //     2,
  //   )}]`,
  // );
  return response.data;
};

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  console.error(
    `[error: ${error.config?.url}] [${JSON.stringify(
      error.response,
      null,
      2,
    )}]`,
  );

  const errorResponse = error.response?.data as
    | ApiResponse<unknown>
    | undefined;

  if (errorResponse && typeof errorResponse.data_header?.message === 'string') {
    Toast.show(errorResponse.data_header.message, Toast.SHORT);
  }

  if (error.response?.status === 401) {
    navigationRef.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
  }
  return Promise.reject(error.response?.data);
};

const setupInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

const ApiClient = setupInterceptors(
  Axios.create({
    baseURL: config.baseURL,
    timeout: 60000,
  }),
);

// Start network logging for debugging (only in DEV mode)
if (__DEV__) {
  startNetworkLogging();
}

export default ApiClient;
