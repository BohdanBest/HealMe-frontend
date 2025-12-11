import { apiInstance } from "@/shared/api/instance";
import type {
  DoctorProfile,
  DoctorAvailability,
  DoctorReview,
} from "../model/types";

export interface UpdateDoctorRequest {
  specializationId: string;
  consultationFee: number;
  medicalInstitutionLicense: string;
  phoneNumber: string;
  biography?: string;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const doctorApi = {
  getAllDoctors: async (): Promise<DoctorProfile[]> => {
    const response = await apiInstance.get<DoctorProfile[]>("/api/doctors");
    return response.data;
  },

  getDoctorById: async (id: string): Promise<DoctorProfile> => {
    const response = await apiInstance.get<DoctorProfile>(`/api/doctors/${id}`);
    return response.data;
  },

  getDoctorAvailability: async (id: string): Promise<DoctorAvailability[]> => {
    const response = await apiInstance.get<DoctorAvailability[]>(
      `/api/doctors/${id}/availability`
    );
    return response.data;
  },

  getDoctorReviews: async (id: string): Promise<DoctorReview[]> => {
    const response = await apiInstance.get<DoctorReview[]>(
      `/api/doctors/${id}/reviews`
    );
    return response.data;
  },
  getMyProfile: async (): Promise<DoctorProfile> => {
    const response = await apiInstance.get<DoctorProfile>("/api/doctors/me");
    return response.data;
  },

  updateMyProfile: async (
    data: UpdateDoctorRequest
  ): Promise<DoctorProfile> => {
    const response = await apiInstance.put<DoctorProfile>(
      "/api/doctors/me",
      data
    );
    return response.data;
  },

  createAvailability: async (
    data: CreateAvailabilityRequest
  ): Promise<DoctorAvailability> => {
    const response = await apiInstance.post<DoctorAvailability>(
      "/api/doctors/me/availability",
      data
    );
    return response.data;
  },
};
