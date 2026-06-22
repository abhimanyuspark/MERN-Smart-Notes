import { useDispatch } from "react-redux";
import { deleteNotes } from "../../redux/features/note";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Delete = ({ id }) => {
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Delete Note?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    toast.promise(dispatch(deleteNotes([id])).unwrap(), {
      loading: "Deleting...",
      success: "Deleted Successfully",
      error: (err) => err,
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="hover:*:text-red-500 hover:*:size-6 cursor-pointer"
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
    </button>
  );
};

export default Delete;
