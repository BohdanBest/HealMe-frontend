import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import type { RegisterFormData } from "./register.schema";
import { useUserStore } from "../../../../entities/user/model/store";
import { AxiosError } from "axios";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuthData = useUserStore((state) => state.setAuthData);

  const registerUser = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // confirmPassword на бекенд не відправляємо
      const { confirmPassword, ...apiData } = data;
      void confirmPassword; // Явно вказуємо, що змінна не використовується

      const response = await authApi.register(apiData);

      if (response.success && response.user) {
        setAuthData(response.user, response.token);
        navigate("/"); // Або на сторінку "Успіх"
      } else {
        setError(response.message || "Помилка реєстрації");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Щось пішло не так";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { registerUser, isLoading, error };
};
