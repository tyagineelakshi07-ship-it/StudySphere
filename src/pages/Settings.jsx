import "./Settings.css";
function Settings() {
  return (
    <div className="settings-page">

     {/* Study Doodle */}

{/* Study Universe Doodle */}

<div className="settings-doodle">

  <div className="universe-star star-1">✦</div>
  <div className="universe-star star-2">✧</div>
  <div className="universe-star star-3">✦</div>
  <div className="universe-star star-4">·</div>

  <div className="planet">
    <div className="planet-ring"></div>
  </div>

  <div className="orbit-dot"></div>

  <div className="doodle-book">
    <div className="book-left"></div>
    <div className="book-right"></div>
    <div className="book-line line-1"></div>
    <div className="book-line line-2"></div>
  </div>

  <div className="floating-pencil"></div>

  <div className="sparkle sparkle-1">✧</div>
  <div className="sparkle sparkle-2">✦</div>

</div>




      {/* Header */}

      <div className="settings-header">

        <h1>Settings</h1>

        <p>
          Manage your StudySphere preferences
        </p>

      </div>


      {/* Settings Layout */}

      <div className="settings-layout">


        {/* Settings Menu */}

        <div className="settings-menu">

          <button className="settings-menu-item active">
            ◉ General
          </button>

          <button className="settings-menu-item">
            ◇ Appearance
          </button>

          <button className="settings-menu-item">
            ♧ Notifications
          </button>

          <button className="settings-menu-item">
            ◇ Privacy
          </button>

          <button className="settings-menu-item">
            ⓘ About
          </button>

        </div>


        {/* Settings Content */}

        <div className="settings-content">


          {/* Language */}

          <div className="setting-field">

            <label>Language</label>

            <select>
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
            </select>

          </div>


          {/* Daily Goal */}

          <div className="setting-field">

            <label>Daily Study Goal</label>

            <select>
              <option>4 Hours</option>
              <option>2 Hours</option>
              <option>6 Hours</option>
              <option>8 Hours</option>
            </select>

          </div>


          {/* Week Start */}

          <div className="setting-field">

            <label>Week starts on</label>

            <select>
              <option>Monday</option>
              <option>Sunday</option>
            </select>

          </div>


          {/* Appearance */}

          <div className="setting-field">

            <label>Theme</label>

            <select>
              <option>Dark</option>
              <option>Light</option>
            </select>

          </div>


          {/* Profile */}

          <div className="setting-field">

            <label>Profile</label>

            <input
              type="text"
              value="Charvi"
              readOnly
            />

          </div>


          {/* Security */}

          <div className="setting-field">

            <label>Account & Security</label>

            <button className="security-button">
              Change Password
            </button>

          </div>


          {/* Logout */}

          <button className="logout-button">
            Logout
          </button>


        </div>

      </div>

    </div>
  );
}

export default Settings;