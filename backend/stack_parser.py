"""
Stack trace parser supporting Python tracebacks and JavaScript/Node.js stack traces.
Extracts {file, line, function} for each frame.
"""

import re
from typing import List, Dict, Optional


def parse_stack_trace(trace_text: str) -> List[Dict]:
    """Parse a stack trace and extract frames with file, line, and function info."""
    frames = []

    # Try Python traceback first
    python_frames = _parse_python_traceback(trace_text)
    if python_frames:
        frames.extend(python_frames)

    # Try JavaScript/Node.js stack trace
    js_frames = _parse_js_traceback(trace_text)
    if js_frames:
        frames.extend(js_frames)

    # If no frames found, try generic file pattern matching
    if not frames:
        frames = _parse_generic(trace_text)

    # Deduplicate by file:line
    seen = set()
    unique_frames = []
    for frame in frames:
        key = f"{frame['file']}:{frame['line']}"
        if key not in seen:
            seen.add(key)
            unique_frames.append(frame)

    return unique_frames


def _parse_python_traceback(text: str) -> List[Dict]:
    """Parse Python traceback format."""
    frames = []
    # Pattern: File "path/to/file.py", line 42, in function_name
    pattern = r'File\s+"([^"]+)",\s+line\s+(\d+)(?:,\s+in\s+(\w+))?'
    for match in re.finditer(pattern, text):
        file_path = match.group(1)
        line_num = int(match.group(2))
        function_name = match.group(3) or "<unknown>"
        frames.append({
            "file": file_path,
            "line": line_num,
            "function": function_name,
        })
    return frames


def _parse_js_traceback(text: str) -> List[Dict]:
    """Parse JavaScript/Node.js stack trace format."""
    frames = []
    # Pattern: at functionName (path/to/file.js:42:10)
    # Also: at path/to/file.js:42:10
    pattern = r'at\s+(?:(\w+)\s+\()([^:]+):(\d+):\d+\)?'
    for match in re.finditer(pattern, text):
        function_name = match.group(1) or "<anonymous>"
        file_path = match.group(2)
        line_num = int(match.group(3))
        frames.append({
            "file": file_path,
            "line": line_num,
            "function": function_name,
        })
    return frames


def _parse_generic(text: str) -> List[Dict]:
    """Fallback: try to find any file:line patterns."""
    frames = []
    # Match patterns like path/to/file.ext:42
    pattern = r'([\w/\\.-]+\.\w+):(\d+)'
    for match in re.finditer(pattern, text):
        file_path = match.group(1)
        line_num = int(match.group(2))
        frames.append({
            "file": file_path,
            "line": line_num,
            "function": "<detected>",
        })
    return frames


def extract_error_message(trace_text: str) -> Optional[str]:
    """Extract the main error message from a stack trace."""
    lines = trace_text.strip().split("\n")

    # Python: last line is usually the error
    for line in reversed(lines):
        line = line.strip()
        if line and not line.startswith("File ") and not line.startswith("Traceback"):
            # Check if it looks like an error line
            if any(kw in line for kw in ["Error", "Exception", "TypeError", "ValueError",
                                          "KeyError", "IndexError", "AttributeError",
                                          "ImportError", "RuntimeError", "SyntaxError"]):
                return line

    # JavaScript: first line with "Error" or "TypeError"
    for line in lines:
        line = line.strip()
        if any(kw in line for kw in ["Error", "TypeError", "ReferenceError", "SyntaxError",
                                      "RangeError", "URIError"]):
            return line

    # Fallback: return first non-empty line
    for line in lines:
        if line.strip():
            return line.strip()

    return None
