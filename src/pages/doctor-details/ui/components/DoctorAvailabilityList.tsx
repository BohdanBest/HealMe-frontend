import React, { useState } from "react";
import { type DoctorAvailability } from "@/entities/doctor/model/types";
import { appointmentApi } from "@/entities/appointment/api/appointmentApi";
import { getNextDateForDayOfWeek } from "@/shared/lib/dateUtils";
import { Button } from "@/shared/ui/Button/Button";
import "./DoctorAvailabilityList.scss";

interface Props {
  doctorId: string;
  availability: DoctorAvailability[];
  onBookSuccess: () => void;
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

export const DoctorAvailabilityList = ({
  doctorId,
  availability,
  onBookSuccess,
}: Props) => {
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);

  const handleSelect = async (slot: DoctorAvailability) => {

    const targetDate = getNextDateForDayOfWeek(slot.dayOfWeek, slot.startTime);

    const dateStr = targetDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    const timeStr = targetDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isConfirmed = window.confirm(
      `Book appointment for next ${
        daysMap[slot.dayOfWeek]
      }, ${dateStr} at ${timeStr}?`
    );

    if (!isConfirmed) return;

    try {
      setLoadingSlotId(slot.id);

      const endTime = new Date(targetDate);
      endTime.setHours(targetDate.getHours() + 1);

      await appointmentApi.bookAppointment({
        doctorId,
        startTime: targetDate.toISOString(),
        endTime: endTime.toISOString(),
      });

      alert("Appointment booked successfully!");
      onBookSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to book appointment.");
    } finally {
      setLoadingSlotId(null);
    }
  };

  if (availability.length === 0) {
    return <div className="no-slots">No availability configured.</div>;
  }

  const sortedSlots = [...availability].sort(
    (a, b) =>
      a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
  );

  return (
    <div className="availability-list">
      <h3 className="list-title">Weekly Availability</h3>
      <div className="slots-container">
        {sortedSlots.map((slot) => (
          <div key={slot.id} className="slot-row">
            <div className="slot-day">{daysMap[slot.dayOfWeek]}</div>

            <div className="slot-time-badge">
              <span className="clock-icon">🕒</span>
              {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
            </div>

            <Button
              className="select-btn"
              onClick={() => handleSelect(slot)}
              disabled={loadingSlotId === slot.id}>
              {loadingSlotId === slot.id ? "Booking..." : "Select"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
