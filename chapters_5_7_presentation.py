from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE


prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

NAVY = RGBColor(12, 20, 42)
PANEL = RGBColor(22, 33, 61)
BLUE = RGBColor(72, 139, 255)
CYAN = RGBColor(83, 220, 222)
WHITE = RGBColor(244, 247, 255)
MUTED = RGBColor(177, 190, 215)
GREEN = RGBColor(106, 220, 170)
FONT = "Aptos"


def textbox(slide, x, y, w, h, text, size=18, color=WHITE, bold=False,
            font=FONT, align=PP_ALIGN.LEFT):
    shape = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.margin_left = Inches(0.02)
    tf.margin_right = Inches(0.02)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    for i, line in enumerate(text.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.alignment = align
        p.space_after = Pt(8)
        p.font.name = font
        p.font.size = Pt(size)
        p.font.bold = bold
        p.font.color.rgb = color
    return shape


def base(title, chapter, number):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = NAVY
    # Accent rule and page furniture
    rule = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(.10))
    rule.fill.solid(); rule.fill.fore_color.rgb = BLUE; rule.line.fill.background()
    textbox(slide, .62, .38, 5.0, .28, chapter.upper(), 10, CYAN, True)
    textbox(slide, .62, .78, 12.0, .65, title, 29, WHITE, True)
    textbox(slide, .62, 7.10, 8.0, .20, "AI INTERVIEW SYSTEM  •  PROJECT PRESENTATION", 8, MUTED, True)
    textbox(slide, 12.1, 7.08, .55, .22, f"{number:02d}", 9, MUTED, True, align=PP_ALIGN.RIGHT)
    return slide


def card(slide, x, y, w, h, heading, body, accent=BLUE, body_size=16):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                   Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid(); shape.fill.fore_color.rgb = PANEL
    shape.line.color.rgb = RGBColor(43, 61, 96)
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                 Inches(x), Inches(y+.18), Inches(.055), Inches(h-.36))
    bar.fill.solid(); bar.fill.fore_color.rgb = accent; bar.line.fill.background()
    textbox(slide, x+.25, y+.20, w-.48, .40, heading, 16, accent, True)
    textbox(slide, x+.25, y+.72, w-.48, h-.88, body, body_size, WHITE)


def bullet_card(slide, x, y, w, h, heading, items, accent=BLUE, size=16):
    card(slide, x, y, w, h, heading, "\n".join("•  " + item for item in items), accent, size)


# 1 — section opener
s = prs.slides.add_slide(prs.slide_layouts[6])
s.background.fill.solid(); s.background.fill.fore_color.rgb = NAVY
for x, y, d, c in [(9.4, .6, 2.7, PANEL), (10.35, 2.0, 1.8, BLUE), (8.6, 3.5, 1.1, CYAN)]:
    sh = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x), Inches(y), Inches(d), Inches(d))
    sh.fill.solid(); sh.fill.fore_color.rgb = c; sh.fill.transparency = 25
    sh.line.fill.background()
textbox(s, .85, .80, 4, .35, "AI INTERVIEW SYSTEM", 12, CYAN, True)
textbox(s, .85, 1.65, 8.7, 1.3, "System Testing,\nConclusion & References", 34, WHITE, True)
textbox(s, .88, 4.0, 7.2, .55, "Chapters 5–7  |  Project Presentation", 19, MUTED)
textbox(s, .88, 6.45, 6.5, .3, "Resume-driven mock interviews with AI feedback", 12, WHITE)

# 2 — testing scope
s = base("System Testing", "Chapter 5 · System Testing", 2)
textbox(s, .7, 1.62, 11.7, .45,
        "Testing checks whether the main user journeys work from the interface through the API and database.", 16, MUTED)
