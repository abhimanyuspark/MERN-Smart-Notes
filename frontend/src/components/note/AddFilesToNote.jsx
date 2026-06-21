import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadModal from "../__comp/UploadModal";
import { addFilesToNote } from "../../redux/features/note";
import { addChat } from "../../redux/features/chat";

export default function AddFilesToNote() {
  const [isOpen, setIsOpen] = useState(false);
  const { note } = useSelector((state) => state.notes);
  const dispatch = useDispatch();
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-2 pt-0">
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

      <UploadModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        onUpload={(formData) =>
          dispatch(addFilesToNote({ noteId: note?._id, data: formData }))
            .unwrap()
            .then((res) => {
              if (res?.success) {
                onClose();
                dispatch(addChat(res));
              }
            })
        }
      />
    </div>
  );
}
