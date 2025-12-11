import { apiInstance } from "@/shared/api/instance";
import type { AiMessage, AiSession, SendMessageRequest } from "../model/types";

export const aiChatApi = {
  // Відправка повідомлення (створення нового чату або продовження старого)
  sendMessage: async (data: SendMessageRequest): Promise<AiMessage> => {
    const response = await apiInstance.post<AiMessage>("/api/ai/chat", data);
    return response.data;
  },

  // Отримання списку всіх сесій (історії)
  getSessions: async (): Promise<AiSession[]> => {
    const response = await apiInstance.get<AiSession[]>("/api/ai/sessions");
    return response.data;
  },

  // Отримання повідомлень конкретної сесії
  getSessionMessages: async (sessionId: string): Promise<AiMessage[]> => {
    const response = await apiInstance.get<AiMessage[]>(
      `/api/ai/sessions/${sessionId}`
    );
    return response.data;
  },
};
