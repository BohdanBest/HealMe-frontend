import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../model/forgotPassword.schema";
import { useForgotPassword } from "../model/useForgotPassword";
import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { AuthNavbar } from "@/widgets/AuthNavbar/ui/AuthNavbar";
import "./ForgotPasswordForm.scss";

export const ForgotPasswordForm = () => {
  const { requestReset, isLoading, error, success, devToken } =
    useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues, // <--- ДОДАЛИ getValues, щоб дістати email
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  if (success) {
    // Отримуємо введений email
    const email = getValues("email");

    return (
      <div className="forgot-password-page-container">
        <AuthNavbar />
        <div className="forgot-password-form">
          <h1 className="forgot-password-form__title">Check your email</h1>
          <p className="forgot-password-form__subtitle">
            We have sent instructions to recover your password.
          </p>

          <div className="forgot-password-form__actions">
            <Link
              to={`/reset-password?token=${encodeURIComponent(
                devToken || ""
              )}&email=${encodeURIComponent(email)}`}>
              <Button className="forgot-password-form__submit-btn">
                Reset Password Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page-container">
      <AuthNavbar />

      <div className="forgot-password-content-wrapper">
        <form
          onSubmit={handleSubmit(requestReset)}
          className="forgot-password-form">
          <h1 className="forgot-password-form__title">Forgot password</h1>
          <p className="forgot-password-form__subtitle">
            You will receive instructions for resetting your password
          </p>

          {error && (
            <div className="forgot-password-form__error-global">{error}</div>
          )}

          <div className="forgot-password-form__fields">
            <Input
              label="E-Mail"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="forgot-password-form__actions">
            <Button
              type="submit"
              disabled={isLoading}
              className="forgot-password-form__submit-btn">
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
