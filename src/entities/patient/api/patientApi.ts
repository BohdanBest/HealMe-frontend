import { apiInstance } from "@/shared/api/instance";
import type { PatientProfile, UpdatePatientRequest } from "../model/types";

export const patientApi = {
  getMe: async (): Promise<PatientProfile> => {
    const response = await apiInstance.get<PatientProfile>("/api/patients/me");
    return response.data;
  },

  getPatientById: async (id: string): Promise<PatientProfile> => {
    const response = await apiInstance.get<PatientProfile>(
      `/api/patients/${id}`
    );
    return response.data;
  },

  updateMe: async (data: UpdatePatientRequest): Promise<PatientProfile> => {
    const response = await apiInstance.put<PatientProfile>(
      "/api/patients/me",
      data
    );
    return response.data;
  },
};
