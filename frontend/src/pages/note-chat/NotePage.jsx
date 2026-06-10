import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { uploadNoteId } from "../../redux/features/note";
import NoteChat from "./NoteChat";

export default function NotePage() {
  const { id } = useParams();
  const { note, loading } = useSelector((state) => state.notes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uploadNoteId(id));
  }, [dispatch, id]);

  if (loading || !note) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return <NoteChat />;
}
