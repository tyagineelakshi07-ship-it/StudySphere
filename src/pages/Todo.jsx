import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ListTodo, CheckCircle2 } from "lucide-react";
import { useTodos } from "../context/TodoContext";
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

const CATEGORIES = [
  { label: "Study", color: "#34d399" },
  { label: "Practice", color: "#3b82f6" },
  { label: "Assignment", color: "#f59e0b" },
  { label: "Review", color: "#ec4899" },
  { label: "Work", color: "#f0973a" },
];
const colorOf = (label) => CATEGORIES.find((c) => c.label === label)?.color;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const EMPTY_COPY = {
  all: { title: "No tasks yet.", text: "Add your first task to get started!" },
  active: { title: "No active tasks.", text: "Everything is done, or you haven't added a task yet." },
  completed: { title: "No completed tasks.", text: "Tasks you finish will show up here." },
};

function TaskRow({ task, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [category, setCategory] = useState(task.category);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setText(task.text);
    setCategory(task.category);
    setError("");
    setEditing(true);
  };

  const save = () => {
    const clean = text.trim();
    if (!clean) {
      setError("Task can't be empty.");
      return;
    }
    onSave(task.id, clean, category);
    setEditing(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") setEditing(false);
  };

  const color = colorOf(task.category);

  return (
    <li className={`todo-item ${task.completed ? "done" : ""}`} style={color ? { borderLeftColor: color } : undefined}>
      <input
        type="checkbox"
        className="todo-check"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.completed ? "incomplete" : "completed"}`}
      />

      {editing ? (
        <div className="todo-edit">
          <div className="todo-edit-row">
            <input
              ref={inputRef}
              className={`todo-input ${error ? "is-invalid" : ""}`}
              value={text}
              maxLength={120}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              onKeyDown={onKey}
              aria-label="Edit task text"
              aria-invalid={error ? "true" : "false"}
            />
            <select className="select-input todo-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Task category">
              <option value="">No category</option>
              {CATEGORIES.map((c) => (
                <option key={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
      ) : (
        <div className="todo-body">
          <span className="todo-text">{task.text}</span>
          {task.category && (
            <span className="todo-tag" style={{ color, borderColor: color }}>
              {task.category}
            </span>
          )}
        </div>
      )}

      <div className="todo-actions">
        {editing ? (
          <>
            <button className="icon-btn" onClick={save} aria-label="Save changes" title="Save"><Check size={15} /></button>
            <button className="icon-btn" onClick={() => setEditing(false)} aria-label="Cancel editing" title="Cancel"><X size={15} /></button>
          </>
        ) : (
          <>
            <button className="icon-btn" onClick={startEdit} aria-label={`Edit "${task.text}"`} title="Edit"><Pencil size={15} /></button>
            <button className="icon-btn danger" onClick={() => onDelete(task.id)} aria-label={`Delete "${task.text}"`} title="Delete"><Trash2 size={15} /></button>
          </>
        )}
      </div>
    </li>
  );
}

function Todo() {
  const { tasks, counts, storageError, addTask, toggleTask, editTask, deleteTask, clearCompleted, clearAll } = useTodos();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const visible = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const submit = (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) {
      setError("Please enter a task before adding.");
      return;
    }
    addTask(clean, category);
    setText("");
    setError("");
    setNotice("Task added.");
  };

  const empty = EMPTY_COPY[filter];

  return (
    <div className="page-content todo-page">
      <Doodle type="notebook" size={50} style={{ top: -18, left: 420 }} />
      <Doodle type="stars" size={22} style={{ top: -20, left: 530 }} />
      <Doodle type="coffee" size={46} className="blue" style={{ top: -14, left: 610 }} />
      <Doodle type="openBook" size={110} style={{ bottom: 0, right: 30 }} className="faint" />

      <div className="page-content-inner">
        <Header icon={ListTodo} title="My Tasks" subtitle="Add what you need to do and tick it off as you go." />

        <form className="glass-card todo-add" onSubmit={submit} noValidate>
          <div className="todo-add-row">
            <div className="todo-add-field">
              <label htmlFor="new-task" className="sr-only">New task</label>
              <input
                id="new-task"
                className={`todo-input ${error ? "is-invalid" : ""}`}
                placeholder="What do you need to do?"
                value={text}
                maxLength={120}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "new-task-error" : undefined}
              />
            </div>
            <label htmlFor="new-task-category" className="sr-only">Category</label>
            <select id="new-task-category" className="select-input todo-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">No category</option>
              {CATEGORIES.map((c) => (
                <option key={c.label}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="add-task-btn">
              <Plus size={16} /> Add Task
            </button>
          </div>
          {error && <p id="new-task-error" className="form-error" role="alert">{error}</p>}
        </form>

        <div aria-live="polite" className="todo-notices">
          {notice && <div className="status-banner success">{notice}</div>}
          {storageError && <div className="status-banner error">{storageError}</div>}
        </div>

        <div className="glass-card todo-panel">
          <div className="todo-toolbar">
            <div className="view-toggle" role="group" aria-label="Filter tasks">
              {FILTERS.map((f) => (
                <button key={f.key} className={filter === f.key ? "active" : ""} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
            <p className="todo-counts">
              {counts.total} total · {counts.active} active · {counts.completed} completed
            </p>
          </div>

          {visible.length === 0 ? (
            <div className="todo-empty">
              <CheckCircle2 size={32} />
              <h3>{empty.title}</h3>
              <p>{empty.text}</p>
            </div>
          ) : (
            <ul className="todo-list">
              {visible.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} onSave={editTask} onDelete={(id) => { deleteTask(id); setNotice("Task deleted."); }} />
              ))}
            </ul>
          )}

          {counts.total > 0 && (
            <div className="todo-footer">
              {confirmClear ? (
                <div className="todo-confirm" role="alertdialog" aria-label="Confirm clear all tasks">
                  <span>Delete all {counts.total} tasks? This can&apos;t be undone.</span>
                  <button className="todo-danger" onClick={() => { clearAll(); setConfirmClear(false); setNotice("All tasks cleared."); }}>Yes, delete all</button>
                  <button className="todo-ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
                </div>
              ) : (
                <>
                  {counts.completed > 0 && (
                    <button className="todo-ghost" onClick={() => { clearCompleted(); setNotice("Completed tasks cleared."); }}>
                      Clear completed
                    </button>
                  )}
                  <button className="todo-danger" onClick={() => setConfirmClear(true)}>Clear all</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
