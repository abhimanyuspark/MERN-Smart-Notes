import React, { useState } from "react";
import NoteSource from "./NoteSource";
import ChatPage from "./ChatPage";
import NoteStudio from "./NoteStudio";
const tabs = ["Source", "Chats", "Status"];

const NoteChatMobile = () => {
  const [tab, setTab] = useState(tabs[1]);
  const onTab = (t) => {
    setTab(t);
  };

  return (
    <div>
      <ul className="flex items-center justify-between py-2 px-3 bg-base-300 h-16">
        {tabs.map((t, i) => (
          <li
            className="text-lg"
            key={i}
            onClick={() => {
              onTab(t);
            }}
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="h-[calc(100vh-10rem)]">
        {tab === tabs[0] && <NoteSource />}
        {tab === tabs[1] && <ChatPage />}
        {tab === tabs[2] && <NoteStudio />}
      </div>
    </div>
  );
};

export default NoteChatMobile;
