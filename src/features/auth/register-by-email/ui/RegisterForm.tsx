import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "../model/register.schema";
import { useRegister } from "../model/useRegister";
import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { Gender } from "@/shared/api/types/auth";
import { AuthNavbar } from "@/widgets/AuthNavbar/ui/AuthNavbar";
import "./RegisterForm.scss";

export const RegisterForm = () => {
  const { registerUser, isLoading, error: apiError } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isDoctor: false,
      gender: Gender.Male,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="register-page-container">
      <AuthNavbar />

      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h1 className="register-form__title">Register</h1>

        {apiError && (
          <div className="register-form__error-global">{apiError}</div>
        )}

        <div className="register-form__fields">
          {/* Row: First Name + Last Name */}
          <div className="register-form__row">
            <Input
              label="First Name"
              placeholder="Ivan"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Last Name"
              placeholder="Petrenko"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Email (Full width) */}
          <Input
            label="E-Mail"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Gender (Full width) */}
          <div className="ui-input-wrapper">
            <label className="ui-input-wrapper__label">Gender</label>
            <select {...register("gender")} className="register-form__select">
              <option value={Gender.Male}>Male</option>
              <option value={Gender.Female}>Female</option>
            </select>
          </div>

          {/* Password (Full width) */}
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Confirm Password (Full width) */}
          <Input
            label="Confirm Password"
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Checkbox */}
          <div className="register-form__checkbox">
            <label>
              <input type="checkbox" {...register("isDoctor")} />I am a Doctor
            </label>
          </div>
        </div>

        <div className="register-form__actions">
          <Button
            type="submit"
            disabled={isLoading}
            className="register-form__submit-btn">
            {isLoading ? "Registering..." : "Register"}
          </Button>

          <Link to="/login" className="register-form__login-link">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
