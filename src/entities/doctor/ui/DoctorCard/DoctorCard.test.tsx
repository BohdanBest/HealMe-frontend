import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { DoctorCard } from "./DoctorCard";
import { type DoctorProfile } from "../../model/types";
import { describe, it, expect } from "vitest";

const mockDoctor: DoctorProfile = {
  id: "123",
  userId: "user-1",
  firstName: "Gregory",
  lastName: "House",
  specializationId: "Diagnostician",
  consultationFee: 500,
  medicalInstitutionLicense: "LIC-12345",
  phoneNumber: "555-0199",
  biography: "Specializes in medical mysteries.",
};

describe("DoctorCard", () => {
  it("renders doctor name and specialization correctly", () => {
    render(
      <BrowserRouter>
        <DoctorCard doctor={mockDoctor} />
      </BrowserRouter>
    );

    expect(screen.getByText("Dr. Gregory House")).toBeInTheDocument();
    expect(screen.getByText("Diagnostician")).toBeInTheDocument();
    expect(screen.getByText("$500 / hr")).toBeInTheDocument();
  });

  it("renders initials in the placeholder", () => {
    render(
      <BrowserRouter>
        <DoctorCard doctor={mockDoctor} />
      </BrowserRouter>
    );

    expect(screen.getByText("GH")).toBeInTheDocument();
  });

  it("contains link to details page", () => {
    render(
      <BrowserRouter>
        <DoctorCard doctor={mockDoctor} />
      </BrowserRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/doctors/123");
  });
});
