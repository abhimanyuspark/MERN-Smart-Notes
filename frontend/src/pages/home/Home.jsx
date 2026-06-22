import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNotes, fetchNotes } from "../../redux/features/note";
import { useNavigate } from "react-router";
import CreateNote from "../../components/__comp/CreateNote";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ActionBar from "./ActionBar";
import NoteCard from "./NoteCard";
import NotesHeader from "./NotesHeader";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notes, loading, error } = useSelector((state) => state.notes);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const toggleNote = (id) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const deleteSelected = async () => {
    if (!selectedNotes.length) return;

    const result = await Swal.fire({
      title: "Delete Selected Notes?",
      text: `${selectedNotes.length} notes will be deleted.`,
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    toast.promise(dispatch(deleteNotes(selectedNotes)).unwrap(), {
      loading: "Deleting...",
      success: "Deleted Successfully",
      error: (err) => err,
    });

    setSelectedNotes([]);
    setSelectMode(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 flex justify-between items-center">
        <NotesHeader
          notesCount={notes?.length}
          selectMode={selectMode}
          selectedCount={selectedNotes?.length}
        />

        {notes?.length > 0 && (
          <ActionBar
            notes={notes}
            selectMode={selectMode}
            selectedNotes={selectedNotes}
            setSelectedNotes={setSelectedNotes}
            setSelectMode={setSelectMode}
            deleteSelected={deleteSelected}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CreateNote />

        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            navigate={navigate}
            selectMode={selectMode}
            selected={selectedNotes.includes(note._id)}
            onToggle={toggleNote}
          />
        ))}
      </div>
    </div>
  );
}
