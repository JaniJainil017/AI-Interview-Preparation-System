from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt


prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

RED = RGBColor(224, 25, 39)
DEEP_RED = RGBColor(169, 12, 25)
INK = RGBColor(42, 23, 17)
GRAY = RGBColor(100, 100, 100)
PALE = RGBColor(250, 246, 244)
WHITE = RGBColor(255, 255, 255)
FONT = "Aptos"


def textbox(slide, x, y, w, h, text, size=18, color=INK, bold=False,
            align=PP_ALIGN.LEFT, font=FONT):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.margin_left = Inches(.03)
    tf.margin_right = Inches(.03)
    tf.margin_top = Inches(.02)
    tf.margin_bottom = Inches(.02)
    for i, line in enumerate(text.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.alignment = align
        p.font.name = font
        p.font.size = Pt(size)
        p.font.bold = bold
        p.font.color.rgb = color
        p.space_after = Pt(7)
    return box


def shape(slide, kind, x, y, w, h, color, transparency=0):
    s = slide.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid()
    s.fill.fore_color.rgb = color
    s.fill.transparency = transparency
    s.line.fill.background()
    return s


def footer(slide, page):
    # Geometric red band inspired by the supplied university slide.
    shape(slide, MSO_SHAPE.RECTANGLE, 0, 7.12, 13.333, .38, DEEP_RED)
    shape(slide, MSO_SHAPE.PARALLELOGRAM, 0, 7.12, 4.2, .38, RED)
    shape(slide, MSO_SHAPE.PARALLELOGRAM, 2.9, 7.12, 3.0, .38, RGBColor(196, 24, 39))
    textbox(slide, .45, 7.18, 5.5, .17, "AI INTERVIEW SYSTEM  |  PROJECT PRESENTATION", 8, WHITE, True)
    textbox(slide, 11.95, 7.15, .9, .2, f"{page:02d}", 9, WHITE, True, PP_ALIGN.RIGHT)
    textbox(slide, 8.4, 6.62, 4.5, .36, "Ganpat University", 21, RED, True, PP_ALIGN.RIGHT)


def base(title, section, page):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = WHITE
    shape(slide, MSO_SHAPE.RECTANGLE, 0, 0, 13.333, .22, RED)
    shape(slide, MSO_SHAPE.PARALLELOGRAM, 8.4, 0, 4.93, .22, DEEP_RED)
    # University-style top masthead
    textbox(slide, 8.15, .34, 4.7, .3, "A SOCIALLY RESPONSIBLE UNIVERSITY", 11, GRAY, True, PP_ALIGN.RIGHT)
    shape(slide, MSO_SHAPE.RECTANGLE, .48, .36, 1.0, .9, RED)
    textbox(slide, .52, .48, .92, .62, "Ganpat\nUniversity", 13, WHITE, True, PP_ALIGN.CENTER)
    textbox(slide, 1.72, 1.42, 10.0, .3, section.upper(), 10, RED, True, PP_ALIGN.CENTER)
    textbox(slide, 1.1, 1.77, 11.1, .7, title, 31, INK, True, PP_ALIGN.CENTER)
    shape(slide, MSO_SHAPE.RECTANGLE, 5.65, 2.55, 2.0, .055, RED)
    footer(slide, page)
    return slide


def card(slide, x, y, w, h, heading, body, accent=RED, body_size=17):
    c = shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h, PALE)
    c.line.color.rgb = RGBColor(238, 222, 218)
    shape(slide, MSO_SHAPE.RECTANGLE, x, y + .12, .07, h - .24, accent)
    textbox(slide, x + .25, y + .2, w - .5, .38, heading, 16, accent, True)
    textbox(slide, x + .25, y + .72, w - .5, h - .88, body, body_size, INK)


def bullets(slide, x, y, w, h, title, items, size=17):
    card(slide, x, y, w, h, title, "\n".join("•  " + item for item in items), RED, size)


