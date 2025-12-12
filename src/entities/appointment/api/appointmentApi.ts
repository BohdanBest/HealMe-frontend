import { apiInstance } from "@/shared/api/instance";
import type { Appointment, BookAppointmentRequest } from "../model/types";

export const appointmentApi = {
  bookAppointment: async (
    data: BookAppointmentRequest
  ): Promise<Appointment> => {
    const response = await apiInstance.post<Appointment>(
      "/api/appointments",
      data
    );
    return response.data;
  },

  getMyAppointments: async (): Promise<Appointment[]> => {
    const response = await apiInstance.get<Appointment[]>(
      "/api/appointments/my-appointments"
    );
    return response.data;
  },

  confirmAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiInstance.put<Appointment>(
      `/api/appointments/${id}/confirm`
    );
    return response.data;
  },

  cancelAppointment: async (id: string): Promise<void> => {
    await apiInstance.put(`/api/appointments/${id}/cancel`);
  },
};
