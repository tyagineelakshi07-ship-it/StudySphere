import React, { useEffect, useMemo, useState } from "react";
import "./Notes.css";

const initialNotes = [
  {
    id: 1,
    title: "DBMS Notes",
    subject: "DBMS",
    content:
      "Database Management System concepts, SQL queries, normalization and database basics.",
    date: "2026-10-15",
    updatedAt: "2026-10-15T10:00:00.000Z",
    favorite: true,
  },
  {
    id: 2,
    title: "Java Programming",
    subject: "Java",
    content:
      "Java OOP concepts, classes, objects, inheritance, polymorphism and exception handling.",
    date: "2026-10-14",
    updatedAt: "2026-10-14T10:00:00.000Z",
    favorite: true,
  },
  {
    id: 3,
    title: "React Essentials",
    subject: "React",
    content:
      "React components, JSX, props, map function and basic React concepts.",
    date: "2026-10-13",
    updatedAt: "2026-10-13T10:00:00.000Z",
    favorite: false,
  },
  {
    id: 4,
    title: "Operating Systems",
    subject: "Operating Systems",
    content:
      "Processes, threads, memory management, scheduling and operating system concepts.",
    date: "2026-10-12",
    updatedAt: "2026-10-12T10:00:00.000Z",
    favorite: false,
  },
  {
    id: 5,
    title: "Mathematics",
    subject: "Mathematics",
    content:
      "Calculus, linear algebra, probability, statistics and important formulas.",
    date: "2026-10-10",
    updatedAt: "2026-10-10T10:00:00.000Z",
    favorite: false,
  },
  {
    id: 6,
    title: "SQL Queries",
    subject: "SQL",
    content:
      "SQL commands, SELECT, INSERT, UPDATE, DELETE and database manipulation.",
    date: "2026-10-09",
    updatedAt: "2026-10-09T10:00:00.000Z",
    favorite: false,
  },
];

const STORAGE_KEY = "studysphere_notes";

const subjectIcons = {
  dbms: "▤",
  java: "◉",
  react: "❀",
  "operating systems": "▣",
  mathematics: "π",
  maths: "π",
  sql: "▤",
};

