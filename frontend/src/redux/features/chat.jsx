import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../axios";
import { errorFun } from "../../utils/errFun";

export const getChatMessages = createAsyncThunk(
  "chat/getMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`chats/${chatId}/messages`);
      return data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, message }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`chats/${chatId}/message`, { message });
      return data;
    } catch (error) {
      const errMsg = errorFun(error);
      return rejectWithValue(errMsg);
    }
  },
);

const initialState = {
  chat: null,
  messages: [],
  loading: false,
  sending: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChat: (state) => {
      state.chat = null;
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
      })

      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.loading = false;

        state.chat = {
          chatId: action.payload.chatId,
          title: action.payload.title,
          noteId: action.payload.noteId,
        };

        state.messages = action.payload.messages;
      })

      .addCase(getChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.pending, (state, action) => {
        state.sending = true;
        state.messages.push({
          role: "user",
          content: { text: action.meta.arg.message },
          createdAt: new Date(),
        });
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.messages.push(action.payload.message);
      })

      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { clearChat } = chatSlice.actions;

export default chatSlice.reducer;
