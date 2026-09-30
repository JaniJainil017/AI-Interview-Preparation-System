from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Create presentation
prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(7.5)

# Define color scheme
TITLE_COLOR = RGBColor(0, 51, 102)  # Dark blue
ACCENT_COLOR = RGBColor(0, 102, 204)  # Light blue
TEXT_COLOR = RGBColor(51, 51, 51)  # Dark gray
WHITE = RGBColor(255, 255, 255)

def add_title_slide(prs, title, subtitle):
    """Add a title slide"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = TITLE_COLOR
    
    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.5), Inches(9), Inches(1.5))
    title_frame = title_box.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(54)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].font.color.rgb = WHITE
    title_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    
    # Subtitle
    subtitle_box = slide.shapes.add_textbox(Inches(0.5), Inches(4.2), Inches(9), Inches(1.5))
    subtitle_frame = subtitle_box.text_frame
    subtitle_frame.text = subtitle
    subtitle_frame.paragraphs[0].font.size = Pt(32)
    subtitle_frame.paragraphs[0].font.color.rgb = RGBColor(200, 200, 200)
    subtitle_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    
    return slide

def add_content_slide(prs, title, content_items):
    """Add a content slide with bullet points"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    
    # Title background bar
    title_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1))
    title_shape.fill.solid()
    title_shape.fill.fore_color.rgb = ACCENT_COLOR
    title_shape.line.color.rgb = ACCENT_COLOR
    
    # Title text
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.2), Inches(9), Inches(0.7))
    title_frame = title_box.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(40)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].font.color.rgb = WHITE
    
    # Content
    content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.4), Inches(5.5))
    text_frame = content_box.text_frame
    text_frame.word_wrap = True
    
    for i, item in enumerate(content_items):
        if i == 0:
            p = text_frame.paragraphs[0]
        else:
            p = text_frame.add_paragraph()
        
        p.text = item
        p.font.size = Pt(18)
        p.font.color.rgb = TEXT_COLOR
        p.level = 0
        p.space_before = Pt(6)
        p.space_after = Pt(6)
    
    return slide

