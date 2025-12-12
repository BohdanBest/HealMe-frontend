import { Logo } from "@/shared/ui/Logo/Logo";
import "./AuthNavbar.scss";

interface AuthNavbarProps {
  className?: string;
}

export const AuthNavbar = ({ className = "" }: AuthNavbarProps) => {
  return (
    <div className={`auth-navbar ${className}`}>
      <div className="auth-navbar__content">
        <Logo />
      </div>
      <div className="auth-navbar__line" />
    </div>
  );
};
