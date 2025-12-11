import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import type { DoctorAvailability } from "@/entities/doctor/model/types";
import { doctorApi, type CreateAvailabilityRequest } from "@/entities/doctor/api/doctorApi";

const daysMap = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ScheduleDrawerProps {
  isOpen: boolean;
  dayOfWeek: number | null;
  onClose: () => void;
  existingSlots: DoctorAvailability[];
  onSlotAdded: (slot: DoctorAvailability) => void;
}

export const ScheduleDrawer = ({
  isOpen,
  dayOfWeek,
  onClose,
  existingSlots,
  onSlotAdded,
}: ScheduleDrawerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } =
    useForm<CreateAvailabilityRequest>();

  const onSubmit = async (data: CreateAvailabilityRequest) => {
    if (dayOfWeek === null) return;

    try {
      setIsSubmitting(true);
      const payload = {
        dayOfWeek: dayOfWeek,
        startTime: data.startTime + ":00",
        endTime: data.endTime + ":00",
      };

      const newSlot = await doctorApi.createAvailability(payload);
      onSlotAdded(newSlot);
      reset();
    } catch (error) {
      console.error(error);
      alert("Failed to add slot. Check overlaps.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className={`schedule-drawer ${isOpen ? "open" : ""}`}>
      <div className="drawer-header">
        <h3>Edit {dayOfWeek !== null ? daysMap[dayOfWeek] : ""}s</h3>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="drawer-body">
        <div className="drawer-section">
          <h4>Add New Slot</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="drawer-form">
            <Input
              type="time"
              label="Start"
              {...register("startTime", { required: true })}
            />
            <Input
              type="time"
              label="End"
              {...register("endTime", { required: true })}
            />
            <Button type="submit" disabled={isSubmitting} className="add-btn">
              {isSubmitting ? "Adding..." : "+ Add Slot"}
            </Button>
          </form>
        </div>

        <div className="drawer-section">
          <h4>Existing Slots</h4>
          {existingSlots.length > 0 ? (
            <ul className="drawer-slots-list">
              {existingSlots
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((slot) => (
                  <li key={slot.id} className="drawer-slot-item">
                    <span>
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="no-slots">No slots for this day yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
};
