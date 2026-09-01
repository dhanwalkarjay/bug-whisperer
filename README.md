# 🔍 Bug Whisperer — AI Debugging Detective

**Paste a stack trace and a repo link. Bug Whisperer investigates across your entire codebase —
tracing the causal chain, naming the root cause, and proposing the fix — presented as an
interactive detective case board, not a wall of text.**

Submitted for iQOO Hackathon — Developer Tools track.

> **Status: Idea submission.** This repo holds our architecture prototype and technical
> validation — not a finished product. Backend/frontend scaffolding is in place and the core
> approach (fetch referenced files via GitHub API, reason across them with Groq) has been
> tested end to end. The full build happens if shortlisted, at the hackathon venue.

---

## The Problem

Developers lose **16 hours a week** — about 35% of all dev time — to debugging. A cryptic stack
trace at 2am means manually opening 6–10 files, cross-referencing logic, and guessing at a root
cause. Most AI tools (ChatGPT, Copilot) analyze one file at a time — they don't reason across a
whole codebase the way a senior engineer actually debugs.

## The Solution

Bug Whisperer parses a stack trace, pulls the specific files it references straight from GitHub,
and asks an LLM to reason across all of them like a detective building a case — not just explain
the error line. It will come back with:

- A **root cause**, which may differ from where the exception actually surfaced
- **Role-classified evidence** (crime scene / prime suspect / accomplice / red herring) across every file involved
- A **confidence rating**, so it's honest when it's not sure instead of confidently wrong
- A **copyable fix**

## What's built so far (technical validation)

- ✅ Backend architecture: FastAPI service that parses stack traces, fetches referenced files via
  the GitHub REST API, and calls Groq for cross-file reasoning
- ✅ Prompt design tested against real stack traces — structured JSON output with root cause,
  role-classified evidence, and confidence rating
- ✅ Frontend scaffold: React + Vite + Tailwind, mobile-first
- 🔲 Case board UI (visual investigation board) — planned for build day
- 🔲 Mobile packaging via Capacitor — planned for build day
- 🔲 Deployment — planned for build day

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Mobile | Capacitor — planned, wraps the app as a native Android app with camera & offline access |
| Backend | FastAPI (Python) |
| AI Engine | Groq — `openai/gpt-oss-120b` |
| Data Layer | GitHub REST API |
| Hosting | Vercel (frontend) + Render (backend) — planned |

## Architecture

```
React UI (Case Board) → FastAPI backend → GitHub REST API (fetch referenced files) → Groq API (detective reasoning over the diff + files)
```

OR

```
┌──────────────┐    POST /investigate       ┌───────────────┐
│   React UI   │  ──────────────────────▶  │   FastAPI     │
│ (Case Board) │   {repo_url, trace}        │   backend     │
│              │  ◀──────────────────────  │               │
└──────────────┘    structured JSON         └───────┬───────┘
                                                    │
                                    ┌───────────────┼────────────────┐
                                    ▼                                ▼
                             GitHub REST API                     Groq API
                       (fetch files named in trace)        (openai/gpt-oss-120b)
```

## Running the current prototype

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # add your GROQ_API_KEY — free at console.groq.com/keys
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Note: this runs the current scaffold, not the final case-board
experience described in the pitch — that's the build-day target.

## Team

**[Your team name]**
- [Jay Dhanwalkar](https://github.com/dhanwalkarjay) — jaydhanwalkar123@gmail.com

## License

MIT — see [LICENSE](LICENSE).
