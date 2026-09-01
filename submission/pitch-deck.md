# 🕵️ Bug Whisperer — AI Debugging Detective

### iQOO Hackathon 2026 | Pune City Battle

---

## Slide 1: The Problem

### Every Developer Knows This Feeling

It's 2 AM. Your app just crashed. You're staring at a wall of stack trace text — cryptic file paths, line numbers, function names scattered across multiple files. You have no idea **where** to start looking.

**The Pain Points:**
- Stack traces reference 5-10 files across your codebase
- The error location is rarely the **root cause**
- Senior engineers spend hours tracing causal chains
- Junior developers are completely lost
- Existing AI tools only look at **one file at a time**

**The Cost:**
- Average debugging time: **16 hours/week** per developer
- 35% of development time spent on debugging (IBM Research)
- Critical bugs in production cost businesses **$100+/hour** in downtime

---

## Slide 2: Our Solution

### Bug Whisperer — The Debugging Detective

**One-liner:** Paste a stack trace and a repo link. Bug Whisperer investigates across your **whole codebase** like a detective — pulls the relevant files, reconstructs the causal chain, names the root cause, and proposes the fix.

**What Makes Us Different:**
| Traditional AI Tools | Bug Whisperer |
|---------------------|---------------|
| Analyzes ONE file | Analyzes ENTIRE codebase |
| Shows where error occurred | Traces ROOT CAUSE |
| Text output | Interactive CASE BOARD |
| Generic suggestions | Detective-style reasoning |
| Desktop only | Mobile-first PWA |

---

## Slide 3: How It Works

### The Investigation Pipeline

```
📱 User Input → 🔍 Parse → 📂 Fetch → 🧠 Analyze → 🎯 Present
```

**Step 1: Input**
- User pastes a GitHub repo URL + stack trace
- Or photographs a stack trace with phone camera

**Step 2: Parse**
- Extracts `{file, line, function}` for each stack frame
- Supports Python, JavaScript, Node.js, and more

**Step 3: Fetch**
- Automatically fetches referenced files from GitHub API
- Fetches up to 6 files, truncated to 200 lines each

**Step 4: Analyze**
- Sends trace + code to Groq's Llama 3.3 70B
- Detective reasoning prompt identifies root cause
- Classifies each location by role (crime scene, prime suspect, etc.)

**Step 5: Present**
- Interactive case board with animated evidence cards
- SVG connector lines linking evidence to root cause
- Copy-to-clipboard fix with confidence rating

---

## Slide 4: Key Features

### 🎯 Core Features

1. **Multi-File Analysis** — Reasons across your entire codebase, not just one file
2. **Root Cause Detection** — Identifies the TRUE cause, not just where the error surfaced
3. **Role Classification** — Labels each file as Crime Scene, Prime Suspect, Accomplice, or Red Herring
4. **Confidence Rating** — Honest about uncertainty (High/Medium/Low)
5. **Copy-to-Clipboard Fix** — Ready-to-use code fix

### 📱 Mobile-First Features

6. **Camera Input** — Photograph stack traces from phone camera
7. **PWA Installable** — Install as native app on any phone
8. **Offline Support** — Works without internet after first load
9. **Web Share API** — Share investigations via native share sheet
10. **Haptic Feedback** — Vibration on success/error

### 🎨 UI/UX Features

11. **Detective Case Board** — Not a boring card grid
12. **Pin-Drop Animations** — Cards animate in like evidence being pinned
13. **SVG Connector Lines** — Visual links between evidence and root cause
14. **Role-Based Styling** — Each evidence type has unique colors/icons
15. **Demo Presets** — One-tap to try with real repos

---

## Slide 5: UI Design — The Case Board

### Screen 1: Input
```
┌─────────────────────────────────┐
│  🔍 Bug Whisperer               │
│                                 │
│  [Try Demo: Python | JavaScript]│
│                                 │
│  📁 Repository URL              │
│  ┌─────────────────────────┐    │
│  │ https://github.com/...  │    │
│  └─────────────────────────┘    │
│                                 │
│  📄 Stack Trace     [📷 Camera] │
│  ┌─────────────────────────┐    │
│  │ Traceback (most recent  │    │
│  │   File "app.py", line 15│    │
│  │   ...                   │    │
│  └─────────────────────────┘    │
│                                 │
│  [🔍 Investigate]               │
│                                 │
│  ⚡ AI Analysis  📂 Multi-File  │
└─────────────────────────────────┘
```

### Screen 2: Loading
```
┌─────────────────────────────────┐
│                                 │
│         🔍 (pulsing)            │
│                                 │
│  ✓ Scanning the crime scene...  │
│  ● Reading the file system...   │
│  ○ Cross-referencing evidence...│
│  ○ Analyzing the root cause...  │
│                                 │
└─────────────────────────────────┘
```

### Screen 3: Case Board
```
┌─────────────────────────────────┐
│  📋 Case Summary                │
│  ┌─────────────────────────┐    │
│  │ The application crashed  │    │
│  │ because user_input was   │    │
│  │ None when passed to...   │    │
│  └─────────────────────────┘    │
│                                 │
│  🔗 Evidence Board              │
│                                 │
│  📍 ● Crime Scene               │
│  ┌─────────────────────────┐    │
│  │ ⚠ Crime Scene           │    │
│  │ 📄 app.py:15             │    │
│  │ Where exception thrown   │    │
│  └─────────────────────────┘    │
│         │                       │
│         ▼ (dashed line)         │
│  📍 ● Prime Suspect ★           │
│  ┌─────────────────────────┐    │
│  │ 🎯 Prime Suspect        │    │
│  │ 📄 utils/parser.py:42   │    │
│  │ Passes None downstream   │    │
│  └─────────────────────────┘    │
│                                 │
│  ✅ Case Closed                 │
│  ┌─────────────────────────┐    │
│  │ 💡 Suggested Fix         │    │
│  │ if not data:             │    │
│  │     raise ValueError()   │    │
│  │              [📋 Copy]   │    │
│  └─────────────────────────┘    │
│                                 │
│  [🔗 Share] [📋 Copy] [🐦 Tweet]│
└─────────────────────────────────┘
```

