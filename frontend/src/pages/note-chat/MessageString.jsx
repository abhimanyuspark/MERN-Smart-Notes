import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../redux/features/chat";

const MessageString = ({ msg, index }) => {
  const content = JSON.parse(msg.content);
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chat);

  const handleSubmit = (message) => {
    if (!message.trim()) return;

    dispatch(
      sendMessage({
        chatId: chat.chatId,
        message,
      }),
    );
  };

  return (
    <div key={index} className="rounded p-5 mb-6 bg-base-100">
      <h2 className="font-bold text-xl">{content?.title}</h2>

      <p className="mt-3">{content?.summary}</p>

      <div className="mt-5">
        <h3 className="font-semibold">Suggested Questions</h3>

        <div className="flex flex-col items-start gap-2 mt-3">
          {content?.suggestedQuestions?.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                handleSubmit(q);
              }}
              className="btn btn-neutral"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageString;
