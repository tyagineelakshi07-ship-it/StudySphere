import { ChevronLeft, ChevronRight, Plus, BookOpen, Laptop, Flag, RotateCw, HelpCircle } from "lucide-react";
import "./Todo.css";

/**
 * Shared page header: title, optional icon/subtitle, and action buttons.
 */
function Header({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <h1>
          {Icon && <Icon size={26} className="page-header-icon" />}
          {title}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
}

/**
 * Purely decorative thin line-art doodle. Renders behind content, never
 * interactive, never carries information — visual texture only.
 */
function Doodle({ type, className = "", style, size = 64 }) {
  const props = {
    viewBox: "0 0 64 64",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <div className={`doodle ${className}`} style={style} aria-hidden="true">
      <svg {...props}>{DOODLE_PATHS[type]}</svg>
    </div>
  );
}

const DOODLE_PATHS = {
  coffee: (
    <>
      <path d="M14 24h28v16a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z" />
      <path d="M42 28h5a6 6 0 0 1 0 12h-5" />
      <path d="M20 18c-1-3 2-4 1-7" opacity="0.7" />
      <path d="M28 18c-1-3 2-4 1-7" opacity="0.7" />
      <path d="M36 18c-1-3 2-4 1-7" opacity="0.7" />
    </>
  ),
  openBook: (
    <>
      <path d="M32 16c-5-4-14-5-22-3v34c8-2 17-1 22 3" />
      <path d="M32 16c5-4 14-5 22-3v34c-8-2-17-1-22 3" />
      <path d="M32 16v37" />
      <path d="M14 22c5-1.5 10-1.5 14 0" opacity="0.6" />
      <path d="M14 30c5-1.5 10-1.5 14 0" opacity="0.6" />
      <path d="M36 22c4-1.5 9-1.5 14 0" opacity="0.6" />
      <path d="M36 30c4-1.5 9-1.5 14 0" opacity="0.6" />
    </>
  ),
  notebook: (
    <>
      <rect x="14" y="10" width="34" height="44" rx="3" />
      <path d="M14 18h34M14 46h34" opacity="0.5" />
      <circle cx="10" cy="16" r="2" />
      <circle cx="10" cy="26" r="2" />
      <circle cx="10" cy="36" r="2" />
      <circle cx="10" cy="46" r="2" />
      <path d="M22 28h18M22 34h14" opacity="0.6" />
    </>
  ),
  stars: (
    <>
      <path d="M20 8l2.4 6.6L28 17l-5.6 2.4L20 26l-2.4-6.6L12 17l5.6-2.4z" />
      <path d="M46 24l1.6 4.4L52 30l-4.4 1.6L46 36l-1.6-4.4L40 30l4.4-1.6z" opacity="0.75" />
      <path d="M40 46l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" opacity="0.6" />
    </>
  ),
};

/**
 * Convert a hex color to an rgba() string with the given alpha.
 */
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * A single scheduled task block placed on the timeline grid.
 */
function TaskCard({ title, time, label, icon: Icon, color, style, compact }) {
  const cardStyle = {
    ...style,
    background: `linear-gradient(160deg, ${hexToRgba(color, 0.22)}, ${hexToRgba(color, 0.07)})`,
    borderColor: hexToRgba(color, 0.4),
  };

  return (
    <div className={`task-card ${compact ? "compact" : ""}`} style={cardStyle}>
      <div className="task-card-top">
        <span className="task-dot" style={{ background: color }} />
        <span className="task-title">{title}</span>
      </div>
      <div className="task-time">{time}</div>
      <div className="task-label" style={{ color }}>
        {Icon && <Icon size={13} strokeWidth={2.2} />}
        <span>{label}</span>
      </div>
    </div>
  );
}

const DAYS = [
  { label: "Mon", date: 12 },
  { label: "Tue", date: 13 },
  { label: "Wed", date: 14 },
  { label: "Thu", date: 15 },
  { label: "Fri", date: 16 },
  { label: "Sat", date: 17 },
  { label: "Sun", date: 18 },
];

const HOURS = [8, 10, 12, 14, 16, 18, 20];
const DAY_START = 8; // 8 AM
const PX_PER_HOUR = 58;

const TASKS = [
  { day: 1, start: "09:00", end: "10:30", title: "Quiz Revision", label: "Study", icon: BookOpen, color: "#34d399" },
  { day: 1, start: "10:30", end: "12:30", title: "Java Practice", label: "Practice", icon: Laptop, color: "#3b82f6", offsetFrac: 0, widthFrac: 0.68, compact: true },
  { day: 1, start: "11:00", end: "13:00", title: "DBMS Assignment", label: "High Priority", icon: Flag, color: "#f59e0b", offsetFrac: 0.34, widthFrac: 0.68, raised: true, compact: true },
  { day: 6, start: "10:00", end: "11:30", title: "OS Revision", label: "Review", icon: RotateCw, color: "#ec4899" },
  { day: 1, start: "14:00", end: "16:00", title: "Web Project", label: "Work", icon: Laptop, color: "#f0973a" },
  { day: 4, start: "16:00", end: "17:30", title: "Statistics Quiz", label: "Practice", icon: HelpCircle, color: "#a78bfa" },
  { day: 1, start: "18:00", end: "19:30", title: "AI Notes", label: "Study", icon: BookOpen, color: "#34d399" },
];

function timeToHours(t) {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

const LEGEND = [
  { label: "Study", color: "#34d399" },
  { label: "Practice", color: "#3b82f6" },
  { label: "Assignment", color: "#f59e0b" },
  { label: "Review", color: "#ec4899" },
  { label: "Work", color: "#f0973a" },
];

function Todo() {
  const gridHeight = (20 - DAY_START) * PX_PER_HOUR;

  return (
    <div className="page-content todo-page">
      <Doodle type="notebook" size={50} style={{ top: -18, left: 420 }} />
      <Doodle type="stars" size={22} style={{ top: -20, left: 530 }} />
      <Doodle type="stars" size={16} style={{ top: 18, left: 480 }} className="faint" />
      <Doodle type="coffee" size={46} className="blue" style={{ top: -14, left: 610 }} />
      <Doodle type="openBook" size={110} style={{ bottom: 0, right: 30 }} className="faint" />
      <Doodle type="stars" size={26} style={{ bottom: 90, right: 10 }} className="faint" />

      <div className="page-content-inner">
        <Header title="My Tasks Timeline" subtitle="Plan your tasks and stay on track every day.">
          <div className="view-toggle">
            <button className="active">Week</button>
            <button>Month</button>
          </div>
          <button className="icon-btn">
            <ChevronLeft size={16} />
          </button>
          <button className="icon-btn">
            <ChevronRight size={16} />
          </button>
          <button className="add-task-btn">
            <Plus size={16} /> Add Task
          </button>
        </Header>

        <div className="timeline-panel glass-card">
          <div className="timeline-date">May 12 – 18, 2026</div>

          <div className="timeline-head">
            <div className="time-col-spacer" />
            {DAYS.map((d) => (
              <div key={d.label} className={`timeline-day-head ${d.label === "Tue" ? "active" : ""}`}>
                <span className="day-name">{d.label}</span>
                <span className="day-num">{d.date}</span>
              </div>
            ))}
          </div>

          <div className="timeline-body" style={{ height: gridHeight }}>
            <div className="time-labels">
              {HOURS.map((h) => (
                <div key={h} className="time-label" style={{ top: (h - DAY_START) * PX_PER_HOUR }}>
                  {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                </div>
              ))}
            </div>

            <div className="timeline-grid">
              {DAYS.map((d, i) => (
                <div key={d.label} className={`timeline-col ${d.label === "Tue" ? "active-col" : ""}`} style={{ gridColumn: i + 1 }}>
                  {HOURS.map((h) => (
                    <div key={h} className="hour-line" style={{ top: (h - DAY_START) * PX_PER_HOUR }} />
                  ))}
                </div>
              ))}

              {TASKS.map((task, idx) => {
                const top = (timeToHours(task.start) - DAY_START) * PX_PER_HOUR;
                const height = (timeToHours(task.end) - timeToHours(task.start)) * PX_PER_HOUR;
                const colWidth = 100 / 7;
                const widthFrac = task.widthFrac ?? 1;
                const offsetFrac = task.offsetFrac ?? 0;
                const leftPct = task.day * colWidth + offsetFrac * colWidth;
                const widthPct = widthFrac * colWidth;
                return (
                  <TaskCard
                    key={idx}
                    title={task.title}
                    time={formatRange(task.start, task.end)}
                    label={task.label}
                    icon={task.icon}
                    color={task.color}
                    compact={task.compact}
                    style={{
                      top,
                      height: height - 6,
                      left: `calc(${leftPct}% + 5px)`,
                      width: `calc(${widthPct}% - 10px)`,
                      zIndex: task.raised ? 3 : 2,
                      boxShadow: task.raised ? "-6px 0 16px -6px rgba(0,0,0,0.55)" : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="timeline-footer">
          <div className="legend">
            {LEGEND.map((l) => (
              <div className="legend-item" key={l.label}>
                <span className="legend-dot" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(t, withPeriod = true) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minutes = m === 0 ? "00" : String(m).padStart(2, "0");
  return `${hour12}:${minutes}${withPeriod ? ` ${period}` : ""}`;
}

function formatRange(start, end) {
  const startPeriod = Number(start.split(":")[0]) >= 12 ? "PM" : "AM";
  const endPeriod = Number(end.split(":")[0]) >= 12 ? "PM" : "AM";
  const samePeriod = startPeriod === endPeriod;
  return `${formatTime(start, !samePeriod)} – ${formatTime(end, true)}`;
}

export default Todo;
