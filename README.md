# 🔍 Bug Whisperer — AI Debugging Detective
 
**Paste a stack trace and a repo link. Bug Whisperer investigates across your entire codebase —
tracing the causal chain, naming the root cause, and proposing the fix — presented as an
interactive detective case board, not a wall of text.**
 
Built for iQOO Hackathon — Developer Tools track.
 
---
 
## The Problem
 
Developers lose **16 hours a week** — about 35% of all dev time — to debugging. A cryptic stack
trace at 2am means manually opening 6–10 files, cross-referencing logic, and guessing at a root
cause. Most AI tools (ChatGPT, Copilot) analyze one file at a time — they don't reason across a
whole codebase the way a senior engineer actually debugs.
 
## The Solution
 
Bug Whisperer parses a stack trace, pulls the specific files it references straight from GitHub,
and asks an LLM to reason across all of them like a detective building a case — not just explain
the error line. It comes back with:
 
- A **root cause**, which may differ from where the exception actually surfaced
- **Role-classified evidence** (crime scene / prime suspect / accomplice / red herring) across every file involved
- A **confidence rating**, so it's honest when it's not sure instead of confidently wrong
- A **copyable fix**

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Groq API key](https://console.groq.com/) (free tier)
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (optional, for higher rate limits)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🏗️ Architecture

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

## 🎯 How It Works

1. **Paste** a GitHub repo URL + a stack trace / error log
2. **Parse** the stack trace to extract file/line/function for each frame
3. **Fetch** the content of each referenced file via the GitHub API
4. **Analyze** the trace + file contents with Groq's openai/gpt-oss-120b
5. **Render** results as an interactive case board with evidence cards

## 🎨 Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + Vite + Tailwind CSS |
| Mobile | Capacitor (for now) |
| Backend | FastAPI (Python) |
| LLM | Groq API — `openai/gpt-oss-120b` |
| Repo Data | GitHub REST API |
| Icons | lucide-react |

## Team
 
**Solo**
- [Jay Dhanwalkar](https://github.com/dhanwalkarjay) — jaydhanwalkar123@gmail.com

## License
 
MIT — see [LICENSE](LICENSE).

---

*Built for the hackathon — debugging that feels like detective work.*
