import { useEffect, useState, useRef } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useUserStore } from "@/entities/user/model/store";
import { type ChatMessage } from "@/entities/chat/model/types";
import { chatApi } from "@/entities/chat/api/chatApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5283";

export const useChat = (appointmentId: string) => {
  const { token, user } = useUserStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!token || !appointmentId) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/chat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();

    connectionRef.current = newConnection;

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("SignalR Connected");
        setIsConnected(true);

        await newConnection.invoke("JoinGroup", appointmentId);

        const history = await chatApi.getHistory(appointmentId);
        setMessages(history);
      } catch (err) {
        console.error("Chat Connection Failed: ", err);
      }
    };

    startConnection();

    newConnection.on("ReceiveMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newConnection.stop();
    };
  }, [appointmentId, token]);

  const sendMessage = async (text: string) => {
    if (connectionRef.current && isConnected) {
      try {
        await connectionRef.current.invoke("SendMessage", appointmentId, text);
      } catch (e) {
        console.error("Send failed", e);
      }
    }
  };

  return { messages, sendMessage, isConnected, userId: user?.id };
};
