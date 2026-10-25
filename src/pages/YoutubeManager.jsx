
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  addVideo,
  toggleVideo,
  deleteVideo,
} from "../slices/videoSlice.js";

import "./YoutubeManager.css";

function YouTubeManager() {
  const dispatch = useDispatch();

  const videos = useSelector((state) => state.videos.videos);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  function isValidYouTubeUrl(value) {
    try {
      const parsedUrl = new URL(value);
      const hostname = parsedUrl.hostname.toLowerCase();

      return (
        (
          hostname === "youtube.com" ||
          hostname.endsWith(".youtube.com") ||
          hostname === "youtu.be" ||
          hostname.endsWith(".youtu.be")
        ) &&
        (
          parsedUrl.protocol === "https:" ||
          parsedUrl.protocol === "http:"
        )
      );
    } catch {
      return false;
    }
  }

  function handleSaveVideo(event) {
    event.preventDefault();

    if (!title.trim() || !url.trim() || !subject.trim()) {
      setError("Please fill in the title, video link and subject.");
      return;
    }

    if (!isValidYouTubeUrl(url.trim())) {
      setError("Please enter a valid YouTube link.");
      return;
    }

    dispatch(
      addVideo({
        title: title.trim(),
        url: url.trim(),
        subject: subject.trim(),
      })
    );

    setTitle("");
    setUrl("");
    setSubject("");
    setError("");
  }

  const completedCount = videos.filter(
    (video) => video.completed
  ).length;

  const subjects = [
    "All",
    ...new Set(videos.map((video) => video.subject)),
  ];

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      video.subject.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      selectedSubject === "All" ||
      video.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="youtube-page">
      <div className="youtube-header">
        <h1>YouTube Manager</h1>
        <p>Save and organize your study videos in one place 🎥</p>
      </div>

      <div className="add-video-box">
        <h2>➕ Add Study Video</h2>

        <form onSubmit={handleSaveVideo}>
          <label htmlFor="video-title">Video Title</label>
          <input
            id="video-title"
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="video-url">YouTube Video Link</label>
          <input
            id="video-url"
            type="url"
            placeholder="Paste YouTube video link here"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />

          <label htmlFor="video-subject">Subject</label>
          <input
            id="video-subject"
            type="text"
            placeholder="Enter subject name"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />

          {error && (
            <p role="alert" className="youtube-error">
              {error}
            </p>
          )}

          <button type="submit">Save Video</button>
        </form>
      </div>

      <div className="videos-section">
        <h2>📚 My Study Videos</h2>

        <p className="youtube-progress">
          Completed: {completedCount} / {videos.length} videos
        </p>

        <input
          type="search"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search study videos"
        />

        <select
          value={selectedSubject}
          onChange={(event) => setSelectedSubject(event.target.value)}
          aria-label="Filter videos by subject"
        >
          {subjects.map((subjectName) => (
            <option key={subjectName} value={subjectName}>
              {subjectName === "All"
                ? "All Subjects"
                : subjectName}
            </option>
          ))}
        </select>

        {filteredVideos.length === 0 ? (
          <p className="youtube-empty">
            No matching videos found.
          </p>
        ) : (
          filteredVideos.map((video) => (
            <div className="video-card" key={video.id}>
              <div className="video-icon">▶</div>

              <div className="video-info">
                <h3>{video.title}</h3>
                <p>Subject: {video.subject}</p>

                {video.url && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Video ↗
                  </a>
                )}
              </div>

              <button
                type="button"
                className={
                  video.completed
                    ? "video-status completed"
                    : "video-status not-watched"
                }
                onClick={() => dispatch(toggleVideo(video.id))}
              >
                {video.completed
                  ? "✓ Completed"
                  : "☐ Not Watched"}
              </button>

              <button
                type="button"
                className="youtube-delete-btn"
                onClick={() => dispatch(deleteVideo(video.id))}
                aria-label={`Delete ${video.title}`}
                title="Delete video"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default YouTubeManager;

