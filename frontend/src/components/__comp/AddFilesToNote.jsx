import React, { useState } from "react";
import UploadSource from "./UploadSource";
import { useSelector } from "react-redux";

export default function AddFilesToNote() {
  const [isOpen, setIsOpen] = useState(false);
  const { note } = useSelector((state) => state.notes);

  return (
    <div className="p-2">
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-accent rounded size-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Files To Note
      </button>

      <UploadSource
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        noteId={note?._id}
      />
    </div>
  );
}
