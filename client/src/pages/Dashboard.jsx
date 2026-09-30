import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Award, Clock3, Sparkles } from "lucide-react";
import "./Pages.css";

function Dashboard({ history, profile, latestReport }) {
  const averageScore = history.length
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
    : 0;

  const chartData = history.slice(0, 6).reverse().map((item, index) => ({
    name: `S${index + 1}`,
    score: item.score || 0,
  }));

  return (
    <div className="page-shell dashboard-shell">
      <section className="hero-card hero-card-large">
        <div>
          <p className="eyebrow accent-text">Performance Dashboard</p>
          <h1>Track your progress</h1>
          <p className="hero-text">
            Review your latest interview sessions and monitor improvement over time.
          </p>
        </div>
        <div className="dashboard-summary">
          <div className="stat-pill">Smart AI insights for every session</div>
        </div>
      </section>

      <section className="page-card overview-grid">
        <div className="stat-card stat-glow">
          <div className="icon-pill"><Sparkles size={16} /></div>
          <strong>{profile?.name || "Student"}</strong>
          <p>Resume-based interview practice</p>
        </div>
        <div className="stat-card stat-glow">
          <div className="icon-pill"><Activity size={16} /></div>
          <strong>{history.length}</strong>
          <p>Interviews completed</p>
        </div>
        <div className="stat-card stat-glow">
          <div className="icon-pill"><Award size={16} /></div>
          <strong>{averageScore}%</strong>
          <p>Average score</p>
        </div>
        <div className="stat-card stat-glow">
          <div className="icon-pill"><Clock3 size={16} /></div>
          <strong>{latestReport?.score || 0}%</strong>
          <p>Latest score</p>
        </div>
      </section>

      <section className="page-card chart-card">
        <h2>Score trend</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="name" stroke="var(--muted)" />
              <YAxis domain={[0, 100]} stroke="var(--muted)" />
              <Tooltip />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="url(#scoreGradient)" />
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="page-card">
        <h2>Recent interview history</h2>
        {history.length ? (
          <ul className="history-list history-grid">
            {history.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>Interview Session</strong>
                  <p>{item.timestamp}</p>
                </div>
                <span className="pill pill-glow">{item.score}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No interview history yet. Complete your first session to see growth here.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;