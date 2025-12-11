export const Gender = {
  Male: 0,
  Female: 1,
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  roles: string[];
}

export interface AuthResult {
  success: boolean;
  message: string;
  token: string;
  user?: UserInfo;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  isDoctor: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}
