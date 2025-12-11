export interface AiSession {
  id: string;
  title: string;
  createdAt: string;
}

export interface AiMessage {
  sessionId: string;
  messageId: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
}

export interface SendMessageRequest {
  sessionId?: string;
  message: string;
}
