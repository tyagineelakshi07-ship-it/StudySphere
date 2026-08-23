import { useState } from "react";
import "./YouTubeManager.css";

function YouTubeManager() {

  const [video1, setVideo1] = useState(false);
  const [video2, setVideo2] = useState(false);
  const [video3, setVideo3] = useState(false);

  return (
    <div className="youtube-page">

      <div className="youtube-header">
        <h1>YouTube Manager</h1>
        <p>Save and organize your study videos in one place 🎥</p>
      </div>


      <div className="add-video-box">

        <h2>➕ Add Study Video</h2>

        <label>YouTube Video Link</label>

        <input
          type="text"
          placeholder="Paste YouTube video link here"
        />

        <label>Subject</label>

        <input
          type="text"
          placeholder="Enter subject name"
        />

        <button>Save Video</button>

      </div>


      <div className="videos-section">

        <h2>📚 My Study Videos</h2>


        {/* Video 1 */}
        <div className="video-card">

          <div className="video-icon">
            ▶
          </div>

          <div className="video-info">
            <h3>SQL Joins Explained</h3>
            <p>Subject: DBMS</p>
          </div>

          <button
            className={
              video1
                ? "video-status completed"
                : "video-status not-watched"
            }
            onClick={() => setVideo1(!video1)}
          >
            {video1 ? "✓ Completed" : "☐ Not Watched"}
          </button>

        </div>


        {/* Video 2 */}
        <div className="video-card">

          <div className="video-icon">
            ▶
          </div>

          <div className="video-info">
            <h3>Probability Basics</h3>
            <p>Subject: Statistics</p>
          </div>

          <button
            className={
              video2
                ? "video-status completed"
                : "video-status not-watched"
            }
            onClick={() => setVideo2(!video2)}
          >
            {video2 ? "✓ Completed" : "☐ Not Watched"}
          </button>

        </div>


        {/* Video 3 */}
        <div className="video-card">

          <div className="video-icon">
            ▶
          </div>

          <div className="video-info">
            <h3>React Components</h3>
            <p>Subject: FEE</p>
          </div>

          <button
            className={
              video3
                ? "video-status completed"
                : "video-status not-watched"
            }
            onClick={() => setVideo3(!video3)}
          >
            {video3 ? "✓ Completed" : "☐ Not Watched"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default YouTubeManager;