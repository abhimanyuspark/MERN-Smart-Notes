import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { noteClear, uploadNoteId } from "../../redux/features/note";
import NoteChat from "../../components/note/NoteChat";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";
import useDeviceType from "../../hooks/useDeviceType";
import NoteChatMobile from "../../components/note/NoteChatMobile";

export default function NotePage() {
  const { id } = useParams();
  const { note, loading, error } = useSelector((state) => state.notes);
  const dispatch = useDispatch();
  const { deviceType, isMobile, isTablet, isDesktop } = useDeviceType();

  useEffect(() => {
    if (id) {
      dispatch(uploadNoteId(id));
    }

    return () => dispatch(noteClear());
  }, [dispatch, id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      {isDesktop && <NoteChat />}
      {isMobile && <NoteChatMobile />}
      {isTablet && <NoteChatMobile />}
    </>
  );
}
