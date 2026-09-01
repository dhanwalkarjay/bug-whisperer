"""
Bug Whisperer — AI Debugging Detective
FastAPI backend for the investigation endpoint.
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from stack_parser import parse_stack_trace, extract_error_message
from github_fetcher import parse_repo_url, fetch_files, fetch_repo_tree
from groq_client import analyze_with_groq

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Bug Whisperer API",
    description="AI Debugging Detective — paste a stack trace, get a root cause analysis",
    version="1.0.0",
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvestigateRequest(BaseModel):
    repo_url: str
    stack_trace: str


class InvestigateResponse(BaseModel):
    case_summary: str
    root_cause: dict
    evidence: list
    fix: dict
    confidence: str
    files_fetched: int
    trace_language: str


@app.get("/")
async def root():
    return {"message": "Bug Whisperer API is running", "status": "ok"}


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "groq_key_set": bool(os.getenv("GROQ_API_KEY")),
        "github_token_set": bool(os.getenv("GITHUB_TOKEN")),
    }


@app.post("/investigate", response_model=InvestigateResponse)
async def investigate(request: InvestigateRequest):
    """
    Main investigation endpoint.
    1. Parse the stack trace
    2. Fetch referenced files from GitHub
    3. Send everything to Groq for detective analysis
    4. Return structured results
    """
    # Validate inputs
    if not request.repo_url.strip():
        raise HTTPException(status_code=400, detail="Repository URL is required")
    if not request.stack_trace.strip():
        raise HTTPException(status_code=400, detail="Stack trace is required")

    # Step 1: Parse the stack trace
    frames = parse_stack_trace(request.stack_trace)
    error_message = extract_error_message(request.stack_trace) or ""

    # Detect language from trace
    trace_language = "unknown"
    if any(kw in request.stack_trace for kw in ["Traceback (most recent call last)", "File \"", "in "]):
        trace_language = "python"
    elif any(kw in request.stack_trace for kw in ["at ", "(", ")", ".js:", ".ts:", "node_modules"]):
        trace_language = "javascript"

    # Step 2: Parse repo URL
    repo_info = parse_repo_url(request.repo_url)
    if not repo_info:
        raise HTTPException(
            status_code=400,
            detail="Invalid repository URL. Use format: https://github.com/owner/repo"
        )

    owner = repo_info["owner"]
    repo = repo_info["repo"]

    # Step 3: Fetch files
    file_contents = {}

    if frames:
        # Extract unique file paths from frames
        file_paths = []
        for frame in frames:
            file_path = frame["file"]
            # Clean up common prefixes
            for prefix in ["./", "../", "src/"]:
                if file_path.startswith(prefix):
                    file_path = file_path[len(prefix):]
                    break
            if file_path not in file_paths:
                file_paths.append(file_path)

        file_contents = await fetch_files(owner, repo, file_paths, max_files=6)

    # Fallback: if no files found, try to get the repo tree
    if not file_contents:
        tree = await fetch_repo_tree(owner, repo)
        if tree:
            # Let the LLM figure out which files are relevant
            # Send a sample of source files
            source_files = [
                f for f in tree
                if f.endswith((".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".java", ".rb"))
                and not f.endswith(("test.py", "test.js", "spec.js", ".test.js", ".test.ts"))
            ][:10]

            file_contents = await fetch_files(owner, repo, source_files, max_files=6)

    # Step 4: Analyze with Groq
    try:
        result = analyze_with_groq(
            stack_trace=request.stack_trace,
            file_contents=file_contents,
            error_message=error_message,
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    if not result:
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze the bug. Please try again with more context."
        )

    # Step 5: Return results
    return InvestigateResponse(
        case_summary=result.get("case_summary", ""),
        root_cause=result.get("root_cause", {}),
        evidence=result.get("evidence", []),
        fix=result.get("fix", {}),
        confidence=result.get("confidence", "medium"),
        files_fetched=len(file_contents),
        trace_language=trace_language,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
