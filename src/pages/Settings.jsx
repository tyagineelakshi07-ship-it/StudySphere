import { useState, useEffect } from "react";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [mode, setMode] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [modal, setModal] = useState({
    show: false,
    message: "",
    type: "success",
  });

  function showModal(message, type = "success") {
    setModal({
      show: true,
      message,
      type,
    });
  }

  useEffect(() => {
    const savedLogin = localStorage.getItem("studyLoggedIn");

    if (savedLogin) {
      try {
        const user = JSON.parse(savedLogin);
        setCurrentUser(user);
        setLoggedIn(true);
      } catch {
        localStorage.removeItem("studyLoggedIn");
      }
    }
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSecurityChange(e) {
    setSecurity({
      ...security,
      [e.target.name]: e.target.value,
    });
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem("studyUsers")) || [];
    } catch {
      return [];
    }
  }

  function handleSignup(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      showModal("Please fill in all fields.", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      showModal("Please enter a valid email address.", "error");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      showModal("Enter a valid 10-digit phone number.", "error");
      return;
    }

    if (form.password.length < 8) {
      showModal("Password must contain at least 8 characters.", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showModal("Passwords do not match.", "error");
      return;
    }

    const users = getUsers();

    const exists = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() ||
        user.phone === form.phone.trim()
    );

    if (exists) {
      showModal("An account with this email or phone already exists.", "error");
      return;
    }

    const newUser = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
    };

    users.push(newUser);
    localStorage.setItem("studyUsers", JSON.stringify(users));

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    setMode("login");
    showModal("Account created successfully! Please log in.");
  }

  function handleLogin(e) {
    e.preventDefault();

    if (!form.email.trim() || !form.phone.trim() || !form.password) {
      showModal("Enter your email, phone number and password.", "error");
      return;
    }

    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === form.email.trim().toLowerCase() &&
        item.phone === form.phone.trim() &&
        item.password === form.password
    );

    if (!user) {
      showModal("Incorrect email, phone number or password.", "error");
      return;
    }

    const userInfo = {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    setCurrentUser(user);
    setLoggedIn(true);
    localStorage.setItem("studyLoggedIn", JSON.stringify(userInfo));

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    showModal("Login successful! Welcome, " + user.name + ".");
  }

  function handleLogout() {
    localStorage.removeItem("studyLoggedIn");

    setLoggedIn(false);
    setCurrentUser(null);
    setMode("login");
    setActiveTab("General");

    showModal("You have logged out successfully.");
  }

  function changePassword(e) {
    e.preventDefault();

    if (
      !security.currentPassword ||
      !security.newPassword ||
      !security.confirmNewPassword
    ) {
      showModal("Please fill in all password fields.", "error");
      return;
    }

    if (security.newPassword.length < 8) {
      showModal("New password must contain at least 8 characters.", "error");
      return;
    }

    if (security.newPassword !== security.confirmNewPassword) {
      showModal("New passwords do not match.", "error");
      return;
    }

    const users = getUsers();

    const userIndex = users.findIndex(
      (user) =>
        currentUser &&
        user.email === currentUser.email &&
        user.phone === currentUser.phone
    );

    if (userIndex === -1) {
      showModal("Please log in to change your password.", "error");
      return;
    }

    if (users[userIndex].password !== security.currentPassword) {
      showModal("Current password is incorrect.", "error");
      return;
    }

    users[userIndex].password = security.newPassword;

    localStorage.setItem("studyUsers", JSON.stringify(users));

    setCurrentUser(users[userIndex]);

    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    showModal("Password changed successfully!");
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your StudySphere account.</p>
      </div>

      <div className="settings-layout">
        <div className="settings-menu">
          <button
            type="button"
            className={`settings-menu-item ${
              activeTab === "General" ? "active" : ""
            }`}
            onClick={() => setActiveTab("General")}
          >
            General
          </button>

          <button
            type="button"
            className={`settings-menu-item ${
              activeTab === "Account Security" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Account Security")}
          >
            Account Security
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "General" && (
            <>
              {!loggedIn ? (
                <>
                  <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

                  <p className="settings-description">
                    {mode === "login"
                      ? "Log in to your StudySphere account."
                      : "Create your new StudySphere account."}
                  </p>

                  <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
                    {mode === "signup" && (
                      <div className="setting-field">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    <div className="setting-field">
                      <label>Email Address</label>
                      <input
                        type="text"
                        name="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="setting-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="setting-field">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </div>

                    {mode === "signup" && (
                      <div className="setting-field">
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    <button type="submit" className="security-button">
                      {mode === "login" ? "Login" : "Create Account"}
                    </button>
                  </form>

                  <p className="settings-description">
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </p>

                  <button
                    type="button"
                    className="back-button"
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    {mode === "login" ? "Sign Up" : "Back to Login"}
                  </button>
                </>
              ) : (
                <>
                  <h2>Welcome, {currentUser?.name}</h2>

                  <p className="settings-description">
                    You are logged in to your StudySphere account.
                  </p>

                  <div className="account-section">
                    <h3>Account</h3>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Account Security" && (
            <>
              <h2>Account Security</h2>

              <p className="settings-description">
                Change your password to keep your account secure.
              </p>

              {!loggedIn ? (
                <p className="settings-description">
                  Please log in first to change your password.
                </p>
              ) : (
                <form onSubmit={changePassword}>
                  <div className="setting-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Enter current password"
                      value={security.currentPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>

                  <div className="setting-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={security.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>

                  <div className="setting-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Confirm new password"
                      value={security.confirmNewPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>

                  <button type="submit" className="security-button">
                    Change Password
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <div className="settings-doodle">
        <span className="universe-star star-1">✦</span>
        <span className="universe-star star-2">✧</span>
        <span className="universe-star star-3">✧</span>
        <span className="universe-star star-4">✦</span>

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

        <span className="sparkle sparkle-1">✦</span>
        <span className="sparkle sparkle-2">✧</span>
      </div>

      {modal.show && (
        <div className="custom-modal-overlay">
          <div className={`custom-modal ${modal.type}`}>
            <div className="custom-modal-header">
              <span>
                {modal.type === "success" ? "Success" : "Error"}
              </span>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setModal({ ...modal, show: false })
                }
              >
                ×
              </button>
            </div>

            <div className="custom-modal-body">{modal.message}</div>

            <div className="custom-modal-footer">
              <button
                type="button"
                onClick={() =>
                  setModal({ ...modal, show: false })
                }
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;