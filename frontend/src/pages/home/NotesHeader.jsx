import React from "react";

const NotesHeader = ({ notesCount, selectMode, selectedCount }) =>
  !selectMode ? (
    <div className="flex gap-2 flex-col">
      <h1 className="text-2xl font-bold -ml-1">📚 My Notes</h1>

      <p className="text-sm opacity-70">
        {notesCount} {notesCount === 1 ? "Note" : "Notes"}
      </p>
    </div>
  ) : (
    <div className="flex gap-2 flex-col">
      <h1 className="text-2xl font-bold">{selectedCount} Selected</h1>

      <p className="text-sm opacity-70">
        Click notes to select or deselect them
      </p>
    </div>
  );

export default NotesHeader;
