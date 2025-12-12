import { useEffect, useState } from "react";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";

import { useUserStore } from "@/entities/user/model/store";
import { Button } from "@/shared/ui/Button/Button";
import "./AppointmentsPage.scss";
import {
  AppointmentStatus,
  type Appointment,
} from "@/entities/appointment/model/types";
import { appointmentApi } from "@/entities/appointment/api/appointmentApi";
import { patientApi } from "@/entities/patient/api/patientApi";
import { doctorApi } from "@/entities/doctor/api/doctorApi";
import { Link } from "react-router-dom";

export const AppointmentsPage = () => {
  const { user } = useUserStore();
  const isDoctor = user?.roles?.includes("Doctor");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profilesMap, setProfilesMap] = useState<
    Record<string, { firstName: string; lastName: string; subtext: string }>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentApi.getMyAppointments();
      const sorted = data.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setAppointments(sorted);

      const newProfilesMap: Record<
        string,
        { firstName: string; lastName: string; subtext: string }
      > = {};

      if (isDoctor) {
        const uniquePatientIds = Array.from(
          new Set(data.map((a) => a.patientId))
        );

        await Promise.all(
          uniquePatientIds.map(async (patId) => {
            try {
              const p = await patientApi.getPatientById(patId);
              if (p) {
                newProfilesMap[patId] = {
                  firstName: p.firstName,
                  lastName: p.lastName,
                  subtext: p.email,
                };
              }
            } catch (e) {
              console.error(`Failed to load patient ${patId}`, e);
            }
          })
        );
      } else {
        const uniqueDoctorIds = Array.from(
          new Set(data.map((a) => a.doctorId))
        );

        await Promise.all(
          uniqueDoctorIds.map(async (docId) => {
            try {
              const d = await doctorApi.getDoctorById(docId);
              if (d) {
                newProfilesMap[docId] = {
                  firstName: d.firstName,
                  lastName: d.lastName,
                  subtext: d.specializationId,
                };
              }
            } catch (e) {
              console.error(`Failed to load doctor ${docId}`, e);
            }
          })
        );
      }

      setProfilesMap(newProfilesMap);
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      setActionLoadingId(id);
      await appointmentApi.cancelAppointment(id);
      await fetchAppointments();
    } catch {
      alert("Error cancelling");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      setActionLoadingId(id);
      await appointmentApi.confirmAppointment(id);
      await fetchAppointments();
    } catch {
      alert("Error confirming");
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStatus = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Pending:
        return <span className="status-badge pending">PENDING</span>;
      case AppointmentStatus.Confirmed:
        return <span className="status-badge confirmed">CONFIRMED</span>;
      case AppointmentStatus.Cancelled:
        return <span className="status-badge cancelled">CANCELLED</span>;
      default:
        return null;
    }
  };

  if (isLoading)
    return (
      <div className="appointments-layout">
        <Sidebar />
        <div className="main-content loading">Loading...</div>
      </div>
    );

  return (
    <div className="appointments-layout">
      <Sidebar />
      <main className="main-content">
        <div className="appointments-container">
          <div className="page-header">
            <h1 className="page-title">
              {isDoctor ? "Patient Appointments" : "My Appointments"}
            </h1>
            <div className="header-divider"></div>
          </div>

          <div className="appointments-list">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments yet.</p>
              </div>
            ) : (
              appointments.map((app) => {
                const startDate = new Date(app.startTime);
                const endDate = new Date(app.endTime);
                const isPast = endDate < new Date();

                const targetProfileId = isDoctor ? app.patientId : app.doctorId;
                const profile = profilesMap[targetProfileId];

                const displayName = profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Loading...";
                const titlePrefix = isDoctor ? "" : "Dr. ";
                const displaySubtext = profile?.subtext || "";

                return (
                  <div
                    key={app.id}
                    className={`appointment-card ${isPast ? "past" : ""}`}>
                    <div className="card-date-section">
                      <div className="date-box">
                        <span className="day">{startDate.getDate()}</span>
                        <span className="month">
                          {startDate
                            .toLocaleString("en-US", { month: "short" })
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="card-info-section">
                      <div className="person-row">
                        <div className="mini-avatar">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div className="person-details">
                          <div className="person-name">
                            {titlePrefix}
                            {displayName}
                          </div>
                          <div className="person-subtext">{displaySubtext}</div>
                        </div>
                      </div>
                      <div className="time-range">
                        🕒{" "}
                        {startDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {endDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="card-actions-section">
                      {renderStatus(app.status)}
                      <div className="action-buttons">
                        {isDoctor &&
                          app.status === AppointmentStatus.Pending &&
                          !isPast && (
                            <Button
                              className="confirm-btn"
                              onClick={() => handleConfirm(app.id)}
                              disabled={actionLoadingId === app.id}>
                              {actionLoadingId === app.id ? "..." : "Confirm"}
                            </Button>
                          )}
                        {app.status !== AppointmentStatus.Cancelled && (
                          <Link
                            to={`/chat/${app.id}`}
                            style={{ textDecoration: "none" }}>
                            <Button
                              variant="outline"
                              style={{
                                padding: "0.5rem 1rem",
                                fontSize: "0.9rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}>
                              <span>💬</span> Chat
                            </Button>
                          </Link>
                        )}
                        {app.status !== AppointmentStatus.Cancelled &&
                          !isPast && (
                            <button
                              className="cancel-link"
                              onClick={() => handleCancel(app.id)}
                              disabled={actionLoadingId === app.id}>
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
