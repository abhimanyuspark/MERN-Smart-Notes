import Delete from "./Delete";

const NoteCard = ({ note, navigate, selectMode, selected, onToggle }) => {
  return (
    <div
      onClick={() =>
        selectMode ? onToggle(note._id) : navigate(`/note/${note._id}`)
      }
      className={`
        p-4 rounded cursor-pointer transition
        ${selectMode ? "outline outline-secondary" : ""}
        ${selected ? "bg-accent" : "bg-base-200 hover:bg-base-300"}
      `}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-bold">{note.title}</h2>

        {!selectMode && <Delete id={note._id} />}
      </div>

      <p className="text-sm opacity-70 truncate mt-2 line-clamp-1">
        {note.summary}
      </p>
    </div>
  );
};

export default NoteCard;
