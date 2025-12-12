import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import "./DoctorDetailsPage.scss";

import { doctorApi } from "@/entities/doctor/api/doctorApi";

import { useUserStore } from "@/entities/user/model/store";
import { BookingModal } from "@/features/appointment/ui/BookingModal/BookingModal";
import { AppointmentConfirmModal } from "@/features/appointment/ui/AppointmentConfirmModal/AppointmentConfirmModal";
import type {
  DoctorAvailability,
  DoctorProfile,
  DoctorReview,
} from "@/entities/doctor/model/types";
import type { Appointment } from "@/entities/appointment/model/types";
import { appointmentApi } from "@/entities/appointment/api/appointmentApi";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const calculateAppointmentDate = (
  dayOfWeek: number,
  startTime: string
): Date => {
  const now = new Date();
  const currentDayOfWeek = now.getDay();
  let daysUntil = dayOfWeek - currentDayOfWeek;

  if (daysUntil < 0) daysUntil += 7;

  if (daysUntil === 0) {
    const [hours, minutes] = startTime.split(":").map(Number);
    const slotTime = new Date(now);
    slotTime.setHours(hours, minutes, 0, 0);
    if (slotTime <= now) daysUntil = 7;
  }

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysUntil);
  const [hours, minutes] = startTime.split(":").map(Number);
  targetDate.setHours(hours, minutes, 0, 0);
  targetDate.setSeconds(0);
  targetDate.setMilliseconds(0);

  return targetDate;
};

