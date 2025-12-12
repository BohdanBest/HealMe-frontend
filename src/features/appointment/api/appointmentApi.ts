import { apiInstance } from "@/shared/api/instance";
import { type Appointment } from "@/entities/appointment/model/types";

export const appointmentApi = {
  // Створення запису
  bookAppointment: async (data: {
    doctorId: string;
    startTime: string;
    endTime: string;
  }): Promise<Appointment> => {
    const response = await apiInstance.post<Appointment>(
      "/api/appointments",
      data
    );
    return response.data;
  },

  // Отримання моїх записів
  getMyAppointments: async (): Promise<Appointment[]> => {
    const response = await apiInstance.get<Appointment[]>(
      "/api/appointments/my-appointments"
    );
    return response.data;
  },

  // Підтвердження (для лікаря)
  confirmAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiInstance.put<Appointment>(
      `/api/appointments/${id}/confirm`
    );
    return response.data;
  },

  // Скасування
  cancelAppointment: async (id: string): Promise<void> => {
    await apiInstance.put(`/api/appointments/${id}/cancel`);
  },
};
