import { useState, useEffect } from "react";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";

import { CalendarGrid } from "./components/CalendarGrid";
import { ScheduleDrawer } from "./components/ScheduleDrawer";
import "./DoctorSchedulePage.scss";
import type { DoctorAvailability } from "@/entities/doctor/model/types";
import { doctorApi } from "@/entities/doctor/api/doctorApi";

export const DoctorSchedulePage = () => {
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(
    null
  );

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const profile = await doctorApi.getMyProfile();
      const data = await doctorApi.getDoctorAvailability(profile.id);
      setAvailability(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Коли слот додано, оновлюємо список
  const handleSlotAdded = (newSlot: DoctorAvailability) => {
    setAvailability((prev) => [...prev, newSlot]);
  };

  return (
    <div className="schedule-page-layout">
      <Sidebar />

      <main className="schedule-content">
        <h1 className="page-title">Manage Schedule</h1>
        <p className="page-subtitle">
          Select a day to configure your weekly recurring availability.
        </p>

        {isLoading ? (
          <div className="loading">Loading calendar...</div>
        ) : (
          <div className="calendar-container">
            <CalendarGrid
              onSelectDay={(dayIndex) => setSelectedDayOfWeek(dayIndex)}
              availability={availability}
            />
          </div>
        )}

        <ScheduleDrawer
          isOpen={selectedDayOfWeek !== null}
          dayOfWeek={selectedDayOfWeek}
          onClose={() => setSelectedDayOfWeek(null)}
          existingSlots={availability.filter(
            (slot) => slot.dayOfWeek === selectedDayOfWeek
          )}
          onSlotAdded={handleSlotAdded}
        />

        {/* Затінення фону при відкритому дровері */}
        {selectedDayOfWeek !== null && (
          <div
            className="drawer-overlay"
            onClick={() => setSelectedDayOfWeek(null)}
          />
        )}
      </main>
    </div>
  );
};
