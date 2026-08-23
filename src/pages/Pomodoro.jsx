import "./Pomodoro.css";

function Pomodoro() {
  return (
    <div className="pomodoro-page">

      {/* Main Heading */}
      <div className="pomodoro-heading">
        <p>STUDY SESSION</p>
        <h1>Focus<span>.</span></h1>
        <div className="focus-line"></div>
      </div>

      {/* Hand Drawn Timer */}
      <div className="timer-doodle">

        <svg viewBox="0 0 420 420" className="timer-svg">

          {/* Outer imperfect circle */}
          <circle
            cx="210"
            cy="210"
            r="165"
            className="timer-ring outer-ring"
          />

          <circle
            cx="210"
            cy="210"
            r="151"
            className="timer-ring inner-ring"
          />

          {/* Timer ticks */}
          <line x1="210" y1="45" x2="210" y2="58" />
          <line x1="375" y1="210" x2="362" y2="210" />
          <line x1="210" y1="375" x2="210" y2="362" />
          <line x1="45" y1="210" x2="58" y2="210" />

          {/* Small decorative marks */}
          <path d="M105 92 Q112 84 121 80" />
          <path d="M310 95 Q320 100 326 110" />
          <path d="M95 315 Q102 323 111 327" />
          <path d="M315 315 Q324 309 330 300" />

        </svg>

        <div className="timer-content">
          <span className="timer-mode">FOCUS</span>
          <div className="timer-number">25:00</div>
          <span className="timer-session">SESSION 01</span>
        </div>

      </div>

      {/* Controls */}
      <div className="timer-controls">
        <button className="timer-start">START FOCUS</button>
        <button className="timer-reset">↻</button>
      </div>

      {/* Bottom Info */}
      <div className="session-info">
        <div>
          <span>FOCUS</span>
          <strong>25 MIN</strong>
        </div>

        <div className="info-divider"></div>

        <div>
          <span>SHORT BREAK</span>
          <strong>5 MIN</strong>
        </div>

        <div className="info-divider"></div>

        <div>
          <span>LONG BREAK</span>
          <strong>15 MIN</strong>
        </div>
      </div>

      {/* Doodles */}

      <svg className="pomodoro-doodle coffee-doodle" viewBox="0 0 120 120">
        <path d="M25 45 Q60 38 92 46 L86 82 Q58 92 31 81 Z" />
        <path d="M90 52 Q108 49 105 65 Q102 76 88 71" />
        <path d="M42 32 Q39 22 46 17" />
        <path d="M61 31 Q58 21 65 15" />
      </svg>

      <svg className="pomodoro-doodle clock-doodle" viewBox="0 0 120 120">
        <circle cx="60" cy="62" r="38" />
        <path d="M60 62 L60 39" />
        <path d="M60 62 L78 72" />
        <path d="M52 17 Q60 11 68 17" />
      </svg>

      <svg className="pomodoro-doodle pencil-doodle" viewBox="0 0 150 80">
        <path d="M20 60 L105 20 L125 40 L40 76 Z" />
        <path d="M105 20 L122 13 L138 29 L125 40" />
        <path d="M20 60 L14 75 L40 76" />
        <path d="M45 49 L60 62" />
        <path d="M62 41 L77 54" />
      </svg>

      {/* Stars */}
      <span className="p-star p-star-one">✦</span>
      <span className="p-star p-star-two">✧</span>
      <span className="p-star p-star-three">✦</span>

    </div>
  );
}

export default Pomodoro;