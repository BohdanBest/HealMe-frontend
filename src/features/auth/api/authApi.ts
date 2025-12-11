
import { apiInstance } from "../../../shared/api/instance";
import type {
  AuthResult,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../../../shared/api/types/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResult> => {
    const response = await apiInstance.post<AuthResult>(
      "/api/auth/login",
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResult> => {
    const response = await apiInstance.post<AuthResult>(
      "/api/auth/register",
      data
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<AuthResult> => {
    const response = await apiInstance.post<AuthResult>(
      "/api/auth/forgot-password",
      data
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<AuthResult> => {
    const response = await apiInstance.post<AuthResult>(
      "/api/auth/reset-password",
      data
    );
    return response.data;
  },

  testAuth: async (): Promise<string> => {
    const response = await apiInstance.get<string>("/api/auth/testAuth");
    return response.data;
  },
};
