import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth";
import noteReducer from "./features/note";
import themeReducer from "./features/theme";
import chatReducer from "./features/chat";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
    chat: chatReducer,
    theme: themeReducer,
  },
});
