import React from "react";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";
import AddFilesToNote from "./AddFilesToNote";

const NoteDetails = () => {
  const { note, loading } = useSelector((state) => state.notes);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="p-4 bg-base-300 border-b-2 border-base-100 mb-2 pl-5">
        Source
      </div>

      <AddFilesToNote />

      <ul className="p-2">
        {note?.medias?.map((m, i) => {
          if (m.mediaType === "image") {
            return (
              <li key={i} className="flex gap-4 items-center">
                {/* <img
                  alt={m.fileName}
                  className="max-w-50 h-10 rounded"
                  src={`${import.meta.env.VITE_API_URL}${m.mediaUrl}`}
                /> */}
                <div className="text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <p className="text-sm truncate">{m.fileName}</p>
              </li>
            );
          } else {
            return (
              <li key={i} className="flex gap-4 items-center">
                <div className="text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                  </svg>
                </div>
                <p className="text-sm truncate">Pdf</p>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default NoteDetails;
