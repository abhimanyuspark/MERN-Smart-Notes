import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../redux/axios";
import { useState } from "react";
import { uploadNoteId } from "../../redux/features/note";
import ChatPage from "./ChatPage";
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
