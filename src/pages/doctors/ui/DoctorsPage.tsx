import { useEffect, useState } from "react";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { doctorApi } from "@/entities/doctor/api/doctorApi";
import { DoctorCard } from "@/entities/doctor/ui/DoctorCard/DoctorCard";
import type { DoctorProfile } from "@/entities/doctor/model/types";
import filterIcon from "@/shared/assets/filter.svg"
import "./DoctorsPage.scss";

export const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorApi.getAllDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = doctors.filter(
      (doc) =>
        doc.firstName.toLowerCase().includes(term) ||
        doc.lastName.toLowerCase().includes(term) ||
        doc.specializationId.toLowerCase().includes(term)
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  return (
    <div className="doctors-page-layout">
      <Sidebar />

      <main className="doctors-main-content">
        <div className="doctors-header-section">
          <h1 className="doctors-title">LIST OF DOCTORS</h1>
          <div className="doctors-divider"></div>

          <div className="doctors-search-bar">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>

              <button className="filter-btn">
                <img src={filterIcon} alt="" />
              </button>
            </div>
          </div>
        </div>

        <div className="doctors-container">
          {isLoading && <div className="loading-state">Loading doctors...</div>}

          {error && <div className="error-state">{error}</div>}

          {!isLoading && !error && (
            <div className="doctors-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} />
                ))
              ) : (
                <p
                  style={{ textAlign: "center", width: "100%", color: "#666" }}>
                  No doctors found matching your criteria.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
