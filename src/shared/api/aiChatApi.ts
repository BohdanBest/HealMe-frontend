import axios from "axios";

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL;

export interface AiChatRequest {
  chat_id: string;
  message: string;
}

export interface AiChatResponse {
  chat_id: string;
  user_message: string;
  ai_response: string;
  timestamp: string;
}

export const aiChatApi = {
  sendMessage: async (data: AiChatRequest): Promise<AiChatResponse> => {
    const response = await axios.post<AiChatResponse>(
      `${AI_SERVICE_URL}/api/chat`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return response.data;
  },
};