export const DoctorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const { user } = useUserStore();

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);

  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "schedule" | "reviews">(
    "about"
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    slotId: string;
    startDate: Date;
    endDate: Date;
    dateStr: string;
    timeStr: string;
  } | null>(null);

  const fetchMyAppointments = async () => {
    if (!user) return;
    try {
      const apps = await appointmentApi.getMyAppointments();
      setMyAppointments(apps);
    } catch (e) {
      console.error("Failed to load appointments", e);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [docData, availData, reviewData] = await Promise.all([
          doctorApi.getDoctorById(id),
          doctorApi.getDoctorAvailability(id),
          doctorApi.getDoctorReviews(id),
        ]);

        setDoctor(docData);
        setAvailability(availData);
        setReviews(reviewData);

        await fetchMyAppointments();
      } catch (err) {
        console.error(err);
        setError("Failed to load doctor information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const sortedAvailability = [...availability].sort((a, b) => {
    const getDayIndex = (d: number) => (d === 0 ? 7 : d);
    const dayA = getDayIndex(a.dayOfWeek);
    const dayB = getDayIndex(b.dayOfWeek);
    if (dayA !== dayB) return dayA - dayB;
    return a.startTime.localeCompare(b.startTime);
  });

  const onSelectSlot = (slot: DoctorAvailability) => {
    const startDate = calculateAppointmentDate(slot.dayOfWeek, slot.startTime);
    const endDate = new Date(startDate);
    const [endH, endM] = slot.endTime.split(":").map(Number);
    endDate.setHours(endH, endM, 0, 0);

    const dateStr = startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const timeStr = startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setConfirmData({
      slotId: slot.id,
      startDate,
      endDate,
      dateStr,
      timeStr,
    });
  };

  const handleConfirmBooking = async () => {
    if (!confirmData || !doctor) return;

    try {
      setIsProcessing(true);
      await appointmentApi.bookAppointment({
        doctorId: doctor.id,
        startTime: confirmData.startDate.toISOString(),
        endTime: confirmData.endDate.toISOString(),
      });

      // Оновлюємо список записів, щоб слот став сірим
      await fetchMyAppointments();

      setConfirmData(null);
      // Не переходимо на іншу сторінку, залишаємось тут
      alert("Appointment booked successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to book slot. It might be taken or invalid.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (time: string) => time.slice(0, 5);

  if (isLoading)
    return (
      <div className="doctor-details-layout">
        <Sidebar />
        <div className="main-content loading">Loading...</div>
      </div>
    );
  if (error || !doctor)
    return (
      <div className="doctor-details-layout">
        <Sidebar />
        <div className="main-content error">
          <h2>{error || "Doctor not found"}</h2>
        </div>
      </div>
    );

  const initials = `${doctor.firstName?.[0] || ""}${
    doctor.lastName?.[0] || ""
  }`;

  return (
    <div className="doctor-details-layout">
      <Sidebar />

      <main className="main-content">
        <div className="doctor-profile-container">
          <div className="profile-header">
            {/* ... (Header code) ... */}
            <Link to="/doctors" className="back-link">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to list
            </Link>

            <div className="profile-card">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-info">
                <h1 className="doctor-name">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="doctor-spec">
                  {doctor.specializationId || "Specialist"}
                </p>
                <div className="doctor-meta">
                  <span className="price">${doctor.consultationFee} / hr</span>
                  <span className="license">
                    License: {doctor.medicalInstitutionLicense}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}>
              About
            </button>
            <button
              className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}>
              Schedule
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}>
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "about" && (
              /* ... (About content) ... */
              <div className="about-section fade-in">
                <div className="info-block">
                  <h3>Biography</h3>
                  <p>{doctor.biography || "No biography provided."}</p>
                </div>
                <div className="info-block">
                  <h3>Contact</h3>
                  <div className="contact-row">
                    <span className="label">Phone:</span>
                    <span className="value">
                      {doctor.phoneNumber || "Not available"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* --- SCHEDULE SECTION --- */}
            {activeTab === "schedule" && (
              <div className="schedule-section fade-in">
                <h3>Weekly Availability</h3>
                {sortedAvailability.length > 0 ? (
                  <div className="availability-list">
                    {sortedAvailability.map((slot) => {
                      // 1. Рахуємо, коли буде цей слот наступного разу
                      const potentialDate = calculateAppointmentDate(
                        slot.dayOfWeek,
                        slot.startTime
                      );
                      const isBooked = myAppointments.some((app) => {
                        if (app.status === 2) return false;

                        const appDate = new Date(app.startTime);
                        return (
                          app.doctorId === doctor.id &&
                          Math.abs(
                            appDate.getTime() - potentialDate.getTime()
                          ) < 60000
                        );
                      });

                      return (
                        <div
                          key={slot.id}
                          className={`availability-item ${
                            isBooked ? "disabled" : ""
                          }`}>
                          <div className="availability-day">
                            <span className="day-name">
                              {daysOfWeek[slot.dayOfWeek]}
                            </span>
                          </div>
                          <div className="availability-time">
                            <span className="time-badge">
                              {formatTime(slot.startTime)} -{" "}
                              {formatTime(slot.endTime)}
                            </span>
                          </div>

                          <button
                            className="book-slot-btn"
                            onClick={() => onSelectSlot(slot)}
                            disabled={isBooked}>
                            {isBooked ? "Booked" : "Select"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>This doctor hasn't added any working hours yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              /* ... (Reviews content) ... */
              <div className="reviews-section fade-in">
                <h3>Patient Reviews</h3>
                {reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="stars">
                            {"★".repeat(review.rating)}
                            <span className="stars-empty">
                              {"★".repeat(5 - review.rating)}
                            </span>
                          </div>
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-text">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No reviews yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <BookingModal
          doctorId={doctor.id}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => {
            fetchMyAppointments(); // Оновлюємо, якщо забронювали через модалку
            alert("Booked!");
          }}
        />

        <AppointmentConfirmModal
          isOpen={!!confirmData}
          onClose={() => setConfirmData(null)}
          onConfirm={handleConfirmBooking}
          isLoading={isProcessing}
          doctorName={`${doctor.firstName} ${doctor.lastName}`}
          dateStr={confirmData?.dateStr || ""}
          timeStr={confirmData?.timeStr || ""}
        />
      </main>
    </div>
  );
};
