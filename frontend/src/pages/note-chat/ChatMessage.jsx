import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";

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
    <div className="flex-1 overflow-y-auto px-5 py-6">
      {messages.map((msg, index) => {
        const type =
          typeof msg.content === "string";
        if (!type) {
          return <MessageBubble key={msg._id || index} message={msg} />;
        } else {
          const content = JSON.parse(msg.content);
          return (
            <div
              key={index}
              className="
                bg-white
                border
                rounded-2xl
                p-5
                mb-6
                shadow-sm
              "
            >
              <h2 className="font-bold text-xl">{content?.title}</h2>

              <p className="mt-3 text-gray-600">{content?.summary}</p>

              <div className="mt-5">
                <h3 className="font-semibold">Suggested Questions</h3>

                <div className="flex flex-wrap gap-2 mt-3">
                  {content?.suggestedQuestions?.map((q, i) => (
                    <button
                      key={i}
                      className="
                          px-3
                          py-2
                          bg-gray-100
                          hover:bg-gray-200
                          rounded-full
                          text-sm
                        "
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        }
      })}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
