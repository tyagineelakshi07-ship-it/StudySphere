
import { useStudy } from "../context/StudyContext";
import "./Pomodoro.css";

function Pomodoro() {
  const {
    completedSessions = 0,
    focusMinutes = 0,

    mode,
    setMode,
    selectedMinutes,
    setSelectedMinutes,
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    message,
    setMessage,
    setCompletionHandled,
  } = useStudy();

  let totalMinutes = selectedMinutes;

  if (mode === "Short Break") {
    totalMinutes = 5;
  } else if (mode === "Long Break") {
    totalMinutes = 15;
  }

  // Change timer mode
  function changeMode(newMode) {
    setMode(newMode);
    setIsRunning(false);
    setMessage("");
    setCompletionHandled(false);

    if (newMode === "Focus") {
      setTimeLeft(selectedMinutes * 60);
    } else if (newMode === "Short Break") {
      setTimeLeft(5 * 60);
    } else {
      setTimeLeft(15 * 60);
    }
  }

  // Change focus duration
  function changeDuration(minutes) {
    setSelectedMinutes(minutes);
    setMode("Focus");
    setIsRunning(false);
    setTimeLeft(minutes * 60);
    setMessage("");
    setCompletionHandled(false);
  }

  // Start or pause timer
  function startPauseTimer() {
    if (timeLeft === 0) {
      setTimeLeft(totalMinutes * 60);
      setMessage("");
      setCompletionHandled(false);
      setIsRunning(true);
    } else {
      setIsRunning((previous) => !previous);
    }
  }

  // Reset timer
  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(totalMinutes * 60);
    setMessage("");
    setCompletionHandled(false);
  }

  // Convert seconds into MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0")
    );
  }

  // Calculate progress percentage
  const progress = Math.max(
    0,
    Math.min(100, (timeLeft / (totalMinutes * 60)) * 100)
  );

  return (
    <main className="pomodoro-page">
      {/* Decorative doodles */}
      <div className="extra-doodles" aria-hidden="true">
        {[
          "✦", "✧", "♡", "✩", "☾", "⋆", "✎", "✦",
          "☼", "✧", "♡", "✩", "⋆", "☾", "✦", "✧",
          "✩", "♡", "⋆", "✦", "☼", "✧", "✩", "⋆",
          "♡", "✦", "☾", "✧", "✩", "⋆"
        ].map((doodle, index) => (
          <span
            className={`tiny-doodle doodle-${index + 1}`}
            key={index}
          >
            {doodle}
          </span>
        ))}
      </div>

      {/* Book illustration */}
      <svg
        className="pomodoro-doodle book-doodle"
        viewBox="0 0 100 75"
        aria-hidden="true"
      >
        <path d="M50 16 C35 4 18 7 5 13 L10 62 C24 55 39 57 50 68 C61 57 76 55 90 62 L95 13 C82 7 65 4 50 16Z" />
        <path d="M50 16 V68 M17 22 Q32 15 42 24 M16 34 Q31 27 42 36 M58 24 Q69 15 84 22 M58 36 Q69 27 84 34" />
      </svg>

      {/* Coffee illustration */}
      <svg
        className="pomodoro-doodle coffee-doodle"
        viewBox="0 0 80 85"
        aria-hidden="true"
      >
        <path d="M15 35 H55 V61 Q55 72 43 72 H27 Q15 72 15 61Z" />
        <path d="M55 41 H62 Q73 41 69 52 Q67 59 55 58 M22 79 H59" />
        <path d="M25 25 Q18 17 26 10 M38 25 Q31 17 39 10 M49 25 Q42 17 50 10" />
      </svg>

      {/* Clock illustration */}
      <svg
        className="pomodoro-doodle clock-doodle"
        viewBox="0 0 80 80"
        aria-hidden="true"
      >
        <circle cx="40" cy="42" r="30" />
        <path d="M40 23 V42 L54 50 M29 5 H51 M40 5 V12" />
      </svg>

      {/* Pencil illustration */}
      <svg
        className="pomodoro-doodle pencil-doodle"
        viewBox="0 0 110 35"
        aria-hidden="true"
      >
        <path d="M8 25 L78 5 L91 10 L21 30Z M78 5 L82 17 M8 25 L3 33 L21 30 M31 18 L44 25" />
      </svg>

      <header className="pomodoro-heading">
        <p>STAY FOCUSED</p>
        <h1>
          Pomodoro <span>Timer</span>
        </h1>
        <div className="focus-line" />
        <p className="pomodoro-subtitle">
          Small steps. Deep focus. Better days.
        </p>
      </header>

      {/* Timer circle */}
      <section className="timer-doodle">
        <div
          className="simple-progress"
          style={{ "--progress": `${progress}%` }}
        >
          <div className="timer-content">
            <span className="timer-mode">{mode.toUpperCase()}</span>
            <div className="timer-number">{formatTime(timeLeft)}</div>
            <span className="timer-session">
              {mode === "Focus" ? "STUDY SESSION" : "TIME FOR YOURSELF"}
            </span>
          </div>
        </div>
      </section>

      {/* Timer modes */}
      <div className="timer-controls mode-controls">
        {["Focus", "Short Break", "Long Break"].map((item) => (
          <button
            type="button"
            key={item}
            className={`timer-start ${mode === item ? "active-mode" : ""}`}
            onClick={() => changeMode(item)}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Focus durations */}
      {mode === "Focus" && (
        <div className="timer-controls duration-controls">
          {[25, 30, 45].map((minutes) => (
            <button
              type="button"
              key={minutes}
              className={`timer-start duration-button ${
                selectedMinutes === minutes ? "active-mode" : ""
              }`}
              onClick={() => changeDuration(minutes)}
            >
              {minutes} MIN
            </button>
          ))}
        </div>
      )}

      {/* Start, pause and reset */}
      <div className="timer-controls action-controls">
        <button
          type="button"
          className="timer-start main-action"
          onClick={startPauseTimer}
        >
          {isRunning ? "PAUSE" : timeLeft === 0 ? "START AGAIN" : "START"}
        </button>

        <button
          type="button"
          className="timer-reset"
          onClick={resetTimer}
          aria-label="Reset timer"
          title="Reset timer"
        >
          ↻
        </button>
      </div>

      {message && (
        <p className="timer-status" role="status">
          {message}
        </p>
      )}

      {/* Study statistics */}
      <section className="session-info">
        <div>
          <span>COMPLETED SESSIONS</span>
          <strong>{completedSessions}</strong>
        </div>

        <div className="info-divider" />

        <div>
          <span>FOCUS MINUTES</span>
          <strong>{focusMinutes}</strong>
        </div>

        <div className="info-divider" />

        <div>
          <span>YOUR DAILY REMINDER</span>
          <strong>KEEP GOING ✦</strong>
        </div>
      </section>
    </main>
  );
}

export default Pomodoro;


