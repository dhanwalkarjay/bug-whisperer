"""
Groq API client for Bug Whisperer detective analysis.
Uses llama-3.3-70b-versatile for fast, intelligent debugging analysis.
"""

import os
import json
from typing import Dict, Optional
from groq import Groq


DETECTIVE_SYSTEM_PROMPT = """You are Bug Whisperer, a world-class debugging detective. Your job is to analyze stack traces and source code to identify the ROOT CAUSE of bugs — not just where the error surfaced.

Your reasoning process:
1. First, read the stack trace to understand what error occurred and where
2. Then, examine each referenced source file carefully
3. Trace the causal chain: what happened BEFORE the error was thrown?
4. Identify the TRUE root cause — which is often different from where the exception was raised
5. Classify each referenced location by its role in the investigation

ROLE CLASSIFICATIONS:
- "crime_scene": Where the exception was ultimately thrown/surfaced
- "prime_suspect": The actual root cause of the bug (often upstream)
- "accomplice": Contributed to the problem but isn't the root cause
- "red_herring": Looked relevant on the surface but turned out not to be

You MUST respond with valid JSON matching this exact schema — no markdown fences, no extra text:

{
  "case_summary": "One paragraph plain-English account of what went wrong, like a detective's case brief",
  "root_cause": {
    "file": "path/to/file.py",
    "line": 42,
    "explanation": "Why this is the actual root cause, not just where it surfaced"
  },
  "evidence": [
    {
      "file": "path/to/file.py",
      "line": 18,
      "role": "crime_scene",
      "note": "Where the exception was ultimately thrown"
    }
  ],
  "fix": {
    "file": "path/to/file.py",
    "suggested_code": "exact code to add/modify",
    "explanation": "Why this fix addresses the root cause"
  },
  "confidence": "high|medium|low"
}

Be specific. Cite exact file paths and line numbers. Your analysis must be grounded in the actual code provided, not speculation."""


def analyze_with_groq(
    stack_trace: str,
    file_contents: Dict[str, str],
    error_message: str = "",
) -> Optional[Dict]:
    """
    Send the stack trace and file contents to Groq for detective analysis.
    Returns the structured JSON response.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set. Please set it in your .env file.")

    client = Groq(api_key=api_key)

    # Build the user message with all context
    user_message = f"## Stack Trace\n```\n{stack_trace}\n```\n\n"

    if error_message:
        user_message += f"## Error Message\n{error_message}\n\n"

    if file_contents:
        user_message += "## Referenced Source Files\n\n"
        for file_path, content in file_contents.items():
            user_message += f"### {file_path}\n```//\n{content}\n```\n\n"
    else:
        user_message += "## No source files could be retrieved.\nPlease analyze based on the stack trace alone.\n\n"

    user_message += "Analyze this bug like a detective. Identify the root cause, classify each location, and propose a fix. Respond with the JSON schema specified in your instructions."

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": DETECTIVE_SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )

        result_text = response.choices[0].message.content
        result = json.loads(result_text)

        # Validate required fields
        required_fields = ["case_summary", "root_cause", "evidence", "fix", "confidence"]
        for field in required_fields:
            if field not in result:
                result[field] = _get_default(field)

        # Ensure root_cause has required sub-fields
        if isinstance(result["root_cause"], dict):
            for key in ["file", "line", "explanation"]:
                if key not in result["root_cause"]:
                    result["root_cause"][key] = "N/A"

        # Ensure evidence is a list
        if not isinstance(result["evidence"], list):
            result["evidence"] = []

        # Ensure fix has required sub-fields
        if isinstance(result["fix"], dict):
            for key in ["file", "suggested_code", "explanation"]:
                if key not in result["fix"]:
                    result["fix"][key] = "N/A"

        # Ensure confidence is valid
        if result["confidence"] not in ["high", "medium", "low"]:
            result["confidence"] = "medium"

        return result

    except json.JSONDecodeError:
        # If the model didn't return valid JSON, try to extract it
        try:
            # Try to find JSON in the response
            start = result_text.find("{")
            end = result_text.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(result_text[start:end])
        except Exception:
            pass
        return None
    except Exception as e:
        raise RuntimeError(f"Groq API error: {str(e)}")


def _get_default(field: str):
    """Get default values for missing fields."""
    defaults = {
        "case_summary": "Analysis could not be completed. Please try again with more context.",
        "root_cause": {"file": "unknown", "line": 0, "explanation": "Could not determine root cause"},
        "evidence": [],
        "fix": {"file": "unknown", "suggested_code": "", "explanation": "Could not generate a fix"},
        "confidence": "low",
    }
    return defaults.get(field, None)
