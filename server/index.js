// 1. Imports
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:1b";
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 2. App Setup
const app = express();
app.use(cors());
app.use(express.json());

// 3. MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-interview";

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("Start MongoDB locally with: mongod --dbpath C:/data/db");
  });

// 4. Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// 5. Models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    question: String,
    answer: String,
    feedback: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Interview = mongoose.model("Interview", interviewSchema);

// Helper for Ollama generation with GPU auto-detection and CPU fallback
async function callOllama(prompt, customOptions = {}) {
    const defaultOptions = {
        ...(process.env.OLLAMA_NUM_GPU !== undefined ? { num_gpu: Number(process.env.OLLAMA_NUM_GPU) } : {}),
        ...customOptions
    };

    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: OLLAMA_MODEL,
            prompt,
            stream: false,
            options: defaultOptions
        });
        return response.data.response.trim();
    } catch (err) {
        const errMessage = err.response?.data?.error || err.message || "";
        if (/out of memory|cudaMalloc|unable to allocate CUDA|failed to allocate.*CUDA/i.test(errMessage)) {
            console.warn("GPU memory issue, falling back to CPU for Ollama...");
            const cpuResponse = await axios.post("http://localhost:11434/api/generate", {
                model: OLLAMA_MODEL,
                prompt,
                stream: false,
                options: { ...customOptions, num_gpu: 0 }
            });
            return cpuResponse.data.response.trim();
        }
        throw err;
    }
}

// 6. Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit safety net
});

// 7. Home Route
app.get("/", (req, res) => {
    res.send("AI Interview Server Running");
});

// 8. Auth Routes
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ success: true, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error("Signup error", error);
        res.status(500).json({ error: "Signup failed" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ success: true, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ error: "Login failed" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Users fetch error", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// 9. Resume Upload API
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    let extractedText = "";

    try {
        if (req.file.mimetype === "application/pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);
            extractedText = pdfData.text;
        } else if (
            req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else {
            return res.status(400).json({ error: "Only PDF and DOCX files are supported" });
        }

        res.json({
            success: true,
            text: extractedText.trim()
        });
    } catch (err) {
        console.error("Resume Parsing Error:", err);
        res.status(500).json({ error: "Failed to parse resume file" });
    } finally {
        // Clean up temporary file from uploads directory
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

// 10. Interview History Routes
app.post("/interviews", async (req, res) => {
    const { userEmail, question, answer, feedback, score } = req.body;

    if (!userEmail) {
        return res.status(400).json({ error: "userEmail is required" });
    }

    try {
        const savedInterview = await Interview.create({ userEmail, question, answer, feedback, score });
        res.status(201).json({ success: true, interview: savedInterview });
    } catch (error) {
        console.error("Interview save error", error);
        res.status(500).json({ error: "Failed to save interview" });
    }
});

app.get("/interviews/:email", async (req, res) => {
    try {
        const interviews = await Interview.find({ userEmail: req.params.email }).sort({ timestamp: -1 });
        res.json(interviews);
    } catch (error) {
        console.error("Interview fetch error", error);
        res.status(500).json({ error: "Failed to fetch interviews" });
    }
});

app.get("/interviews", async (req, res) => {
    try {
        const interviews = await Interview.find({}).sort({ timestamp: -1 });
        res.json(interviews);
    } catch (error) {
        console.error("Interview fetch error", error);
        res.status(500).json({ error: "Failed to fetch interviews" });
    }
});

// 11. Generate Question API (With optional resume context)
app.post("/generate-question", async (req, res) => {
    const { resumeText, questionIndex = 1, previousQuestions = [] } = req.body;

    if (!resumeText) {
        return res.status(400).json({ error: "Resume text is required" });
    }

    if (questionIndex < 1 || questionIndex > 5) {
        return res.status(400).json({ error: "questionIndex must be between 1 and 5" });
    }

    try {
        const categories = [
            "HR",
            "Project",
            "Technical",
            "Advanced Technical",
            "Scenario / Problem Solving"
        ];

        const category = categories[questionIndex - 1];
        const difficultyMap = {
            1: "Easy",
            2: "Medium",
            3: "Medium",
            4: "Hard",
            5: "Hard"
        };

        let prompt = `You are an expert AI Technical Interviewer with a professional HR + Technical interview style.\n\n`;
        prompt += `Your task is to conduct a realistic interview based only on the candidate's uploaded resume.\n\n`;
        prompt += `Instructions:\n`;
        prompt += `1. Analyze the resume carefully before asking any question.\n`;
        prompt += `2. Extract and remember the candidate's Name, Education, Technical Skills, Programming Languages, Frameworks, Databases, Projects, Internship/Experience, and Certifications.\n`;
        prompt += `3. Ask only resume-based questions.\n`;
        prompt += `4. This is interview turn ${questionIndex} of 5.\n`;
        prompt += `5. The current category must be ${category}.\n`;
        prompt += `6. Generate exactly one question and do not ask more than one question in this turn.\n`;
        prompt += `7. Do not repeat any previous questions. Previous questions: ${previousQuestions.join(" | ") || "None"}\n`;
        prompt += `8. The sequence must always be HR -> Project -> Technical -> Advanced Technical -> Scenario / Problem Solving.\n`;
        prompt += `9. Keep the conversation professional, structured, and interview-like.\n`;
        prompt += `10. Do not reveal the answer or provide hints unless the candidate explicitly requests them.\n\n`;
        prompt += `Response format:\n\n`;
        prompt += `Question Number: ${questionIndex}\n\n`;
        prompt += `Category:\n${category}\n\n`;
        prompt += `Difficulty:\n${difficultyMap[questionIndex]}\n\n`;
        prompt += `Question:\n<Ask only one interview question>\n\n`;

        if (resumeText) {
            prompt += `Candidate Resume Context:\n${resumeText.slice(0, 2000)}\n\n`;
        }

        prompt += `Generate the next question using the exact response format above.`;

        const question = await callOllama(prompt);

        res.json({
            question
        });
    } catch (error) {
        const ollamaError = error.response?.data?.error || error.message;
        console.error("Ollama Error:", ollamaError);
        const memoryError = /out of memory|failed to allocate|unable to allocate/i.test(ollamaError);
        res.status(500).json({
            error: memoryError
                ? `Ollama could not load ${OLLAMA_MODEL} because available memory is insufficient. Please check system resources.`
                : `Question generation failed: ${ollamaError}`
        });
    }
});

// 12. Evaluate Answer API
app.post("/evaluate-answer", async (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ error: "Question and answer are required" });
    }

    try {
        const prompt = `You are an expert technical interviewer evaluating a candidate's answer.\n\n` +
            `Use the question and the candidate's answer to score the response out of 10.\n` +
            `Provide strengths, weaknesses, and a concise improved answer suggestion.\n` +
            `Do not ask a new question. Do not include unrelated commentary.\n\n` +
            `Question:\n${question}\n\n` +
            `Candidate Answer:\n${answer}\n\n` +
            `Return strictly in this format:\n\n` +
            `Score: <0-10 score>\n\n` +
            `Strengths:\n- <Point 1>\n- <Point 2>\n\n` +
            `Weaknesses:\n- <Point 1>\n- <Point 2>\n\n` +
            `Suggested improved answer:\n<One concise improved answer>\n`;

        const text = await callOllama(prompt, { temperature: 0.2 });

        res.json({
            result: text
        });
    } catch (error) {
        console.error("Ollama Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Evaluation failed. Ensure Ollama is running." });
    }
});

// 13. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
