import React from "react";

const ChatHeader = ({ content = "Content" }) => {
  return (
    <div className="border-b-2 border-base-100 p-2 text-xl">{content}</div>
  );
};

export default ChatHeader;
