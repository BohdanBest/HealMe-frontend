import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { Button } from "@/shared/ui/Button/Button";
import "./DoctorDetailsPage.scss";
import type { DoctorAvailability, DoctorProfile, DoctorReview } from "@/entities/doctor/model/types";
import { doctorApi } from "@/entities/doctor/api/doctorApi";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DoctorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"about" | "schedule" | "reviews">(
    "about"
  );

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
      } catch (err) {
        console.error("Failed to load doctor details", err);
        setError("Failed to load doctor information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const sortedAvailability = [...availability].sort((a, b) => {
    const getDayIndex = (d: number) => (d === 0 ? 7 : d);
    const dayA = getDayIndex(a.dayOfWeek);
    const dayB = getDayIndex(b.dayOfWeek);

    if (dayA !== dayB) return dayA - dayB;
    return a.startTime.localeCompare(b.startTime);
  });

  const formatTime = (time: string) => time.slice(0, 5);

  if (isLoading) {
    return (
      <div className="doctor-details-layout">
        <Sidebar />
        <div className="main-content loading">Loading...</div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="doctor-details-layout">
        <Sidebar />
        <div className="main-content error">
          <h2>{error || "Doctor not found"}</h2>
          <Link to="/doctors">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = `${doctor.firstName?.[0] || ""}${
    doctor.lastName?.[0] || ""
  }`;

  return (
    <div className="doctor-details-layout">
      <Sidebar />

      <main className="main-content">
        <div className="doctor-profile-container">
          <div className="profile-header">
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
                  <span className="separator">•</span>
                  <span className="license">
                    License: {doctor.medicalInstitutionLicense}
                  </span>
                </div>
              </div>
              <div className="profile-actions">
                <Button onClick={() => setActiveTab("schedule")}>
                  Book Appointment
                </Button>
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

            {activeTab === "schedule" && (
              <div className="schedule-section">
                <h3>Weekly Availability</h3>

                {sortedAvailability.length > 0 ? (
                  <div className="availability-list">
                    {sortedAvailability.map((slot) => (
                      <div key={slot.id} className="availability-item">
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

                        <button className="book-slot-btn">Select</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>This doctor hasn't added any working hours yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
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
      </main>
    </div>
  );
};
