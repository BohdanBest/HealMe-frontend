import axios, { AxiosError } from "axios";
import { useUserStore } from "../../entities/user/model/store";

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
