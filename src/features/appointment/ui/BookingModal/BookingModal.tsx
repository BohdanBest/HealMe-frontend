import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import "@/shared/ui/Modal/Modal.scss"; // Підключаємо наші нові стилі
import type { DoctorAvailability } from "@/entities/doctor/model/types";
import { doctorApi } from "@/entities/doctor/api/doctorApi";
import { appointmentApi } from "@/entities/appointment/api/appointmentApi";
import type { AxiosError } from "axios";

interface BookingModalProps {
  doctorId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BookingForm {
  date: string;
  time: string;
}

const daysMap = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const BookingModal = ({
  doctorId,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) => {
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [selectedDaySlot, setSelectedDaySlot] =
    useState<DoctorAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset } = useForm<BookingForm>();
  const selectedDate = watch("date");

  // 1. При відкритті завантажуємо графік лікаря
  useEffect(() => {
    if (isOpen && doctorId) {
      const fetchSchedule = async () => {
        try {
          const slots = await doctorApi.getDoctorAvailability(doctorId);
          setAvailability(slots);
        } catch (e) {
          console.error("Failed to fetch schedule", e);
        }
      };
      fetchSchedule();
    }
  }, [isOpen, doctorId]);

  // 2. Коли змінюється дата, шукаємо відповідний слот у графіку
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDaySlot(null);
      return;
    }

    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay(); // 0 (Sun) - 6 (Sat)

    // Шукаємо слот для цього дня тижня
    // (Якщо у лікаря кілька слотів на день, тут можна додати логіку вибору, але поки беремо перший)
    const slot = availability.find((s) => s.dayOfWeek === dayOfWeek);
    setSelectedDaySlot(slot || null);
  }, [selectedDate, availability]);

  const onSubmit = async (data: BookingForm) => {
    if (!selectedDaySlot) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);

      // Формуємо повну дату та час
      const startDateTime = new Date(`${data.date}T${data.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 година

      // Перевірка: чи входить час у межі робочого слоту?
      // doctorAvailability повертає час як рядок "09:00:00"
      const slotStart = new Date(`${data.date}T${selectedDaySlot.startTime}`);
      const slotEnd = new Date(`${data.date}T${selectedDaySlot.endTime}`);

      // Додаємо невеликий буфер, щоб не можна було записатись рівно в секунду закриття
      if (startDateTime < slotStart || endDateTime > slotEnd) {
        setErrorMsg(
          `Please choose a time between ${selectedDaySlot.startTime.slice(
            0,
            5
          )} and ${selectedDaySlot.endTime.slice(0, 5)}`
        );
        setIsLoading(false);
        return;
      }

      // Відправка на бекенд
      await appointmentApi.bookAppointment({
        doctorId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });

      alert("Appointment booked successfully!");
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      console.error(err);
      setErrorMsg(
        axiosError.response?.data.message ||
          axiosError.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Book Appointment</h2>
        <p className="modal-subtitle">Select a date and time for your visit.</p>

        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}>
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Input
            type="date"
            label="Date"
            min={todayStr}
            {...register("date", { required: true })}
          />

          {/* Логіка відображення доступності */}
          {selectedDate && !selectedDaySlot && (
            <div
              style={{
                color: "#d97706",
                background: "#fffbeb",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #fcd34d",
                fontSize: "0.9rem",
              }}>
              <strong>Unavailable:</strong> The doctor does not work on{" "}
              {daysMap[new Date(selectedDate).getDay()]}s.
            </div>
          )}

          {selectedDaySlot && (
            <div className="time-selection-block">
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  color: "#166534",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  border: "1px solid #bbf7d0",
                }}>
                <strong>Available Hours:</strong>{" "}
                {selectedDaySlot.startTime.slice(0, 5)} -{" "}
                {selectedDaySlot.endTime.slice(0, 5)}
              </div>

              <Input
                type="time"
                label="Start Time"
                {...register("time", { required: true })}
              />

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                  marginTop: "-1rem",
                  marginLeft: "0.2rem",
                }}>
                *Duration: 1 hour
              </p>

              <Button
                type="submit"
                disabled={isLoading}
                style={{ marginTop: "0.5rem", width: "100%" }}>
                {isLoading ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
