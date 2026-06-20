import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded px-4 py-3 shadow-sm ${isUser ? "bg-primary" : "bg-base-100"}`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content?.text || ""}
        </ReactMarkdown>

        <div
          className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-gray-500"}`}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
