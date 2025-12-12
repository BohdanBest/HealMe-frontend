import React, { useState, useEffect, useRef } from "react";
import { TypewriterText } from "@/shared/ui/TypewriterText/TypewriterText";
import { useUIStore } from "@/shared/model/uiStore";
import { useUserStore } from "@/entities/user/model/store"; // <--- 1. Імпорт стору юзера
import "./ChatWindow.scss";
import type { AiSession } from "@/entities/ai-chat/model/types";
import { aiChatApi } from "@/entities/ai-chat/api/aiChatApi";

interface UiMessage {
  id: string;
  text: string;
  isUser: boolean;
  time: string;
  isAnimated?: boolean;
}

export const ChatWindow = () => {
  const { user } = useUserStore();
  const { isAiHistoryOpen, closeAiHistory } = useUIStore();

  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AiSession[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const loadSessions = async () => {
    try {
      const data = await aiChatApi.getSessions();
      setSessions(data);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const selectSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setCurrentSessionId(sessionId);

      const history = await aiChatApi.getSessionMessages(sessionId);

      const uiMessages: UiMessage[] = history.flatMap((msg) => [
        {
          id: msg.messageId + "_user",
          text: msg.userMessage,
          isUser: true,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isAnimated: false,
        },
        {
          id: msg.messageId + "_ai",
          text: msg.aiResponse,
          isUser: false,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isAnimated: false,
        },
      ]);

      setMessages(uiMessages);

      if (window.innerWidth < 768) closeAiHistory();
    } catch (e) {
      console.error("Failed to load chat messages", e);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    if (window.innerWidth < 768) closeAiHistory();
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    if (!user) {
      alert("Please login to use AI Chat.");
      return;
    }

    const tempId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        text: text,
        isUser: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAnimated: false,
      },
    ]);

    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiChatApi.sendMessage({
        sessionId: currentSessionId || undefined,
        message: text,
      });

      if (!currentSessionId) {
        setCurrentSessionId(response.sessionId);
        await loadSessions();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: response.messageId,
          text: response.aiResponse,
          isUser: false,
          time: new Date(response.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isAnimated: true,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Error connecting to server. Please try again.",
          isUser: false,
          time: "",
          isAnimated: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const suggestions = [
    "I have a headache and nausea",
    "Check my skin rash",
    "Find a cardiologist nearby",
    "What are symptoms of flu?",
  ];

  return (
    <div className="chat-layout-wrapper">
      {user && (
        <aside
          className={`chat-history ${isAiHistoryOpen ? "open" : "closed"}`}>
          <div className="history-header">
            <button className="new-chat-btn" onClick={startNewChat}>
              <span>+ New Chat</span>
            </button>
          </div>

          <div className="history-list">
            {sessions.length === 0 ? (
              <div className="history-empty">No history yet</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`history-item ${
                    session.id === currentSessionId ? "active" : ""
                  }`}
                  onClick={() => selectSession(session.id)}>
                  <span className="icon">💬</span>
                  <span className="title" title={session.title}>
                    {session.title || "New Conversation"}
                  </span>
                </div>
              ))
            )}
          </div>
        </aside>
      )}

      <div className="chat-window">
        <div className="chat-header">
          <h2 className="chat-header__title">AI-CHAT</h2>
          <div className="chat-header__line"></div>
        </div>

        <div className="chat-content">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <h2 className="chat-empty-state__greeting">
                How can I help you today?
              </h2>

              <div className="chat-suggestions">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    onClick={() => handleSend(s)}>
                    {s} <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-list">
              <div className="chat-date">Today</div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${
                    msg.isUser ? "message-bubble--user" : "message-bubble--ai"
                  }`}>
                  {msg.isAnimated ? (
                    <TypewriterText text={msg.text} speed={20} />
                  ) : (
                    <div className="static-text">{msg.text}</div>
                  )}
                  {!msg.isAnimated && (
                    <span className="message-time">{msg.time}</span>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="message-bubble message-bubble--ai typing">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <form
            className="chat-input-wrapper"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}>
            <input
              type="text"
              placeholder={
                isLoading ? "AI is thinking..." : "Type a message..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input__field"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="chat-input__send-btn"
              disabled={!inputValue.trim() || isLoading}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
