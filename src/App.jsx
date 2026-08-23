import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./Components/sidebar";
import Home from "./pages/home.jsx";
import Pomodoro from "./pages/Pomodoro.jsx";

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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;