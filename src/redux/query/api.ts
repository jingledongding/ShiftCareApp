import {createApi, BaseQueryFn} from '@reduxjs/toolkit/query/react';
import type { DoctorAvailability } from '@/types/doctor';

// 自定义 baseQuery 以支持 React Native
const customBaseQuery: BaseQueryFn<
  {
    url: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  },
  unknown,
  {status: number; data: any}
> = async ({url, method = 'GET', body, headers}, api) => {
  try {
    console.log('🚀 Starting request:', {url, method});

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('📡 Response received:', {status: response.status, ok: response.ok});

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.statusText);
      console.log('❌ Response error:', errorData);
      return {
        error: {
          status: response.status,
          data: errorData,
        },
      };
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    return {data};
  } catch (error: any) {
    console.log('❌ API Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return {
      error: {
        status: error.name === 'AbortError' ? 408 : 500,
        data: error.message || 'Network request failed',
      },
    };
  }
};

const baseUrl = 'https://raw.githubusercontent.com';

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
  refetchOnReconnect: true,
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    doctorList: builder.query<DoctorAvailability[], void>({
      query: () => ({
        url: `${baseUrl}/suyogshiftcare/jsontest/main/available.json`,
        method: 'GET',
      }),
    }),
  }),
});

// 导出 hooks
export const { useDoctorListQuery } = doctorApi;