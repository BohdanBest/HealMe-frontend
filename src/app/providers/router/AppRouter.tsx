import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";
import { HomePage } from "@/pages/home/ui/HomePage";
import { LoginForm } from "@/features/auth/login-by-email/ui/LoginForm";
import { RegisterForm } from "@/features/auth/register-by-email/ui/RegisterForm";
import { ForgotPasswordForm } from "@/features/auth/forgot-password/ui/ForgotPasswordForm";
import { ResetPasswordForm } from "@/features/auth/reset-password/ui/ResetPasswordForm";
import { DoctorsPage } from "@/pages/doctors/ui/DoctorsPage";
import { DoctorDetailsPage } from "@/pages/doctor-details/ui/DoctorDetailsPage";
import { PatientProfilePage } from "@/pages/profile/ui/PatientProfilePage";
import { AppointmentsPage } from "@/pages/appointments/ui/AppointmentsPage";
import { DoctorSchedulePage } from "@/pages/doctor-schedule/ui/DoctorSchedulePage";
import { DoctorProfileEditPage } from "@/pages/doctor-dashboard/ui/DoctorProfileEditPage";
import { ChatPage } from "@/pages/chat/ui/ChatPage";
import { ChatsPage } from "@/pages/chats/ui/ChatsPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useUserStore((state) => state.isAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useUserStore((state) => state.isAuth);

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordForm />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordForm />
          </PublicRoute>
        }
      />

      <Route path="/" element={<HomePage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/doctors/:id" element={<DoctorDetailsPage />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <PatientProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/doctor/me"
        element={
          <PrivateRoute>
            <DoctorProfileEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/schedule"
        element={
          <PrivateRoute>
            <DoctorSchedulePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:appointmentId"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <PrivateRoute>
            <ChatsPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
