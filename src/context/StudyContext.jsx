
import { createContext, useContext, useEffect, useState } from "react";

const StudyContext = createContext();

export function StudyProvider({ children }) {
  const [videos, setVideos] = useState([
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
  ]);

  const [completedSessions, setCompletedSessions] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [tasks, setTasks] = useState([]);

  // Pomodoro timer state
  const [mode, setMode] = useState("Focus");
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [completionHandled, setCompletionHandled] = useState(false);

  // Play a bell sound
  function playBell() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
      );

      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.onended = () => {
        audioContext.close();
      };

      if (audioContext.state === "suspended") {
        audioContext.resume().then(() => {
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 1);
        }).catch(() => {
          audioContext.close();
        });
      } else {
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
      }
    } catch (error) {
      console.log("Bell sound could not play.");
    }
  }

  // Keep timer running when changing pages
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Handle timer completion only once
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning || completionHandled) {
      return;
    }

    setIsRunning(false);
    setCompletionHandled(true);
    playBell();

    if (mode === "Focus") {
      setCompletedSessions((previous) => previous + 1);
      setFocusMinutes((previous) => previous + selectedMinutes);
      setMessage("Focus complete! Great work. Take a break.");
    } else {
      setMessage("Break complete! Ready to study again?");
    }
  }, [
    timeLeft,
    isRunning,
    completionHandled,
    mode,
    selectedMinutes,
  ]);

  // Add a new study video
  function addVideo(video) {
    const newVideo = {
      ...video,
      id: Date.now(),
      completed: false,
    };

    setVideos((previousVideos) => [...previousVideos, newVideo]);
  }

  // Mark a video as completed or not watched
  function toggleVideo(id) {
    setVideos((previousVideos) =>
      previousVideos.map((video) =>
        video.id === id
          ? { ...video, completed: !video.completed }
          : video
      )
    );
  }

  // Delete a study video
  function deleteVideo(id) {
    setVideos((previousVideos) =>
      previousVideos.filter((video) => video.id !== id)
    );
  }

  // Record a completed Pomodoro session
  function recordSession(minutes) {
    setCompletedSessions((previous) => previous + 1);
    setFocusMinutes((previous) => previous + minutes);
  }

  // Add a new task
  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  // Mark a task as completed or incomplete
  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  return (
    <StudyContext.Provider
      value={{
        videos,
        addVideo,
        toggleVideo,
        deleteVideo,

        completedSessions,
        focusMinutes,
        recordSession,

        tasks,
        addTask,
        toggleTask,

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
        completionHandled,
        setCompletionHandled,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}



