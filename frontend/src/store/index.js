import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import projectSlice from "./projectSlice";
import drawboardSlice from "./drawBoardSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    project: projectSlice.reducer,
    drawboard: drawboardSlice.reducer,
  },
});
