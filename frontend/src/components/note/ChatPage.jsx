import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getChatMessages } from "../../redux/features/chat";
import ChatMessages from "./ChatMessage";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

function ChatPage() {
  const dispatch = useDispatch();
  const { note } = useSelector((state) => state.notes);
  const id = note?.chatId?._id;

  useEffect(() => {
    if (id) {
      dispatch(getChatMessages(id));
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-2 relative h-full">
      <ChatHeader />
      <div className="overflow-y-scroll h-full">
        <ChatMessages />
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatPage;
