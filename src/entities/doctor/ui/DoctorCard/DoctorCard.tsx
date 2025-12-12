import { Link } from "react-router-dom";
import { type DoctorProfile } from "../../model/types";
import { Button } from "@/shared/ui/Button/Button";
import "./DoctorCard.scss";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="doctor-card">
      <div className="doctor-card__image-placeholder">
        <span className="initials">
          {doctor.firstName[0]}
          {doctor.lastName[0]}
        </span>
      </div>

      <div className="doctor-card__content">
        <h3 className="doctor-card__name">
          Dr. {doctor.firstName} {doctor.lastName}
        </h3>

        <p className="doctor-card__spec">
          {doctor.specializationId || "General Specialist"}
        </p>

        <p className="doctor-card__bio">
          {doctor.biography
            ? doctor.biography.length > 80
              ? doctor.biography.slice(0, 80) + "..."
              : doctor.biography
            : "Experienced specialist ready to help you."}
        </p>

        <div className="doctor-card__footer">
          <span className="doctor-card__price">
            ${doctor.consultationFee} / hr
          </span>

          <Link to={`/doctors/${doctor.id}`}>
            <Button className="doctor-card__btn" variant="outline">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
