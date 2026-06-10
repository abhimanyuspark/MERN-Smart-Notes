import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes } from "../../redux/features/note";
import { Link } from "react-router";
import UploadModal from "../../components/__comp/UploadModal";

export default function Home() {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, []);

  if (loading && notes.length === 0) {
    return (
      <div className="p-6">
        <UploadModal />
        <p className="text-center text-gray-500">Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0 && !loading) {
    return (
      <div className="p-6">
        <UploadModal />
        <p className="text-center text-gray-500">No notes found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      <UploadModal />
      {notes.map((note) => (
        <Link
          to={`/note/${note._id}`}
          key={note._id}
          className="card bg-base-200 p-4 shadow"
        >
          <h2 className="font-bold">{note.title}</h2>
          <p className="text-sm opacity-70">{note.summary?.slice(0, 80)}</p>
        </Link>
      ))}
    </div>
  );
}
