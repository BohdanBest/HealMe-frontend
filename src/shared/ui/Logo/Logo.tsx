import { Link } from "react-router-dom";
import logoSrc from "@/shared/assets/healme-logo.svg"; // Імпорт файлу як шляху
import "./Logo.scss";

interface LogoProps {
  className?: string;
  to?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo = ({
  className = "",
  to = "/",
  width = 180,
  height = 80,
}: LogoProps) => {
  return (
    <Link to={to} className={`ui-logo ${className}`}>
      <img
        src={logoSrc}
        alt="HealMe Logo"
        width={width}
        height={height}
        className="ui-logo__image"
      />
    </Link>
  );
};
