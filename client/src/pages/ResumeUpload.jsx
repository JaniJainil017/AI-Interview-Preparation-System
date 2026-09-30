import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResumeUpload.css";

function ResumeUpload({ setResumeText }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadResume = async () => {
    if (!file) {
      setMessage("Please select a PDF or DOCX resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeText(response.data.text);
      setMessage("Resume uploaded successfully. Redirecting to interview practice...");
      navigate("/interview");
    } catch (error) {
      console.log(error);
      setMessage("Resume upload failed. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-card">
        <p className="eyebrow">Welcome</p>
        <h1>Upload your resume to begin</h1>
        <p className="description">
          Add a PDF or DOCX file and the AI will build a tailored interview experience around it.
        </p>

        <label className="upload-box">
          <span>{file ? file.name : "Choose a resume file"}</span>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button className="primary-btn" onClick={uploadResume} disabled={loading}>
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && (
          <p className={`status-message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;