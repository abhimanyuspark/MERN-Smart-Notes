import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadNote } from "../../redux/features/note";

export default function UploadModal() {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  const handleUpload = () => {
    const formData = new FormData();

    for (let file of files) {
      formData.append("files", file);
    }

    dispatch(uploadNote(formData))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.payload.success) {
          navigate(`/note/${res.payload.note._id}`);
        }
      })
      .catch((err) => {
        console.error("Upload error:", err);
      });
  };

  return (
    <div className="p-4">
      <input
        type="file"
        multiple
        className="file-input"
        onChange={(e) => setFiles(e.target.files)}
      />

      <button className="btn btn-primary mt-3" onClick={handleUpload}>
        Upload Note
      </button>
    </div>
  );
}
