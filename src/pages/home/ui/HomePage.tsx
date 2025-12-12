import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { ChatWindow } from "@/widgets/ChatWindow/ui/ChatWindow";
import "./HomePage.scss";

export const HomePage = () => {
  return (
    <div className="home-page-layout">
      <Sidebar />

      <main className="home-main-content">
        <ChatWindow />
      </main>
    </div>
  );
};
