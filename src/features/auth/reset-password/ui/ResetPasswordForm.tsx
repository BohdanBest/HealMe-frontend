import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../model/resetPassword.schema";
import { useResetPassword } from "../model/useResetPassword";
import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { AuthNavbar } from "@/widgets/AuthNavbar/ui/AuthNavbar";
import "./ResetPasswordForm.scss";

export const ResetPasswordForm = () => {
  const { resetPassword, isLoading, error, success } = useResetPassword();
  const [searchParams] = useSearchParams();

  // Отримуємо email та token з URL
  const emailFromUrl = searchParams.get("email") || "";
  const tokenFromUrl = searchParams.get("token") || "";

  // --- ВИПРАВЛЕННЯ: Прибрали <ResetPasswordFormData> ---
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      token: tokenFromUrl,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Оновлюємо значення форми, якщо URL параметри завантажились із затримкою
  useEffect(() => {
    if (emailFromUrl) setValue("email", emailFromUrl);
    if (tokenFromUrl) setValue("token", tokenFromUrl);
  }, [emailFromUrl, tokenFromUrl, setValue]);

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(data);
  };

  if (success) {
    return (
      <div className="reset-password-page-container">
        <AuthNavbar />
        <div className="reset-password-content-wrapper">
          <div className="reset-password-form">
            <h1 className="reset-password-form__title">Password Changed!</h1>
            <p className="reset-password-form__subtitle">
              Your password has been reset successfully.
            </p>
            <div className="reset-password-form__actions">
              <Link to="/login">
                <Button className="reset-password-form__submit-btn">
                  Sign In Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page-container">
      <AuthNavbar />

      <div className="reset-password-content-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
          <h1 className="reset-password-form__title">Reset password</h1>

          {error && (
            <div className="reset-password-form__error-global">{error}</div>
          )}

          {!tokenFromUrl && (
            <div className="reset-password-form__warning">
              Warning: Missing reset token in URL.
            </div>
          )}

          {/* Приховані поля */}
          <input type="hidden" {...register("email")} />
          <input type="hidden" {...register("token")} />

          <div className="reset-password-form__fields">
            <Input
              label="Password"
              type="password"
              error={errors.newPassword?.message as string}
              {...register("newPassword")}
            />

            <Input
              label="Confirm password"
              type="password"
              error={errors.confirmNewPassword?.message as string}
              {...register("confirmNewPassword")}
            />
          </div>

          <div className="reset-password-form__actions">
            <Button
              type="submit"
              disabled={isLoading}
              className="reset-password-form__submit-btn">
              {isLoading ? "Resetting..." : "Reset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
