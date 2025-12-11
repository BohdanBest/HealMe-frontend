export interface DoctorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  specializationId: string;
  consultationFee: number;
  medicalInstitutionLicense: string;
  phoneNumber: string;
  biography?: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