# 1: Cover
s = prs.slides.add_slide(prs.slide_layouts[6])
s.background.fill.solid(); s.background.fill.fore_color.rgb = WHITE
shape(s, MSO_SHAPE.RECTANGLE, 0, 0, 13.333, .36, RED)
shape(s, MSO_SHAPE.PARALLELOGRAM, 7.7, 0, 5.63, .36, DEEP_RED)
shape(s, MSO_SHAPE.RECTANGLE, .5, .6, 1.25, 1.05, RED)
textbox(s, .55, .75, 1.15, .72, "Ganpat\nUniversity", 16, WHITE, True, PP_ALIGN.CENTER)
textbox(s, 8.25, .72, 4.55, .3, "A SOCIALLY RESPONSIBLE UNIVERSITY", 11, GRAY, True, PP_ALIGN.RIGHT)
shape(s, MSO_SHAPE.OVAL, 9.1, 1.65, 3.35, 3.35, PALE)
shape(s, MSO_SHAPE.OVAL, 10.05, 2.58, 1.55, 1.55, RED)
textbox(s, 1.15, 2.05, 7.9, 1.25, "AI Interview\nSystem", 42, INK, True)
textbox(s, 1.2, 4.02, 7.5, .5, "Resume-driven mock interviews with AI feedback", 20, GRAY)
shape(s, MSO_SHAPE.RECTANGLE, 1.2, 4.82, 2.0, .07, RED)
textbox(s, 1.2, 5.15, 7.6, .55, "PROJECT PRESENTATION", 14, RED, True)
shape(s, MSO_SHAPE.RECTANGLE, 0, 7.12, 13.333, .38, DEEP_RED)
shape(s, MSO_SHAPE.PARALLELOGRAM, 0, 7.12, 5.2, .38, RED)
textbox(s, .55, 7.19, 5.5, .17, "AI INTERVIEW SYSTEM", 8, WHITE, True)
textbox(s, 8.6, 7.17, 4.1, .2, "Ganpat University", 12, WHITE, True, PP_ALIGN.RIGHT)

# 2: Problem and purpose
s = base("The Interview Practice Gap", "Project Overview", 2)
textbox(s, 1.0, 2.88, 11.3, .55,
        "Candidates need a practical way to rehearse, receive feedback and improve at their own pace.", 20, INK, True, PP_ALIGN.CENTER)
bullets(s, .85, 3.75, 5.65, 2.35, "The challenge", [
    "Interview practice can be difficult to arrange",
    "Feedback may not be immediate or consistent",
    "Generic questions can miss a candidate’s experience",
], 15)
bullets(s, 6.8, 3.75, 5.65, 2.35, "Our approach", [
    "Use the uploaded resume as interview context",
    "Generate questions and feedback with a local AI model",
    "Keep past interview results available in a dashboard",
], 15)

# 3: Objectives
s = base("Project Objectives", "Project Overview", 3)
items = [
    ("Personalize", "Use resume content to guide interview questions."),
    ("Practice", "Offer a browser-based question and answer workflow."),
    ("Coach", "Return AI feedback, a score and improvement suggestions."),
    ("Track", "Save interview records and show progress in the dashboard."),
]
for i, (h, b) in enumerate(items):
    col, row = i % 2, i // 2
    card(s, 1.05 + col * 5.95, 3.0 + row * 1.55, 5.4, 1.25, h, b, RED, 15)

# 4: Architecture
s = base("System Architecture", "Solution Design", 4)
layers = [
    ("01  USER INTERFACE", "React 19 + Vite\nPages for account, resume, interview and dashboard", RED),
    ("02  APPLICATION API", "Node.js + Express\nREST endpoints, upload handling and AI requests", DEEP_RED),
    ("03  DATA + AI", "MongoDB + Mongoose\nOllama local model; PDF/DOCX text extraction", RGBColor(133, 63, 54)),
]
for i, (head, body, color) in enumerate(layers):
    y = 2.95 + i * 1.12
    card(s, 2.0, y, 9.3, .88, head, body, color, 13)
    if i < 2:
        textbox(s, 6.35, y + .84, .6, .28, "↓", 20, RED, True, PP_ALIGN.CENTER)

# 5: Workflow
s = base("How an Interview Works", "User Journey", 5)
steps = [
    ("01", "Create account", "Sign up or sign in"),
    ("02", "Upload resume", "PDF or DOCX text is extracted"),
    ("03", "Answer questions", "AI asks staged interview questions"),
    ("04", "Review feedback", "See score and improvement guidance"),
    ("05", "Track progress", "Review saved history and reports"),
]
for i, (n, h, b) in enumerate(steps):
    y = 2.88 + i * .72
    shape(s, MSO_SHAPE.OVAL, 1.05, y, .48, .48, RED)
    textbox(s, 1.08, y + .1, .42, .22, n, 9, WHITE, True, PP_ALIGN.CENTER)
    textbox(s, 1.85, y, 2.7, .34, h, 17, INK, True)
    textbox(s, 4.7, y, 7.5, .38, b, 16, GRAY)
    if i < len(steps) - 1:
        shape(s, MSO_SHAPE.RECTANGLE, 1.27, y + .46, .035, .27, RGBColor(238, 190, 188))

# 6: Features
s = base("Core Features", "What the System Offers", 6)
bullets(s, .9, 2.95, 5.65, 3.15, "Candidate experience", [
    "Account signup and login",
    "Resume upload and text extraction",
    "AI-generated interview questions",
    "Answer submission and feedback",
], 16)
bullets(s, 6.8, 2.95, 5.65, 3.15, "Review and reporting", [
    "Score and improvement suggestions",
    "Saved interview history",
    "Dashboard performance view",
    "Downloadable report support in the client",
], 16)

