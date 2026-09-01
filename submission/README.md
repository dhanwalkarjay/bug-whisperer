# 📋 iQOO Hackathon 2026 — Phase 1 Submission

## What's in This Folder

| File | Purpose |
|------|---------|
| `pitch-deck.md` | Full 12-slide pitch deck (convert to PDF/PPT) |
| `submission-form.md` | Exact content to copy-paste into the form |

## How to Submit

### Step 1: Convert Pitch Deck to PDF/PPT

**Option A — Use Google Slides:**
1. Create a new Google Slides presentation
2. Copy each slide from `pitch-deck.md`
3. Add simple backgrounds (dark theme recommended)
4. Export as PDF

**Option B — Use Canva (recommended for design):**
1. Go to canva.com
2. Search "Hackathon Pitch Deck"
3. Copy content from each slide
4. Export as PDF

**Option C — Use Marp (Markdown to slides):**
```bash
npm install -g @marp-team/marp-cli
marp pitch-deck.md --pdf
```

### Step 2: Fill Out the Form

Go to [Pune Dashboard](https://iqoo.reskilll.com/dashboard/iqoo-pune) and fill:

1. **Idea Title:** `Bug Whisperer — AI Debugging Detective`
2. **Description:** Copy from `submission-form.md` → "Description" section
3. **Deck/Document:** Upload your PDF or paste a link
4. **Proficiency & Background:** Copy from `submission-form.md` → "Proficiency & Background" section

### Step 3: Submit

Check the confirmation checkbox and hit **Submit Idea** before the deadline.

---

## Quick Copy-Paste Blocks

### Idea Title
```
Bug Whisperer — AI Debugging Detective
```

### Description (ready to paste)
```
Bug Whisperer is an AI-powered debugging tool that analyzes stack traces across your entire codebase to identify the true root cause of bugs. Unlike traditional AI tools that only look at one file, Bug Whisperer reasons across multiple files like a senior engineer — pulling relevant source code from GitHub, reconstructing the causal chain, classifying each location by role (crime scene, prime suspect, accomplice, red herring), and proposing a concrete fix with confidence rating. The result is presented as an interactive detective case board with animated evidence cards, SVG connector lines, and a copy-to-clipboard fix panel. Mobile-first with camera input for photographing stack traces, PWA installable, and Web Share API integration.
```

### Proficiency & Background
```
Android Development: Intermediate — Built responsive web applications with React and mobile-first design. Experience with PWA development and offline capabilities.

LLMs / AI: Intermediate — Integrated Groq API with Llama 3.3 70B for structured JSON analysis. Designed detective reasoning prompts for code analysis. Built multi-file context pipelines for LLM input.

Relevant Projects: Built AI-powered code analysis tools using LLMs. Developed responsive web applications with Tailwind CSS. Participated in previous hackathons with focus on developer tools.
```

---

## Tips for a Strong Submission

1. **Be specific about AI integration** — Don't just say "uses AI". Explain HOW (Groq, detective prompt, multi-file analysis)
2. **Emphasize mobile-first** — Camera input, PWA, haptic feedback
3. **Show real-world utility** — "Saves 1 hour 50 minutes per debugging session"
4. **Unique UI** — Detective case board is not another card grid
5. **Free tier stack** — 100% free hosting and APIs
