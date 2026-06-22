import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageString from "./MessageString";
import Loading from "../common/Loading";

function ChatMessages() {
  const { chat, messages, loading, sending } = useSelector(
    (state) => state.chat,
  );

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col px-2">
      <h2 className="text-3xl mx-2 my-8 font-bold">
        {String(chat?.title || "")
          .split(" - ")
          .at(1)}
      </h2>

      <div className="flex flex-col gap-4">
        {messages.map((msg, index) => {
          const isString = typeof msg.content === "string";

          return isString ? (
            <MessageString key={msg._id || index} msg={msg} index={index} />
          ) : (
            <MessageBubble key={msg._id || index} message={msg} />
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-accent text-accent-content rounded px-4 py-2 font-medium animate-pulse">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatMessages;
