import React, { useState } from "react";
const tabs = ["Source", "Chats", "Status"];

const NoteChatMobile = () => {
  const [tab, setTab] = useState(tabs[1]);
  const onTab = (t) => {
    setTab(t);
  };

  return (
    <ul>
      {tabs.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
};

export default NoteChatMobile;
