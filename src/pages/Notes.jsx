import "./Notes.css";
function Notes() {

  const notes = [
    {
      subject: "DBMS",
      title: "DBMS Notes",
      description: "Database Management System concepts, SQL queries, normalization and database basics.",
      date: "Updated 2 hours ago",
      icon: "▤",
      color: "dbms-note",
      favorite: true
    },

    {
      subject: "Java",
      title: "Java Programming",
      description: "Java OOP concepts, classes, objects, inheritance, polymorphism and exception handling.",
      date: "Updated 1 day ago",
      icon: "☕",
      color: "java-note",
      favorite: true
    },

    {
      subject: "React",
      title: "React Essentials",
      description: "React components, JSX, props, map function and basic React concepts.",
      date: "Updated 3 days ago",
      icon: "⚛",
      color: "react-note",
      favorite: false
    },

    {
      subject: "Operating Systems",
      title: "Operating Systems",
      description: "Processes, threads, memory management, scheduling and operating system concepts.",
      date: "Updated 4 days ago",
      icon: "▣",
      color: "os-note",
      favorite: false
    },

    {
      subject: "Mathematics",
      title: "Mathematics",
      description: "Calculus, linear algebra, probability, statistics and important formulas.",
      date: "Updated 5 days ago",
      icon: "π",
      color: "math-note",
      favorite: false
    },

    {
      subject: "SQL",
      title: "SQL Queries",
      description: "SQL commands, SELECT, INSERT, UPDATE, DELETE and database manipulation.",
      date: "Updated 1 week ago",
      icon: "▤",
      color: "sql-note",
      favorite: false
    }
  ];


  return (
    <div className="notes-page">

      {/* Background Doodles */}

      <div className="notes-doodle notes-star-one">✦</div>

      <div className="notes-doodle notes-star-two">✧</div>

      <div className="notes-doodle notes-book">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className="notes-doodle notes-pencil">
        ╱
      </div>

      <div className="notes-doodle notes-paper">
        <span></span>
        <span></span>
        <span></span>
      </div>


      {/* Header */}

      <div className="notes-header">

        <div>
          <h1>My Notes</h1>
          <p>All your notes in one place</p>
        </div>

        <button className="create-note-btn">
          + Create Note
        </button>

      </div>


      {/* Search and Filters */}

      <div className="notes-toolbar">

        <input
          type="text"
          placeholder="⌕  Search notes..."
        />

        <div className="filter-buttons">

          <button className="active-filter">
            All notes
          </button>

          <button>
            Recent
          </button>

          <button>
            Favorites
          </button>

        </div>

        <select>
          <option>Sort by</option>
          <option>Newest</option>
          <option>Oldest</option>
        </select>

      </div>


      {/* Notes */}

      <div className="notes-grid">

        {notes.map((note) => {

          return (
            <div
              className={"note-card " + note.color}
              key={note.title}
            >

              {/* Subject Header */}

              <div className="note-subject">

                <div className="subject-name">
                  <span className="subject-icon">
                    {note.icon}
                  </span>

                  {note.subject}
                </div>

                <span className={
                  note.favorite
                    ? "favorite active"
                    : "favorite"
                }>
                  {note.favorite ? "★" : "☆"}
                </span>

              </div>


              {/* Note Content */}

              <div className="note-content">

                <h2>
                  {note.title}
                </h2>

                <p>
                  {note.description}
                </p>

              </div>


              {/* Date */}

              <div className="note-date">

                <span>◷</span>

                {note.date}

              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
}

export default Notes;