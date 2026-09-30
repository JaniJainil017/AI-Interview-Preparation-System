import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { Bot, BrainCircuit, Mic, TimerReset } from "lucide-react";
import "./Interview.css";
import "./Pages.css";

function Interview({ resumeText, saveReport, profile }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [timer, setTimer] = useState(300);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isEvaluationVisible, setIsEvaluationVisible] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [finalReport, setFinalReport] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!question || feedback) return;
    if (timer <= 0) {
      setFeedback("Time is up. Submit your answer or generate a new question.");
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [question, feedback, timer]);

  useEffect(() => {
    if (!answer.trim()) {
      setScore(0);
      return;
    }

    const words = answer.trim().split(/\s+/).length;
    const computed = Math.min(100, Math.round(words * 1.8 + (answer.length > 120 ? 18 : 8)));
    setScore(computed);
  }, [answer]);

  useEffect(() => () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60).toString().padStart(2, "0");
    const seconds = (value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const parseQuestionPayload = (text) => {
    const lines = text.split(/\r?\n/);
    const questionNumberMatch = text.match(/Question Number:\s*(\d+)/i);
    const categoryLine = lines.find((line) => line.toLowerCase().startsWith("category:"));
    const difficultyLine = lines.find((line) => line.toLowerCase().startsWith("difficulty:"));
    const questionLineIndex = lines.findIndex((line) => line.toLowerCase().startsWith("question:"));
    const questionText = questionLineIndex >= 0
      ? lines.slice(questionLineIndex + 1).join(" ").trim()
      : text.trim();

    return {
      questionNumber: Number(questionNumberMatch?.[1] || 1),
      category: (categoryLine?.split(":")[1] || "Technical").trim(),
      difficulty: (difficultyLine?.split(":")[1] || "Medium").trim(),
      questionText,
    };
  };

  const extractSectionItems = (text, heading) => {
    const regex = new RegExp(String.raw`${heading}:\s*([\s\S]*?)(?=\n\n[A-Za-z ]+:|$)`, "i");
    const match = text.match(regex);

    if (!match) return [];

    return match[1]
      .split("\n")
      .map((item) => item.replace(/^-\s*/, "").trim())
      .filter(Boolean);
  };
  const parseQuestionScore = (feedbackText) => {
    const scoreMatch = feedbackText.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    return scoreMatch ? Number(scoreMatch[1]) : 0;
  };
  const getRecommendation = (averageScore) => {
    if (averageScore >= 80) {
      return "Excellent overall performance. Keep refining your answers with sharper examples and stronger structure.";
    }

    if (averageScore >= 60) {
      return "Good progress overall. Focus on clarity, crisp technical depth, and more real-world examples to improve consistency.";
    }

    return "Your fundamentals are promising. Work on a more structured response style, stronger technical explanations, and more confident scenarios.";
  };

  const isSessionComplete = questionIndex >= 5;

  let sessionButtonLabel = "Start Interview";
  if (loading) {
    sessionButtonLabel = "Starting...";
  } else if (isSessionComplete) {
    sessionButtonLabel = "Interview Complete";
  } else if (questionIndex > 0) {
    sessionButtonLabel = "Next Question";
  }

  const generateQuestion = async () => {
    if (!resumeText) {
      alert("Please upload your resume first.");
      return;
    }

    if (questionIndex >= 5) {
      alert("Interview complete. Reset the session to start again.");
      return;
    }

    setLoading(true);

    try {
      const nextIndex = questionIndex + 1;
      const response = await axios.post("http://localhost:5000/generate-question", {
        resumeText,
        questionIndex: nextIndex,
        previousQuestions: questionHistory,
      });

      setQuestion(response.data.question);
      setAnswer("");
      setFeedback("");
      setLiveTranscript("");
      setScore(0);
      setQuestionIndex(nextIndex);
      setQuestionHistory((prev) => [...prev, response.data.question]);
      setIsEvaluationVisible(false);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Question generation failed. Check that the server and Ollama are running.");
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!question) {
      alert("Generate a question first.");
      return;
    }

    if (!answer.trim()) {
      alert("Please write your answer before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/evaluate-answer", {
        question,
        answer,
      });

      const result = response.data.result;
      const match = result.match(/Score:\s*(\d{1,3})/i);
      const parsedScore = match ? Number(match[1]) : Math.max(0, Math.min(100, score));
      const user = JSON.parse(localStorage.getItem("ai-interview-user") || "null");

      if (user?.email) {
        await axios.post("http://localhost:5000/interviews", {
          userEmail: user.email,
          question,
          answer,
          feedback: result,
          score: parsedScore,
        });
      }

      setFeedback(result);
      setScore(parsedScore);
      setSessionResults((prev) => [...prev, { question, answer, score: parsedScore, feedback: result }]);
      setIsEvaluationVisible(true);
      saveReport({
        id: Date.now(),
        question,
        answer,
        feedback: result,
        score: parsedScore,
        timestamp: new Date().toLocaleString(),
      });
    } catch (error) {
      console.log(error);
      alert("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (type) => {
    if (!finalReport) return;

    const fileName = type === "pdf" ? "interview-report.pdf" : "interview-report.docx";
    const candidateName = finalReport.candidateName || profile?.name || "Candidate";
    const dateText = finalReport.date || new Date().toLocaleDateString("en-GB");
    const questionLines = finalReport.questionResults.flatMap((questionResult) => [
      `Question ${questionResult.questionNumber}`,
      `Score: ${questionResult.score}/10`,
      "Strengths:",
      ...questionResult.strengths.map((item) => `• ${item}`),
      "Weaknesses:",
      ...questionResult.weaknesses.map((item) => `• ${item}`),
      "--------------------------------",
    ]);

    const lines = [
      "AI Interview Report",
      `Candidate: ${candidateName}`,
      `Date: ${dateText}`,
      `Total Score : ${finalReport.totalScore} / 50`,
      `Average Score : ${finalReport.averageScore} / 10`,
      "--------------------------------",
      ...questionLines,
      "================================",
      "",
      "Overall Feedback",
      finalReport.feedback,
      "",
      "Overall Strengths",
      ...finalReport.strengths.map((item) => `• ${item}`),
      "",
      "Overall Weaknesses",
      ...finalReport.weaknesses.map((item) => `• ${item}`),
      "",
      "Recommendation",
      finalReport.recommendation,
    ];

    if (type === "pdf") {
      const pdf = new jsPDF();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("AI Interview Report", 14, 18);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      let cursor = 32;

      lines.forEach((line) => {
        const trimmed = String(line || "").trim();
        if (!trimmed) {
          cursor += 7;
          return;
        }

        const wrapped = pdf.splitTextToSize(trimmed, 180);
        pdf.text(wrapped, 14, cursor);
        cursor += wrapped.length * 7 + 2;

        if (cursor > 280) {
          pdf.addPage();
          cursor = 18;
        }
      });

      pdf.save(fileName);
      return;
    }

    const doc = new Document({
      sections: [{
        children: lines.map((line) => new Paragraph({ text: line })),
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const finishInterview = () => {
    const results = sessionResults.length ? sessionResults : [{ score, feedback }];
    const questionResults = results.map((item, index) => {
      const strengths = extractSectionItems(item.feedback || "", "Strengths");
      const weaknesses = extractSectionItems(item.feedback || "", "Weaknesses");

      return {
        questionNumber: index + 1,
        score: Number(item.score || parseQuestionScore(item.feedback || "")),
        strengths,
        weaknesses,
        feedback: item.feedback || "",
      };
    });

    const totalScore = questionResults.reduce((sum, item) => sum + Number(item.score || 0), 0);
    const averageScore = Number((totalScore / Math.max(questionResults.length, 1)).toFixed(1));
    const overallFeedback = questionResults.map((item) => item.feedback).filter(Boolean).join("\n\n");
    const strengths = [...new Set(questionResults.flatMap((item) => item.strengths))];
    const weaknesses = [...new Set(questionResults.flatMap((item) => item.weaknesses))];
    const recommendation = getRecommendation(averageScore);

    let performanceLevel = "Needs Improvement";
    if (averageScore >= 8) {
      performanceLevel = "Excellent";
    } else if (averageScore >= 6) {
      performanceLevel = "Good";
    }

    const report = {
      id: Date.now(),
      candidateName: profile?.name || "Candidate",
      date: new Date().toLocaleDateString("en-GB"),
      overallScore: averageScore,
      totalScore,
      averageScore,
      feedback: overallFeedback || feedback,
      strengths,
      weaknesses,
      recommendation,
      performanceLevel,
      questionResults,
      questionsAnswered: results.length,
      timestamp: new Date().toLocaleString(),
    };

    setFinalReport(report);
    saveReport(report);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setLiveTranscript(transcript);
      setAnswer((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript));
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const parsedQuestion = parseQuestionPayload(question);
  const displayQuestionNumber = parsedQuestion.questionNumber || Math.max(1, Math.min(questionIndex, 5));
  const progressValue = Math.round((questionIndex / 5) * 100);
  const timerProgress = Math.round((timer / 300) * 100);

  return (
    <div className="interview-page">
      <div className="interview-shell">
        <header className="interview-header">
          <div>
            <p className="eyebrow">Interview Session</p>
            <h1>{profile?.name || "Candidate"}</h1>
            <p className="subtitle">
              Resume-based interview flow with one question at a time.
            </p>
          </div>

          <div className="resume-pill">
            <span>Resume Loaded</span>
            <strong>{resumeText ? "✅" : "Upload a resume first"}</strong>
          </div>
        </header>

        <div className="grid">
          <section className="panel">
            <h2>Session controls</h2>

            <div className="interview-stats">
              <div className="metric-box">
                <span>Timer</span>
                <div className="progress-ring-wrap">
                  <div className="timer-ring" style={{ "--timer-progress": timerProgress }}>
                    <div className="timer-value">{formatTime(timer)}</div>
                  </div>
                </div>
              </div>
              <div className="metric-box">
                <span>Progress</span>
                <div className="progress-ring-wrap">
                  <div className="progress-ring" style={{ "--progress": progressValue }}>
                    <div className="progress-ring-text">{progressValue}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-box">
                <span>Live Score</span>
                <strong>{score}%</strong>
              </div>
              <div className="metric-box">
                <span>Question</span>
                <strong>{displayQuestionNumber} / 5</strong>
              </div>
            </div>

            <div className="progress-block">
              <div className="progress-label-row">
                <span>Question {displayQuestionNumber} of 5</span>
                <span>{progressValue}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressValue}%` }} />
              </div>
            </div>

            <div className="button-row">
              <button className="primary-btn" onClick={generateQuestion} disabled={loading}>
                <BrainCircuit size={16} style={{ marginRight: 8 }} />
                {sessionButtonLabel}
              </button>
              <button className="secondary-btn" onClick={isListening ? stopVoiceInput : startVoiceInput}>
                {isListening ? <TimerReset size={16} style={{ marginRight: 8 }} /> : <Mic size={16} style={{ marginRight: 8 }} />}
                {isListening ? "Stop Voice" : "Start Voice"}
              </button>
            </div>
          </section>

          <section className="panel">
            <h2>Interview Question</h2>

            {question ? (
              <div className="question-box">
                <div className="question-meta">
                  <span>Question {displayQuestionNumber}</span>
                  <span>Category: {parsedQuestion.category}</span>
                  <span>Difficulty: {parsedQuestion.difficulty}</span>
                </div>
                <p>{parsedQuestion.questionText || question}</p>
              </div>
            ) : (
              <p className="empty-state">Generate a question to start practicing.</p>
            )}

            {liveTranscript && <p className="voice-preview">{liveTranscript}</p>}

            <textarea
              value={answer}
              placeholder="Write your answer here or use voice input..."
              onChange={(e) => setAnswer(e.target.value)}
              rows="10"
            />

            <div className="button-row">
              <button className="primary-btn" onClick={evaluateAnswer} disabled={loading}>
                <Bot size={16} style={{ marginRight: 8 }} />
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
              {isEvaluationVisible && questionIndex < 5 && (
                <button className="secondary-btn" onClick={generateQuestion} disabled={loading}>
                  {loading ? "Loading..." : "Next Question"}
                </button>
              )}
              {isEvaluationVisible && questionIndex >= 5 && (
                <button className="secondary-btn" onClick={finishInterview} disabled={loading}>
                  {loading ? "Generating..." : "Finish Interview"}
                </button>
              )}
              <button
                className="secondary-btn"
                onClick={() => {
                  setAnswer("");
                  setQuestion("");
                  setFeedback("");
                  setLiveTranscript("");
                  setScore(0);
                  setQuestionIndex(0);
                  setQuestionHistory([]);
                  setSessionResults([]);
                  setFinalReport(null);
                  setIsEvaluationVisible(false);
                  setTimer(300);
                }}
              >
                Reset
              </button>
            </div>
          </section>
        </div>

        {feedback && isEvaluationVisible && !finalReport && (
          <section className="panel feedback-panel">
            <h2>AI Evaluation</h2>
            <div className="metric-row">
              <div className="metric-box">
                <span>Score</span>
                <strong>{score}/10</strong>
              </div>
            </div>

            <div className="evaluation-items">
              <div>
                <h3>Strengths</h3>
                <ul>
                  {extractSectionItems(feedback, "Strengths").map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Weaknesses</h3>
                <ul>
                  {extractSectionItems(feedback, "Weaknesses").map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {finalReport && (
          <section className="panel feedback-panel report-completion-card">
            <h2>Interview Completed ✅</h2>
            <div className="metric-row">
              <div className="metric-box">
                <span>Total Score</span>
                <strong>{finalReport.totalScore}/50</strong>
              </div>
              <div className="metric-box">
                <span>Average Score</span>
                <strong>{finalReport.averageScore}/10</strong>
              </div>
            </div>

            <div className="button-row report-action-row">
              <button className="primary-btn" onClick={() => downloadReport("pdf")}>Download PDF Report</button>
              <button className="secondary-btn" onClick={() => downloadReport("docx")}>Download DOCX Report</button>
              <button className="secondary-btn" onClick={() => window.location.href = "/"}>Back to Dashboard</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Interview;
