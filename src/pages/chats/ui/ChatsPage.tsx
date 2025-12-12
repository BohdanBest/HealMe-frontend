import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";


import { useUserStore } from "@/entities/user/model/store";
import "./ChatsPage.scss";
import { appointmentApi } from "@/entities/appointment/api/appointmentApi";
import { AppointmentStatus } from "@/entities/appointment/model/types";
import type { PatientProfile } from "@/entities/patient/model/types";
import type { DoctorProfile } from "@/entities/doctor/model/types";
import { patientApi } from "@/entities/patient/api/patientApi";
import { doctorApi } from "@/entities/doctor/api/doctorApi";

interface ChatListItem {
  appointmentId: string;
  partnerName: string;
  partnerSubtext: string;
  date: Date;
}

export const ChatsPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const isDoctor = user?.roles?.includes("Doctor");

  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoading(true);
        const appointments = await appointmentApi.getMyAppointments();

        const activeApps = appointments
          .filter((a) => a.status !== AppointmentStatus.Cancelled)
          .sort(
            (a, b) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          );

        const partnerIds = new Set<string>();
        activeApps.forEach((app) =>
          partnerIds.add(isDoctor ? app.patientId : app.doctorId)
        );

        const profilesMap: Record<string, PatientProfile | DoctorProfile> = {};

        await Promise.all(
          Array.from(partnerIds).map(async (id) => {
            try {
              if (isDoctor) {
                const p = await patientApi.getPatientById(id);
                if (p) profilesMap[id] = p;
              } else {
                const d = await doctorApi.getDoctorById(id);
                if (d) profilesMap[id] = d;
              }
            } catch (e) {
              console.error(`Error loading profile ${id}`, e);
            }
          })
        );

        const items: ChatListItem[] = activeApps.map((app) => {
          const partnerId = isDoctor ? app.patientId : app.doctorId;
          const profile = profilesMap[partnerId];

          let name = "Loading...";
          let subtext = "";

          if (profile) {
            name = `${profile.firstName} ${profile.lastName}`;
            if (isDoctor) {
              subtext = "Patient";
            } else {
              subtext = (profile as DoctorProfile).specializationId || "Doctor";
              name = `Dr. ${name}`;
            }
          }

          return {
            appointmentId: app.id,
            partnerName: name,
            partnerSubtext: subtext,
            date: new Date(app.startTime),
          };
        });

        setChatList(items);
      } catch (error) {
        console.error("Failed to load chats", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [user, isDoctor]);

  if (isLoading) {
    return (
      <div className="chats-layout">
        <Sidebar />
        <div className="content loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chats-layout">
      <Sidebar />
      <main className="content">
        <div className="page-header">
          <h1 className="title">
            Chats with {isDoctor ? "Patients" : "Doctors"}
          </h1>
        </div>

        <div className="chats-list-container">
          {chatList.length === 0 ? (
            <div className="empty-state">
              You don't have any active appointments to chat.
            </div>
          ) : (
            chatList.map((chat) => (
              <div
                key={chat.appointmentId}
                className="chat-list-item"
                onClick={() => navigate(`/chat/${chat.appointmentId}`)}
              >
                <div className="chat-avatar">
                  {chat.partnerName.charAt(isDoctor ? 0 : 4) || "?"}
                </div>

                <div className="chat-info">
                  <div className="info-top">
                    <span className="partner-name">{chat.partnerName}</span>
                    <span className="chat-date">
                      {chat.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="info-bottom">
                    <span className="partner-subtext">
                      {chat.partnerSubtext}
                    </span>
                    <span className="open-arrow">›</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
