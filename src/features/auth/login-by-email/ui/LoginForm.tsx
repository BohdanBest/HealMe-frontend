import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../model/login.schema";
import { useLogin } from "../model/useLogin";
import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { AuthNavbar } from "@/widgets/AuthNavbar/ui/AuthNavbar"; // <--- Імпорт віджета
import "./LoginForm.scss";

export const LoginForm = () => {
  const { login, isLoading, error: apiError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="login-page-container">
      {/* Використовуємо новий компонент */}
      <AuthNavbar />

      <form onSubmit={handleSubmit(login)} className="login-form">
        <h1 className="login-form__title">Sign in</h1>

        {/* ... решта коду форми без змін ... */}
        {apiError && <div className="login-form__error-global">{apiError}</div>}

        <div className="login-form__fields">
          <Input
            label="E-Mail"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="login-form__forgot-wrapper">
          <Link to="/forgot-password" className="login-form__forgot-link">
            Forgot your password?
          </Link>
        </div>

        <div className="login-form__actions">
          <Button
            type="submit"
            disabled={isLoading}
            className="login-form__submit-btn">
            {isLoading ? "Login..." : "Login"}
          </Button>

          <Link to="/register" className="login-form__register-link">
            Register now
          </Link>
        </div>
      </form>
    </div>
  );
};
