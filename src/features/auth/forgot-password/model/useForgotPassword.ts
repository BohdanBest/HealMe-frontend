import { useState } from "react";
import { authApi } from "@/features/auth/api/authApi";
import { type ForgotPasswordFormData } from "./forgotPassword.schema";
import type { AxiosError } from "axios";

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null); // Для відображення токена (DEV only)

  const requestReset = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setDevToken(null);

    try {
      const response = await authApi.forgotPassword(data);

      if (response.success) {
        setSuccess(true);
        // У продакшені токен приходить на пошту, але зараз бекенд повертає його тут
        if (response.token) {
          setDevToken(response.token);
        }
      } else {
        setError(response.message || "Не вдалося надіслати запит");
      }
    } catch (err) {
     const axiosError = err as AxiosError<{ message?: string }>;
     const msg =
       axiosError.response?.data?.message ||
       axiosError.message ||
       "Сталася помилка";
     setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { requestReset, isLoading, error, success, devToken };
};
