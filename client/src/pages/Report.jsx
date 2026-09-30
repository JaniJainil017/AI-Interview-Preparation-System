import { Link } from "react-router-dom";
import "./Pages.css";

function Report({ latestReport }) {
  const overallScore = latestReport?.overallScore ?? latestReport?.score ?? 0;
  const performanceLevel = latestReport?.performanceLevel || "Good";
  const questionsAnswered = latestReport?.questionsAnswered ?? 10;
  const averageResponseTime = latestReport?.averageResponseTime || "1 min 20 sec";
  const communicationSkills = latestReport?.communicationSkills ?? 8;
  const technicalKnowledge = latestReport?.technicalKnowledge ?? 9;
  const confidence = latestReport?.confidence ?? 7;
  const problemSolving = latestReport?.problemSolving ?? 8;
  const strengths = latestReport?.strengths || [
    "Good knowledge of PHP & Laravel",
    "Explained projects clearly",
    "Good logical thinking",
  ];
  const areasToImprove = latestReport?.areasToImprove || [
    "Improve communication",
    "Give shorter and more structured answers",
    "Mention more real-world examples",
  ];
  const recommendedTopics = latestReport?.recommendedTopics || [
    "PHP OOP",
    "Laravel Authentication",
    "REST API",
    "MySQL Joins",
    "React Basics",
  ];
  const feedback = latestReport?.feedback || "You have a good understanding of backend development and your project explanations are clear. Focus on improving communication, confidence, and answer structure. With more mock interview practice, you can perform well in technical interviews.";

  const downloadReport = () => {
    if (!latestReport) return;

    const content = [
      "AI Interview Report",
      "",
      `Overall Score: ${overallScore}%`,
      `Performance Level: ${performanceLevel}`,
      `Questions Answered: ${questionsAnswered}`,
      `Average Response Time: ${averageResponseTime}`,
      `Communication Skills: ${communicationSkills}/10`,
      `Technical Knowledge: ${technicalKnowledge}/10`,
      `Confidence: ${confidence}/10`,
      `Problem Solving: ${problemSolving}/10`,
      "",
      "Strengths:",
      ...strengths.map((item) => `• ${item}`),
      "",
      "Areas to Improve:",
      ...areasToImprove.map((item) => `• ${item}`),
      "",
      "Recommended Topics:",
      ...recommendedTopics.map((item) => `• ${item}`),
      "",
      "AI Overall Feedback:",
      feedback,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interview-report.txt";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStars = (value) => "★".repeat(Math.max(1, Math.round(value / 2))) + "☆".repeat(5 - Math.max(1, Math.round(value / 2)));

  return (
    <div className="page-shell report-shell">
      <section className="page-card report-complete-card">
        <div className="report-hero">
          <p className="eyebrow">🎉 Interview Completed</p>
          <h1>Here is your final interview summary</h1>
          <p className="report-subtitle">A clean, resume-driven performance snapshot with strengths, weak points, and recommended next topics.</p>
        </div>

        {latestReport ? (
          <>
            <div className="report-overview">
              <div className="score-badge">
                <span className="score-label">Overall Score</span>
                <strong>{overallScore}%</strong>
              </div>

              <div className="performance-card">
                <span className="performance-level">Performance Level</span>
                <div className="performance-stars">{renderStars(overallScore)}</div>
                <p>{performanceLevel}</p>
              </div>
            </div>

            <div className="report-metrics-grid">
              <div className="metric-tile">
                <span>Questions Answered</span>
                <strong>{questionsAnswered} / 10</strong>
              </div>
              <div className="metric-tile">
                <span>Average Response Time</span>
                <strong>{averageResponseTime}</strong>
              </div>
              <div className="metric-tile">
                <span>Communication Skills</span>
                <strong>{communicationSkills}/10</strong>
              </div>
              <div className="metric-tile">
                <span>Technical Knowledge</span>
                <strong>{technicalKnowledge}/10</strong>
              </div>
              <div className="metric-tile">
                <span>Confidence</span>
                <strong>{confidence}/10</strong>
              </div>
              <div className="metric-tile">
                <span>Problem Solving</span>
                <strong>{problemSolving}/10</strong>
              </div>
            </div>

            <div className="report-detail-grid">
              <div className="report-detail-card">
                <h2>Strengths</h2>
                <ul>
                  {strengths.map((item) => (
                    <li key={item}>✔ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="report-detail-card">
                <h2>Areas to Improve</h2>
                <ul>
                  {areasToImprove.map((item) => (
                    <li key={item}>❌ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="report-detail-card">
                <h2>Recommended Topics</h2>
                <ul>
                  {recommendedTopics.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="report-detail-card feedback-card">
                <h2>AI Overall Feedback</h2>
                <p>“{feedback}”</p>
              </div>
            </div>

            <div className="report-actions">
              <button className="btn-primary" onClick={downloadReport}>📄 Download Report</button>
              <Link className="btn-secondary" to="/interview">🔄 Retake Interview</Link>
              <Link className="btn-secondary" to="/dashboard">🏠 Back to Dashboard</Link>
            </div>
          </>
        ) : (
          <p className="empty-state">Complete an interview first to create a report.</p>
        )}
      </section>
    </div>
  );
}

export default Report;