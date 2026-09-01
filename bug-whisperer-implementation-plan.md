# Bug Whisperer — AI Debugging Detective
### Full End-to-End Implementation Plan

---

## 1. The Pitch

**One-liner:** Paste a stack trace and a repo link. Bug Whisperer investigates across your whole
codebase like a detective — pulls the relevant files, reconstructs the causal chain, names the
root cause, and proposes the fix. Presented as an interactive case board, not a wall of text.

**Why it's different from a PR reviewer (and most hackathon AI dev tools):**
- Reasons across *multiple files*, not one diff — closer to how a senior engineer actually debugs
- Solves a moment of real pain (a cryptic crash), not a routine task
- The UI itself is the differentiator: a detective case board, not another card-grid dashboard

**Track fit:** Developer Tools — "help developers create, test, deploy, or collaborate faster using AI."

---

## 2. Product Flow

1. User pastes: a GitHub repo URL + a raw stack trace / error log (paste, not upload — faster for demo)
2. Backend parses the stack trace to extract `{file, line, function}` for each frame
3. Backend fetches the content of each referenced file via the GitHub API
4. Backend sends the trace + file contents to Groq (Llama 3.3 70B) with a "detective reasoning" prompt
5. Model returns structured JSON: root cause, supporting evidence per file, confidence, and a fix
6. Frontend renders it as a case board: pinned evidence cards connected by lines, root cause
   highlighted, fix shown in a "case closed" panel

---

## 3. Tech Stack (100% free tier)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast to build, fully free, no backend lock-in |
| Backend | FastAPI (Python) | Simple async API, easy GitHub + Groq calls |
| LLM | Groq API — `llama-3.3-70b-versatile` | Free tier, very fast inference (matters live) |
| Repo data | GitHub REST API | Free, public repos need no auth; PAT optional for rate limits |
| Hosting | Vercel (frontend) + Render (backend) | Both free tiers, deploy from GitHub in minutes |
| Icons | lucide-react | Free, lightweight |

No database needed for the hackathon version — fully stateless per request.

---

## 4. System Architecture

```
┌──────────────┐   POST /investigate    ┌───────────────┐
│   React UI    │ ──────────────────────▶│   FastAPI      │
│ (Case Board)  │  {repo_url, trace}      │   backend      │
│               │◀──────────────────────  │                │
└──────────────┘   structured JSON        └───────┬────────┘
                                                    │
                                    ┌───────────────┼────────────────┐
                                    ▼                                ▼
                          GitHub REST API                     Groq API
                     (fetch files named in trace)        (llama-3.3-70b-versatile,
                                                            detective reasoning prompt)
```

---

## 5. API Contract

### `POST /investigate`

**Request**
```json
{
  "repo_url": "https://github.com/owner/repo",
  "stack_trace": "raw pasted trace text"
}
```

**Response**
```json
{
  "case_summary": "One paragraph plain-English account of what went wrong",
  "root_cause": {
    "file": "src/utils/parser.py",
    "line": 42,
    "explanation": "Why this is the actual root cause, not just where it surfaced"
  },
  "evidence": [
    {
      "file": "src/api/handler.py",
      "line": 18,
      "role": "crime_scene",
      "note": "Where the exception was ultimately thrown"
    },
    {
      "file": "src/utils/parser.py",
      "line": 42,
      "role": "prime_suspect",
      "note": "Passes unvalidated input downstream"
    }
  ],
  "fix": {
    "file": "src/utils/parser.py",
    "suggested_code": "if not data:\n    raise ValueError('empty input')",
    "explanation": "Validates input before use, preventing the crash"
  },
  "confidence": "high"
}
```

