import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../redux/features/chat";

function MessageInput() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chat);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    dispatch(
      sendMessage({
        chatId: chat.chatId,
        message,
      }),
    );

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        p-4
        border-t
        
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          border
          rounded-2xl
          px-4
          py-3
        "
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your notes..."
          className="
            flex-1
            outline-none
            bg-transparent
          "
        />

        <button
          type="submit"
          className="
            bg-blue-600
            text-white
            px-5
            py-2
            rounded-xl
          "
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
