import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageString from "./MessageString";
import Loading from "../common/Loading";

function ChatMessages() {
  const { chat, messages, loading } = useSelector((state) => state.chat);

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col px-2">
      <h2 className="text-3xl mx-2 my-8 font-bold">
        {String(chat?.title).split(" - ").at(1)}
      </h2>

      <div className="flex gap-4 flex-col">
        {messages.map((msg, index) => {
          const type = typeof msg.content === "string";
          if (!type) {
            return <MessageBubble key={index} message={msg} />;
          } else {
            return <MessageString key={index} msg={msg} index={index} />;
          }
        })}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
