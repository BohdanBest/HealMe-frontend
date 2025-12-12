import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar"; 
import { useChat } from "@/features/chat/lib/useChat";
import { useUserStore } from "@/entities/user/model/store";
import "./ChatPage.scss"; 
export const ChatPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user } = useUserStore();
  const { messages, sendMessage, isConnected } = useChat(appointmentId || "");

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    setInputValue("");
  };

  if (!appointmentId) return <div>Invalid Chat</div>;

  return (
    <div className="chat-layout">
      <Sidebar />
      <main className="chat-main">
        {/* --- HEADER --- */}
        <div className="chat-header">
          {/* Ліва частина: Кнопка назад */}
          <Link to="/appointments" className="back-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Link>

          {/* Центр: Інформація про чат */}
          <div className="header-info">
            <h2 className="chat-title">Consultation Chat</h2>
            <div
              className={`status-badge ${isConnected ? "online" : "offline"}`}>
              <span className="dot"></span>
              {isConnected ? "Online" : "Connecting..."}
            </div>
          </div>

          {/* Права частина: Пусто для балансу */}
          <div className="header-spacer"></div>
        </div>

        {/* --- MESSAGES --- */}
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-chat-placeholder">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}

          {messages.map((msg) => {
            // Перевірка: чи це моє повідомлення
            const isMe = String(msg.senderId) === String(user?.id);

            return (
              <div
                key={msg.id}
                className={`message-row ${
                  isMe ? "my-message" : "other-message"
                }`}>
                {/* Аватарка для співрозмовника */}
                {!isMe && (
                  <div className="message-avatar">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}

                <div className="message-bubble">
                  <div className="message-text">{msg.message}</div>
                  <div className="message-meta">
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {/* Галочки для моїх повідомлень (візуальний ефект) */}
                    {isMe && <span className="read-status">✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="chat-input-bar">
          <form className="input-container" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={!isConnected || !inputValue.trim()}
              className="send-icon-btn">
              <svg
                width="20"
                height="20"
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
      </main>
    </div>
  );
};
