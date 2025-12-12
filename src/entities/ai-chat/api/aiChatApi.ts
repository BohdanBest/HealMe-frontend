import axios from "axios";
import { apiInstance } from "@/shared/api/instance";
import type { AiMessage, AiSession, SendMessageRequest } from "../model/types";


const AI_DIRECT_URL = import.meta.env.VITE_AI_SERVICE_URL;

export interface GuestChatResponse {
  chat_id: string;
  ai_response: string;
  timestamp: string;
}

export const aiChatApi = {
  // --- 1. ДЛЯ АВТОРИЗОВАНИХ (Через .NET Backend) ---
  sendMessage: async (data: SendMessageRequest): Promise<AiMessage> => {
    const response = await apiInstance.post<AiMessage>("/api/ai/chat", data);
    return response.data;
  },

  getSessions: async (): Promise<AiSession[]> => {
    const response = await apiInstance.get<AiSession[]>("/api/ai/sessions");
    return response.data;
  },

  getSessionMessages: async (sessionId: string): Promise<AiMessage[]> => {
    const response = await apiInstance.get<AiMessage[]>(
      `/api/ai/sessions/${sessionId}`
    );
    return response.data;
  },

  sendMessageGuest: async (
    chatId: string,
    message: string
  ): Promise<GuestChatResponse> => {
    if (!AI_DIRECT_URL) throw new Error("AI Service URL is not configured");

    const response = await axios.post<GuestChatResponse>(
      `${AI_DIRECT_URL}/api/chat`,
      {
        chat_id: chatId,
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Важливо для ngrok
        },
      }
    );
    return response.data;
  },
};
