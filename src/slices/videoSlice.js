
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [
    {
      id: 1,
      title: "SQL Joins Explained",
      subject: "DBMS",
      url: "",
      completed: false,
    },
    {
      id: 2,
      title: "Probability Basics",
      subject: "Statistics",
      url: "",
      completed: false,
    },
    {
      id: 3,
      title: "React Components",
      subject: "FEE",
      url: "",
      completed: false,
    },
  ],
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    addVideo: (state, action) => {
      state.videos.push({
        ...action.payload,
        id: Date.now(),
        completed: false,
      });
    },

    toggleVideo: (state, action) => {
      const video = state.videos.find(
        (video) => video.id === action.payload
      );

      if (video) {
        video.completed = !video.completed;
      }
    },

    deleteVideo: (state, action) => {
      state.videos = state.videos.filter(
        (video) => video.id !== action.payload
      );
    },
  },
});

export const { addVideo, toggleVideo, deleteVideo } =
  videoSlice.actions;

export default videoSlice.reducer;