---

## Slide 6: Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                       │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Input   │  │  Case    │  │  Fix     │  │  Share   │ │
│  │  Panel   │→ │  Board   │→ │  Panel   │  │  Button  │ │
│  └─────────┘  └──────────┘  └──────────┘  └──────────┘ │
│       │              │              │              │      │
│       └──────────────┴──────────────┴──────────────┘      │
│                          │                                │
│                    POST /investigate                      │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────┴───────────────────────────────┐
│                   BACKEND (FastAPI)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Stack      │  │   GitHub    │  │    Groq         │  │
│  │   Parser     │  │   Fetcher   │  │    Client       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│       │                │                   │              │
│  Python + JS      GitHub REST API    Llama 3.3 70B       │
│  regex parsing    file contents      detective prompt    │
└──────────────────────────────────────────────────────────┘
```

### Tech Stack (100% Free Tier)

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + Vite + Tailwind CSS | Fast, modern, fully free |
| Backend | FastAPI (Python) | Async, easy API calls |
| LLM | Groq — llama-3.3-70b-versatile | Free tier, blazing fast |
| Repo Data | GitHub REST API | Free for public repos |
| Icons | lucide-react | Lightweight, free |
| Hosting | Vercel + Render | Free tiers |

---

## Slide 7: AI Integration

### How We Use AI (Groq + Llama 3.3)

**The Detective Prompt:**

Our system prompt instructs the model to act as a "Senior Debugging Detective" with specific instructions:

1. **Read the stack trace** to understand what error occurred
2. **Examine each source file** carefully
3. **Trace the causal chain** — what happened BEFORE the error?
4. **Identify the TRUE root cause** (often different from where exception surfaced)
5. **Classify each location** by role (crime_scene, prime_suspect, accomplice, red_herring)
6. **Propose a concrete fix** with explanation

**Why This Matters:**
- Most AI tools just explain the error at the surface level
- Bug Whisperer reasons **across multiple files** like a senior engineer
- The role classification makes the analysis **visually interpretable**
- Confidence rating provides **honest uncertainty quantification**

---

## Slide 8: Real-World Utility

### Who Benefits?

| User | How Bug Whisperer Helps |
|------|------------------------|
| **Junior Developers** | Understand complex crashes without senior help |
| **Senior Engineers** | Save hours debugging across large codebases |
| **Open Source Maintainers** | Triage bug reports faster |
| **Hackathon Teams** | Debug under time pressure |
| **DevOps/SRE** | Quick root cause analysis in production |

### Real Impact Example

**Before Bug Whisperer:**
- Developer sees `AttributeError: 'NoneType' object has no attribute 'strip'`
- Spends 2 hours reading 5 files to find the root cause
- Fix is a 3-line validation check

**After Bug Whisperer:**
- Paste trace + repo URL → 10 seconds
- See root cause highlighted as "Prime Suspect"
- Copy the 3-line fix
- **Time saved: 1 hour 50 minutes**

---

## Slide 9: Phone-First Design

### Mobile-First Execution

Bug Whisperer is designed **mobile-first** for the iQOO Hackathon:

1. **Camera Input** — Photograph stack traces from screens/papers
2. **PWA Installable** — Add to home screen like a native app
3. **Offline Support** — Core UI works without internet
4. **Web Share API** — Share investigations via native share sheet
5. **Haptic Feedback** — Vibration on success/error
6. **Touch Optimized** — 44px minimum touch targets
7. **Responsive Design** — Perfect on any screen size

### Why This Fits the Hackathon

- **Phone-first execution**: Camera input, PWA, mobile-optimized UI
- **AI integration**: Groq Llama 3.3 for detective reasoning
- **Real-world utility**: Solves actual debugging pain
- **Innovation**: Detective case board UI is unique

---

## Slide 10: Future Vision

### Post-Hackathon Roadmap

**Phase 2: Production Features**
- GitHub OAuth for private repos
- Follow imports/call graph beyond trace files
- Persist investigation history (Postgres/Supabase)
- CI/CD integration (auto-analyze failed builds)

**Phase 3: Platform**
- VS Code extension
- Slack/Discord bot
- REST API for teams
- Support for Java, Go, Ruby, Rust stack traces

**Phase 4: Enterprise**
- Team dashboards
- Bug pattern detection
- Integration with Jira/Linear
- On-premise deployment option

---

## Slide 11: Team & Ask

### What We Need

1. **Shortlisting** — Get selected for the on-site Pune City Battle
2. **iQOO 15 Loaner** — Test mobile features on real hardware
3. **Mentorship** — Guidance on scaling the AI analysis

### What We Bring

- Working prototype (backend + frontend)
- Unique UI concept (detective case board)
- Strong AI integration (not just wrapper)
- Mobile-first PWA ready for demo
- Real-world utility that judges will appreciate

---

## Slide 12: Thank You

### Bug Whisperer — AI Debugging Detective

**"This isn't code review. It's investigation."**

🔗 **Repository:** github.com/your-team/bug-whisperer
📧 **Contact:** your-email@example.com

*Built with ♥ for hackathon judges who know the pain of debugging at 2am*
