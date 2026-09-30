import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Pages.css";

function Login({ setAuthUser }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        form
      );

      const user = response.data.user;

      localStorage.setItem(
        "ai-interview-user",
        JSON.stringify(user)
      );

      setAuthUser(user);
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Invalid email or password."
      );
    }
  };

  return (
    <div className="landing-shell">

      {/* ================= NAVBAR ================= */}
      <header className="top-nav landing-nav">
        <Link to="/" className="brand brand-glow">
          🤖 AI Interview Hub
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <Link to="/login" className="ghost-btn nav-btn">
            Login
          </Link>

          <Link to="/signup" className="btn-primary nav-btn">
            Sign Up
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="landing-grid" id="home">

        {/* ================= HERO ================= */}
        <section className="hero-panel">
          <div className="hero-copy">

            <span className="eyebrow accent-text">
              AI Interview Hub
            </span>

            <h1>
              Crack Your Dream Job with AI
            </h1>

            <p className="hero-text">
              Practice AI interviews, analyze your resume,
              improve communication skills, and receive
              instant feedback.
            </p>

            <ul className="feature-list">
              <li>✓ AI Voice Interview</li>
              <li>✓ Resume Analyzer</li>
              <li>✓ AI Generated Questions</li>
              <li>✓ Instant Feedback</li>
              <li>✓ Performance Dashboard</li>
            </ul>

            <div className="hero-actions">
              <a
                href="#login"
                className="btn-primary hero-button"
              >
                Start Your Journey
              </a>
            </div>

          </div>

          {/* ================= HERO VISUAL ================= */}
          <div className="hero-visual">
            <div className="glow-orb"></div>
            <div className="robot-shell"></div>
            <div className="floating-resume"></div>
            <div className="voice-wave"></div>

            <div className="dashboard-card card-1"></div>
            <div className="dashboard-card card-2"></div>
            <div className="dashboard-card card-3"></div>

            
          </div>
        </section>

        {/* ================= LOGIN ================= */}
        <aside className="login-panel" id="login">
          <div className="glass-card auth-card premium-login-card">

            <div className="login-heading">

              <p className="eyebrow accent-text">
                Welcome Back
              </p>

              <h2>
                Secure access to your AI workspace
              </h2>

              <p className="hero-text">
                Login and continue practicing with your
                tailored interview experience.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* EMAIL */}
              <label className="field field-icon">
                <span>Email</span>

                <input
                  type="email"
                  required
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              {/* PASSWORD */}
              <label className="field field-icon">
                <span>Password</span>

                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </label>

              {/* REMEMBER / FORGOT */}
              <div className="auth-row">

                <label className="checkbox-field">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <a href="#" className="forgot-link">
                  Forgot Password?
                </a>

              </div>

              {/* LOGIN BUTTON */}
              <button
                className="btn-primary login-submit"
                type="submit"
              >
                Login
              </button>

              {/* ERROR MESSAGE */}
              {message && (
                <p className="status error">
                  {message}
                </p>
              )}

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                className="btn-secondary google-btn"
              >
                Continue with Google
              </button>

              {/* SIGNUP */}
              <p className="helper-text">
                New here?{" "}
                <Link to="/signup">
                  Create an account
                </Link>
              </p>

            </form>
          </div>
        </aside>

      </main>

      {/* ================= FEATURES ================= */}
      <section
        className="feature-strip"
        id="features"
      >

        <div className="feature-card">
          <span>🤖</span>
          <h3>AI Interview</h3>
          <p>
            Real-time question practice with AI coaching.
          </p>
        </div>

        <div className="feature-card">
          <span>📄</span>
          <h3>Resume Analysis</h3>
          <p>
            Instant resume feedback with tailored
            interview questions.
          </p>
        </div>

        <div className="feature-card">
          <span>🎤</span>
          <h3>Voice Recognition</h3>
          <p>
            Practice speaking clearly with live AI scoring.
          </p>
        </div>

        <div className="feature-card">
          <span>📊</span>
          <h3>AI Reports</h3>
          <p>
            Track your performance with intelligent
            analytics.
          </p>
        </div>

      </section>

      {/* ================= STATS ================= */}
      <section
        className="stats-section"
        id="about"
      >

        <div className="stat-card stat-glow">
          <strong>10,000+</strong>
          <span>Interviews</span>
        </div>

        <div className="stat-card stat-glow">
          <strong>98%</strong>
          <span>Accuracy</span>
        </div>

        <div className="stat-card stat-glow">
          <strong>24/7</strong>
          <span>AI Support</span>
        </div>

        <div className="stat-card stat-glow">
          <strong>5000+</strong>
          <span>Students</span>
        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className="landing-footer"
        id="contact"
      >

        <div>
          <h3>AI Interview Hub</h3>

          <p>
            Premium AI-powered interview practice
            for modern professionals.
          </p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <a href="#">
            Privacy Policy
          </a>
        </div>

      </footer>

    </div>
  );
}

export default Login;