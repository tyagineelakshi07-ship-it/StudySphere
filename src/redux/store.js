
import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "../slices/videoSlice.js";

// Load previously saved videos
let preloadedState;

const savedVideos = localStorage.getItem("studySphereVideos");

if (savedVideos) {
  try {
    const parsedVideos = JSON.parse(savedVideos);

    if (
      parsedVideos &&
      Array.isArray(parsedVideos.videos)
    ) {
      preloadedState = {
        videos: parsedVideos,
      };
    }
  } catch (error) {
    console.log("Saved videos could not be loaded.");
  }
}

// Create Redux store
export const store = configureStore({
  reducer: {
    videos: videoReducer,
  },
  preloadedState,
});

// Save videos whenever Redux state changes
store.subscribe(() => {
  localStorage.setItem(
    "studySphereVideos",
    JSON.stringify(store.getState().videos)
  );
});


