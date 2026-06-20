import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { uploadNoteId } from "../../redux/features/note";
import NoteChat from "./NoteChat";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";

export default function NotePage() {
  const { id } = useParams();
  const { note, loading, error } = useSelector((state) => state.notes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(uploadNoteId(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return <NoteChat />;
}
