from fpdf import FPDF

summary = '''AI Interview System Maintenance Analysis

Project structure:
- client/: React + Vite frontend
- server/: Express backend + MongoDB + resume parsing
- uploads/: local resume storage

Key files:
- client/src/App.jsx: app shell, routing, auth state, history fetch
- client/src/pages/ResumeUpload.jsx: resume upload UI + backend upload call
- server/index.js: auth, resume upload, interview history, Ollama AI prompts
- client/package.json: frontend dependencies and Vite scripts
- server/package.json: backend dependencies

Maintenance issues:
1. No proper backend auth/token system
2. Hard-coded host URLs and Ollama path
3. Monolithic server/index.js
4. No tests or CI
5. Built-in modules incorrectly listed as dependencies in server package.json
6. Minimal validation and error handling

Recommendations:
- Add env config and remove hard-coded URLs
- Use JWT/session auth and protect API routes
- Modularize server code into routes/controllers
- Add tests and linting
- Fix package.json issues
'''

pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()
pdf.set_font('Arial', 'B', 16)
pdf.cell(0, 10, 'AI Interview System Maintenance Analysis', ln=True)
pdf.ln(5)
pdf.set_font('Arial', '', 12)
for line in summary.splitlines():
    if line.strip() == '':
        pdf.ln(3)
    else:
        pdf.multi_cell(0, 8, line)

output_path = 'AI_Interview_System_Maintenance_Analysis.pdf'
pdf.output(output_path)
print(output_path)
