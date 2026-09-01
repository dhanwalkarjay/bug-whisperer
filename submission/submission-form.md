# Phase 1 Submission Content — Copy-Paste Ready

---

## 1. Idea Title

**Bug Whisperer — AI Debugging Detective**

---

## 2. Description (50+ characters)

Bug Whisperer is an AI-powered debugging tool that analyzes stack traces across your entire codebase to identify the true root cause of bugs. Unlike traditional AI tools that only look at one file, Bug Whisperer reasons across multiple files like a senior engineer — pulling relevant source code from GitHub, reconstructing the causal chain, classifying each location by role (crime scene, prime suspect, accomplice, red herring), and proposing a concrete fix with confidence rating. The result is presented as an interactive detective case board with animated evidence cards, SVG connector lines, and a copy-to-clipboard fix panel. Mobile-first with camera input for photographing stack traces, PWA installable, and Web Share API integration.

---

## 3. Proficiency & Background

**Android Development:** Intermediate
- Built responsive web applications with React and mobile-first design
- Experience with PWA development and offline capabilities

**LLMs / AI:** Intermediate
- Integrated Groq API with Llama 3.3 70B for structured JSON analysis
- Designed detective reasoning prompts for code analysis
- Built multi-file context pipelines for LLM input

**Relevant Projects:**
- Built AI-powered code analysis tools using LLMs
- Developed responsive web applications with Tailwind CSS
- Participated in previous hackathons with focus on developer tools

---

## 4. Problem Statement

**The Problem:**
Developers spend an average of 16 hours per week debugging (IBM Research). Stack traces reference multiple files across a codebase, but the error location is rarely the root cause. Existing AI tools analyze only one file at a time, requiring developers to manually trace causal chains across 5-10 files. This is especially painful for junior developers who lack the experience to navigate complex codebases under time pressure.

**Who It's For:**
- Junior developers learning to debug complex systems
- Senior engineers saving time on multi-file debugging
- Hackathon teams debugging under 30-hour time constraints
- Open source maintainers triaging bug reports

**How It Works:**
1. User pastes a GitHub repo URL + stack trace (or photographs one with phone camera)
2. Backend parses the trace to extract file paths and line numbers
3. Referenced files are fetched automatically from GitHub API
4. Groq's Llama 3.3 analyzes the trace + code with a detective reasoning prompt
5. Results are presented as an interactive case board with evidence cards, root cause identification, and suggested fix

---

## 5. Feature Vision

**Core Features:**
- Multi-file codebase analysis (not just one file)
- Root cause detection (not just where error surfaced)
- Role classification (crime scene, prime suspect, accomplice, red herring)
- Confidence rating (high/medium/low)
- Copy-to-clipboard code fix
- Demo presets for quick testing

**Mobile-First Features:**
- Camera input for photographing stack traces
- PWA installable as native app
- Offline support for core UI
- Web Share API for native sharing
- Haptic feedback on interactions
- Touch-optimized 44px minimum targets

**UI/UX:**
- Detective case board theme (not boring card grid)
- Pin-drop animations for evidence cards
- SVG connector lines linking evidence to root cause
- Role-based styling with unique colors/icons
- Dark charcoal/espresso background with noise texture

---

## 6. Proposed Architecture

**Frontend:** React + Vite + Tailwind CSS + lucide-react
- Component-based architecture (InputPanel, CaseBoard, EvidenceCard, FixPanel)
- PWA with service worker for offline support
- Web Share API integration
- Camera input via getUserMedia API

**Backend:** FastAPI (Python)
- /investigate endpoint with async processing
- Stack trace parser (Python + JS regex patterns)
- GitHub API file fetcher (up to 6 files, 200 lines each)
- Groq API client with detective reasoning prompt

**AI:** Groq API — llama-3.3-70b-versatile
- System prompt for detective reasoning
- Structured JSON output (case_summary, root_cause, evidence, fix, confidence)
- Temperature 0.3 for consistent analysis
- Max tokens 2000 for focused output

**Data Flow:**
User Input → Parse Stack Trace → Fetch GitHub Files → Analyze with Groq → Render Case Board

**No Database Required:**
Stateless per request — perfect for hackathon prototype. Future: Postgres for investigation history.

---

## 7. UI Wireframes/Mockups Description

**Screen 1 — Input:**
- Centered card with subtle pin decoration at top
- "Try Demo" buttons for Python and JavaScript examples
- Repository URL input with GitBranch icon
- Stack trace textarea with Camera button for photo input
- "Investigate" button with gradient styling
- Feature badges: AI Analysis, Multi-File, Root Cause

**Screen 2 — Loading:**
- Pulsing magnifying glass animation
- Sequential status messages: "Scanning crime scene...", "Reading file system...", "Cross-referencing evidence...", "Analyzing root cause..."

**Screen 3 — Case Board:**
- Case Summary card with FileText icon
- Evidence Board section with staggered animated cards
- Each card has: role badge (color-coded), file:line, description note
- SVG dashed lines connecting evidence to root cause
- "Case Closed" banner with confidence badge
- Fix panel with code block and copy button
- Share/Copy/Tweet action buttons

**Color Scheme:**
- Background: #1a1612 (deep charcoal)
- Cards: #2a2318 (espresso)
- Crime Scene: #ef4444 (red)
- Prime Suspect: #f59e0b (amber)
- Accomplice: #3b82f6 (blue)
- Red Herring: #6b7280 (gray)
- Confidence High: #22c55e (green)

**Typography:**
- Headings: Playfair Display (serif, detective theme)
- Body: Inter (clean, readable)
- Code: JetBrains Mono (monospace)
