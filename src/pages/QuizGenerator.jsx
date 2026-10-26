import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  FileText,
  Hash,
  BarChart2,
  ListChecks,
  ClipboardEdit,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Eraser,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import "./QuizGenerator.css";

// Local page logic is kept in this file so the project needs no context/hooks folders.
const QUIZ_HISTORY_KEY = "studysphere.quizAttempts.v1";
function readStoredArray(key) {
  try { const value = JSON.parse(window.localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function useQuizHistory() {
  const [attempts, setAttempts] = useState(() => readStoredArray(QUIZ_HISTORY_KEY).filter(a => a && typeof a.id === "string" && Number.isFinite(a.total) && Number.isFinite(a.correct) && a.total > 0));
  const [storageError, setStorageError] = useState(null);
  useEffect(() => {
    try { window.localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(attempts)); setStorageError(null); }
    catch { setStorageError("Your browser blocked saving. Changes may be lost on refresh."); }
  }, [attempts]);
  const recordAttempt = useCallback(({ subject, topic, difficulty, total, correct }) => setAttempts(prev => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, subject, topic, difficulty, total, correct, percentage: Math.round(correct / total * 100), completedAt: new Date().toISOString() }, ...prev]), []);
  return { attempts, storageError, recordAttempt };
}
function useStudyMaterial() {
  const [text, setText] = useState("");
  const [showError, setShowError] = useState(false);
  const trimmed = text.trim();
  const stats = { chars: text.length, words: trimmed ? trimmed.split(/\s+/).length : 0 };
  const len = trimmed.length;
  const error = len === 0 ? "Paste some study material to generate a quiz." : len < MIN_CHARS ? `Add a bit more material — at least ${MIN_CHARS} characters (you have ${len}).` : text.length > MAX_CHARS ? `Please keep your material under ${MAX_CHARS.toLocaleString()} characters.` : "";
  const clear = useCallback(() => { setText(""); setShowError(false); }, []);
  return { text, setText, stats, error, showError, setShowError, clear };
}
function useQuizSession() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const begin = useCallback(list => { setQuestions(list); setAnswers(list.map(() => null)); setIndex(0); setStatus("running"); }, []);
  const select = useCallback(optionIndex => setAnswers(prev => prev.map((a, i) => i === index ? optionIndex : a)), [index]);
  const goTo = useCallback(i => setIndex(cur => Math.min(Math.max(i, 0), questions.length - 1)), [questions.length]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const finish = useCallback(() => setStatus("finished"), []);
  const retake = useCallback(() => begin(questions), [begin, questions]);
  const reset = useCallback(() => { setQuestions([]); setAnswers([]); setIndex(0); setStatus("idle"); }, []);
  const unanswered = answers.filter(a => a === null).length;
  const score = answers.reduce((n, a, i) => n + (a !== null && questions[i]?.options[a]?.correct ? 1 : 0), 0);
  return { questions, status, index, answers, unanswered, score, begin, select, goTo, next, prev, finish, retake, reset };
}

// Basic, rule-based quiz builder. NOT AI: it splits pasted notes into sentences
// and turns them into questions using word frequency and simple patterns.
// Every question carries the source sentence it came from so answers can be explained.

const MIN_CHARS = 120;
const MAX_CHARS = 20000;
const COUNTS = [5, 10];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_TYPES = ["MCQ", "True/False"];

// Preferred sentence length (in words) per difficulty.
const RANGES = { Easy: [6, 18], Medium: [10, 28], Hard: [15, 40] };
// Share of MCQs that may be "which describes X?" definition questions.
const DEFINITION_SHARE = { Easy: 0.6, Medium: 0.4, Hard: 0.25 };

