import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../redux/features/chat";

function MessageInput() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { chat, loading } = useSelector((state) => state.chat);

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
      className="bg-base-200 sticky bottom-0 rounded left-0 right-0 w-full"
    >
      <div className="flex items-center gap-3 px-4 py-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your notes..."
          className="flex-1 outline-none bg-transparent"
        />

        <button type="submit" className="btn btn-accent">
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