bullet_card(s, .7, 2.35, 5.8, 3.9, "Test coverage", [
    "Account registration and sign-in",
    "Resume upload and PDF/DOCX text extraction",
    "AI question generation and answer evaluation",
    "Interview history, dashboard and report views",
    "Required-field and unsupported-file responses",
], BLUE)
bullet_card(s, 6.8, 2.35, 5.8, 3.9, "Test environment", [
    "React + Vite browser client",
    "Node.js and Express API (port 5000 by default)",
    "MongoDB for user and interview records",
    "Ollama local model for questions and feedback",
    "PDF and DOCX sample resumes",
], CYAN)

# 3 — output tests
s = base("Output Testing", "Chapter 5 · 5.1.1", 3)
textbox(s, .7, 1.55, 12, .35, "Expected system output for representative input conditions", 15, MUTED)
headers = ["Scenario", "Input / action", "Expected output"]
rows = [
    ("Account creation", "Valid name, email and password", "Account created; success response; password stored as a hash"),
    ("Resume parsing", "PDF or DOCX within the 5 MB limit", "Extracted resume text returned for interview context"),
    ("Question generation", "Resume text and question number 1–5", "One question with category and difficulty returned"),
    ("Answer evaluation", "Question and non-empty answer", "Score, strengths, weaknesses and suggested answer returned"),
    ("Interview history", "Saved interview for a user email", "Record stored and returned in newest-first order"),
    ("Invalid input", "Missing fields / unsupported file", "Clear 400-level validation response"),
]
table = s.shapes.add_table(len(rows)+1, 3, Inches(.7), Inches(2.05), Inches(11.95), Inches(4.4)).table
table.columns[0].width = Inches(2.15); table.columns[1].width = Inches(3.4); table.columns[2].width = Inches(6.4)
for r, row in enumerate([headers] + [list(x) for x in rows]):
    for c, val in enumerate(row):
        cell = table.cell(r, c)
        cell.text = val
        cell.margin_left = Inches(.13); cell.margin_right = Inches(.1)
        cell.margin_top = Inches(.06); cell.margin_bottom = Inches(.04)
        cell.fill.solid(); cell.fill.fore_color.rgb = BLUE if r == 0 else PANEL
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        for p in cell.text_frame.paragraphs:
            p.font.name = FONT; p.font.size = Pt(11 if r else 12)
            p.font.bold = (r == 0 or c == 0)
            p.font.color.rgb = WHITE if r == 0 else (CYAN if c == 0 else WHITE)

# 4 — verification and validation
s = base("Validation and Verification Testing", "Chapter 5 · 5.1.2", 4)
card(s, .7, 1.7, 5.8, 2.0, "Verification — built correctly?",
     "Review API routes, required fields, password hashing, question limits (1–5), upload size (5 MB), and supported document types.", BLUE, 15)
card(s, 6.8, 1.7, 5.8, 2.0, "Validation — solves the user need?",
     "Walk through signup → resume upload → five interview questions → feedback → dashboard/report and confirm each result is understandable and useful.", CYAN, 15)
bullet_card(s, .7, 4.05, 5.8, 2.15, "Key checks", [
    "Missing resume or answer shows a prompt",
    "Invalid credentials do not sign the user in",
    "History is filtered by the signed-in email",
], GREEN, 14)
bullet_card(s, 6.8, 4.05, 5.8, 2.15, "Test result reporting", [
    "Record test case, input, expected and actual result",
    "Mark Pass / Fail and capture defects",
    "Run tests with MongoDB and Ollama available",
], CYAN, 14)
textbox(s, .8, 6.45, 11.5, .32,
        "Note: This section describes the project test plan; enter actual pass/fail results after executing the cases.", 11, MUTED)

# 5 — conclusion
s = base("Conclusion", "Chapter 6 · 6.1", 5)
textbox(s, .8, 1.65, 11.3, .72,
        "The project brings resume-based interview practice and AI-generated feedback into one web application.", 21, WHITE, True)