const STOPWORDS = new Set(
  ("a an the and or but if then else when while of at by for with about against between into through during before after above below to from up down in out on off over under again further once here there all any both each few more most other some such no nor not only own same so than too very can will just should now is are was were be been being have has had do does did this that these those it its they them their what which who whom whose how why where also may might must shall would could as per via using used use one two many much however therefore thus because while whether").split(" ")
);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const clean = (s) => s.replace(/\s+/g, " ").trim();
const wordCount = (s) => clean(s).split(" ").filter(Boolean).length;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const stem = (w) => w.toLowerCase().replace(/(ing|ed|es|s|ly)$/, "");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clip = (s, n = 110) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const WORD_RE = /[A-Za-z][A-Za-z'-]{3,}/g;

/** Split notes into clean candidate sentences / lines (unique, 6-40 words, mostly prose). */
function splitSentences(text) {
  const protectedText = text
    .replace(/\r/g, "")
    .replace(/\b(e\.g|i\.e|vs|etc)\./gi, (m) => m.replace(/\./g, "§"));
  const seen = new Set();
  return protectedText
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => clean(s.replace(/§/g, ".").replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "")))
    .filter((s) => {
      const n = wordCount(s);
      if (n < 6 || n > 40) return false;
      const letters = (s.match(/[A-Za-z]/g) || []).length;
      if (letters / s.length < 0.7) return false; // skips code / symbol-heavy lines
      const key = norm(s);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function buildFrequency(text) {
  const freq = new Map();
  const forms = new Map(); // lower-case word -> { original casing: count }
  (text.match(WORD_RE) || []).forEach((w) => {
    const k = w.toLowerCase();
    if (STOPWORDS.has(k)) return;
    freq.set(k, (freq.get(k) || 0) + 1);
    const f = forms.get(k) || {};
    f[w] = (f[w] || 0) + 1;
    forms.set(k, f);
  });
  // Prefer the casing the author used most (e.g. "JavaScript", "useEffect").
  const display = new Map([...forms].map(([k, f]) => [k, Object.entries(f).sort((a, b) => b[1] - a[1])[0][0]]));
  return { freq, display };
}

/** Rough "shape" of a word so swaps/distractors look like the real answer. */
function caseClass(w) {
  if (/[a-z][A-Z]/.test(w)) return "camel";
  return w[0] === w[0].toUpperCase() ? "cap" : "lower";
}
function suffixClass(w) {
  const l = w.toLowerCase();
  if (l.endsWith("ing")) return "ing";
  if (l.endsWith("ed")) return "ed";
  if (l.endsWith("ly")) return "ly";
  if (l.endsWith("s") && !l.endsWith("ss")) return "s";
  return "base";
}

/** Choose the word to hide / swap in a sentence, based on difficulty. */
function pickKeyword(sentence, freq, difficulty) {
  const words = [...new Set(sentence.match(WORD_RE) || [])].filter((w) => !STOPWORDS.has(w.toLowerCase()));
  const candidates = words
    .map((w) => ({ w, f: freq.get(w.toLowerCase()) || 1, first: sentence.startsWith(w) }))
    .filter((c) => !c.first && c.w.length >= 5);
  if (candidates.length === 0) return null;
  const score = (c) =>
    difficulty === "Easy" ? c.f * 3 + c.w.length * 0.3 // common, central terms
    : difficulty === "Hard" ? c.w.length * 1.2 - c.f * 0.5 // longer, more specific terms
    : c.f * 2 + c.w.length * 0.5;
  return candidates.sort((a, b) => score(b) - score(a))[0].w;
}

/** Wrong-but-plausible options: other terms from the notes that are not in this sentence. */
function pickDistractors(answer, sentence, ctx, n = 3, strict = false) {
  const { vocab, difficulty, display } = ctx;
  const inSentence = new Set((sentence.match(WORD_RE) || []).map(stem));
  const base = vocab
    .map((w) => display.get(w) || w)
    .filter((w) => !inSentence.has(stem(w)) && stem(w) !== stem(answer));
  const ac = caseClass(answer);
  const as = suffixClass(answer);
  let pool = base.filter((w) => caseClass(w) === ac && suffixClass(w) === as);
  if (pool.length < n && !strict) pool = base.filter((w) => caseClass(w) === ac);
  if (pool.length < n && !strict) pool = base;
  if (pool.length < n) return null;
  const closeness = (w) => Math.abs(w.length - answer.length);
  // Pool is already ordered by how often the author uses each term, so Easy/T-F swaps use central topic words.
  const ranked = difficulty === "Easy" || n === 1 ? pool : [...pool].sort((a, b) => closeness(a) - closeness(b));
  const window = ranked.slice(0, difficulty === "Hard" ? Math.max(n, 5) : Math.max(n, 8));
  return shuffle(window).slice(0, n);
}

const blankOut = (sentence, word) => sentence.replace(new RegExp(`\\b${escapeRe(word)}\\b`, "g"), "_____");
const explain = (sentence) => `From your notes: “${sentence}”`;

function buildCloze(sentence, ctx) {
  const key = pickKeyword(sentence, ctx.freq, ctx.difficulty);
  if (!key) return null;
  const distractors = pickDistractors(key, sentence, ctx);
  if (!distractors) return null;
  return {
    type: "MCQ",
    q: `Fill in the blank: ${blankOut(sentence, key)}`,
    options: shuffle([{ text: key, correct: true }, ...distractors.map((text) => ({ text, correct: false }))]),
    explanation: explain(sentence),
    source: sentence,
  };
}

/** "Term: a definition" lines read naturally as "Term is a definition"; other colon lines are skipped. */
function toStatement(sentence) {
  const m = sentence.match(TERM_LINE_RE);
  if (!m) return sentence;
  return /^(a|an|the)\s/i.test(m[2]) ? `${clean(m[1])} is ${clean(m[2]).replace(/\.+$/, "")}.` : null;
}

function buildTrueFalse(rawSentence, ctx, wantFalse) {
  const sentence = toStatement(rawSentence);
  if (!sentence) return null;
  const options = () => [
    { text: "True", correct: !wantFalse },
    { text: "False", correct: wantFalse },
  ];
  if (!wantFalse) {
    return { type: "True/False", q: `True or False: ${sentence}`, options: [{ text: "True", correct: true }, { text: "False", correct: false }], explanation: `True — this statement comes directly from your notes: “${sentence}”`, source: sentence };
  }
  const key = pickKeyword(sentence, ctx.freq, ctx.difficulty);
  const swap = key && pickDistractors(key, sentence, ctx, 1, true);
  if (!swap) return null;
  const changed = sentence.replace(new RegExp(`\\b${escapeRe(key)}\\b`, "g"), swap[0]);
  if (changed === sentence) return null;
  return { type: "True/False", q: `True or False: ${changed}`, options: options(), explanation: `False — “${swap[0]}” was substituted for “${key}”. Your notes say: “${sentence}”`, source: sentence };
}

const DEFINITION_RE = /^(.{2,60}?)\s+(?:(?:is|are)\s+(?:defined as\s+)?(?:the|a|an)\s+|refers to\s+(?:the\s+|a\s+|an\s+)?|means\s+(?:the\s+|a\s+|an\s+)?)(.{15,})$/i;
const TERM_LINE_RE = /^([A-Za-z][^:\-–—]{1,50}?)\s*[:\-–—]\s+(.{15,})$/;

function extractDefinitions(text, sentences) {
  const out = [];
  text.split(/\n+/).forEach((line) => {
    const t = clean(line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ""));
    const m = t.match(TERM_LINE_RE);
    if (m && wordCount(m[1]) <= 6) out.push({ term: clean(m[1]), definition: clean(m[2]).replace(/\.+$/, ""), source: t });
  });
  sentences.forEach((s) => {
    const m = s.match(DEFINITION_RE);
    if (m && wordCount(m[1]) <= 6 && !/^(it|this|that|there|which|they)$/i.test(m[1].trim())) {
      out.push({ term: clean(m[1]).replace(/^(a|an|the)\s+/i, ""), definition: clean(m[2]).replace(/\.+$/, ""), source: s });
    }
  });
  const seen = new Set();
  return out.filter((d) => {
    const k = d.term.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function buildDefinition(def, defs, difficulty) {
  const others = defs.filter((o) => o.term !== def.term && norm(clip(o.definition)) !== norm(clip(def.definition)));
  if (others.length < 3) return null;
  const ranked = [...others].sort((a, b) => Math.abs(a.definition.length - def.definition.length) - Math.abs(b.definition.length - def.definition.length));
  const picks = difficulty === "Easy" ? shuffle(others).slice(0, 3) : shuffle(ranked.slice(0, Math.max(3, 5))).slice(0, 3);
  return {
    type: "MCQ",
    q: `Which of the following best describes “${def.term}”?`,
    options: shuffle([{ text: clip(def.definition), correct: true }, ...picks.map((o) => ({ text: clip(o.definition), correct: false }))]),
    explanation: explain(def.source),
    source: def.source,
  };
}

/**
 * Build up to `count` questions from `text`.
 * Returns { questions, notes } where notes explains any shortfall to the user.
 */
function generateQuizFromText(text, { count = 5, difficulty = "Medium", type = "MCQ" } = {}) {
  const trimmed = text.trim();
  const sentences = splitSentences(trimmed);
  const { freq, display } = buildFrequency(trimmed);
  const vocab = [...freq.entries()].filter(([w]) => w.length >= 5).sort((a, b) => b[1] - a[1]).map(([w]) => w);
  const ctx = { freq, vocab, difficulty, display };

  const [lo, hi] = RANGES[difficulty] ?? RANGES.Medium;
  const inRange = shuffle(sentences.filter((s) => wordCount(s) >= lo && wordCount(s) <= hi));
  const outRange = shuffle(sentences.filter((s) => wordCount(s) < lo || wordCount(s) > hi));

  const questions = [];
  const used = new Set();
  const seenQ = new Set();
  const add = (item, sourceKeys) => {
    if (!item || seenQ.has(norm(item.q))) return false;
    seenQ.add(norm(item.q));
    sourceKeys.forEach((k) => used.add(k));
    questions.push(item);
    return true;
  };
  let relaxed = 0;

  if (type === "MCQ") {
    const defs = extractDefinitions(trimmed, sentences);
    if (defs.length >= 4) {
      const limit = Math.max(1, Math.floor(count * DEFINITION_SHARE[difficulty]));
      for (const d of shuffle(defs)) {
        if (questions.length >= limit) break;
        if (used.has(norm(d.source))) continue;
        add(buildDefinition(d, defs, difficulty), [norm(d.source)]);
      }
    }
    for (const [pool, isRelaxed] of [[inRange, false], [outRange, true]]) {
      for (const s of pool) {
        if (questions.length >= count) break;
        if (used.has(norm(s))) continue;
        if (add(buildCloze(s, ctx), [norm(s)]) && isRelaxed) relaxed++;
      }
    }
  } else {
    // Roughly half true, half false, in random order.
    const flags = shuffle(Array.from({ length: count }, (_, i) => i % 2 === 1));
    for (const [pool, isRelaxed] of [[inRange, false], [outRange, true]]) {
      for (const s of pool) {
        if (questions.length >= count) break;
        if (used.has(norm(s))) continue;
        const wantFalse = flags[questions.length];
        const item = buildTrueFalse(s, ctx, wantFalse) || (wantFalse ? buildTrueFalse(s, ctx, false) : null);
        if (add(item, [norm(s)]) && isRelaxed) relaxed++;
      }
    }
  }

  const final = shuffle(questions).slice(0, count);
  const notes = [];
  if (final.length > 0 && final.length < count) {
    notes.push(`Your material only supports ${final.length} valid question${final.length === 1 ? "" : "s"} of the ${count} requested, so that is how many were generated. Add more full-sentence notes for more.`);
  }
  if (final.length > 0 && relaxed > 0) {
    notes.push(`${relaxed} question${relaxed === 1 ? "" : "s"} came from sentences that don’t fully match the “${difficulty}” length level because there weren’t enough that did.`);
  }
  return { questions: final, notes };
}



function TextareaField({ label, icon: Icon, error, className = "field", inputClassName = "", ref: inputRef, ...props }) {
  const id = props.id;
  return <div className={className}>
    {label && <label htmlFor={id}>{Icon && <Icon size={14} />} {label}</label>}
    <textarea ref={inputRef} id={id} className={`${inputClassName} ${error ? "is-invalid" : ""}`.trim()} aria-invalid={error ? "true" : "false"} {...props} />
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>;
}
function SelectField({ label, icon: Icon, options, className = "field", ...props }) {
  return <div className={className}><label htmlFor={props.id}>{Icon && <Icon size={14} />} {label}</label>
    <select className="select-input" {...props}>{options.map((o) => { const value = typeof o === "string" ? o : o.value; const text = typeof o === "string" ? o : o.label; return <option key={value} value={value}>{text}</option>; })}</select>
  </div>;
}

const HISTORY_SUBJECT = "My Content";
const GENERATE_DELAY_MS = 500; // brief pause so the loading state is visible

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


/** Left card: material, settings and the generate button (all controlled inputs). */
function StudyMaterialForm({ material, settings, onSettings, onGenerate, onClear, generating, textareaRef }) {
  const { text, setText, stats, error, showError } = material;
  const overLimit = text.length > MAX_CHARS;
  return (
    <form className="glass-card config-card st-form" onSubmit={onGenerate} noValidate>
      <TextareaField
        ref={textareaRef}
        id="study-material"
        label="Your Study Material"
        icon={FileText}
        rows={12}
        placeholder="Paste your notes, textbook content, lecture material, or programming concepts here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={showError ? error : undefined}
        maxLength={MAX_CHARS + 1000}
      />

      <div className="st-meta">
        <span className={`char-count ${overLimit ? "over" : ""}`} aria-live="polite">
          {stats.words.toLocaleString()} word{stats.words === 1 ? "" : "s"} · {stats.chars.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
        </span>
        <button type="button" className="todo-ghost st-clear" onClick={onClear} disabled={text.length === 0 || generating}>
          <Eraser size={14} /> Clear Content
        </button>
      </div>

      <div className="st-selects">
        <label className="field st-question-count" htmlFor="content-question-count">
          <span className="field-label"><Hash size={15} /> Number of Questions</span>
          <input
            id="content-question-count"
            className="input-box"
            type="number"
            min="1"
            max="50"
            step="1"
            value={settings.count}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") { onSettings({ count: "" }); return; }
              const parsed = Number(raw);
              if (Number.isFinite(parsed)) onSettings({ count: Math.max(1, Math.min(50, Math.floor(parsed))) });
            }}
            onBlur={() => onSettings({ count: Math.max(1, Math.min(50, Number(settings.count) || 5)) })}
            required
            aria-describedby="content-question-count-help"
          />
          <small id="content-question-count-help">Enter any number from 1 to 50.</small>
        </label>
        <SelectField icon={BarChart2} label="Difficulty" value={settings.difficulty} onChange={(e) => onSettings({ difficulty: e.target.value })} options={DIFFICULTIES} />
        <SelectField icon={ListChecks} label="Question Type" value={settings.type} onChange={(e) => onSettings({ type: e.target.value })} options={QUESTION_TYPES} />
      </div>

      <p className="quiz-hint st-basic-note">
        <Info size={13} /> This is a basic, rule-based generator — not AI. It reuses sentences from your notes, so quality depends on how clearly they are written.
      </p>

      <button type="submit" className="generate-btn" disabled={generating} aria-busy={generating}>
        <Sparkles size={17} /> {generating ? "Generating…" : "Generate My Quiz"}
      </button>
    </form>
  );
}

function EmptyState({ icon: Icon = ClipboardEdit, title, children }) {
  return (
    <div className="preview-empty">
      <div className="preview-icon"><Icon size={30} /></div>
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function Notes({ notes }) {
  if (!notes?.length) return null;
  return (
    <div className="status-banner info" role="status">
      <div>{notes.map((n) => <p key={n}>{n}</p>)}</div>
    </div>
  );
}

/** Generated questions, shown before the quiz starts (answers stay hidden). */
function QuizPreview({ draft, onStart, onRegenerate }) {
  return (
    <div className="quiz-run">
      <div className="preview-head"><h3>Preview</h3><span>{draft.questions.length} question{draft.questions.length === 1 ? "" : "s"}</span></div>
      <Notes notes={draft.notes} />
      <ol className="st-preview-list">
        {draft.questions.map((q, i) => (
          <li key={i}>
            <div className="st-preview-q">{q.q}</div>
            <ul>{q.options.map((o, j) => <li key={j}>{o.text}</li>)}</ul>
          </li>
        ))}
      </ol>
      <div className="quiz-nav">
        <button type="button" className="todo-ghost" onClick={onRegenerate}><RotateCcw size={15} /> Regenerate</button>
        <button type="button" className="add-task-btn" onClick={onStart}>Start Quiz <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

/** Taking the quiz: select, move between questions, submit. */
function QuizRunner({ session, title, onSubmit, onQuit }) {
  const { questions, index, answers, select, goTo, next, prev } = session;
  const q = questions[index];
  const total = questions.length;
  const last = index === total - 1;
  return (
    <div className="quiz-run">
      <div className="preview-head"><h3>{title}</h3><span>Question {index + 1} of {total}</span></div>
      <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answers.filter((a) => a !== null).length} aria-label="Questions answered">
        <div style={{ width: `${(answers.filter((a) => a !== null).length / total) * 100}%` }} />
      </div>
      <div className="st-pills" role="group" aria-label="Jump to question">
        {questions.map((_, i) => (
          <button key={i} type="button" className={`st-pill ${i === index ? "current" : ""} ${answers[i] !== null ? "done" : ""}`} aria-current={i === index ? "step" : undefined} aria-label={`Question ${i + 1}${answers[i] !== null ? ", answered" : ""}`} onClick={() => goTo(i)}>
            {i + 1}
          </button>
        ))}
      </div>
      <fieldset className="quiz-question">
        <legend>{q.q}</legend>
        {q.options.map((opt, i) => (
          <label key={`${index}-${i}`} className={`quiz-option ${answers[index] === i ? "selected" : ""}`}>
            <input type="radio" name={`q-${index}`} checked={answers[index] === i} onChange={() => select(i)} />
            <span>{opt.text}</span>
          </label>
        ))}
      </fieldset>
      <div className="quiz-nav">
        <button type="button" className="todo-ghost" onClick={onQuit}>Quit quiz</button>
        <div className="st-nav-buttons">
          <button type="button" className="todo-ghost" onClick={prev} disabled={index === 0}><ArrowLeft size={15} /> Previous</button>
          {last ? (
            <button type="button" className="add-task-btn" onClick={onSubmit}><CheckCircle2 size={16} /> Submit Quiz</button>
          ) : (
            <button type="button" className="add-task-btn" onClick={next}>Next <ArrowRight size={16} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizResults({ session, title, storageError, onRetake, onNew }) {
  const { questions, answers, score } = session;
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  return (
    <div className="quiz-run">
      <div className="preview-head"><h3>Results</h3><span>{title}</span></div>
      <div className="quiz-score"><strong>{score} / {total}</strong><span>{percent}%</span></div>
      {storageError && <div className="status-banner error">{storageError}</div>}
      <ol className="quiz-review st-review">
        {questions.map((q, i) => {
          const chosen = answers[i] === null ? null : q.options[answers[i]];
          const right = q.options.find((o) => o.correct);
          const ok = chosen?.correct;
          const Icon = chosen === null ? MinusCircle : ok ? CheckCircle2 : XCircle;
          return (
            <li key={i} className={chosen === null ? "skip" : ok ? "ok" : "bad"}>
              <div className="quiz-review-q"><Icon size={16} /> {q.q}</div>
              {!ok && <div className="quiz-review-a">Your answer: {chosen ? chosen.text : "Not answered"}</div>}
              <div className="quiz-review-a">Correct answer: {right.text}</div>
              <div className="quiz-review-a st-explain">{q.explanation}</div>
            </li>
          );
        })}
      </ol>
      <div className="quiz-nav">
        <button type="button" className="todo-ghost" onClick={onNew}>Generate New Quiz</button>
        <button type="button" className="add-task-btn" onClick={onRetake}><RotateCcw size={15} /> Retake Quiz</button>
      </div>
    </div>
  );
}

function ManualQuestionForm({ onCreate, showToast }) {
  const blank = () => ({ q: "", options: ["", "", "", ""], correct: 0, explanation: "" });
  const [items, setItems] = useState([blank()]);
  const update = (index, patch) => setItems((old) => old.map((item, i) => i === index ? { ...item, ...patch } : item));
  const updateOption = (index, optionIndex, value) => setItems((old) => old.map((item, i) => i === index ? { ...item, options: item.options.map((o, j) => j === optionIndex ? value : o) } : item));
  const add = () => { if (items.length >= 50) return; setItems((old) => [...old, blank()]); };
  const remove = (index) => setItems((old) => old.length === 1 ? [blank()] : old.filter((_, i) => i !== index));
  const submit = (e) => {
    e.preventDefault();
    const incomplete = items.findIndex((item) => !item.q.trim() || item.options.some((o) => !o.trim()));
    if (incomplete >= 0) { showToast(`Please complete Question ${incomplete + 1} and all four options.`, "error"); return; }
    const questions = items.map((item) => ({ type: "MCQ", q: item.q.trim(), options: item.options.map((text, i) => ({ text: text.trim(), correct: i === Number(item.correct) })), explanation: item.explanation.trim() || "Review the correct option you selected." }));
    onCreate(questions);
  };
  return <form className="glass-card config-card st-form" onSubmit={submit}>
    <div><h3>Create Quiz Manually</h3><p className="quiz-hint">Add your own questions, four options, and choose the correct answer. Up to 50 questions.</p></div>
    {items.map((item, index) => <section key={index} className="manual-question" style={{ border: "1px solid var(--border-subtle)", borderRadius: 14, padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>Question {index + 1}</strong><button type="button" className="todo-ghost" onClick={() => remove(index)} aria-label={`Remove question ${index + 1}`}><Trash2 size={15}/> Remove</button></div>
      <label className="field">Question text<textarea className="textarea-box" rows={3} value={item.q} onChange={(e) => update(index, { q: e.target.value })} placeholder="Enter your question…" required /></label>
      {item.options.map((option, optionIndex) => <label className="field" key={optionIndex}>Option {String.fromCharCode(65 + optionIndex)}<input className="input-box" value={option} onChange={(e) => updateOption(index, optionIndex, e.target.value)} placeholder={`Enter option ${String.fromCharCode(65 + optionIndex)}`} required /></label>)}
      <label className="field">Correct answer<select className="input-box" value={item.correct} onChange={(e) => update(index, { correct: Number(e.target.value) })}>{item.options.map((_, i) => <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>)}</select></label>
      <label className="field">Explanation (optional)<textarea className="textarea-box" rows={2} value={item.explanation} onChange={(e) => update(index, { explanation: e.target.value })} placeholder="Explain why this answer is correct…" /></label>
    </section>)}
    <button type="button" className="todo-ghost" onClick={add} disabled={items.length >= 50}><Plus size={16}/> Add another question ({items.length}/50)</button>
    <button type="submit" className="generate-btn"><ClipboardEdit size={17}/> Preview My Quiz</button>
  </form>;
}

function SelfTestStudio() {
  const { recordAttempt, storageError } = useQuizHistory();
  const material = useStudyMaterial();
  const session = useQuizSession();
  const [notice, setNotice] = useState(null);
  const showToast = (message, type = "success") => setNotice({ message, type });

  const [settings, setSettings] = useState({ count: 5, difficulty: "Medium", type: "MCQ" });
  const [createMode, setCreateMode] = useState("content");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null); // { questions, notes, settings, title }
  const [genError, setGenError] = useState("");
  const [confirm, setConfirm] = useState(null); // { title, body, confirmLabel, onConfirm }
  const textareaRef = useRef(null);
  const timerRef = useRef(null);
  const [quizMeta, setQuizMeta] = useState({ title: "Pasted notes", difficulty: "Medium" });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const closeConfirm = useCallback(() => setConfirm(null), []);

  const updateSettings = (patch) => {
    setSettings((s) => ({ ...s, ...patch }));
    setDraft(null);
  };

  const onText = {
    ...material,
    setText: (value) => {
      material.setText(value);
      setDraft(null);
      setGenError("");
    },
  };

  const runGenerate = () => {
    setGenerating(true);
    setGenError("");
    setDraft(null);
    session.reset();
    timerRef.current = setTimeout(() => {
      try {
        const { questions, notes } = generateQuizFromText(material.text, settings);
        if (questions.length === 0) {
          const msg = "We couldn’t build any questions from this text. Try longer notes written as full sentences (6+ words each).";
          setGenError(msg);
          showToast(msg, "error");
        } else {
          const firstLine = material.text.trim().split(/\n/)[0].trim();
          setDraft({ questions, notes, settings: { ...settings }, title: firstLine.length > 3 ? firstLine.slice(0, 40) : "Pasted notes" });
          showToast(`Generated ${questions.length} question${questions.length === 1 ? "" : "s"}.`, "success");
        }
      } catch {
        const msg = "Something went wrong while generating the quiz. Please try again.";
        setGenError(msg);
        showToast(msg, "error");
      } finally {
        setGenerating(false);
      }
    }, GENERATE_DELAY_MS);
  };

  const onGenerate = (e) => {
    e?.preventDefault();
    if (generating) return;
    material.setShowError(true);
    if (material.error) {
      textareaRef.current?.focus();
      showToast(material.error, "error");
      return;
    }
    if (session.status === "running") {
      setConfirm({
        title: "Replace current quiz?",
        body: "You’re partway through a quiz. Generating a new one will discard your answers.",
        confirmLabel: "Generate new quiz",
        onConfirm: () => { closeConfirm(); runGenerate(); },
      });
      return;
    }
    runGenerate();
  };

  const onClear = () => {
    material.clear();
    setDraft(null);
    setGenError("");
    textareaRef.current?.focus();
    showToast("Content cleared.", "success");
  };

  const createManualDraft = (questions) => {
    session.reset();
    setGenError("");
    setDraft({ questions, notes: [], settings: { count: questions.length, difficulty: "Medium", type: "MCQ" }, title: "My Manual Quiz" });
    showToast(`Added ${questions.length} question${questions.length === 1 ? "" : "s"} to your quiz.`, "success");
  };

  const startDraft = () => {
    setQuizMeta({ title: draft.title, difficulty: draft.settings.difficulty });
    session.begin(draft.questions);
    setDraft(null);
  };

  const submit = () => {
    const finalize = () => {
      closeConfirm();
      recordAttempt({
        subject: HISTORY_SUBJECT,
        topic: quizMeta.title,
        difficulty: quizMeta.difficulty,
        total: session.questions.length,
        correct: session.score,
      });
      session.finish();
      showToast("Quiz submitted — see your results.", "success");
    };
    if (session.unanswered > 0) {
      setConfirm({
        title: "Submit with unanswered questions?",
        body: `You have ${session.unanswered} unanswered question${session.unanswered === 1 ? "" : "s"}. They will be marked incorrect.`,
        confirmLabel: "Submit anyway",
        onConfirm: finalize,
      });
    } else {
      finalize();
    }
  };

  const quit = () =>
    setConfirm({
      title: "Quit this quiz?",
      body: "Your answers so far will be discarded. Your pasted material stays put.",
      confirmLabel: "Quit quiz",
      onConfirm: () => { closeConfirm(); session.reset(); },
    });

  const retake = () => {
    session.retake();
    showToast("Quiz restarted.", "success");
  };

  const generateNew = () => {
    session.reset();
    textareaRef.current?.focus();
  };

  return (
    <div className="page-content quiz-page self-test">
      <Doodle type="coffee" size={54} style={{ top: 8, left: 360 }} />
      <Doodle type="laptop" size={64} style={{ top: -6, left: 500 }} />
      <Doodle type="plant" size={52} className="blue" style={{ top: 30, left: 660 }} />
      <Doodle type="books" size={54} style={{ top: 0, right: 90 }} />

      <div className="page-content-inner">
        <Header icon={Sparkles} title="Quiz Generator" subtitle="Turn your notes into a quiz and test what you know." />

        <div className="quiz-layout">
          <div className="quiz-create-column">
            <div className="mode-switch" role="group" aria-label="Quiz creation method" style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <button type="button" className={createMode === "content" ? "add-task-btn" : "todo-ghost"} onClick={() => setCreateMode("content")}>From My Content</button>
              <button type="button" className={createMode === "manual" ? "add-task-btn" : "todo-ghost"} onClick={() => setCreateMode("manual")}>Create Quiz Manually</button>
            </div>
            {createMode === "content" ? <StudyMaterialForm material={onText} settings={settings} onSettings={updateSettings} onGenerate={onGenerate} onClear={onClear} generating={generating} textareaRef={textareaRef} /> : <ManualQuestionForm onCreate={createManualDraft} showToast={showToast} />}
          </div>

          <div className="glass-card preview-card" aria-live="polite">
            {generating && (
              <EmptyState icon={Sparkles} title="Building your quiz…">Reading your notes and picking the best sentences.</EmptyState>
            )}

            {!generating && genError && (
              <>
                <div className="status-banner error" role="alert">{genError}</div>
                <EmptyState icon={ClipboardEdit} title="No quiz generated">Add more detail to your notes, then try again.</EmptyState>
              </>
            )}

            {!generating && !genError && session.status === "idle" && !draft && (
              <>
                <div className="preview-head"><h3>Preview</h3><span>0 questions</span></div>
                <EmptyState title="Your quiz will appear here">Paste your study material, choose your settings, and press “Generate My Quiz”.</EmptyState>
              </>
            )}

            {!generating && draft && session.status === "idle" && (
              <QuizPreview draft={draft} onStart={startDraft} onRegenerate={onGenerate} />
            )}

            {session.status === "running" && !generating && (
              <QuizRunner session={session} title={quizMeta.title} onSubmit={submit} onQuit={quit} />
            )}

            {session.status === "finished" && !generating && (
              <QuizResults session={session} title={quizMeta.title} storageError={storageError} onRetake={retake} onNew={generateNew} />
            )}
          </div>
        </div>
      </div>

      {notice && <div className={`status-banner ${notice.type === "error" ? "error" : "success"}`} role={notice.type === "error" ? "alert" : "status"}>
        <span>{notice.message}</span> <button type="button" className="todo-ghost" onClick={() => setNotice(null)}>Dismiss</button>
      </div>}

      {confirm && <section className="glass-card quiz-confirm-inline" role="alertdialog" aria-label={confirm.title}>
        <h3>{confirm.title}</h3><p>{confirm.body}</p>
        <div className="confirm-actions"><button type="button" className="todo-ghost" onClick={closeConfirm}>Cancel</button>
        <button type="button" className="add-task-btn" onClick={confirm.onConfirm}>{confirm.confirmLabel}</button></div>
      </section>}
    </div>
  );
}

export default SelfTestStudio;
