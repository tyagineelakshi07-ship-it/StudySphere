import { Link } from "react-router-dom";

import {
  Home,
  NotebookPen,
  Timer,
  ListTodo,
  Brain,
  PlaySquare,
  ChartNoAxesColumn,
  Settings,
  Info,
  Mail,
  ChevronDown,
  Sparkles
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo">
        <Sparkles className="logo-icon" size={17} />
        <span className="logo-white">Study</span>
        <span>Sphere</span>
      </div>


      {/* Navigation */}
      <nav className="nav-menu">

        <Link to="/" className="nav-item active">
          <Home size={17} />
          <p>Home</p>
        </Link>

        <div className="nav-item">
          <NotebookPen size={17} />
          <p>Notes</p>
        </div>

        <Link to="/pomodoro" className="nav-item">
          <Timer size={17} />
          <p>Pomodoro</p>
        </Link>
        <div className="nav-item">
          <ListTodo size={17} />
          <p>Todo List</p>
        </div>

        <div className="nav-item">
          <Brain size={17} />
          <p>Quiz Generator</p>
        </div>

        <div className="nav-item">
          <PlaySquare size={17} />
          <p>YouTube Manager</p>
        </div>

        <div className="nav-item">
          <ChartNoAxesColumn size={17} />
          <p>Performance</p>
        </div>

        <div className="nav-item">
          <Settings size={17} />
          <p>Settings</p>
        </div>

        <div className="nav-item">
          <Info size={17} />
          <p>About Us</p>
        </div>

        <div className="nav-item">
          <Mail size={17} />
          <p>Contact</p>
        </div>

      </nav>


      {/* Profile */}
      <div className="profile">

        <div className="profile-avatar">
          N
        </div>

        <div className="profile-info">
          <p>Neelakshi</p>
          <span>View Profile</span>
        </div>

        <ChevronDown
          className="profile-arrow"
          size={15}
        />

      </div>

    </aside>
  );
}

export default Sidebar;