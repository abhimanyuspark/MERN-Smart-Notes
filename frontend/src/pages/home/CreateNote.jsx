import React, { useState } from "react";
import UploadModal from "../../components/__comp/UploadModal";

export default function CreateNote() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-info rounded size-full"
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
        Create new note
      </button>

      <UploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
