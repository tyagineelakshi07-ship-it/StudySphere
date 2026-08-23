import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/Notes.jsx";
import Sidebar from "./Components/sidebar";
import Home from "./pages/Home.jsx";
import Performance from "./pages/Performance.jsx";
import Pomodoro from "./pages/Pomodoro.jsx";
import Settings from "./pages/Settings.jsx";
import YouTubeManager from "./pages/YoutubeManager.jsx";
import About from "./pages/About.jsx";
import Todo from "./pages/Todo.jsx";
import QuizGenerator from "./pages/QuizGenerator.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/youtube" element={<YouTubeManager />} />
             <Route path="/performance" element={<Performance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/quiz-generator" element={<QuizGenerator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;