import { useState, useEffect } from "react";
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
  onSlotDeleted: (id: string) => void;
  onSlotUpdated: (slot: DoctorAvailability) => void;
}

export const ScheduleDrawer = ({
  isOpen,
  dayOfWeek,
  onClose,
  existingSlots,
  onSlotAdded,
  onSlotDeleted,
  onSlotUpdated,
}: ScheduleDrawerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const { register, handleSubmit, reset } =
    useForm<CreateAvailabilityRequest>();

  // Скидаємо режими при закритті/відкритті для іншого дня
  useEffect(() => {
    cancelEdit();
  }, [dayOfWeek, isOpen]);

  const onSubmit = async (data: CreateAvailabilityRequest) => {
    if (dayOfWeek === null) return;

    try {
      setIsSubmitting(true);
      const payload = {
        dayOfWeek: dayOfWeek,
        startTime: data.startTime.length === 5 ? data.startTime + ":00" : data.startTime,
        endTime: data.endTime.length === 5 ? data.endTime + ":00" : data.endTime,
      };

      if (editingSlotId) {
        const updatedSlot = await doctorApi.updateAvailability(editingSlotId, {
          startTime: payload.startTime,
          endTime: payload.endTime,
        });
        onSlotUpdated(updatedSlot);
        setEditingSlotId(null);
      } else {
        const newSlot = await doctorApi.createAvailability(payload);
        onSlotAdded(newSlot);
      }
      reset({ startTime: "", endTime: "" });
    } catch (error) {
      console.error(error);
      alert(
        editingSlotId
          ? "Failed to update slot. Check overlaps."
          : "Failed to add slot. Check overlaps."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability slot?")) return;
    try {
      setDeletingSlotId(id);
      await doctorApi.deleteAvailability(id);
      onSlotDeleted(id);
      if (editingSlotId === id) {
        cancelEdit();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete slot.");
    } finally {
      setDeletingSlotId(null);
    }
  };

  const startEdit = (slot: DoctorAvailability) => {
    setEditingSlotId(slot.id);
    reset({
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
    });
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    reset({ startTime: "", endTime: "" });
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
          <h4>{editingSlotId ? "Edit Slot" : "Add New Slot"}</h4>
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
            <div className="drawer-form-actions">
              <Button type="submit" disabled={isSubmitting} className="add-btn">
                {isSubmitting
                  ? editingSlotId
                    ? "Updating..."
                    : "Adding..."
                  : editingSlotId
                  ? "Update Slot"
                  : "+ Add Slot"}
              </Button>
              {editingSlotId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="cancel-edit-btn"
                >
                  Cancel
                </Button>
              )}
            </div>
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
                    <span className="slot-time">
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </span>
                    <div className="slot-actions">
                      <button
                        type="button"
                        className="slot-action-btn edit-btn"
                        onClick={() => startEdit(slot)}
                        disabled={deletingSlotId !== null || isSubmitting}
                        title="Edit Slot"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="slot-action-btn delete-btn"
                        onClick={() => handleDelete(slot.id)}
                        disabled={deletingSlotId === slot.id}
                        title="Delete Slot"
                      >
                        {deletingSlotId === slot.id ? "..." : "🗑️"}
                      </button>
                    </div>
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

