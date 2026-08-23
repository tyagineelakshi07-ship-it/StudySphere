import {
  Info,
  Check,
  Star,
  ListChecks,
  Target,
  GraduationCap,
  BrainCircuit,
  ClipboardCheck,
  Sparkles,
  Eye,
  Compass,
  Focus,
  Heart,
  ArrowRight,
  Zap,
  Mail,
  Send,
} from "lucide-react";

import "./About.css";

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
  books: (
    <>
      <rect x="8" y="38" width="40" height="8" rx="1.5" />
      <rect x="12" y="30" width="34" height="8" rx="1.5" />
      <rect x="10" y="22" width="30" height="8" rx="1.5" />
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
  plant: (
    <>
      <path d="M18 40h28l-3 16H21z" />
      <path d="M32 40V22" />
      <path d="M32 30c0-8-8-12-14-11 0 8 6 13 14 11z" />
      <path d="M32 26c1-7 8-10 13-9 0 7-5 11-13 9z" />
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
  lightbulb: (
    <>
      <path d="M32 8a16 16 0 0 0-9 29c2 1.5 3 3 3 5h12c0-2 1-3.5 3-5a16 16 0 0 0-9-29z" />
      <path d="M26 48h12M28 53h8" />
      <path d="M32 16v14M27 25l10 6M37 25l-10 6" opacity="0.6" />
    </>
  ),
  rocket: (
    <>
      <path d="M32 6c8 6 10 18 8 28l-8 6-8-6c-2-10 0-22 8-28z" />
      <circle cx="32" cy="20" r="4" opacity="0.7" />
      <path d="M24 30l-8 4 4 10" />
      <path d="M40 30l8 4-4 10" />
      <path d="M28 40l-2 12 6-4 6 4-2-12" />
    </>
  ),
  stars: (
    <>
      <path d="M20 8l2.4 6.6L28 17l-5.6 2.4L20 26l-2.4-6.6L12 17l5.6-2.4z" />
      <path d="M46 24l1.6 4.4L52 30l-4.4 1.6L46 36l-1.6-4.4L40 30l4.4-1.6z" opacity="0.75" />
      <path d="M40 46l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" opacity="0.6" />
    </>
  ),
  planet: (
    <>
      <circle cx="30" cy="32" r="12" />
      <ellipse cx="30" cy="32" rx="22" ry="6.5" transform="rotate(-18 30 32)" />
      <circle cx="24" cy="27" r="1.6" opacity="0.7" />
    </>
  ),
  target: (
    <>
      <circle cx="32" cy="32" r="18" />
      <circle cx="32" cy="32" r="11" opacity="0.7" />
      <circle cx="32" cy="32" r="4" opacity="0.7" />
    </>
  ),
};

/**
 * Small icon + title + description card used to showcase a feature.
 */
function FeatureCard({ icon: Icon, iconColor = "#8b5cf6", title, description, className = "" }) {
  return (
    <div className={`feature-card glass-card ${className}`}>
      {Icon && (
        <div className="feature-card-icon" style={{ color: iconColor, borderColor: `${iconColor}44`, background: `${iconColor}1a` }}>
          <Icon size={20} strokeWidth={2} />
        </div>
      )}
      <h3 className="feature-card-title">{title}</h3>
      {description && <p className="feature-card-desc">{description}</p>}
    </div>
  );
}

const WHY_CARDS = [
  {
    icon: ListChecks,
    color: "#a78bfa",
    title: "Stay Organized",
    description:
      "Plan your tasks, manage your study schedule, and know exactly what comes next.",
  },
  {
    icon: BrainCircuit,
    color: "#60a5fa",
    title: "Practice Smarter",
    description:
      "Turn your learning material into quizzes and practice questions.",
  },
  {
    icon: Target,
    color: "#34d399",
    title: "Track Progress",
    description:
      "Understand your study habits and celebrate consistent progress.",
  },
];

const JOURNEY = [
  {
    year: "2025",
    title: "The Idea",
    text: "We imagined a single place where students organize their learning.",
  },
  {
    year: "2026",
    title: "First Build",
    text: "We started turning the concept into a practical student learning platform.",
  },
  {
    year: "Today",
    title: "StudySphere",
    text: "A growing learning hub bringing study tools together in one experience.",
  },
];

const TEAM = [
  {
    name: "Charvi",
    role: "Team Member",
    bg: "linear-gradient(160deg, #7c3aed, #4c1d95)",
    text: "Turning ideas into impactful features with creativity and dedication.",
  },
  {
    name: "Aayushi",
    role: "Team Member",
    bg: "linear-gradient(160deg, #3b82f6, #1e3a8a)",
    text: "Designing smooth experiences and bringing clarity to every detail.",
  },
  {
    name: "Neelakshi",
    role: "Team Member",
    bg: "linear-gradient(160deg, #10b981, #065f46)",
    text: "Solving problems and building reliable solutions with focus and care.",
  },
];

const BELIEVE = [
  {
    icon: Sparkles,
    color: "#a78bfa",
    title: "Keep It Simple",
    text: "Learning should feel organized, clear, and easy to manage.",
  },
  {
    icon: BrainCircuit,
    color: "#60a5fa",
    title: "Learn Smarter",
    text: "We use technology to make study sessions more meaningful.",
  },
  {
    icon: Focus,
    color: "#34d399",
    title: "Stay Focused",
    text: "Small, consistent progress can create big results.",
  },
  {
    icon: Heart,
    color: "#f472b6",
    title: "Student First",
    text: "Every feature is designed around real student needs.",
  },
];

function About() {
  return (
    <div className="page-content about-page">
      <Doodle
        type="notebook"
        size={54}
        className="blue"
        style={{ top: 4, right: 210 }}
      />

      <Doodle
        type="stars"
        size={40}
        style={{ top: 30, right: 130 }}
      />

      <div className="page-content-inner">

        {/* ================= HERO ================= */}

        <section className="about-hero">
          <div className="about-hero-text">
            <span className="eyebrow">
              <Info size={13} /> About StudySphere
            </span>

            <h1>
              We&apos;re building a
              <br />
              <span className="text-grad">smarter</span> way to learn.
            </h1>

            <p className="about-hero-desc">
              StudySphere is a student-focused learning hub designed to bring
              planning, studying, practice, and progress together in one
              simple space.
            </p>

            <div className="about-hero-badges">
              <span>
                <Check size={14} /> Organized learning
              </span>

              <span>
                <Check size={14} /> Smart study tools
              </span>

              <span>
                <Check size={14} /> Built for students
              </span>
            </div>
          </div>

          <div className="about-hero-art">
            <div className="orbit-ring" />

            <div className="orbit-badge badge-1">
              <ClipboardCheck size={18} />
            </div>

            <div className="orbit-badge badge-2">
              <Target size={18} />
            </div>

            <div className="orbit-badge badge-3">
              <BrainCircuit size={18} />
            </div>

            <div className="orbit-badge badge-4">
              <GraduationCap size={18} />
            </div>

            <div className="student-scene">
              <div className="student-scene-glow" />

              <Doodle
                type="notebook"
                size={30}
                className="scene-doodle scene-notebook"
              />

              <div className="scene-plant">
                <Doodle type="plant" size={46} />
              </div>

              <div className="scene-books">
                <Doodle type="books" size={46} />
              </div>

              <div className="scene-mug">
                <Heart size={14} />
              </div>

              <div className="scene-laptop">
                <GraduationCap size={30} className="scene-cap" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= STORY + WHY ================= */}

        <section className="about-row about-row-2">

          <div className="glass-card story-card">
            <div className="story-illustration">
              <div className="story-illustration-glow" />

              <Doodle
                type="lightbulb"
                size={64}
                className="strong"
                style={{
                  position: "static",
                  opacity: 0.95,
                }}
              />

              <Doodle
                type="openBook"
                size={92}
                className="blue"
                style={{
                  position: "static",
                  opacity: 0.6,
                  marginTop: -6,
                }}
              />
            </div>

            <div className="story-text">
              <span className="eyebrow">
                <Star size={13} /> Our Story
              </span>

              <h2>
                Learning shouldn&apos;t feel overwhelming.
              </h2>

              <p>
                Students often use different tools for notes, tasks, quizzes,
                study sessions, and tracking their progress. StudySphere was
                created with a simple idea: bring these everyday learning
                activities together.
              </p>

              <p>
                Our goal is to create a calm and organized digital space where
                students can understand what they need to do, focus on what
                matters, and see how far they have come.
              </p>
            </div>
          </div>

          <div className="glass-card why-card">
            <span className="eyebrow">
              <Star size={13} /> Why StudySphere?
            </span>

            <div className="why-grid">
              {WHY_CARDS.map((c) => (
                <FeatureCard
                  key={c.title}
                  icon={c.icon}
                  iconColor={c.color}
                  title={c.title}
                  description={c.description}
                />
              ))}
            </div>
          </div>

        </section>

        {/* ================= MISSION / VISION / JOURNEY / TEAM ================= */}

        <section className="about-row about-row-4">

          <div className="glass-card mv-card">
            <span className="eyebrow">
              <Compass size={13} /> Our Mission
            </span>

            <h3>
              Make learning simpler and smarter.
            </h3>

            <p>
              We want to help students spend less time managing their learning
              and more time actually learning.
            </p>

            <Doodle
              type="target"
              size={44}
              style={{
                position: "static",
                opacity: 0.7,
                marginTop: 10,
              }}
            />
          </div>

          <div className="glass-card mv-card">
            <span className="eyebrow">
              <Eye size={13} /> Our Vision
            </span>

            <h3>
              A better learning experience for everyone.
            </h3>

            <p>
              We imagine a future where technology supports students without
              making education feel complicated.
            </p>

            <Doodle
              type="rocket"
              size={44}
              className="blue"
              style={{
                position: "static",
                opacity: 0.7,
                marginTop: 10,
              }}
            />
          </div>

          <div className="glass-card journey-card">
            <span className="eyebrow">
              <Zap size={13} /> Our Journey
            </span>

            <div className="journey-timeline">
              {JOURNEY.map((j, i) => (
                <div className="journey-step" key={j.year}>

                  <div className="journey-dot">
                    {i === JOURNEY.length - 1 ? (
                      <Star size={14} />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>

                  {i < JOURNEY.length - 1 && (
                    <div className="journey-line" />
                  )}

                  <span className="journey-year">
                    {j.year}
                  </span>

                  <span className="journey-title">
                    {j.title}
                  </span>

                  <p className="journey-text">
                    {j.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card team-card">
            <span className="eyebrow">
              <Star size={13} /> Meet the Team
            </span>

            <div className="team-grid">
              {TEAM.map((m) => (
                <div className="team-member" key={m.name}>

                  <div
                    className="team-avatar"
                    style={{ background: m.bg }}
                  >
                    {m.name[0]}
                  </div>

                  <span className="team-name">
                    {m.name}
                  </span>

                  <span className="team-role">
                    {m.role}
                  </span>

                  <p className="team-text">
                    {m.text}
                  </p>

                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ================= WHAT WE BELIEVE + CTA ================= */}

        <section className="about-row about-row-believe">

          <div className="glass-card believe-card">
            <span className="eyebrow">
              <Star size={13} /> What We Believe
            </span>

            <div className="believe-grid">
              {BELIEVE.map((b) => {
                const Icon = b.icon;

                return (
                  <div
                    className="believe-item"
                    key={b.title}
                  >
                    <div
                      className="believe-icon"
                      style={{
                        color: b.color,
                        background: `${b.color}1a`,
                        borderColor: `${b.color}44`,
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <span className="believe-title">
                      {b.title}
                    </span>

                    <p className="believe-text">
                      {b.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cta-card">
            <Doodle
              type="planet"
              size={40}
              style={{
                top: 16,
                right: 18,
                opacity: 0.35,
              }}
            />

            <h2>
              Your learning journey starts here.
            </h2>

            <p>
              Plan. Learn. Practice. Progress.
            </p>

            <button
              type="button"
              className="cta-btn"
            >
              Explore StudySphere
              <ArrowRight size={16} />
            </button>

            <div className="cta-avatar">
              <GraduationCap size={22} />
            </div>
          </div>

        </section>

        {/* ================= CONTACT US ================= */}

        <section className="contact-section">

          <div className="contact-card">

            {/* CONTACT INFORMATION */}

            <div className="contact-info">

              <span className="eyebrow">
                <Mail size={13} /> Contact Us
              </span>

              <h2>
                Have a question?
                <br />
                <span className="text-grad">
                  We&apos;d love to hear from you.
                </span>
              </h2>

              <p>
                Whether you have a question, suggestion, or feedback about
                StudySphere, feel free to reach out. We&apos;re always happy
                to hear from students.
              </p>

              <div className="contact-email">

                <div className="contact-icon">
                  <Mail size={18} />
                </div>

                <div>
                  <span>Email us</span>

                  <strong>
                    studysphere@gmail.com
                  </strong>
                </div>

              </div>

            </div>

            {/* CONTACT FORM */}

            <form className="contact-form">

              <div className="contact-input-row">

                <div className="contact-field">
                  <label htmlFor="contact-name">
                    Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>

              </div>

              <div className="contact-field">

                <label htmlFor="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  rows="5"
                  placeholder="Write your message..."
                />

              </div>

              <button
                type="button"
                className="contact-submit"
              >
                Send Message
                <Send size={16} />
              </button>

            </form>

          </div>

        </section>

      </div>
    </div>
  );
}

export default About;