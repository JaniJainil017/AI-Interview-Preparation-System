import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Pages.css";

function Signup({ setAuthUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/signup", form);
      const user = response.data.user;
      localStorage.setItem("ai-interview-user", JSON.stringify(user));
      setAuthUser(user);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Signup failed.");
    }
  };

  return (
    <div className="landing-shell auth-shell">
      <div className="glass-card auth-card premium-auth-card">
        <p className="eyebrow accent-text">Welcome to AI Interview Hub</p>
        <h1>Create your account</h1>
        <p className="hero-text">Sign up to practice AI-powered interviews, resume review, and performance tracking.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span>Name</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>

          <label className="field">
            <span>Email</span>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>

          <button className="btn-primary login-submit" type="submit">Create Account</button>
          {message && <p className="status error">{message}</p>}

          <p className="helper-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;