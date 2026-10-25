
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./pages/Home.jsx";
import Notes from "./pages/Notes.jsx";
import Performance from "./pages/Performance.jsx";
import Pomodoro from "./pages/Pomodoro.jsx";
import Settings from "./pages/Settings.jsx";
import YouTubeManager from "./pages/YoutubeManager.jsx";
import About from "./pages/About.jsx";
import Todo from "./pages/Todo.jsx";
import QuizGenerator from "./pages/QuizGenerator.jsx";

import Sidebar from "./components/Sidebar.jsx";
import { StudyProvider } from "./context/StudyContext.jsx";
import { store } from "./redux/store.js";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <StudyProvider>
        <HashRouter>
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
                <Route
                  path="/quiz-generator"
                  element={<QuizGenerator />}
                />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </StudyProvider>
    </Provider>
  );
}

export default App;



