import { useState } from "react";
import "./Pages.css";

function Profile({ profile, setProfile }) {
  const [form, setForm] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(form);
  };

  return (
    <div className="page-shell profile-shell">
      <form className="page-card profile-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <p className="eyebrow accent-text">Student Profile</p>
            <h1>Update your profile</h1>
          </div>
          <span className="pill">Personalize your journey</span>
        </div>

        <p className="hero-text">Keep your interview preferences and goals in sync with your practice sessions.</p>

        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="field">
            <span>Experience</span>
            <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </label>
        </div>

        <label className="field">
          <span>Goals</span>
          <textarea rows="4" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
        </label>

        <button className="btn-primary login-submit" type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default Profile;