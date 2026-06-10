import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageString from "./MessageString";

function ChatMessages() {
  const { messages, loading } = useSelector((state) => state.chat);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="flex gap-4 flex-col">
      {messages.map((msg, index) => {
        const type = typeof msg.content === "string";
        if (!type) {
          return <MessageBubble key={msg._id || index} message={msg} />;
        } else {
          return <MessageString msg={msg} index={index} />;
        }
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