# 7: Technology
s = base("Technology Stack", "Implementation", 7)
stack = [
    ("Frontend", "React 19\nVite\nReact Router", RED),
    ("Backend", "Node.js\nExpress\nAxios", DEEP_RED),
    ("Data", "MongoDB\nMongoose\nBcryptJS", RGBColor(133, 63, 54)),
    ("AI & files", "Ollama\nMulter\nPDF / DOCX parsing", RED),
]
for i, (h, b, c) in enumerate(stack):
    card(s, .78 + i * 3.15, 3.1, 2.75, 2.2, h, b, c, 17)
textbox(s, 1.1, 5.75, 11.0, .35,
        "The language model runs through Ollama on the configured local machine.", 14, GRAY, False, PP_ALIGN.CENTER)

# 8: Data and security
s = base("Data Handling & Security", "Implementation", 8)
bullets(s, .9, 3.0, 5.65, 3.05, "Stored records", [
    "User name, email and hashed password",
    "Interview question and submitted answer",
    "Feedback, score and timestamp",
    "Resume files are handled through upload storage",
], 15)
bullets(s, 6.8, 3.0, 5.65, 3.05, "Current safeguards", [
    "Passwords are hashed with bcryptjs",
    "Resume upload has a 5 MB size limit",
    "Signup and login validate required fields",
    "Further access controls and validation are future work",
], 15)

# 9: Testing plan and limitations
s = base("Validation Plan & Next Steps", "Evaluation", 9)
bullets(s, .9, 2.95, 5.65, 3.2, "Key journeys to validate", [
    "Signup, login and invalid credentials",
    "PDF/DOCX upload and unsupported files",
    "Question generation and answer evaluation",
    "History, dashboard and report output",
], 15)
bullets(s, 6.8, 2.95, 5.65, 3.2, "Recommended improvements", [
    "Add automated unit and end-to-end tests",
    "Strengthen authentication and API authorization",
    "Move service URLs and secrets into configuration",
    "Add monitoring, accessibility and deployment setup",
], 15)
textbox(s, 1.0, 6.28, 11.0, .25,
        "This slide outlines a validation plan; it does not claim test execution results.", 10, GRAY, False, PP_ALIGN.CENTER)

# 10: Conclusion
s = base("Conclusion", "Project Outcome", 10)
textbox(s, 1.35, 3.05, 10.6, .65,
        "A single workflow connects resume context, interview practice and actionable AI feedback.",
        23, INK, True, PP_ALIGN.CENTER)
textbox(s, 1.6, 4.15, 10.0, .72,
        "The current system provides a useful foundation for candidate practice, with clear opportunities to improve testing, security and deployment readiness.",
        17, GRAY, False, PP_ALIGN.CENTER)

# 11: Thank you, matching the supplied closing-slide reference
s = prs.slides.add_slide(prs.slide_layouts[6])
s.background.fill.solid(); s.background.fill.fore_color.rgb = WHITE
shape(s, MSO_SHAPE.RECTANGLE, 0, 0, 13.333, .3, RED)
shape(s, MSO_SHAPE.PARALLELOGRAM, 5.1, 0, 8.23, .3, DEEP_RED)
textbox(s, 8.1, .42, 4.7, .3, "A SOCIALLY RESPONSIBLE UNIVERSITY", 11, GRAY, True, PP_ALIGN.RIGHT)
shape(s, MSO_SHAPE.RECTANGLE, .5, .6, 1.15, 1.1, RED)
textbox(s, .55, .77, 1.05, .7, "Ganpat\nUniversity", 14, WHITE, True, PP_ALIGN.CENTER)
textbox(s, 4.25, 1.72, 4.85, .3, "AI INTERVIEW SYSTEM", 11, GRAY, True, PP_ALIGN.CENTER)
textbox(s, 2.0, 2.85, 9.3, 1.2, "THANK YOU", 52, INK, True, PP_ALIGN.CENTER)
textbox(s, 3.2, 4.15, 6.9, .48, "Questions & Discussion", 19, GRAY, False, PP_ALIGN.CENTER)
shape(s, MSO_SHAPE.RECTANGLE, 0, 6.82, 13.333, .68, DEEP_RED)
shape(s, MSO_SHAPE.PARALLELOGRAM, 0, 6.82, 8.4, .68, RED)
shape(s, MSO_SHAPE.PARALLELOGRAM, 3.4, 6.82, 4.4, .68, RGBColor(197, 23, 39))
textbox(s, .55, 7.12, 5.5, .22, "AI INTERVIEW SYSTEM  |  PROJECT PRESENTATION", 9, WHITE, True)
textbox(s, 8.6, 6.98, 4.1, .42, "Ganpat University", 24, WHITE, True, PP_ALIGN.RIGHT)

prs.save("AI_Interview_System_Project_Presentation.pptx")
print(f"Created AI_Interview_System_Project_Presentation.pptx ({len(prs.slides)} slides)")
