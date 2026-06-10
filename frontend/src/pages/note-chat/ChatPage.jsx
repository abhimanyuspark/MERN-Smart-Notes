import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getChatMessages } from "../../redux/features/chat";
import ChatMessages from "./ChatMessage";
import MessageInput from "./MessageInput";

function ChatPage() {
  const dispatch = useDispatch();
  const { note } = useSelector((state) => state.notes);
  const id = note.chatId._id;

  useEffect(() => {
    dispatch(getChatMessages(id));
  }, [id]);

  return (
    <div className="flex flex-col gap-4 relative">
      <ChatMessages />
      {!note && <div className="h-full">Not Found</div>}

      <MessageInput />
    </div>
  );
}

export default ChatPage;
