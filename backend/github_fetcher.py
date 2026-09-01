"""
GitHub API client for fetching file contents from repositories.
"""

import os
import base64
from typing import Optional, Dict, List
import httpx


GITHUB_API_BASE = "https://api.github.com"


def _get_headers() -> Dict[str, str]:
    """Get GitHub API headers with optional auth token."""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "BugWhisperer/1.0",
    }
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    return headers


def parse_repo_url(repo_url: str) -> Optional[Dict[str, str]]:
    """
    Parse a GitHub repo URL into owner and repo name.
    Supports: https://github.com/owner/repo, github.com/owner/repo, owner/repo
    """
    url = repo_url.strip().rstrip("/")
    # Remove .git suffix
    if url.endswith(".git"):
        url = url[:-4]

    # Handle full URLs
    if "github.com" in url:
        parts = url.split("github.com")[-1].strip("/").split("/")
        if len(parts) >= 2:
            return {"owner": parts[0], "repo": parts[1]}

    # Handle owner/repo format
    parts = url.split("/")
    if len(parts) == 2:
        return {"owner": parts[0], "repo": parts[1]}

    return None


async def fetch_file_content(owner: str, repo: str, file_path: str) -> Optional[str]:
    """Fetch a single file's content from a GitHub repo."""
    # Clean the file path
    file_path = file_path.lstrip("/")

    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{file_path}"
    headers = _get_headers()

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("encoding") == "base64":
                    content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
                    return content
                return data.get("download_url")
            return None
        except Exception:
            return None


async def fetch_files(owner: str, repo: str, file_paths: List[str], max_files: int = 6) -> Dict[str, str]:
    """
    Fetch multiple files from a GitHub repo.
    Returns a dict of file_path -> content.
    Caps at max_files files to control latency.
    """
    results = {}

    for file_path in file_paths[:max_files]:
        content = await fetch_file_content(owner, repo, file_path)
        if content:
            # Truncate to first 200 lines to control token usage
            lines = content.split("\n")
            if len(lines) > 200:
                truncated = "\n".join(lines[:200])
                results[file_path] = truncated + f"\n... (truncated at line 200, total {len(lines)} lines)"
            else:
                results[file_path] = content

    return results


async def fetch_repo_tree(owner: str, repo: str, branch: str = "main") -> Optional[List[str]]:
    """
    Fetch the full file tree of a repo (for fallback when trace parsing finds no files).
    Tries main branch first, falls back to master.
    """
    headers = _get_headers()

    async with httpx.AsyncClient(timeout=15.0) as client:
        for try_branch in [branch, "master"]:
            url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{try_branch}?recursive=1"
            try:
                response = await client.get(url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    files = [
                        item["path"]
                        for item in data.get("tree", [])
                        if item["type"] == "blob"
                        and not item["path"].startswith(".")
                        and not item["path"].startswith("node_modules/")
                        and not item["path"].startswith("__pycache__/")
                        and not item["path"].startswith("vendor/")
                    ]
                    return files[:100]  # Cap to 100 files
            except Exception:
                continue

    return None
