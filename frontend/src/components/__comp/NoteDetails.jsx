import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";
import AddFilesToNote from "./AddFilesToNote";
import ShowMedia from "./ShowMedia";

const NoteDetails = () => {
  const { note, loading } = useSelector((state) => state.notes);
  const [media, setMedia] = useState(null);

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
        {note?.medias?.map((m, i) => (
          <li
            key={i}
            className="cursor-pointer hover:bg-base-100 p-2 rounded"
            onClick={() => {
              setMedia(m);
            }}
          >
            {m.mediaType === "image" ? (
              <div className="flex gap-4 items-center ">
                <div className="text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <p className="text-sm truncate">{m.fileName}</p>
              </div>
            ) : (
              <div className="flex gap-4 items-center ">
                <div className="text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
                  </svg>
                </div>
                <p className="text-sm truncate">{m.fileName}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {media && (
        <ShowMedia
          onClose={() => {
            setMedia(null);
          }}
          media={import.meta.env.VITE_API_URL + media.mediaUrl}
          type={media.mediaType}
        />
      )}
    </div>
  );
};

export default NoteDetails;
