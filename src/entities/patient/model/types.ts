import { Gender } from "@/shared/api/types/auth"; 

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

export interface UpdatePatientRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
}
