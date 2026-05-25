import { apiInstance } from "@/shared/api/instance";
import type { Appointment, BookAppointmentRequest } from "../model/types";

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  doctorId: string;
  appointmentId: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

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

  completeAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiInstance.put<Appointment>(
      `/api/appointments/${id}/complete`
    );
    return response.data;
  },

  createReview: async (
    id: string,
    data: CreateReviewRequest
  ): Promise<ReviewResponse> => {
    const response = await apiInstance.post<ReviewResponse>(
      `/api/appointments/${id}/review`,
      data
    );
    return response.data;
  },

  updateReview: async (
    id: string,
    data: UpdateReviewRequest
  ): Promise<ReviewResponse> => {
    const response = await apiInstance.put<ReviewResponse>(
      `/api/appointments/${id}/review`,
      data
    );
    return response.data;
  },

  getReview: async (id: string): Promise<ReviewResponse> => {
    const response = await apiInstance.get<ReviewResponse>(
      `/api/appointments/${id}/review`
    );
    return response.data;
  },
};


