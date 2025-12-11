import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { type ResetPasswordFormData } from "./resetPassword.schema";
import type { AxiosError } from "axios";

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const resetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.resetPassword({
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(response.message || "Не вдалося змінити пароль");
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

  return { resetPassword, isLoading, error, success };
};
