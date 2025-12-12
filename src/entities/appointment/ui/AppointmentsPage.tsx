import React, { useEffect, useState } from "react";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { useUserStore } from "@/entities/user/model/store";
import { Button } from "@/shared/ui/Button/Button";
import "./AppointmentsPage.scss";
import { AppointmentStatus, type Appointment } from "../model/types";
import { appointmentApi } from "../api/appointmentApi";

const getStatusLabel = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Pending:
      return <span className="badge pending">Pending</span>;
    case AppointmentStatus.Confirmed:
      return <span className="badge confirmed">Confirmed</span>;
    case AppointmentStatus.Cancelled:
      return <span className="badge cancelled">Cancelled</span>;
    default:
      return status;
  }
};

export const AppointmentsPage = () => {
  const { user } = useUserStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isDoctor = user?.roles?.includes("Doctor");

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentApi.getMyAppointments();
      setAppointments(
        data.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        )
      );
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      await appointmentApi.cancelAppointment(id);
      loadAppointments();
    } catch (e) {
      console.error(e);
      alert(
        "Failed to cancel. Note: You cannot cancel appointments less than 4 hours before start."
      );
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await appointmentApi.confirmAppointment(id);
      loadAppointments();
    } catch (e) {
      console.error(e);
      alert("Failed to confirm appointment.");
    }
  };

  if (isLoading)
    return (
      <div className="appointments-layout">
        <Sidebar />
        <div className="content loading">Loading...</div>
      </div>
    );

  return (
    <div className="appointments-layout">
      <Sidebar />
      <main className="content">
        <div className="page-header">
          <h1 className="page-title">
            {isDoctor ? "Patient Appointments" : "My Appointments"}
          </h1>
        </div>

        <div className="appointments-container">
          {errorMsg && <div className="alert error">{errorMsg}</div>}

          {appointments.length === 0 ? (
            <div className="empty-state">No appointments found.</div>
          ) : (
            <div className="appointments-list">
              {appointments.map((app) => {
                const start = new Date(app.startTime);
                const end = new Date(app.endTime);
                const isPast = end < new Date();

                return (
                  <div
                    key={app.id}
                    className={`appointment-card ${isPast ? "past" : ""}`}>
                    <div className="card-header">
                      <div className="date-box">
                        <span className="day">{start.getDate()}</span>
                        <span className="month">
                          {start.toLocaleString("default", { month: "short" })}
                        </span>
                      </div>
                      <div className="time-info">
                        <div className="time">
                          {start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {end.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="year">{start.getFullYear()}</div>
                      </div>
                      <div className="status-box">
                        {getStatusLabel(app.status)}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="info-row">
                        <span className="label">
                          {isDoctor ? "Patient ID:" : "Doctor ID:"}
                        </span>
                        <span className="value">
                          {isDoctor ? app.patientId : app.doctorId}
                        </span>
                      </div>
                    </div>

                    {!isPast && app.status !== AppointmentStatus.Cancelled && (
                      <div className="card-actions">
                        {isDoctor &&
                          app.status === AppointmentStatus.Pending && (
                            <Button
                              onClick={() => handleConfirm(app.id)}>
                              Confirm
                            </Button>
                          )}

                        <Button
                          variant="outline"
                          className="cancel-btn"
                          onClick={() => handleCancel(app.id)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
