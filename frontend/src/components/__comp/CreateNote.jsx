import React, { useState } from "react";
import UploadModal from "../../components/__comp/UploadModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { uploadNote } from "../../redux/features/note";

export default function CreateNote() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary rounded w-full h-24"
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

      <UploadModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        onUpload={(formData) =>
          dispatch(uploadNote(formData))
            .unwrap()
            .then((res) => {
              if (res?.success) navigate(`/note/${res?.note?._id}`);
            })
        }
      />
    </div>
  );
}