bullet_card(s, .8, 2.75, 5.7, 3.35, "What the system delivers", [
    "Signup and login with bcrypt password hashing",
    "PDF/DOCX resume text extraction",
    "Five staged, resume-context interview questions",
    "AI evaluation with score and improvement suggestions",
    "Saved interview history and performance dashboard",
], BLUE, 14)
bullet_card(s, 6.8, 2.75, 5.7, 3.35, "Project outcome", [
    "Provides a repeatable mock-interview workflow",
    "Connects a React frontend to an Express API",
    "Uses MongoDB for user and interview data",
    "Runs text generation locally through Ollama",
    "Offers a base for further testing and improvement",
], CYAN, 14)

# 6 — future work
s = base("Future Enhancements", "Chapter 6 · 6.2", 6)
items = [
    ("Security", "Add session/JWT authentication, authorization checks, rate limits and stronger upload validation."),
    ("Quality", "Create automated unit, API integration and end-to-end test suites."),
    ("Interview experience", "Add configurable roles, interview lengths, difficulty and more question types."),
    ("Accessibility", "Improve keyboard navigation, captions and support for assistive technologies."),
    ("Analytics", "Add clearer score trends, category-level feedback and downloadable PDF/DOCX reports."),
    ("Deployment", "Move configuration to environment settings and add production monitoring and backups."),
]
for i, (h, b) in enumerate(items):
    col, row = i % 2, i // 2
    card(s, .7 + col*6.1, 1.65 + row*1.62, 5.8, 1.38, h, b, BLUE if col == 0 else CYAN, 12)

# 7 — books
s = base("Books References", "Chapter 7 · 7.1", 7)
bullet_card(s, .8, 1.75, 11.8, 4.8, "Books consulted for software engineering concepts", [
    "Roger S. Pressman and Bruce R. Maxim, Software Engineering: A Practitioner’s Approach, 9th ed., McGraw Hill, 2019.",
    "Ian Sommerville, Software Engineering, 10th ed., Pearson, 2015.",
    "Martin Fowler, Refactoring: Improving the Design of Existing Code, 2nd ed., Addison-Wesley, 2018.",
    "Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship, Prentice Hall, 2008.",
], CYAN, 17)
textbox(s, .85, 6.75, 11.2, .25, "Use the editions available in your institution’s library when preparing the final written report.", 10, MUTED)

# 8 — web references
s = base("Web References", "Chapter 7 · 7.2", 8)
refs = [
    "React documentation — https://react.dev/learn",
    "Vite documentation — https://vite.dev/guide/",
    "Express documentation — https://expressjs.com/",
    "MongoDB documentation — https://www.mongodb.com/docs/",
    "Mongoose documentation — https://mongoosejs.com/docs/",
    "Ollama API documentation — https://github.com/ollama/ollama/blob/main/docs/api.md",
    "Multer documentation — https://github.com/expressjs/multer",
    "pdf-parse and Mammoth package documentation — https://www.npmjs.com/package/pdf-parse  |  https://www.npmjs.com/package/mammoth",
]
bullet_card(s, .8, 1.7, 11.8, 4.9, "Official and project-relevant documentation", refs, BLUE, 13)
textbox(s, .85, 6.75, 9.5, .25, "Accessed: 29 September 2026", 10, MUTED)

# 9 — closing
s = prs.slides.add_slide(prs.slide_layouts[6])
s.background.fill.solid(); s.background.fill.fore_color.rgb = NAVY
rule = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(.10))
rule.fill.solid(); rule.fill.fore_color.rgb = CYAN; rule.line.fill.background()
textbox(s, .9, 2.25, 11.5, .95, "Thank You", 42, WHITE, True, align=PP_ALIGN.CENTER)
textbox(s, 1.0, 3.35, 11.3, .55, "AI Interview System  |  Questions & Discussion", 18, MUTED, align=PP_ALIGN.CENTER)
textbox(s, .7, 7.08, 8, .2, "CHAPTERS 5–7", 9, MUTED, True)

prs.save("AI_Interview_System_Chapters_5_to_7.pptx")
