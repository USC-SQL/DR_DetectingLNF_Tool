# 🔍 LNF Detector — WCAG 2.4.3 Analysis Tool

A tool for detecting **Linear Navigation Failures (LNF)** in webpages using screenshot input and LLM analysis.

This project evaluates whether keyboard navigation follows a **meaningful, logical order**, as required by WCAG 2.4.3 (Focus Order).

<img width="944" height="577" alt="image" src="https://github.com/user-attachments/assets/b6f3bf1e-83d0-4827-9d0b-b56e66a521c1" />


---

## Overview: How it works

1. User provides:
   - A **numbered screenshot** of a webpage (focus order labeled)
   - A **prompt file**

2. Backend:
   - Sends screenshot + prompt to an LLM
   - Reconstructs navigation flow
   - Detects Linear Navigation Failures

3. Frontend:
   - Built with React
   - Displays navigation transitions and flagged issues

---

## Installation & Setup
### Backend
Run `python app.py` 

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

### Example API Request

```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "image_file=@disneyworld.png" \
  -F "prompt_file=@prompt.txt" \
  -F "subject_name=Disney World" \
  -o output.json
```
