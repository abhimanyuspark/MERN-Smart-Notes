import React from "react";

const ActionBar = ({
  notes,
  selectMode,
  selectedNotes,
  setSelectedNotes,
  setSelectMode,
  deleteSelected,
}) => {
  return (
    <div className="flex gap-2 flex-wrap justify-end">
      <button
        className="btn btn-outline"
        onClick={() => {
          setSelectMode((prev) => !prev);
          setSelectedNotes([]);
        }}
      >
        {selectMode ? "Cancel" : "Select"}
      </button>

      {selectMode && (
        <>
          <button
            className="btn btn-primary"
            onClick={() => setSelectedNotes(notes.map((n) => n._id))}
          >
            Select All
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setSelectedNotes([])}
          >
            Deselect All
          </button>

          <button
            className="btn btn-error"
            disabled={!selectedNotes.length}
            onClick={deleteSelected}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
              <path
                fillRule="evenodd"
                d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
            Delete ({selectedNotes.length})
          </button>
        </>
      )}
    </div>
  );
};

export default ActionBar;
