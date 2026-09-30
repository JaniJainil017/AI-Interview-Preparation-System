import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bot, MoonStar, SunMedium } from "lucide-react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ResumeUpload from "./pages/ResumeUpload";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import "./pages/Pages.css";

const defaultProfile = {
  name: "",
  email: "",
  experience: "Beginner",
  goals: "Improve confidence and communication",
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -18 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const [resumeText, setResumeText] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("ai-interview-theme") || "dark";
  });
  const [authUser, setAuthUser] = useState(() => {
    if (typeof window === "undefined") return null;
    return JSON.parse(localStorage.getItem("ai-interview-user") || "null");
  });
  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") return defaultProfile;
    const stored = localStorage.getItem("ai-interview-profile");
    return stored ? JSON.parse(stored) : defaultProfile;
  });
  const [history, setHistory] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("ai-interview-history");
    return stored ? JSON.parse(stored) : [];
  });
  const [latestReport, setLatestReport] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("ai-interview-latest-report");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ai-interview-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ai-interview-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!authUser?.email) return;

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/interviews/${authUser.email}`);
        const records = response.data.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp).toLocaleString(),
        }));
        setHistory(records);
      } catch (error) {
        console.error("Failed to fetch interview history", error);
      }
    };

    fetchHistory();
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem("ai-interview-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (latestReport) {
      localStorage.setItem("ai-interview-latest-report", JSON.stringify(latestReport));
    }
  }, [latestReport]);

  const saveReport = (report) => {
    const nextHistory = [report, ...history].slice(0, 8);
    setHistory(nextHistory);
    setLatestReport(report);
  };

  const logout = () => {
    localStorage.removeItem("ai-interview-user");
    setAuthUser(null);
  };

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <Link to="/" className="brand">AI Interview Hub</Link>
        <div className="nav-links">
          {authUser ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/upload">Resume</Link>
              <Link to="/interview">Interview</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/report">Report</Link>
              <button className="ghost-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </button>
        </div>
      </nav>

      <button type="button" className="assistant-fab" aria-label="AI assistant">
        <Bot size={18} />
      </button>

      <Routes>
        <Route path="/" element={authUser ? <AnimatedPage><Home profile={profile} /></AnimatedPage> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!authUser ? <AnimatedPage><Login setAuthUser={setAuthUser} /></AnimatedPage> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!authUser ? <AnimatedPage><Signup setAuthUser={setAuthUser} /></AnimatedPage> : <Navigate to="/" replace />} />
        <Route path="/upload" element={authUser ? <AnimatedPage><ResumeUpload setResumeText={setResumeText} /></AnimatedPage> : <Navigate to="/login" replace />} />
        <Route path="/interview" element={authUser ? <AnimatedPage><Interview resumeText={resumeText} saveReport={saveReport} profile={profile} /></AnimatedPage> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={authUser ? <AnimatedPage><Dashboard history={history} profile={profile} latestReport={latestReport} /></AnimatedPage> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={authUser ? <AnimatedPage><Profile profile={profile} setProfile={setProfile} /></AnimatedPage> : <Navigate to="/login" replace />} />
        <Route path="/report" element={authUser ? <AnimatedPage><Report latestReport={latestReport} /></AnimatedPage> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;