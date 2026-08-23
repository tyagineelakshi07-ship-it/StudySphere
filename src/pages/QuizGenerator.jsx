import {
  Sparkles,
  Bell,
  Sun,
  BookOpen,
  Tag,
  Hash,
  BarChart2,
  ListChecks,
  PenLine,
  ChevronDown,
  ClipboardEdit,
} from "lucide-react";
import "./QuizGenerator.css";

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
  laptop: (
    <>
      <rect x="10" y="14" width="44" height="28" rx="3" />
      <path d="M6 46h52l-4 6H10z" />
      <circle cx="32" cy="28" r="7" opacity="0.7" />
      <path d="M28 28l3 3 6-6" opacity="0.7" />
    </>
  ),
  coffee: (
    <>
      <path d="M14 24h28v16a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z" />
      <path d="M42 28h5a6 6 0 0 1 0 12h-5" />
      <path d="M20 18c-1-3 2-4 1-7" opacity="0.7" />
      <path d="M28 18c-1-3 2-4 1-7" opacity="0.7" />
      <path d="M36 18c-1-3 2-4 1-7" opacity="0.7" />
    </>
  ),
  books: (
    <>
      <rect x="8" y="38" width="40" height="8" rx="1.5" />
      <rect x="12" y="30" width="34" height="8" rx="1.5" />
      <rect x="10" y="22" width="30" height="8" rx="1.5" />
    </>
  ),
  plant: (
    <>
      <path d="M18 40h28l-3 16H21z" />
      <path d="M32 40V22" />
      <path d="M32 30c0-8-8-12-14-11 0 8 6 13 14 11z" />
      <path d="M32 26c1-7 8-10 13-9 0 7-5 11-13 9z" />
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

function SelectField({ icon: Icon, label, value }) {
  return (
    <div className="field">
      <label>
        <Icon size={14} /> {label}
      </label>
      <div className="select-box">
        <span>{value}</span>
        <ChevronDown size={16} className="select-chevron" />
      </div>
    </div>
  );
}

function QuizGenerator() {
  return (
    <div className="page-content quiz-page">
      <Doodle type="coffee" size={54} style={{ top: 8, left: 360 }} />
      <Doodle type="laptop" size={64} style={{ top: -6, left: 500 }} />
      <Doodle type="plant" size={52} className="blue" style={{ top: 30, left: 660 }} />
      <Doodle type="books" size={54} style={{ top: 0, right: 90 }} />
      <Doodle type="stars" size={22} className="faint" style={{ top: 50, left: 300 }} />
      <Doodle type="stars" size={18} className="faint" style={{ top: 10, left: 620 }} />

      <div className="page-content-inner">
        <Header icon={Sparkles} title="Quiz Generator" subtitle="Generate custom quizzes and test your knowledge.">
          <button className="icon-btn round">
            <Bell size={16} />
          </button>
          <button className="icon-btn round">
            <Sun size={16} />
          </button>
        </Header>

        <div className="quiz-layout">
          <div className="glass-card config-card">
            <SelectField icon={BookOpen} label="Subject" value="Data Structures" />
            <SelectField icon={Tag} label="Topic" value="Arrays" />

            <div className="field-row">
              <SelectField icon={Hash} label="Number of Questions" value="10" />
              <SelectField icon={BarChart2} label="Difficulty" value="Medium" />
            </div>

            <SelectField icon={ListChecks} label="Question Type" value="MCQ (Multiple Choice)" />

            <div className="field">
              <label>
                <PenLine size={14} /> Additional Instructions (Optional)
              </label>
              <div className="textarea-box">
                <span className="placeholder">e.g., Focus on time complexity, include examples</span>
                <span className="char-count">0/150</span>
              </div>
            </div>

            <button type="button" className="generate-btn">
              <Sparkles size={17} /> Generate Quiz
            </button>
          </div>

          <div className="glass-card preview-card">
            <div className="preview-head">
              <h3>Preview</h3>
              <span>0 of 0</span>
            </div>
            <div className="preview-empty">
              <div className="preview-icon">
                <ClipboardEdit size={30} />
              </div>
              <h4>Your quiz will appear here</h4>
              <p>Generate a quiz to see the questions and test your knowledge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizGenerator;
