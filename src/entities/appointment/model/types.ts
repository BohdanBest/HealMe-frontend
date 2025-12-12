// Замість enum використовуємо const об'єкт (для значень)
export const AppointmentStatus = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
} as const;

// Створюємо тип на основі значень об'єкта (для типізації)
export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus; // Тепер це тип 0 | 1 | 2
  createdAt: string;
}

export interface BookAppointmentRequest {
  doctorId: string;
  startTime: string;
  endTime: string;
}
