import { useState } from "react";
import "./Pomodoro.css";

function Pomodoro() {

  const [time, setTime] = useState(25);

  return (
    <div className="pomodoro-page">

      {/* Heading */}
      <div className="pomodoro-heading">
        <p>STAY FOCUSED</p>

        <h1>
          Pomodoro <span>Timer</span>
        </h1>

        <div className="focus-line"></div>
      </div>


      {/* Timer */}
      <div className="timer-doodle">

        <svg
          className="timer-svg"
          viewBox="0 0 400 400"
        >

          <circle
            className="timer-ring outer-ring"
            cx="200"
            cy="200"
            r="150"
          />

          <circle
            className="timer-ring inner-ring"
            cx="200"
            cy="200"
            r="125"
          />

        </svg>


        {/* Timer Text */}
        <div className="timer-content">

          <div className="timer-mode">
            FOCUS
          </div>

          <div className="timer-number">
            {time}:00
          </div>

          <div className="timer-session">
            STUDY SESSION
          </div>

        </div>

      </div>


      {/* Buttons */}
      <div className="timer-controls">

        <button
          className="timer-start"
          onClick={() => setTime(25)}
        >
          25 MIN
        </button>

        <button
          className="timer-start"
          onClick={() => setTime(30)}
        >
          30 MIN
        </button>

        <button
          className="timer-start"
          onClick={() => setTime(45)}
        >
          45 MIN
        </button>

        <button className="timer-reset">
          ↻
        </button>

      </div>


      {/* Session Info */}
      <div className="session-info">

        <div>
          <span>SESSION</span>
          <strong>01</strong>
        </div>

        <div className="info-divider"></div>

        <div>
          <span>BREAK</span>
          <strong>05 MIN</strong>
        </div>

        <div className="info-divider"></div>

        <div>
          <span>GOAL</span>
          <strong>FOCUS</strong>
        </div>

      </div>


      {/* Doodles */}
      <svg
        className="pomodoro-doodle coffee-doodle"
        viewBox="0 0 100 100"
      >
        <path d="M20 35 L75 35 L70 75 L25 75 Z" />
        <path d="M75 45 C95 40 95 65 72 65" />
        <path d="M35 25 C30 15 40 15 38 7" />
        <path d="M55 25 C50 15 60 15 58 7" />
      </svg>


      <svg
        className="pomodoro-doodle clock-doodle"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="35" />
        <line x1="50" y1="50" x2="50" y2="28" />
        <line x1="50" y1="50" x2="68" y2="58" />
      </svg>


      <svg
        className="pomodoro-doodle pencil-doodle"
        viewBox="0 0 150 60"
      >
        <path d="M15 40 L110 15 L125 30 L30 55 Z" />
        <path d="M110 15 L130 10 L125 30" />
      </svg>


      {/* Stars */}
      <div className="p-star p-star-one">✦</div>
      <div className="p-star p-star-two">✦</div>
      <div className="p-star p-star-three">✦</div>

    </div>
  );
}

export default Pomodoro;