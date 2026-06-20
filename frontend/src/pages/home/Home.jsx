import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes } from "../../redux/features/note";
import { Link } from "react-router";
import UploadModal from "../../components/__comp/UploadModal";
import Error from "../../components/common/Error";
import Loading from "../../components/common/Loading";
import CreateNote from "../../components/__comp/CreateNote";

export default function Home() {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 *:h-24 gap-4">
      <CreateNote />

      {notes.map((note) => (
        <Link
          to={`/note/${note._id}`}
          key={note._id}
          className="bg-base-200 p-4 rounded"
        >
          <h2 className="font-bold">{note.title}</h2>
          <p className="text-sm opacity-70 truncate h-24">{note.summary}</p>
        </Link>
      ))}
    </div>
  );
}
