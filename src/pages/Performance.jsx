import React, { useMemo, useState } from "react";
import "./Performance.css";

const subjectData = [
  { name: "Java", score: 92, color: "#a78bfa" },
  { name: "Python", score: 87, color: "#60a5fa" },
  { name: "Maths", score: 82, color: "#fbbf24" },
  { name: "DBMS", score: 78, color: "#f472b6" },
  { name: "OS", score: 73, color: "#34d399" },
];

const monthlyData = {
  "Last 6 months": [
    { month: "May", score: 58 },
    { month: "Jun", score: 66 },
    { month: "Jul", score: 62 },
    { month: "Aug", score: 74 },
    { month: "Sep", score: 81 },
    { month: "Oct", score: 87 },
  ],
  "Last 3 months": [
    { month: "Aug", score: 74 },
    { month: "Sep", score: 81 },
    { month: "Oct", score: 87 },
  ],
  "This year": [
    { month: "Jan", score: 48 },
    { month: "Feb", score: 55 },
    { month: "Mar", score: 61 },
    { month: "Apr", score: 57 },
    { month: "May", score: 58 },
    { month: "Jun", score: 66 },
    { month: "Jul", score: 62 },
    { month: "Aug", score: 74 },
    { month: "Sep", score: 81 },
    { month: "Oct", score: 87 },
  ],
};

const initialActivities = [
  {
    id: 1,
    icon: "✓",
    title: "Java Quiz Completed",
    detail: "Practice activity",
    result: "92%",
    color: "activity-purple",
  },
  {
    id: 2,
    icon: "▤",
    title: "Notes Updated",
    detail: "Study notes",
    result: "Updated",
    color: "activity-blue",
  },
  {
    id: 3,
    icon: "◷",
    title: "Study Session",
    detail: "Study activity",
    result: "45 min",
    color: "activity-green",
  },
];

function Performance() {
  const [period, setPeriod] = useState("Last 6 months");

  const savedNotesCount = useMemo(() => {
    try {
      const savedNotes = JSON.parse(
        localStorage.getItem("studysphere_notes") || "[]"
      );

      return Array.isArray(savedNotes) ? savedNotes.length : 0;
    } catch {
      return 0;
    }
  }, []);

  const chartData = monthlyData[period];

  const averageScore = Math.round(
    subjectData.reduce(
      (total, subject) => total + subject.score,
      0
    ) / subjectData.length
  );

  return (
    <div className="performance-page">
      <header className="performance-header">
        <div className="performance-header-content">
          <p className="performance-eyebrow">
            YOUR LEARNING JOURNEY
          </p>

          <h1>
            Performance <span>Analysis</span>
          </h1>

          <p className="performance-subtitle">
            Track your progress, understand your strengths and keep improving.
          </p>
        </div>

        <div className="performance-header-icon" aria-hidden="true">
          ✦
        </div>

        <div className="performance-doodle doodle-one" aria-hidden="true">
          ✧
        </div>
        <div className="performance-doodle doodle-two" aria-hidden="true">
          ✦
        </div>
        <div className="performance-doodle doodle-three" aria-hidden="true">
          ◦
        </div>
      </header>

      <section className="performance-stats">
        <div className="performance-stat-card">
          <div className="performance-stat-top">
            <span className="performance-stat-icon stat-purple">◈</span>
            <span className="performance-stat-label">Sample score</span>
          </div>

          <h2>87%</h2>

          <p className="performance-stat-caption">
            <span className="stat-trend">↗</span> Overall performance
          </p>
        </div>

        <div className="performance-stat-card">
          <div className="performance-stat-top">
            <span className="performance-stat-icon stat-blue">↗</span>
            <span className="performance-stat-label">Subject average</span>
          </div>

          <h2>{averageScore}%</h2>

          <p className="performance-stat-caption">
            Across {subjectData.length} sample subjects
          </p>
        </div>

        <div className="performance-stat-card">
          <div className="performance-stat-top">
            <span className="performance-stat-icon stat-pink">◷</span>
            <span className="performance-stat-label">Study time</span>
          </div>

          <h2>42.5h</h2>

          <p className="performance-stat-caption">
            Sample value · not tracked live
          </p>
        </div>

        <div className="performance-stat-card">
          <div className="performance-stat-top">
            <span className="performance-stat-icon stat-green">✓</span>
            <span className="performance-stat-label">Saved notes</span>
          </div>

          <h2>{savedNotesCount}</h2>

          <p className="performance-stat-caption">
            Notes saved in this browser
          </p>
        </div>
      </section>

      <section className="performance-main-grid">
        <div className="performance-panel progress-panel">
          <div className="performance-panel-heading">
            <div>
              <h2>Learning Progress</h2>
              <p>Your sample score trend over time</p>
            </div>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Select chart time period"
              className="performance-period-select"
            >
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>This year</option>
            </select>
          </div>

          <div className="progress-chart">
            <div className="chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="chart-content">
              <div className="chart-grid-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="chart-bars">
                {chartData.map((item) => (
                  <div
                    className="chart-bar-column"
                    key={item.month}
                  >
                    <span className="chart-bar-value">
                      {item.score}%
                    </span>

                    <div className="chart-bar-track">
                      <div
                        className="chart-bar"
                        style={{ height: `${item.score}%` }}
                        title={`${item.month}: ${item.score}%`}
                      />
                    </div>

                    <span className="chart-month">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="performance-chart-note">
            Illustrative data for UI preview; replace with actual assessment
            records when available.
          </p>
        </div>

        <div className="performance-panel subjects-panel">
          <div className="performance-panel-heading">
            <div>
              <h2>Subject Performance</h2>
              <p>Your scores by subject</p>
            </div>
          </div>

          <div className="subject-list">
            {subjectData.map((subject) => (
              <div className="subject-row" key={subject.name}>
                <div className="subject-row-info">
                  <span className="subject-name">
                    {subject.name}
                  </span>

                  <span className="subject-score">
                    {subject.score}%
                  </span>
                </div>

                <div className="subject-progress-track">
                  <div
                    className="subject-progress-fill"
                    style={{
                      width: `${subject.score}%`,
                      backgroundColor: subject.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="subject-average">
            <div>
              <span className="average-dot" />
              <span>Average score</span>
            </div>

            <strong>{averageScore}%</strong>
          </div>
        </div>
      </section>

      <section className="performance-panel activity-panel">
        <div className="performance-panel-heading">
          <div>
            <h2>Recent Activity</h2>
            <p>A preview of your learning activity section</p>
          </div>

          <span className="activity-badge">Demo data</span>
        </div>

        <div className="activity-list">
          {initialActivities.map((activity) => (
            <div className="activity-item" key={activity.id}>
              <div className={`activity-icon ${activity.color}`}>
                {activity.icon}
              </div>

              <div className="activity-info">
                <h3>{activity.title}</h3>
                <p>{activity.detail}</p>
              </div>

              <span className="activity-result">
                {activity.result}
              </span>
            </div>
          ))}
        </div>
      </section>

      <p className="performance-disclaimer">
        Note: Scores, study hours and recent activities are sample values.
        Only the saved-notes count is read from your Notes page.
      </p>
    </div>
  );
}

export default Performance;