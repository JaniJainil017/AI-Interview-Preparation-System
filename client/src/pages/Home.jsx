import { Link } from "react-router-dom";
import "./Pages.css";

function Home({ profile }) {
  return (
    <div className="page-shell home-shell">
      <section className="hero-card hero-card-large">
        <div className="hero-copy">
          <p className="eyebrow accent-text">Professional AI Interview Platform</p>
          <h1>Welcome back, {profile?.name || "student"}</h1>
          <p className="hero-text">
            Practice mock interviews with resume-aware questions, voice input, live scoring, and a polished report experience.
          </p>

          <div className="hero-actions">
            <Link to="/upload" className="btn-primary">Upload Resume</Link>
            <Link to="/interview" className="btn-secondary">Start Interview</Link>
          </div>
        </div>

        <div className="hero-visual hero-visual-small">
          <div className="mini-glow"></div>
          <div className="mini-card mini-card-1"></div>
          <div className="mini-card mini-card-2"></div>
          <div className="mini-card mini-card-3"></div>
        </div>
      </section>

      <section className="page-card feature-grid">
        <div className="feature-panel">
          <h2>Included features</h2>
          <p className="hero-text">Everything you need to improve interview readiness in one intelligent platform.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <strong>Voice Interview</strong>
            <p>Speak naturally and convert your answer into text.</p>
          </div>
          <div className="stat-card">
            <strong>Timer + Scoring</strong>
            <p>Practice under pressure with a countdown and live score.</p>
          </div>
          <div className="stat-card">
            <strong>Smart Report</strong>
            <p>Store your results and download a final interview summary.</p>
          </div>
          <div className="stat-card">
            <strong>Profile & History</strong>
            <p>Track your progress and personal details in one place.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;