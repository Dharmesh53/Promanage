import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawboard: { isDrawing: false },
};

const drawboardSlice = createSlice({
  name: "drawboard",
  initialState,
  reducers: {
    setDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
  },
});

export const { setDrawing } = drawboardSlice.actions;
export default drawboardSlice;