function Notes() {
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      return savedNotes ? JSON.parse(savedNotes) : initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Unable to save notes:", error);
    }
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];
    const searchText = search.toLowerCase().trim();

    if (searchText) {
      result = result.filter(
        (note) =>
          (note.title || "").toLowerCase().includes(searchText) ||
          (note.subject || "").toLowerCase().includes(searchText) ||
          (note.content || "").toLowerCase().includes(searchText)
      );
    }

    if (activeFilter === "Favorites") {
      result = result.filter((note) => note.favorite);
    }

    result.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.date).getTime();
      const timeB = new Date(b.updatedAt || b.date).getTime();

      if (activeFilter !== "Recent" && sortOrder === "oldest") {
        return timeA - timeB || a.id - b.id;
      }

      return timeB - timeA || b.id - a.id;
    });

    if (activeFilter === "Recent") {
      result = result.slice(0, 5);
    }

    return result;
  }, [notes, search, activeFilter, sortOrder]);

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setContent("");
    setFormError("");
    setEditingNoteId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
    setSelectedNote(null);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setSubject(note.subject);
    setContent(note.content);
    setFormError("");
    setSelectedNote(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveNote = (event) => {
    event.preventDefault();

    if (!title.trim() || !subject.trim() || !content.trim()) {
      setFormError("Please enter the title, subject and note content.");
      return;
    }

    const now = new Date().toISOString();

    if (editingNoteId !== null) {
      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title: title.trim(),
                subject: subject.trim(),
                content: content.trim(),
                updatedAt: now,
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        content: content.trim(),
        date: now.slice(0, 10),
        updatedAt: now,
        favorite: false,
      };

      setNotes((previousNotes) => [newNote, ...previousNotes]);
    }

    resetForm();
    setShowForm(false);
    setActiveFilter("Recent");
    setSearch("");
  };

  const toggleFavorite = (id) => {
    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === id ? { ...note, favorite: !note.favorite } : note
      )
    );

    setSelectedNote((previousNote) =>
      previousNote && previousNote.id === id
        ? { ...previousNote, favorite: !previousNote.favorite }
        : previousNote
    );
  };

  const deleteNote = (id) => {
    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    );

    setSelectedNote(null);

    if (editingNoteId === id) {
      closeForm();
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getSubjectClass = (value) =>
    (value || "other").toLowerCase().trim().replace(/\s+/g, "-");

  const getSubjectIcon = (value) =>
    subjectIcons[(value || "").toLowerCase()] || "▤";

  return (
    <div className="notes-page">
      {/* Background doodles */}
      <div className="notes-doodle" aria-hidden="true">
        <div className="notes-universe-star star-1">✦</div>
        <div className="notes-universe-star star-2">✧</div>
        <div className="notes-universe-star star-3">✦</div>
        <div className="notes-universe-star star-4">·</div>

        <div className="notes-planet">
          <div className="notes-planet-ring" />
        </div>

        <div className="notes-orbit-dot" />

        <div className="notes-doodle-book">
          <div className="notes-book-left" />
          <div className="notes-book-right" />
          <div className="notes-book-line notes-line-1" />
          <div className="notes-book-line notes-line-2" />
        </div>

        <div className="notes-floating-pencil" />

        <div className="notes-sparkle notes-sparkle-1">✧</div>
        <div className="notes-sparkle notes-sparkle-2">✦</div>

        <div className="notes-doodle-page">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>

      <div className="notes-content">
        {/* Header */}
        <header className="notes-header">
          <div>
            <h1 className="notes-title">My Notes</h1>
            <p className="notes-subtitle">All your notes in one place</p>
          </div>

          <button
            type="button"
            className="create-note-btn"
            onClick={showForm ? closeForm : openCreateForm}
          >
            <span>{showForm ? "×" : "+"}</span>
            {showForm ? "Close Form" : "Create Note"}
          </button>
        </header>

        {/* Create and edit form */}
        {showForm && (
          <form className="note-form" onSubmit={handleSaveNote}>
            <h2>{editingNoteId !== null ? "Edit Note" : "Create a new note"}</h2>

            <label htmlFor="note-title">Note title</label>
            <input
              id="note-title"
              type="text"
              placeholder="e.g. Java OOP Revision"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor="note-subject">Subject</label>
            <input
              id="note-subject"
              type="text"
              placeholder="e.g. DBMS, Java, Python..."
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />

            <label htmlFor="note-content">Note content</label>
            <textarea
              id="note-content"
              placeholder="Write your notes here..."
              rows="5"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />

            {formError && <p className="note-form-error">{formError}</p>}

            <div className="note-form-actions">
              <button type="submit" className="save-note-btn">
                {editingNoteId !== null ? "Save Changes" : "Save Note"}
              </button>

              <button
                type="button"
                className="cancel-edit-btn"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Search, filters and sorting */}
        <div className="notes-toolbar">
          <div className="notes-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search notes"
            />

            {search && (
              <button
                className="clear-search-btn"
                onClick={() => setSearch("")}
                type="button"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="notes-filters">
            {["All","Favorites"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`notes-filter ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "All" ? "All notes" : filter}
              </button>
            ))}
          </div>

          <select
            className="notes-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            aria-label="Sort notes"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* Notes grid */}
        {filteredNotes.length > 0 ? (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <article
                className={`note-card subject-${getSubjectClass(note.subject)}`}
                key={note.id}
              >
                <div className="note-card-top">
                  <span className="note-subject">
                    <span className="subject-icon">
                      {getSubjectIcon(note.subject)}
                    </span>
                    {note.subject}
                  </span>

                  <button
                    type="button"
                    className={`favorite-btn ${
                      note.favorite ? "is-favorite" : ""
                    }`}
                    onClick={() => toggleFavorite(note.id)}
                    aria-label={
                      note.favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    title={
                      note.favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {note.favorite ? "★" : "☆"}
                  </button>
                </div>

                <div
                  className="note-card-body"
                  onClick={() => setSelectedNote(note)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedNote(note);
                    }
                  }}
                  aria-label={`Read ${note.title}`}
                >
                  <h3>{note.title}</h3>
                  <p className="note-card-content">{note.content}</p>

                  <div className="note-card-date">
                    <span>◷</span>
                    Updated {formatDate(note.updatedAt || note.date)}
                  </div>
                </div>

                <div className="note-card-actions">
                  <button
                    type="button"
                    className="read-note-btn"
                    onClick={() => setSelectedNote(note)}
                  >
                    Read note <span>↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="notes-empty">
            <div className="empty-icon">▤</div>
            <h3>No notes found</h3>
            <p>Try another search or create a new note to get started.</p>

            <button
              type="button"
              className="create-note-btn"
              onClick={openCreateForm}
            >
              + Create Note
            </button>
          </div>
        )}

        {/* Read note modal */}
        {selectedNote && (
          <div
            className="note-modal-overlay"
            onClick={() => setSelectedNote(null)}
          >
            <div
              className="note-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="selected-note-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="note-modal-header">
                <span className="note-subject">
                  <span className="subject-icon">
                    {getSubjectIcon(selectedNote.subject)}
                  </span>
                  {selectedNote.subject}
                </span>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedNote(null)}
                  aria-label="Close note"
                >
                  ×
                </button>
              </div>

              <h2 id="selected-note-title">{selectedNote.title}</h2>

              <p className="note-modal-date">
                Created on {formatDate(selectedNote.date)}
              </p>

              <p className="note-modal-content">{selectedNote.content}</p>

              <div className="note-modal-actions">
                <button
                  type="button"
                  className="modal-favorite-btn"
                  onClick={() => toggleFavorite(selectedNote.id)}
                >
                  {selectedNote.favorite
                    ? "★ Remove Favorite"
                    : "☆ Add Favorite"}
                </button>

                <button
                  type="button"
                  className="modal-favorite-btn"
                  onClick={() => handleEditNote(selectedNote)}
                >
                  ✎ Edit Note
                </button>

                <button
                  type="button"
                  className="delete-note-btn"
                  onClick={() => deleteNote(selectedNote.id)}
                >
                  Delete Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;