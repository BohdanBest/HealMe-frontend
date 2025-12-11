import type { ButtonHTMLAttributes } from "react";
import "./Button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button = ({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const rootClasses = [
    "ui-button",
    `ui-button--${variant}`,
    isLoading ? "ui-button--loading" : "",
    className,
  ]
    .join(" ")
    .trim();

  return (
    <button className={rootClasses} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className="ui-button__spinner" />}
      <span className="ui-button__text">{children}</span>
    </button>
  );
};
