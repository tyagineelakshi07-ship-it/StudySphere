import "./Performance.css";
function Performance() {
  return (
    <div className="performance-page">

    {/* Performance Doodles */}

<div className="performance-doodles">

  {/* Stars */}
  <span className="perf-star star-one">✦</span>
  <span className="perf-star star-two">✧</span>
  <span className="perf-star star-three">✦</span>
  <span className="perf-star star-four">·</span>

  {/* Growth Arrow */}
  <div className="growth-doodle">
    <div className="growth-line line-one"></div>
    <div className="growth-line line-two"></div>
    <div className="growth-line line-three"></div>
    <div className="growth-arrow">↗</div>
  </div>

  {/* Mini Chart */}
  <div className="mini-chart">
    <div className="mini-bar bar-one"></div>
    <div className="mini-bar bar-two"></div>
    <div className="mini-bar bar-three"></div>
    <div className="mini-bar bar-four"></div>
  </div>

  {/* Target */}
  <div className="target-doodle">
    <div className="target-circle"></div>
    <div className="target-dot"></div>
  </div>

  {/* Pencil */}
  <div className="pencil-doodle">
    <div className="pencil-body"></div>
    <div className="pencil-tip"></div>
  </div>

  {/* Floating dots */}
  <span className="perf-dot dot-one"></span>
  <span className="perf-dot dot-two"></span>
  <span className="perf-dot dot-three"></span>

</div>

      {/* Page Header */}

      <div className="performance-header">
        <div>
          <h1>Performance Analysis</h1>
          <p>Track your academic progress and study performance</p>
        </div>

        <button className="report-btn">
          Download Report
        </button>
      </div>


      {/* Statistics Cards */}

      <div className="stats-container">

        <div className="stat-card">
          <p>Overall Score</p>
          <h2>87%</h2>
          <span className="positive">↑ 8.4% this month</span>
        </div>

        <div className="stat-card">
          <p>Average Grade</p>
          <h2>A+</h2>
          <span className="positive">Excellent performance</span>
        </div>

        <div className="stat-card">
          <p>Study Hours</p>
          <h2>42.5</h2>
          <span>Hours this month</span>
        </div>

        <div className="stat-card">
          <p>Quizzes Completed</p>
          <h2>24</h2>
          <span>4 this week</span>
        </div>

      </div>


      {/* Performance Overview */}

      <div className="performance-card">

        <div className="card-heading">
          <div>
            <h2>Performance Overview</h2>
            <p>Your performance over the past 6 months</p>
          </div>

          <select>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
        </div>


        {/* Fake Chart */}

        <div className="chart">

          <div className="y-axis">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
          </div>

          <div className="chart-area">

            <div className="grid-line line1 "></div>
            <div className="grid-line line2"></div>
            <div className="grid-line line3"></div>
            <div className="grid-line line4"></div>
            <div className="grid-line line5"></div>

            <div className="chart-bars">

              <div className="bar-wrapper">
                <div className="bar bar-1"></div>
                <span>Mar</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar bar-2"></div>
                <span>Apr</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar bar-3"></div>
                <span>May</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar bar-4"></div>
                <span>Jun</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar bar-5"></div>
                <span>Jul</span>
              </div>

              <div className="bar-wrapper">
                <div className="bar bar-6"></div>
                <span>Aug</span>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Bottom Section */}

      <div className="performance-bottom">

        {/* Subject Performance */}

        <div className="performance-card subject-card">

          <div className="card-heading">
            <div>
              <h2>Subject Performance</h2>
              <p>Your performance by subject</p>
            </div>
          </div>


          <div className="subject">

            <div className="subject-info">
              <span>Java</span>
              <strong>92%</strong>
            </div>

            <div className="progress-bg">
              <div className="progress-fill java"></div>
            </div>

          </div>


          <div className="subject">

            <div className="subject-info">
              <span>Python</span>
              <strong>87%</strong>
            </div>

            <div className="progress-bg">
              <div className="progress-fill python"></div>
            </div>

          </div>


          <div className="subject">

            <div className="subject-info">
              <span>Mathematics</span>
              <strong>82%</strong>
            </div>

            <div className="progress-bg">
              <div className="progress-fill maths"></div>
            </div>

          </div>


          <div className="subject">

            <div className="subject-info">
              <span>DBMS</span>
              <strong>78%</strong>
            </div>

            <div className="progress-bg">
              <div className="progress-fill dbms"></div>
            </div>

          </div>


          <div className="subject">

            <div className="subject-info">
              <span>Operating Systems</span>
              <strong>73%</strong>
            </div>

            <div className="progress-bg">
              <div className="progress-fill os"></div>
            </div>

          </div>

        </div>


        {/* Recent Activity */}

        <div className="performance-card activity-card">

          <div className="card-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Your latest learning activities</p>
            </div>
          </div>


          <div className="activity">

            <div className="activity-icon">
              ✓
            </div>

            <div>
              <h3>Java Quiz</h3>
              <p>Completed with 92%</p>
            </div>

          </div>


          <div className="activity">

            <div className="activity-icon">
              ✓
            </div>

            <div>
              <h3>Python Assignment</h3>
              <p>Completed with 88%</p>
            </div>

          </div>


          <div className="activity">

            <div className="activity-icon">
              ✓
            </div>

            <div>
              <h3>DBMS Quiz</h3>
              <p>Completed with 84%</p>
            </div>

          </div>


          <div className="activity">

            <div className="activity-icon">
              ✓
            </div>

            <div>
              <h3>Maths Assignment</h3>
              <p>Completed with 79%</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Performance;