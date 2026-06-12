import React from "react";

const ShowMedia = ({ onClose, media, type }) => {
  return (
    <div
      className="fixed z-50 top-0 left-0 size-full bg-black/50 flex items-center justify-center"
      onBlur={onClose}
    >
      <div className="w-3/5 h-3/5 bg-base-200 rounded">
        <div className="border-b-2 border-base-100 p-2 flex justify-end items-center">
          <button className="btn btn-accent rounded" onClick={onClose}>
            close
          </button>
        </div>

        {type === "image" ? (
          <div className="p-2 size-full flex justify-center">
            <img src={media} alt={media} className="size-fit" />
          </div>
        ) : (
          <div className="p-2 size-full relative">
            <iframe src={media} className="w-full h-full"></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowMedia;
