import React from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";
import { Button } from "@/shared/ui/Button/Button";
import { Logo } from "@/shared/ui/Logo/Logo";
import "./Header.scss";

export const Header = () => {
  const { user, logout } = useUserStore();

  return (
    <header className="app-header">
      <div className="app-header__container">
        <Logo />

        <div className="app-header__actions">
          {user ? (
            <>
              <span className="app-header__username">Hi, {user.firstName}</span>
              <Button
                variant="outline"
                onClick={logout}
                className="app-header__logout">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="outline">Sign In</Button>
              </Link>

              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
