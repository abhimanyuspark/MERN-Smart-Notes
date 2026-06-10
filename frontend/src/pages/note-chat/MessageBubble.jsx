// components/MessageBubble.jsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-5 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[80%]
          rounded-2xl
          px-4
          py-3
          shadow-sm
          ${isUser ? "bg-base-100 text-white" : "bg-base-300 border"}
        `}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content?.text || ""}
        </ReactMarkdown>

        <div
          className={`
            text-xs mt-2
            ${isUser ? "text-blue-100" : "text-gray-400"}
          `}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
