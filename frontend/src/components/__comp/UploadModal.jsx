import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { uploadNote } from "../../redux/features/note";

export default function UploadModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "uploading" | "done"

  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setStatus("idle");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const addFiles = (incoming) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...[...incoming].filter((f) => !existing.has(f.name + f.size)),
      ];
    });
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleUpload = () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    setStatus("uploading");
    dispatch(uploadNote(formData))
      .unwrap()
      .then((res) => {
        setStatus("done");
        // console.log("Upload successful:", res);
        if (res?.success) {
          setTimeout(() => navigate(`/note/${res?.note?._id}`), 500);
          onClose();
        }
      })
      .catch((err) => {
        console.error("Upload error:", err);
        setStatus("idle");
      });
  };

  const formatBytes = (b) => {
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(1)} MB`;
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">New note</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/50 hover:text-base-content transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors
              ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-base-300 hover:border-base-400 bg-base-200"}`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            <div className="w-11 h-11 rounded-lg bg-base-100 border border-base-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-base-content/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop files here, or{" "}
                <span className="text-indigo-600">browse</span>
              </p>
              <p className="text-xs text-base-content/40 mt-1">
                Any file type · Multiple files supported
              </p>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <ul className="flex flex-col gap-2">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-base-200 border border-base-300 rounded-lg px-3 py-2.5 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-indigo-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span className="flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-base-content/40 shrink-0">
                    {formatBytes(f.size)}
                  </span>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-0.5 rounded hover:bg-base-300 text-base-content/40 hover:text-base-content"
                    aria-label={`Remove ${f.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!files.length || status === "uploading"}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all active:scale-[.98]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
              ${status === "done" ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {status === "uploading" ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3V24A12 12 0 014 12z"
                  />
                </svg>
                Uploading…
              </>
            ) : status === "done" ? (
              <>✓ Uploaded!</>
            ) : (
              <>
                Upload{" "}
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? "s" : ""}`
                  : "files"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
