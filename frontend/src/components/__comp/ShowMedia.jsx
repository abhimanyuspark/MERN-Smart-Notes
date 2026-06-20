import React from "react";

const ShowMedia = ({ onClose, media, type }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-[90vh] bg-base-200 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-16 px-4 border-b border-base-300 flex items-center justify-end">
          <button className="btn btn-accent" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(90vh-64px)] p-4 overflow-auto flex items-center justify-center">
          {type === "image" ? (
            <img
              src={media}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded"
            />
          ) : (
            <object
              data={media}
              type="application/pdf"
              className="w-full h-full"
            >
              <iframe
                src={media}
                title="PDF Preview"
                className="w-full h-full border-0"
              />

              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-center">
                  Unable to display PDF in your browser.
                </p>

                <a
                  href={media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Open PDF
                </a>
              </div>
            </object>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMedia;
