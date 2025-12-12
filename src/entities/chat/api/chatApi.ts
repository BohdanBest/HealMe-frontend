import { apiInstance } from "@/shared/api/instance";
import { type ChatMessage } from "../model/types";

export const chatApi = {
  getHistory: async (appointmentId: string): Promise<ChatMessage[]> => {
    const response = await apiInstance.get<ChatMessage[]>(
      `/api/chat/${appointmentId}/history`
    );
    return response.data;
  },
};
