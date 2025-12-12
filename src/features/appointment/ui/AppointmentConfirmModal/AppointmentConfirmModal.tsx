import React from "react";
import { Button } from "@/shared/ui/Button/Button";
import "@/shared/ui/Modal/Modal.scss"; // Використовуємо спільні стилі

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctorName: string;
  dateStr: string;
  timeStr: string;
  isLoading: boolean;
}

export const AppointmentConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  doctorName,
  dateStr,
  timeStr,
  isLoading,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "420px",
          textAlign: "center",
          padding: "2.5rem 2rem",
        }}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          disabled={isLoading}>
          &times;
        </button>

        <h2
          className="modal-title"
          style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>
          Confirm Booking
        </h2>

        <p
          style={{
            color: "#4b5563",
            marginBottom: "2rem",
            lineHeight: "1.6",
            fontSize: "1.05rem",
          }}>
          Are you sure you want to book an appointment with
          <br />
          <strong style={{ color: "#333" }}>{doctorName}</strong>
          <br />
          on <strong>{dateStr}</strong> at{" "}
          <strong style={{ color: "#166534" }}>{timeStr}</strong>?
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            style={{ minWidth: "100px" }}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            style={{ minWidth: "140px" }}>
            {isLoading ? "Booking..." : "Yes, Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};
