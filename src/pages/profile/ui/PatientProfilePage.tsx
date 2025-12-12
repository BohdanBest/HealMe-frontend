import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";

import { Button } from "@/shared/ui/Button/Button";
import { Input } from "@/shared/ui/Input/Input";
import { Gender } from "@/shared/api/types/auth";
import "./PatientProfilePage.scss"; // Використовує стилі, ідентичні DoctorDashboard
import type { UpdatePatientRequest } from "@/entities/patient/model/types";
import { patientApi } from "@/entities/patient/api/patientApi";

export const PatientProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdatePatientRequest>();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await patientApi.getMe();

        setValue("firstName", data.firstName);
        setValue("lastName", data.lastName);
        setValue("phoneNumber", data.phoneNumber);
        setValue("gender", data.gender);
        setEmail(data.email);

        if (data.dateOfBirth && data.dateOfBirth !== "0001-01-01T00:00:00") {
          const dateObj = new Date(data.dateOfBirth);
          const formattedDate = dateObj.toISOString().split("T")[0];
          setValue("dateOfBirth", formattedDate);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        setProfileMessage({
          text: "Failed to load profile data.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [setValue]);

  const onSubmit = async (data: UpdatePatientRequest) => {
    try {
      setIsSaving(true);
      setProfileMessage(null);

      const payload = {
        ...data,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      };

      await patientApi.updateMe(payload);
      setProfileMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (error) {
      console.error(error);
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
          <h1 className="page-main-title">My Profile</h1>
        </div>

        <div className="dashboard-container">
          <div className="dashboard-card single-card">
            {profileMessage && (
              <div className={`alert ${profileMessage.type}`}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="dashboard-form">
              {/* SECTION 1: GENERAL INFO */}
              <div className="form-group-section">
                <div className="section-header">
                  <div className="section-label">General Information</div>
                </div>

                <div className="form-grid-2">
                  <Input
                    label="First Name"
                    error={errors.firstName?.message}
                    {...register("firstName", { required: "Required" })}
                  />
                  <Input
                    label="Last Name"
                    error={errors.lastName?.message}
                    {...register("lastName", { required: "Required" })}
                  />
                </div>
              </div>

              {/* SECTION 2: PERSONAL DETAILS */}
              <div className="form-group-section">
                <div className="section-header">
                  <div className="section-label">Personal Details</div>
                </div>

                <div className="form-grid-2">
                  <div className="ui-input-wrapper">
                    <label className="ui-input-wrapper__label">Gender</label>
                    <select
                      {...register("gender")}
                      className="ui-input select-input">
                      <option value={Gender.Male}>Male</option>
                      <option value={Gender.Female}>Female</option>
                    </select>
                  </div>

                  <Input
                    type="date"
                    label="Date of Birth"
                    error={errors.dateOfBirth?.message}
                    {...register("dateOfBirth", { required: "Required" })}
                  />
                </div>
              </div>

              {/* SECTION 3: CONTACT */}
              <div className="form-group-section">
                <div className="section-header">
                  <div className="section-label">Contact Information</div>
                </div>

                <div className="form-grid-2">
                  <Input
                    label="Phone Number"
                    placeholder="+380..."
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber", { required: "Required" })}
                  />

                  <div className="ui-input-wrapper">
                    <label className="ui-input-wrapper__label">Email</label>
                    <input
                      className="ui-input read-only"
                      disabled
                      value={email}
                    />
                    <span className="field-note">
                      Email cannot be changed directly.
                    </span>
                  </div>
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
