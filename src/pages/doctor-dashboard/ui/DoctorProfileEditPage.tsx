import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";

import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import "./DoctorDashboard.scss";
import {
  doctorApi,
  type UpdateDoctorRequest,
} from "@/entities/doctor/api/doctorApi";

export const DoctorProfileEditPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [doctorProfile, setDoctorProfile] = useState<{
    id: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateDoctorRequest>();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const profile = await doctorApi.getMyProfile();
        setDoctorProfile({
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
        });

        setValue("specializationId", profile.specializationId);
        setValue("consultationFee", profile.consultationFee);
        setValue(
          "medicalInstitutionLicense",
          profile.medicalInstitutionLicense
        );
        setValue("phoneNumber", profile.phoneNumber);
        setValue("biography", profile.biography || "");
      } catch (err) {
        console.error("Failed to load doctor data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [setValue]);

  const onProfileSubmit = async (data: UpdateDoctorRequest) => {
    try {
      setIsSaving(true);
      setProfileMessage(null);
      await doctorApi.updateMyProfile(data);
      setProfileMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setProfileMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="page-main-title">Edit Profile</h1>
          {doctorProfile && (
            <Link
              to={`/doctors/${doctorProfile.id}`}
              target="_blank"
              className="view-profile-btn">
              View Public Page
            </Link>
          )}
        </div>

        <div className="dashboard-container">
          <div className="dashboard-card single-card">
            {profileMessage && (
              <div className={`alert ${profileMessage.type}`}>
                {profileMessage.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onProfileSubmit)}
              className="dashboard-form">
              <div className="form-group-section">
                <div className="section-header">
                  <div className="section-label">General Information</div>
                </div>

                <div className="form-grid-3">
                  <div className="ui-input-wrapper">
                    <label className="ui-input-wrapper__label">
                      First Name
                    </label>
                    <input
                      className="ui-input read-only"
                      disabled
                      value={doctorProfile?.firstName}
                    />
                  </div>
                  <div className="ui-input-wrapper">
                    <label className="ui-input-wrapper__label">Last Name</label>
                    <input
                      className="ui-input read-only"
                      disabled
                      value={doctorProfile?.lastName}
                    />
                  </div>
                  <Input
                    label="Phone Number"
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber", { required: "Required" })}
                  />
                </div>
              </div>

              <div className="form-group-section">
                <div className="section-header">
                  <div className="section-label">Professional Details</div>
                </div>

                <div className="form-grid-3">
                  <Input
                    label="Specialization"
                    placeholder="e.g. Cardiologist"
                    error={errors.specializationId?.message}
                    {...register("specializationId", { required: "Required" })}
                  />

                  <Input
                    label="Consultation Fee ($/hr)"
                    type="number"
                    error={errors.consultationFee?.message}
                    {...register("consultationFee", {
                      required: "Required",
                      min: 0,
                    })}
                  />

                  <Input
                    label="Medical License ID"
                    error={errors.medicalInstitutionLicense?.message}
                    {...register("medicalInstitutionLicense", {
                      required: "Required",
                    })}
                  />
                </div>
              </div>

              {/* SECTION 3: BIO (Full width) */}
              <div className="form-group-section">
                <div className="section-header">
                  <div className="section-label">About Me</div>
                  <span className="section-note">
                    This information will be visible on your public profile.
                  </span>
                </div>

                <div className="ui-input-wrapper">
                  <textarea
                    className="ui-input textarea"
                    rows={8}
                    placeholder="Describe your experience, education, and approach to treatment..."
                    {...register("biography")}
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button type="submit" disabled={isSaving} className="save-btn">
                  {isSaving ? "Saving Changes..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
