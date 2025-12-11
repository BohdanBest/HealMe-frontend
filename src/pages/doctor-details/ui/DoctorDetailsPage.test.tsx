import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DoctorDetailsPage } from "./DoctorDetailsPage";
import { doctorApi } from "@/entities/doctor/api/doctorApi";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("@/entities/doctor/api/doctorApi", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/entities/doctor/api/doctorApi")
  >();

  return {
    ...actual,
    doctorApi: {
      ...actual.doctorApi, 
      getDoctorById: vi.fn(),
      getDoctorAvailability: vi.fn(),
      getDoctorReviews: vi.fn(),
    },
  };
});

vi.mock("@/widgets/Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar Mock</div>,
}));

const mockDoctor = {
  id: "1",
  userId: "u1",
  firstName: "John",
  lastName: "Doe",
  specializationId: "Cardiologist",
  consultationFee: 100,
  medicalInstitutionLicense: "LIC-123",
  phoneNumber: "123-456",
  biography: "Best doctor ever.",
};

describe("DoctorDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (doctorApi.getDoctorById as Mock).mockReturnValue(new Promise(() => {}));
    (doctorApi.getDoctorAvailability as Mock).mockReturnValue(
      new Promise(() => {})
    );
    (doctorApi.getDoctorReviews as Mock).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/doctors/1"]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders doctor info after data loads", async () => {
    (doctorApi.getDoctorById as Mock).mockResolvedValue(mockDoctor);
    (doctorApi.getDoctorAvailability as Mock).mockResolvedValue([]);
    (doctorApi.getDoctorReviews as Mock).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/doctors/1"]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Dr. John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Cardiologist")).toBeInTheDocument();
    expect(screen.getByText("$100 / hr")).toBeInTheDocument();
  });

  it("switches tabs correctly", async () => {
    (doctorApi.getDoctorById as Mock).mockResolvedValue(mockDoctor);
    (doctorApi.getDoctorAvailability as Mock).mockResolvedValue([]);
    (doctorApi.getDoctorReviews as Mock).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/doctors/1"]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Dr. John Doe")).toBeInTheDocument()
    );

    expect(screen.getByText("Biography")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Schedule"));
    expect(screen.getByText("Weekly Availability")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Reviews/i));
    expect(screen.getByText("Patient Reviews")).toBeInTheDocument();
  });

  it("shows error state if API fails", async () => {
    (doctorApi.getDoctorById as Mock).mockRejectedValue(
      new Error("Network error")
    );
    (doctorApi.getDoctorAvailability as Mock).mockResolvedValue([]);
    (doctorApi.getDoctorReviews as Mock).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/doctors/1"]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Перевіряємо текст помилки, який ми встановили в компоненті
      expect(
        screen.getByText(/Failed to load doctor information/i)
      ).toBeInTheDocument();
    });
  });
});
