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

const noteSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    note: null,
    loading: false,
    error: null,
  },
  reducers: {},
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
        state.loading = true;
        state.error = null;
      })
      .addCase(addFilesToNote.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload.note;
      })
      .addCase(addFilesToNote.rejected, (state, action) => {
        state.loading = false;
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
      });
  },
});

export default noteSlice.reducer;
