import React from "react";

const ChatHeader = ({ content = "Chat" }) => {
  return (
    <div className="border-b-2 border-base-100 p-2 text-xl md:block hidden">
      {content}
    </div>
  );
};

export default ChatHeader;
