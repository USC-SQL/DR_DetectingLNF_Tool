# 🔍 LNF Detector — WCAG 2.4.3 Navigation Analysis Tool

A tool for detecting **Linear Navigation Failures (LNF)** in webpages using screenshot input and LLM analysis.

This project evaluates whether keyboard navigation follows a **meaningful, logical order**, as required by WCAG 2.4.3 (Focus Order).

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
