import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import type { LoginRequest } from "../../../../shared/api/types/auth";
import { useUserStore } from "../../../../entities/user/model/store";
import { AxiosError } from "axios";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuthData = useUserStore((state) => state.setAuthData);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data);

      if (response.success && response.user) {
        setAuthData(response.user, response.token);
        navigate("/");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
