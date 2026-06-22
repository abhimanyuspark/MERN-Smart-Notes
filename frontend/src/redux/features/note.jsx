import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorFun } from "../../utils/errFun";
import { api } from "../axios";

// GET NOTES
export const fetchNotes = createAsyncThunk(
  "notes/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notes");
      return res.data.notes;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

// UPLOAD NOTE
export const uploadNote = createAsyncThunk(
  "notes/upload",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/notes/upload", data);
      return res.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

// Add Files To Note
export const addFilesToNote = createAsyncThunk(
  "notes/addFilesToNote",
  async ({ noteId, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/notes/upload/${noteId}`, data);
      return res.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

export const uploadNoteId = createAsyncThunk(
  "notes/uploadNoteId",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/notes/${id}`);
      return res.data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

export const deleteNotes = createAsyncThunk(
  "notes/deleteNote",
  async (noteIds, { rejectWithValue }) => {
    try {
      await api.delete("/notes/delete-multiple", {
        data: {
          noteIds: noteIds,
        },
      });
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

const initialState = {
  notes: [],
  note: null,
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    noteClear: (state) => {
      state.note = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.notes = [];
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadNote.pending, (state, action) => {
        state.error = null;
      })
      .addCase(uploadNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload.note);
      })
      .addCase(uploadNote.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addFilesToNote.pending, (state, action) => {
        state.error = null;
      })
      .addCase(addFilesToNote.fulfilled, (state, action) => {
        state.note.medias.push(action.payload?.media);
      })
      .addCase(addFilesToNote.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(uploadNoteId.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.note = null;
      })
      .addCase(uploadNoteId.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload.note;
      })
      .addCase(uploadNoteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteNotes.pending, (state, action) => {
        state.error = null;
      })
      .addCase(deleteNotes.fulfilled, (state, action) => {
        state.notes = state.notes.filter(
          (note) => !action.meta.arg.includes(note._id),
        );
      })
      .addCase(deleteNotes.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { noteClear } = noteSlice.actions;

export default noteSlice.reducer;
