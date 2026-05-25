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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Уникаємо нескінченної рекурсії для ендпоінту оновлення
    if (originalRequest.url === "/api/auth/refresh-token") {
      useUserStore.getState().logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      const { token, refreshToken, setAuthData, logout } = useUserStore.getState();

      if (token && refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
            token,
            refreshToken,
          });

          const newAuthResult = response.data;
          if (newAuthResult.success && newAuthResult.user) {
            setAuthData(
              newAuthResult.user,
              newAuthResult.token,
              newAuthResult.refreshToken || ""
            );
            processQueue(null, newAuthResult.token);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAuthResult.token}`;
            }
            return apiInstance(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      logout();
    }

    return Promise.reject(error);
  }
);

