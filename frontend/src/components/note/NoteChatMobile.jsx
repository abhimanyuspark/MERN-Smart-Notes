import React, { useState } from "react";
import NoteSource from "./NoteSource";
import ChatPage from "./ChatPage";
import NoteStudio from "./NoteStudio";
const tabs = ["Source", "Chats", "Studio"];

const NoteChatMobile = () => {
  const [tab, setTab] = useState(tabs[1]);
  const onTab = (t) => {
    setTab(t);
  };

  return (
    <>
      <ul className="flex items-center justify-between py-2 px-3 bg-base-300 rounded">
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

      <div className="h-[calc(100%-6rem)]">
        {tab === tabs[0] && <NoteSource />}
        {tab === tabs[1] && <ChatPage />}
        {tab === tabs[2] && <NoteStudio />}
      </div>
    </>
  );
};

export default NoteChatMobile;
