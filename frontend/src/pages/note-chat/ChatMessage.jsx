import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageString from "./MessageString";

function ChatMessages() {
  const { chat, messages, loading } = useSelector((state) => state.chat);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex gap-4 flex-col p-2">
      <h2 className="text-3xl mx-2 my-8 font-bold">
        {String(chat?.title).split(" - ").at(1)}
      </h2>

      {messages.map((msg, index) => {
        const type = typeof msg.content === "string";
        if (!type) {
          return <MessageBubble key={index} message={msg} />;
        } else {
          return <MessageString key={index} msg={msg} index={index} />;
        }
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
