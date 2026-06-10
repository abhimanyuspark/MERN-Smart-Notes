import React, { useEffect, useRef, useState } from "react";
import ChatPage from "./ChatPage";

const NoteChat = () => {
  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(256); // initial 64 * 4 = 256px
  const [rightWidth, setRightWidth] = useState(256); // initial 64 * 4 = 256px
  const dragging = useRef(null); // 'left' or 'right' or null

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (dragging.current === "left") {
        let newW = e.clientX - rect.left;
        newW = Math.max(120, Math.min(600, newW));
        setLeftWidth(newW);
      } else if (dragging.current === "right") {
        let newW = rect.right - e.clientX;
        newW = Math.max(120, Math.min(600, newW));
        setRightWidth(newW);
      }
    };

    const onUp = () => (dragging.current = null);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <aside
        className="overflow-y-scroll shrink-0 bg-base-300 p-2 rounded"
        style={{ width: leftWidth }}
      >
        {/* Sidebar */}
      </aside>

      {/* left resizer */}
      <div
        onMouseDown={() => (dragging.current = "left")}
        style={{ width: 2, cursor: "col-resize" }}
        className="bg-transparent hover:bg-gray-200 ml-1"
      />

      <div className="mx-1 flex-1 bg-base-300 rounded p-2 overflow-y-scroll">
        <ChatPage />
      </div>

      {/* right resizer */}
      <div
        onMouseDown={() => (dragging.current = "right")}
        style={{ width: 2, cursor: "col-resize" }}
        className="bg-transparent hover:bg-gray-200 mr-1"
      />

      <aside
        className="overflow-y-scroll shrink-0 bg-base-300 p-2 rounded"
        style={{ width: rightWidth }}
      >
        {/* StatusSidebar */}
      </aside>
    </div>
  );
};

export default NoteChat;
