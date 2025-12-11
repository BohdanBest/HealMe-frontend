import { type InputHTMLAttributes, forwardRef } from "react";
import "./Input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}


export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={`ui-input-wrapper ${className}`}>
        {label && (
          <label htmlFor={inputId} className="ui-input-wrapper__label">
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={`ui-input ${error ? "ui-input--error" : ""}`}
          {...props}
        />

        {error && <span className="ui-input-wrapper__error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