`role` values: `crime_scene` (where it surfaced), `prime_suspect` (actual root cause),
`accomplice` (contributed but not root cause), `red_herring` (looked relevant, wasn't).

This role labeling is what makes the case-board visual make sense — each card gets styled
differently based on its role.

---

## 6. Backend Implementation Plan

### Stack trace parsing
- Support **Python tracebacks** and **JS/Node stack traces** first — most common in demos
- Python: regex on lines like `File "path/to/file.py", line 42, in function_name`
- JS: regex on lines like `at functionName (path/to/file.js:42:10)`
- **Fallback for anything else:** if parsing finds zero files, fetch the repo's file tree
  (`GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`) and let the LLM identify likely
  files itself from the raw trace + file list. This is your safety net for messy/unusual traces.

### GitHub file fetching
- `GET /repos/{owner}/{repo}/contents/{path}` for each file identified (base64-decode the content)
- Cap to the first ~6 unique files referenced, to control latency and token usage
- Truncate each file to ~300 lines around... actually simplest for day-1: truncate each file to
  first 200 lines + any lines near the referenced line number if you have time; otherwise just cap
  total combined character count sent to the model (~12k chars) — simpler and safer under time pressure

### Groq prompt design
System prompt instructs the model to act as a senior debugging detective: reconstruct the causal
chain leading to the crash, cite specific file/line evidence for every claim, classify each
referenced location by role (see above), identify the true root cause (which may differ from where
the exception surfaced), and propose a concrete fix. Respond in strict JSON matching the schema in
section 5 — no markdown fences, no extra commentary.

### Error handling to build in
- Invalid repo URL → clear message
- Private repo without token → clear message ("this repo is private or doesn't exist")
- Trace parses to zero files and tree fetch also fails → ask user to paste more context
- Groq timeout/error → retry-friendly error, don't crash the request

---

## 7. Frontend Implementation Plan — The Case Board

This is where you spend your real design time; it's the "wow" moment.

**Visual concept**
- Background: deep charcoal/espresso tone (not literal wood texture — use a subtle CSS grain/noise
  overlay for restraint, avoid anything cartoonish)
- Each evidence item = a pinned card: slight rotation (alternating ±1–3deg), soft drop shadow, a
  small "pin" dot at the top
- Root cause card (`prime_suspect`) gets a red accent border and sits visually central/elevated
- SVG overlay draws connecting lines from each evidence card toward the root cause card, animated
  in on load (one orchestrated sequence — cards "pin down" staggered, then lines draw in)
- A "Case Closed" panel at the bottom holds the fix, styled distinctly (stamp-like accent, not
  another identical card) with a copy-to-clipboard button

**Screens/states**
1. Input: repo URL field + stack trace textarea, single "Investigate" button
2. Loading: detective-themed but *not* gimmicky — a simple progress indicator, 2–4 short status
   messages ("Reading the file system…", "Cross-referencing evidence…")
3. Results: the case board as described above
4. Error: clear, plain-English message with what to try next

**Component structure**
```
src/
  App.jsx              -> layout, state, API calls
  components/
    InputPanel.jsx      -> repo URL + trace textarea + submit
    CaseBoard.jsx        -> renders evidence cards + SVG connector lines
    EvidenceCard.jsx      -> single pinned card, styled by role
    FixPanel.jsx          -> case-closed fix panel with copy button
```

---

## 8. Build Timeline (~20 hours)

| Time | Task |
|---|---|
| 0–1h | Project setup: repo, folder structure, Groq key, GitHub token, backend skeleton |
| 1–4h | Backend: stack trace parser (Python + JS regex), GitHub file fetcher, error handling |
| 4–7h | Backend: Groq prompt + `/investigate` endpoint; test against 2–3 real crashes via curl/Postman until JSON output is reliable |
| 7–9h | Frontend: input screen, API wiring, loading/error states |
| 9–14h | Frontend: Case Board visual — cards, SVG connector lines, role-based styling, entrance animation. **Biggest time investment — this is your differentiator** |
| 14–16h | Integration pass: real end-to-end runs, fix rough edges, mobile responsiveness check |
| 16–18h | Prepare **two** pre-tested demo cases (one Python repo, one JS repo) with real, findable bugs — do NOT rely on live discovery during judging |
| 18–20h | Buffer, deploy (Vercel + Render), rehearse the 2-minute demo, write submission text |

---

## 9. Demo Script (aim for under 2 minutes)

1. Open on a raw, ugly stack trace on screen: "Every developer knows this feeling — 2am, a crash,
   no idea where to even start looking."
2. Paste the repo link + trace into Bug Whisperer, hit Investigate.
3. Let the case board animate in — cards pinning down, lines connecting.
4. Point at the root cause card: "It didn't just find where the error was thrown — it traced back
   three files to find *why*."
5. Show the fix panel, click copy.
6. Close line: "This isn't code review. It's investigation — reasoning across your whole codebase,
   not just one diff."

---

## 10. Known Risks + Mitigations

| Risk | Mitigation |
|---|---|
| LLM misidentifies root cause on a messy trace | Pre-test your exact demo case repeatedly beforehand; use the `confidence` field so it can honestly say "medium/low" instead of confidently wrong |
| GitHub API rate limits mid-demo | Add a GITHUB_TOKEN (free, personal access token) to raise limit to 5000/hr |
| Large files blow context/latency | Truncate per-file content; cap total files fetched to ~6 |
| Live demo network hiccup | Have a recorded backup video/GIF of a successful run as a fallback |

---

## 11. Path to Real Production (mention in pitch, don't build tonight)

- GitHub OAuth so it can access private repos as the user
- Expand file discovery beyond files literally named in the trace (follow imports/call graph)
- Persist past investigations (Postgres/Supabase) so teams build a shared "case history"
- CI integration: auto-run on failed test/build logs, not just manually pasted traces
- Support more languages/stack trace formats (Java, Go, Ruby, etc.)

Naming this roadmap explicitly in your pitch signals maturity — it shows you know the line between
a working prototype and a real product, which judges consistently respond well to.