def add_two_column_slide(prs, title, left_title, left_items, right_title, right_items):
    """Add a two-column content slide"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Title background bar
    title_shape = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1))
    title_shape.fill.solid()
    title_shape.fill.fore_color.rgb = ACCENT_COLOR
    title_shape.line.color.rgb = ACCENT_COLOR
    
    # Title text
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.2), Inches(9), Inches(0.7))
    title_frame = title_box.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(40)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].font.color.rgb = WHITE
    
    # Left column
    left_box = slide.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(4.5), Inches(6))
    left_frame = left_box.text_frame
    left_frame.word_wrap = True
    
    left_p = left_frame.paragraphs[0]
    left_p.text = left_title
    left_p.font.size = Pt(18)
    left_p.font.bold = True
    left_p.font.color.rgb = ACCENT_COLOR
    
    for item in left_items:
        p = left_frame.add_paragraph()
        p.text = item
        p.font.size = Pt(14)
        p.font.color.rgb = TEXT_COLOR
        p.space_before = Pt(4)
    
    # Right column
    right_box = slide.shapes.add_textbox(Inches(5.2), Inches(1.2), Inches(4.5), Inches(6))
    right_frame = right_box.text_frame
    right_frame.word_wrap = True
    
    right_p = right_frame.paragraphs[0]
    right_p.text = right_title
    right_p.font.size = Pt(18)
    right_p.font.bold = True
    right_p.font.color.rgb = ACCENT_COLOR
    
    for item in right_items:
        p = right_frame.add_paragraph()
        p.text = item
        p.font.size = Pt(14)
        p.font.color.rgb = TEXT_COLOR
        p.space_before = Pt(4)
    
    return slide

# Slide 1: Title Slide
add_title_slide(prs, "AI Interview System", "Existing System Overview & Architecture")

# Slide 2: Project Overview
add_content_slide(prs, "Project Overview", [
    "🎯 Purpose: AI-powered mock interview platform",
    "📊 Helps users practice interviews with AI feedback",
    "📄 Supports resume parsing and analysis",
    "🤖 Uses Ollama for AI-generated questions & feedback",
    "📈 Tracks performance metrics and progress"
])

# Slide 3: Architecture Overview
add_content_slide(prs, "System Architecture", [
    "Frontend: React 19 + Vite (Modern SPA)",
    "Backend: Express.js + Node.js",
    "Database: MongoDB (User & Interview Data)",
    "AI Engine: Ollama (Local LLM)",
    "File Handling: Multer (Resume Upload)",
    "PDF/DOCX Parsing: pdf-parse & mammoth"
])

# Slide 4: Tech Stack
add_two_column_slide(prs, "Technology Stack",
    "Frontend Technologies", [
        "• React 19.2.7",
        "• Vite (Build tool)",
        "• React Router DOM",
        "• Axios (HTTP client)",
        "• Recharts (Analytics)",
        "• Framer Motion (Animations)",
        "• jsPDF (Report generation)"
    ],
    "Backend Technologies", [
        "• Express.js",
        "• Node.js",
        "• MongoDB",
        "• Mongoose (ODM)",
        "• Multer (File upload)",
        "• pdf-parse (PDF parsing)",
        "• mammoth (DOCX parsing)",
        "• bcryptjs (Password hashing)"
    ]
)

# Slide 5: Core Features
add_content_slide(prs, "Core Features", [
    "✅ User Authentication (Signup/Login/Profiles)",
    "✅ Resume Upload & Parsing (PDF/DOCX support)",
    "✅ AI-Powered Interview Questions",
    "✅ Answer Submission & Analysis",
    "✅ Real-time AI Feedback & Scoring",
    "✅ Interview History & Dashboard",
    "✅ Performance Analytics & Reports",
    "✅ PDF Export Capabilities"
])

# Slide 6: Key Components - Frontend
add_content_slide(prs, "Frontend Components", [
    "📱 App.jsx - Main app shell, routing, auth state",
    "🏠 Home.jsx - Landing page",
    "🔐 Login.jsx & Signup.jsx - Authentication",
    "👤 Profile.jsx - User profile management",
    "📄 ResumeUpload.jsx - Resume upload interface",
    "💬 Interview.jsx - Interview question/answer UI",
    "📊 Dashboard.jsx - Analytics & history",
    "📈 Report.jsx - Performance reports"
])

# Slide 7: Key Components - Backend
add_content_slide(prs, "Backend Components", [
    "🔑 Authentication Endpoints",
    "   - /auth/signup - User registration",
    "   - /auth/login - User login",
    "   - /auth/profile - Get user profile",
    "",
    "📄 Resume Management",
    "   - /upload/resume - Upload resume file",
    "   - /parse/resume - Parse resume content",
    "",
    "💬 Interview Operations",
    "   - /interview/question - Get AI question",
    "   - /interview/submit-answer - Submit answer",
    "   - /interview/history - Get interview history"
])

# Slide 8: Database Schema
add_two_column_slide(prs, "Database Schema",
    "User Collection", [
        "• name: String",
        "• email: String (unique)",
        "• password: String (hashed)",
        "• createdAt: Date"
    ],
    "Interview Collection", [
        "• userEmail: String",
        "• question: String",
        "• answer: String",
        "• feedback: String",
        "• score: Number",
        "• timestamp: Date"
    ]
)

# Slide 9: Data Flow
add_content_slide(prs, "Typical User Journey", [
    "1️⃣  User Signs Up → Password hashed & stored in MongoDB",
    "2️⃣  User Logs In → Session/Token created",
    "3️⃣  Uploads Resume → File parsed (PDF/DOCX extraction)",
    "4️⃣  Requests Question → Backend calls Ollama AI API",
    "5️⃣  AI Generates Question → Based on resume content",
    "6️⃣  User Answers → Submitted to backend",
    "7️⃣  Ollama Analyzes → AI generates feedback & score",
    "8️⃣  Results Stored → History saved in MongoDB",
    "9️⃣  Dashboard Shows → Analytics & progress tracking"
])

# Slide 10: Current Strengths
add_content_slide(prs, "System Strengths ✅", [
    "✓ Modern React architecture with Vite",
    "✓ Scalable Express.js backend",
    "✓ Document parsing capabilities (PDF/DOCX)",
    "✓ Integrated AI feedback system",
    "✓ Responsive UI with animations",
    "✓ Performance tracking & analytics",
    "✓ Production-ready MongoDB setup"
])

# Slide 11: Current Issues
add_content_slide(prs, "Maintenance Issues ⚠️", [
    "❌ No proper JWT/Token authentication",
    "❌ Hard-coded host URLs & Ollama paths",
    "❌ Monolithic server code (all in index.js)",
    "❌ Limited input validation & error handling",
    "❌ No automated tests or test suites",
    "❌ Missing CI/CD pipeline",
    "❌ Minimal API documentation",
    "❌ No logging or monitoring system"
])

# Slide 12: Recommendations
add_content_slide(prs, "Recommended Improvements 📈", [
    "🔧 Implement JWT/Session-based authentication",
    "🔧 Add environment configuration (.env files)",
    "🔧 Modularize server code (routes/controllers/models)",
    "🔧 Implement comprehensive error handling",
    "🔧 Add unit & integration tests",
    "🔧 Set up CI/CD pipeline (GitHub Actions)",
    "🔧 Add API documentation (Swagger/OpenAPI)",
    "🔧 Implement logging & monitoring"
])

# Slide 13: Deployment Architecture
add_content_slide(prs, "Deployment Recommendations", [
    "☁️ Frontend: Deploy to Vercel/Netlify/AWS S3",
    "☁️ Backend: Deploy to Heroku/AWS EC2/Railway",
    "☁️ Database: MongoDB Atlas (Cloud)",
    "☁️ AI Engine: Ollama on dedicated GPU server",
    "☁️ CDN: CloudFlare for static assets",
    "☁️ SSL/HTTPS: Enable for security",
    "☁️ Environment variables: Use secrets manager"
])

# Slide 14: Security Considerations
add_content_slide(prs, "Security Checklist 🔒", [
    "🔐 Implement password hashing (bcryptjs ✓)",
    "🔐 Add JWT token expiration",
    "🔐 Validate all user inputs",
    "🔐 Implement CORS properly",
    "🔐 Rate limiting on API endpoints",
    "🔐 Secure file upload handling",
    "🔐 Environment variables for secrets",
    "🔐 HTTPS/TLS encryption"
])

# Slide 15: Performance Optimization
add_content_slide(prs, "Performance Optimization", [
    "⚡ Database indexing on email fields",
    "⚡ Caching strategies (Redis optional)",
    "⚡ Frontend code splitting with Vite",
    "⚡ Lazy loading of components",
    "⚡ API response pagination",
    "⚡ Gzip compression on responses",
    "⚡ CDN for static assets",
    "⚡ Database query optimization"
])

# Slide 16: Roadmap
add_content_slide(prs, "Development Roadmap", [
    "Phase 1: Refactoring & Architecture",
    "  • Modularize code, add authentication",
    "",
    "Phase 2: Testing & Quality",
    "  • Add tests, linting, documentation",
    "",
    "Phase 3: Deployment & DevOps",
    "  • CI/CD setup, cloud deployment",
    "",
    "Phase 4: Features & Scaling",
    "  • New features, performance optimization, monitoring"
])

# Slide 17: Conclusion
add_content_slide(prs, "Conclusion", [
    "✨ AI Interview System is a solid foundation",
    "📊 Core features are well-implemented",
    "🔧 Requires architectural improvements",
    "🚀 Ready for modernization & scaling",
    "💡 Potential for significant enhancement",
    "",
    "📌 Next Steps:",
    "  1. Prioritize refactoring",
    "  2. Add comprehensive tests",
    "  3. Deploy to production",
    "  4. Gather user feedback & iterate"
])

# Slide 18: Q&A
slide = prs.slides.add_slide(prs.slide_layouts[6])
background = slide.background
fill = background.fill
fill.solid()
fill.fore_color.rgb = TITLE_COLOR

qa_box = slide.shapes.add_textbox(Inches(0.5), Inches(3), Inches(9), Inches(1.5))
qa_frame = qa_box.text_frame
qa_frame.text = "Questions & Discussion"
qa_frame.paragraphs[0].font.size = Pt(54)
qa_frame.paragraphs[0].font.bold = True
qa_frame.paragraphs[0].font.color.rgb = WHITE
qa_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

# Save presentation
output_path = 'AI_Interview_System_Existing_System_Overview.pptx'
prs.save(output_path)
print(f"✅ PowerPoint presentation created: {output_path}")
print(f"📊 Total slides: {len(prs.slides)}")
