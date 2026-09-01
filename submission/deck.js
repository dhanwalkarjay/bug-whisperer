const pptxgen = require("pptxgenjs");
const path = require("path");

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Bug Whisperer";
pptx.company = "iQOO Hackathon 2026";
pptx.subject = "Bug Whisperer pitch deck";
pptx.title = "Bug Whisperer - AI Debugging Detective";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};

const W = 13.333;
const H = 7.5;
const M = 0.58;

const C = {
  bg: "0B0F0B",
  bg2: "111711",
  panel: "182018",
  line: "344034",
  green: "C7FF1A",
  yellow: "FFE500",
  red: "FF4D4D",
  blue: "65B7FF",
  gray: "879287",
  white: "FFFFFF",
  text: "EAF2E7",
  muted: "AAB4AA",
  faint: "5F6B5E",
};

const FONT_HEAD = "Aptos Display";
const FONT_BODY = "Aptos";

function addBg(slide) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: C.bg },
    line: { transparency: 100 },
  });
  for (let x = -0.4; x < W; x += 1.0) {
    slide.addShape(pptx.ShapeType.line, {
      x, y: 0, w: 2.6, h: H,
      line: { color: "172017", width: 0.5, transparency: 28 },
    });
  }
  slide.addShape(pptx.ShapeType.arc, {
    x: 10.65, y: -1.4, w: 4.0, h: 4.0,
    line: { color: C.green, width: 1.2, transparency: 28 },
    adjustPoint: 0.18,
  });
  slide.addShape(pptx.ShapeType.arc, {
    x: -1.8, y: 5.75, w: 3.4, h: 3.4,
    line: { color: C.yellow, width: 1.0, transparency: 42 },
    adjustPoint: 0.18,
  });
}

function title(slide, kicker, heading, sub) {
  addBg(slide);
  slide.addText(kicker.toUpperCase(), {
    x: M, y: 0.38, w: 7.6, h: 0.3,
    fontFace: FONT_BODY, fontSize: 10, bold: true,
    color: C.green, charSpacing: 2.4, margin: 0,
  });
  slide.addText(heading, {
    x: M, y: 0.78, w: 10.7, h: 0.7,
    fontFace: FONT_HEAD, fontSize: 30, bold: true,
    color: C.white, margin: 0, fit: "shrink",
  });
  if (sub) {
    slide.addText(sub, {
      x: M, y: 1.42, w: 9.6, h: 0.35,
      fontFace: FONT_BODY, fontSize: 12.5, italic: true,
      color: C.muted, margin: 0, fit: "shrink",
    });
  }
}

function footer(slide, n) {
  slide.addText("BUG WHISPERER", {
    x: M, y: H - 0.45, w: 2.6, h: 0.2,
    fontFace: FONT_BODY, fontSize: 8.5, bold: true,
    color: C.faint, charSpacing: 1.5, margin: 0,
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: W - 1.15, y: H - 0.47, w: 0.6, h: 0.2,
    fontFace: FONT_BODY, fontSize: 8.5, color: C.faint,
    align: "right", margin: 0,
  });
}

function panel(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: opts.radius ?? 0.08,
    fill: { color: opts.fill ?? C.panel, transparency: opts.transparency ?? 0 },
    line: { color: opts.line ?? C.line, width: opts.width ?? 1 },
    shadow: opts.shadow === false ? undefined : { type: "outer", color: "000000", opacity: 0.18, blur: 6, offset: 2, angle: 90 },
  });
}

function badge(slide, text, x, y, w, color = C.green) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.32,
    rectRadius: 0.07,
    fill: { color: C.bg2 },
    line: { color, width: 1 },
  });
  slide.addText(text.toUpperCase(), {
    x, y: y + 0.06, w, h: 0.18,
    fontFace: FONT_BODY, fontSize: 8.5, bold: true,
    color, charSpacing: 1.2, align: "center", margin: 0,
  });
}

function bullet(slide, text, x, y, w, color = C.green, size = 11.5) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y: y + 0.11, w: 0.09, h: 0.09,
    fill: { color }, line: { transparency: 100 },
  });
  slide.addText(text, {
    x: x + 0.22, y, w, h: 0.34,
    fontFace: FONT_BODY, fontSize: size,
    color: C.text, margin: 0, fit: "shrink",
  });
}

function metric(slide, big, label, x, y, w, color = C.green) {
  slide.addText(big, {
    x, y, w, h: 0.55,
    fontFace: FONT_HEAD, fontSize: 28, bold: true,
    color, margin: 0, fit: "shrink",
  });
  slide.addText(label, {
    x, y: y + 0.58, w, h: 0.44,
    fontFace: FONT_BODY, fontSize: 9.5,
    color: C.muted, margin: 0, fit: "shrink",
  });
}

function miniIcon(slide, label, x, y, color = C.green) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: 0.45, h: 0.45,
    fill: { color: C.bg2 },
    line: { color, width: 1 },
  });
  slide.addText(label, {
    x, y: y + 0.1, w: 0.45, h: 0.18,
    fontFace: FONT_BODY, fontSize: 8.5, bold: true,
    color, align: "center", margin: 0,
  });
}

{
  const s = pptx.addSlide();
  addBg(s);
  badge(s, "iQOO Hackathon 2026 | Pune City Battle", 3.72, 0.58, 5.9, C.yellow);
  s.addText("BUG", {
    x: 1.0, y: 1.72, w: 11.4, h: 0.92,
    fontFace: FONT_HEAD, fontSize: 64, bold: true,
    color: C.white, align: "center", margin: 0,
  });
  s.addText("WHISPERER", {
    x: 1.0, y: 2.56, w: 11.4, h: 0.92,
    fontFace: FONT_HEAD, fontSize: 64, bold: true,
    color: C.green, align: "center", margin: 0,
  });
  s.addText("AI Debugging Detective", {
    x: 0, y: 3.55, w: W, h: 0.4,
    fontFace: FONT_BODY, fontSize: 18,
    color: C.text, align: "center", margin: 0,
  });
  s.addShape(pptx.ShapeType.line, {
    x: 4.9, y: 4.18, w: 3.55, h: 0,
    line: { color: C.line, width: 1.2 },
  });
  s.addText("\"This isn't code review. It's investigation.\"", {
    x: 1.9, y: 4.48, w: 9.6, h: 0.32,
    fontFace: FONT_HEAD, fontSize: 16, italic: true,
    color: C.muted, align: "center", margin: 0,
  });
  s.addText("Paste a stack trace and a repo link. Bug Whisperer investigates the whole codebase, traces the causal chain, names the root cause, and hands you the fix.", {
    x: 2.15, y: 5.14, w: 9.05, h: 0.52,
    fontFace: FONT_BODY, fontSize: 12.2,
    color: C.muted, align: "center", margin: 0, fit: "shrink",
  });
  badge(s, "Developer Tools Track | Phone-first PWA | Groq + GitHub API", 3.35, 6.24, 6.65, C.green);
}

{
  const s = pptx.addSlide();
  title(s, "The problem", "Debugging still wastes the best engineering hours", "Stack traces show symptoms. Developers still have to reconstruct the story.");
  const pains = [
    "Stack traces reference 5-10 files across a codebase",
    "The file that throws the error is often not the root cause",
    "Junior developers get stuck on causal chains",
    "Senior engineers lose focus time in repetitive triage",
    "Existing AI tools commonly reason over one pasted file",
  ];
  pains.forEach((p, i) => bullet(s, p, M, 2.1 + i * 0.55, 6.6));
  panel(s, 8.05, 1.75, 4.65, 4.8, { fill: C.bg2, line: C.green });
  s.addText("WHY IT MATTERS", { x: 8.4, y: 2.05, w: 3.8, h: 0.2, fontSize: 9.5, bold: true, color: C.yellow, charSpacing: 1.6, margin: 0 });
  metric(s, "16 hrs", "debugging per developer per week", 8.4, 2.55, 3.7);
  metric(s, "35%", "of development time spent debugging", 8.4, 3.8, 3.7, C.yellow);
  metric(s, "$100+/hr", "potential cost of critical downtime", 8.4, 5.05, 3.7);
  footer(s, 2);
}

{
  const s = pptx.addSlide();
  title(s, "Our solution", "A debugging detective for the whole repo", "From stack trace to root cause, with evidence the team can inspect.");
  panel(s, M, 1.92, W - 2 * M, 1.25, { fill: C.bg2, line: C.green });
  s.addText("ONE-LINER", { x: 0.95, y: 2.17, w: 1.35, h: 0.18, fontSize: 9, bold: true, color: C.green, charSpacing: 1.5, margin: 0 });
  s.addText("Paste a stack trace and GitHub repo URL. Bug Whisperer fetches relevant files, reconstructs the chain, labels evidence, and proposes a fix with confidence.", {
    x: 2.25, y: 2.04, w: 9.6, h: 0.55,
    fontSize: 13, color: C.text, margin: 0, fit: "shrink",
  });
  const leftX = M;
  const rightX = 6.95;
  panel(s, leftX, 3.6, 5.75, 2.55, { fill: C.panel, line: C.line });
  panel(s, rightX, 3.6, 5.75, 2.55, { fill: C.bg2, line: C.green });
  s.addText("TRADITIONAL AI", { x: leftX + 0.28, y: 3.9, w: 5.1, h: 0.22, fontSize: 10, bold: true, color: C.gray, charSpacing: 1.4, margin: 0 });
  s.addText("BUG WHISPERER", { x: rightX + 0.28, y: 3.9, w: 5.1, h: 0.22, fontSize: 10, bold: true, color: C.green, charSpacing: 1.4, margin: 0 });
  [["One file", "Whole codebase"], ["Error location", "True root cause"], ["Plain text answer", "Interactive case board"], ["Generic advice", "Evidence-linked fix"]].forEach(([a, b], i) => {
    bullet(s, a, leftX + 0.35, 4.38 + i * 0.43, 4.8, C.gray, 10.8);
    bullet(s, b, rightX + 0.35, 4.38 + i * 0.43, 4.8, C.green, 10.8);
  });
  footer(s, 3);
}

{
  const s = pptx.addSlide();
  title(s, "How it works", "The investigation pipeline", "Five steps designed for fast demo, real code, and visible reasoning.");
  const steps = [
    ["01", "INPUT", "Repo URL + stack trace, or phone camera capture"],
    ["02", "PARSE", "Extract file, line, function, and language clues"],
    ["03", "FETCH", "Pull referenced files through GitHub REST API"],
    ["04", "ANALYZE", "Groq Llama 3.3 reasons over trace + code"],
    ["05", "PRESENT", "Case board, confidence, and copyable fix"],
  ];
  steps.forEach(([num, label, desc], i) => {
    const boxW = 2.28;
    const x = M + i * 2.5;
    panel(s, x, 2.05, boxW, 3.42, { fill: i % 2 ? C.bg2 : C.panel, line: i === 4 ? C.green : C.line });
    s.addText(num, { x: x + 0.18, y: 2.28, w: 0.62, h: 0.28, fontSize: 15, bold: true, color: C.green, margin: 0 });
    s.addText(label, { x: x + 0.18, y: 3.0, w: boxW - 0.36, h: 0.3, fontSize: 12.5, bold: true, color: C.yellow, charSpacing: 1.4, margin: 0, align: "center" });
    s.addText(desc, { x: x + 0.24, y: 3.58, w: boxW - 0.48, h: 1.25, fontSize: 10.1, color: C.muted, align: "center", margin: 0, fit: "shrink" });
    if (i < steps.length - 1) {
      s.addShape(pptx.ShapeType.triangle, { x: x + boxW + 0.08, y: 3.48, w: 0.22, h: 0.22, rotate: 90, fill: { color: C.green }, line: { transparency: 100 } });
    }
  });
  footer(s, 4);
}

{
  const s = pptx.addSlide();
  title(s, "Feature set", "Fifteen features, one investigation", "Core AI depth plus phone-first execution for the hackathon format.");
  [
    ["CORE", C.green, ["Multi-file analysis", "Root cause detection", "Role classification", "Confidence rating", "Copy-to-clipboard fix"]],
    ["PHONE-FIRST", C.yellow, ["Camera input", "PWA installable", "Offline shell", "Web Share API", "Haptic feedback"]],
    ["UX", C.blue, ["Detective case board", "Pin-drop animations", "Connector lines", "Role-based styling", "Demo presets"]],
  ].forEach(([name, color, items], i) => {
    const x = M + i * 4.17;
    panel(s, x, 1.9, 3.83, 4.75, { fill: i === 0 ? C.bg2 : C.panel, line: color });
    badge(s, name, x + 0.3, 2.22, 1.7, color);
    items.forEach((item, j) => bullet(s, item, x + 0.36, 2.88 + j * 0.65, 3.1, color, 11.2));
  });
  footer(s, 5);
}

{
  const s = pptx.addSlide();
  title(s, "UI design", "The case board is the product moment", "Investigation results are pinned evidence, not another text dump.");
  const fx = 8.65;
  const fy = 1.52;
  const fw = 3.75;
  const fh = 5.45;
  panel(s, fx - 0.14, fy - 0.12, fw + 0.28, fh + 0.24, { fill: "030403", line: C.line, radius: 0.22 });
  panel(s, fx, fy, fw, fh, { fill: C.bg2, line: "223022", radius: 0.18, shadow: false });
  s.addText("CASE SUMMARY", { x: fx + 0.26, y: fy + 0.25, w: 2.5, h: 0.18, fontSize: 8.8, bold: true, color: C.yellow, charSpacing: 1.3, margin: 0 });
  panel(s, fx + 0.25, fy + 0.58, fw - 0.5, 0.7, { fill: C.panel, line: C.line, shadow: false });
  s.addText("App crashed because user_input was None before validation.", { x: fx + 0.42, y: fy + 0.75, w: fw - 0.84, h: 0.24, fontSize: 8.4, color: C.text, margin: 0, fit: "shrink" });
  [[1.55, "CRIME SCENE", "app.py:15 - exception thrown", C.red], [2.82, "PRIME SUSPECT", "parser.py:42 - passes None", C.green], [4.08, "SUGGESTED FIX", "if not data: raise ValueError()", C.yellow]].forEach(([dy, label, desc, color], i) => {
    panel(s, fx + 0.25, fy + dy, fw - 0.5, 0.82, { fill: i === 1 ? C.bg2 : C.panel, line: color, shadow: false });
    miniIcon(s, String(i + 1), fx + 0.43, fy + dy + 0.18, color);
    s.addText(label, { x: fx + 1.0, y: fy + dy + 0.15, w: 2.2, h: 0.18, fontSize: 8.5, bold: true, color, margin: 0, fit: "shrink" });
    s.addText(desc, { x: fx + 1.0, y: fy + dy + 0.43, w: 2.2, h: 0.2, fontSize: 8.1, color: C.muted, margin: 0, fit: "shrink" });
    if (i < 2) {
      s.addShape(pptx.ShapeType.line, { x: fx + fw / 2, y: fy + dy + 0.82, w: 0, h: 0.42, line: { color: C.green, width: 1, dash: "dash" } });
    }
  });
  [["1. Input", "Repo URL, stack trace, camera capture, and demo presets."], ["2. Loading", "Live investigation states: scan, read, cross-reference, analyze."], ["3. Case Board", "Evidence cards connect the thrown error to the true cause."]].forEach(([a, b], i) => {
    const y = 2.05 + i * 1.18;
    s.addShape(pptx.ShapeType.rect, { x: M, y, w: 0.07, h: 0.78, fill: { color: i === 1 ? C.yellow : C.green }, line: { transparency: 100 } });
    s.addText(a, { x: M + 0.3, y: y - 0.02, w: 5.9, h: 0.25, fontSize: 13, bold: true, color: C.white, margin: 0 });
    s.addText(b, { x: M + 0.3, y: y + 0.33, w: 6.5, h: 0.32, fontSize: 11, color: C.muted, margin: 0, fit: "shrink" });
  });
  footer(s, 6);
}

{
  const s = pptx.addSlide();
  title(s, "Architecture", "A small stack with a clear reasoning path", "Stateless for the hackathon; structured enough to grow after it.");
  panel(s, M, 1.82, W - 2 * M, 1.55, { fill: C.bg2, line: C.green });
  s.addText("FRONTEND - REACT + VITE + TAILWIND", { x: 0.92, y: 2.08, w: 5.2, h: 0.2, fontSize: 9.6, bold: true, color: C.green, charSpacing: 1.2, margin: 0 });
  ["Input Panel", "Case Board", "Fix Panel", "Share Button"].forEach((t, i) => {
    const x = 1.0 + i * 2.9;
    panel(s, x, 2.48, 2.35, 0.52, { fill: C.panel, line: C.line, shadow: false });
    s.addText(t, { x, y: 2.65, w: 2.35, h: 0.16, fontSize: 9.5, color: C.text, align: "center", margin: 0, fit: "shrink" });
  });
  s.addShape(pptx.ShapeType.line, { x: W / 2, y: 3.37, w: 0, h: 0.66, line: { color: C.yellow, width: 1.2, dash: "dash" } });
  badge(s, "POST /investigate", 5.54, 3.57, 2.25, C.yellow);
  panel(s, M, 4.15, W - 2 * M, 2.1, { fill: C.bg2, line: C.line });
  s.addText("BACKEND - FASTAPI", { x: 0.92, y: 4.43, w: 3.5, h: 0.2, fontSize: 9.6, bold: true, color: C.green, charSpacing: 1.2, margin: 0 });
  [["Stack Parser", "Python + JS trace regex"], ["GitHub Fetcher", "REST API file contents"], ["Groq Client", "Llama 3.3 70B prompt"]].forEach(([a, b], i) => {
    const x = 1.05 + i * 4.05;
    panel(s, x, 4.9, 3.3, 0.82, { fill: C.panel, line: i === 2 ? C.green : C.line, shadow: false });
    s.addText(a, { x: x + 0.18, y: 5.07, w: 2.95, h: 0.18, fontSize: 11, bold: true, color: C.white, align: "center", margin: 0 });
    s.addText(b, { x: x + 0.18, y: 5.34, w: 2.95, h: 0.18, fontSize: 9, color: C.muted, align: "center", margin: 0, fit: "shrink" });
  });
  footer(s, 7);
}

{
  const s = pptx.addSlide();
  title(s, "AI integration", "The model is asked to investigate, not summarize", "Structured output makes the reasoning usable in UI, not trapped in prose.");
  ["Read the stack trace and identify the thrown error", "Examine each fetched source file around the trace lines", "Trace what happened before the exception surfaced", "Name the true root cause, even when it is elsewhere", "Classify files as crime scene, prime suspect, accomplice, or red herring", "Return a concrete fix and confidence rating"].forEach((t, i) => {
    miniIcon(s, String(i + 1), M, 1.98 + i * 0.58, i % 2 ? C.yellow : C.green);
    s.addText(t, { x: M + 0.65, y: 2.06 + i * 0.58, w: 6.75, h: 0.23, fontSize: 11, color: C.text, margin: 0, fit: "shrink" });
  });
  panel(s, 8.05, 1.92, 4.65, 4.65, { fill: C.panel, line: C.green });
  s.addText("TECH STACK", { x: 8.38, y: 2.24, w: 2.4, h: 0.18, fontSize: 10, bold: true, color: C.yellow, charSpacing: 1.4, margin: 0 });
  [["Frontend", "React, Vite, Tailwind CSS"], ["Backend", "FastAPI, async Python"], ["LLM", "Groq llama-3.3-70b-versatile"], ["Repo Data", "GitHub REST API"], ["Hosting", "Vercel + Render free tiers"]].forEach(([a, b], i) => {
    s.addText(a, { x: 8.4, y: 2.86 + i * 0.62, w: 1.25, h: 0.2, fontSize: 10.2, bold: true, color: C.white, margin: 0 });
    s.addText(b, { x: 9.75, y: 2.86 + i * 0.62, w: 2.55, h: 0.2, fontSize: 9.5, color: C.muted, margin: 0, fit: "shrink" });
  });
  footer(s, 8);
}

{
  const s = pptx.addSlide();
  title(s, "Hackathon fit", "Built for a phone-first city battle", "The deck uses the iQOO event framing: build locally, compete nationally, and demo under pressure.");
  [["PHONE", "Phone-first build", "Camera input, PWA install, haptics, and native sharing"], ["30H", "30-hour battle", "Focused prototype scope for the Pune City Battle"], ["PUNE", "City round", "Designed around a clear live demo for local judges"], ["AI", "AI depth", "Parser, GitHub fetcher, and Groq reasoning chain"], ["EDGE", "Build your edge", "Developer tool that turns panic debugging into investigation"], ["DEMO", "Pitch-ready", "3-minute story with one visible root-cause reveal"]].forEach(([pct, label, fit], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * 4.1;
    const y = 1.92 + row * 2.15;
    const color = i === 2 || i === 4 ? C.yellow : C.green;
    panel(s, x, y, 3.78, 1.65, { fill: i % 2 ? C.panel : C.bg2, line: color });
    s.addText(pct, { x: x + 0.25, y: y + 0.26, w: 1.0, h: 0.34, fontSize: 22, bold: true, color, margin: 0 });
    s.addText(label, { x: x + 1.18, y: y + 0.28, w: 2.25, h: 0.2, fontSize: 10.5, bold: true, color: C.white, margin: 0, fit: "shrink" });
    s.addText(fit, { x: x + 1.18, y: y + 0.68, w: 2.25, h: 0.42, fontSize: 9.4, color: C.muted, margin: 0, fit: "shrink" });
  });
  footer(s, 9);
}

{
  const s = pptx.addSlide();
  title(s, "Real-world utility", "Who gets unstuck first?", "The same workflow helps learners, senior engineers, maintainers, and SREs.");
  [["Junior devs", "Understand complex crashes without waiting for senior help"], ["Senior engineers", "Skip repetitive triage and focus on design-level fixes"], ["OSS maintainers", "Turn issue stack traces into actionable root-cause notes"], ["Hackathon teams", "Recover faster under a 30-hour build clock"], ["DevOps / SRE", "Rapid first-pass root-cause analysis for production incidents"]].forEach(([u, d], i) => {
    const x = M + i * 2.47;
    panel(s, x, 1.9, 2.22, 2.05, { fill: C.panel, line: i === 0 ? C.yellow : C.line });
    s.addText(u, { x: x + 0.18, y: 2.26, w: 1.86, h: 0.38, fontSize: 11, bold: true, color: C.white, align: "center", margin: 0, fit: "shrink" });
    s.addText(d, { x: x + 0.2, y: 2.88, w: 1.82, h: 0.62, fontSize: 8.8, color: C.muted, align: "center", margin: 0, fit: "shrink" });
  });
  panel(s, M, 4.45, 5.85, 1.55, { fill: C.bg2, line: C.gray });
  panel(s, 6.9, 4.45, 5.85, 1.55, { fill: C.bg2, line: C.green });
  s.addText("BEFORE", { x: 0.95, y: 4.74, w: 1.2, h: 0.18, fontSize: 9.5, bold: true, color: C.gray, charSpacing: 1.3, margin: 0 });
  s.addText("AttributeError: 'NoneType' object has no attribute 'strip'\n2 hours reading 5 files; fix is a 3-line validation check.", { x: 0.95, y: 5.08, w: 4.9, h: 0.56, fontSize: 10.5, color: C.muted, margin: 0, fit: "shrink" });
  s.addText("AFTER", { x: 7.25, y: 4.74, w: 1.2, h: 0.18, fontSize: 9.5, bold: true, color: C.green, charSpacing: 1.3, margin: 0 });
  s.addText("Paste trace + repo URL. Root cause highlighted as Prime Suspect. Copy the fix in seconds.", { x: 7.25, y: 5.08, w: 4.9, h: 0.38, fontSize: 10.5, color: C.text, margin: 0, fit: "shrink" });
  s.addText("Time saved: 1 hr 50 min", { x: 7.25, y: 5.58, w: 4.9, h: 0.25, fontSize: 13.5, bold: true, color: C.green, margin: 0 });
  footer(s, 10);
}

{
  const s = pptx.addSlide();
  title(s, "Demo story", "A 3-minute pitch judges can follow cold", "Open with pain, show one crash, then let the case board do the persuasion.");
  [["00:00", "Hook", "A stack trace tells you where code died, not why."], ["00:30", "Live Input", "Paste repo URL + Python or JavaScript stack trace."], ["01:15", "Investigation", "Parser extracts frames; GitHub fetches source; Groq analyzes."], ["02:00", "Reveal", "Case board marks crime scene and prime suspect."], ["02:45", "Close", "Copy fix, share case, mention phone-first value."]].forEach(([time, label, desc], i) => {
    const y = 1.9 + i * 0.87;
    s.addText(time, { x: M, y, w: 0.85, h: 0.2, fontSize: 10, bold: true, color: C.yellow, margin: 0 });
    s.addShape(pptx.ShapeType.line, { x: 1.22, y: y + 0.1, w: 0.55, h: 0, line: { color: C.green, width: 1 } });
    s.addText(label, { x: 1.95, y: y - 0.03, w: 2.0, h: 0.22, fontSize: 12, bold: true, color: C.white, margin: 0 });
    s.addText(desc, { x: 4.0, y: y - 0.03, w: 7.45, h: 0.24, fontSize: 11, color: C.muted, margin: 0, fit: "shrink" });
  });
  panel(s, 8.25, 5.45, 4.1, 0.95, { fill: C.panel, line: C.green });
  s.addText("Judge takeaway", { x: 8.55, y: 5.72, w: 1.8, h: 0.18, fontSize: 10, bold: true, color: C.green, margin: 0 });
  s.addText("Useful, original, phone-first, and technically credible.", { x: 10.18, y: 5.72, w: 1.85, h: 0.2, fontSize: 9.8, color: C.text, margin: 0, fit: "shrink" });
  footer(s, 11);
}

{
  const s = pptx.addSlide();
  title(s, "Roadmap and ask", "What we bring next", "The hackathon prototype is intentionally scoped, with a clear path to a team product.");
  [["Phase 2", "GitHub OAuth, import graph traversal, investigation history"], ["Phase 3", "VS Code extension, Slack/Discord bot, team REST API"], ["Phase 4", "Pattern detection, Jira/Linear integration, on-prem option"]].forEach(([p, d], i) => {
    const x = M + i * 4.17;
    panel(s, x, 1.88, 3.82, 1.7, { fill: i === 0 ? C.bg2 : C.panel, line: i === 0 ? C.green : C.line });
    s.addText(p, { x: x + 0.28, y: 2.22, w: 1.45, h: 0.25, fontSize: 14, bold: true, color: i === 0 ? C.green : C.yellow, margin: 0 });
    s.addText(d, { x: x + 0.28, y: 2.78, w: 3.26, h: 0.34, fontSize: 10, color: C.muted, margin: 0, fit: "shrink" });
  });
  panel(s, M, 4.36, 5.85, 1.55, { fill: C.bg2, line: C.yellow });
  panel(s, 6.9, 4.36, 5.85, 1.55, { fill: C.bg2, line: C.green });
  s.addText("WHAT WE NEED", { x: 0.95, y: 4.68, w: 2.2, h: 0.2, fontSize: 10, bold: true, color: C.yellow, charSpacing: 1.3, margin: 0 });
  s.addText("Shortlisting for Pune, iQOO 15 loaner device access, mentor feedback on AI analysis quality.", { x: 0.95, y: 5.1, w: 4.9, h: 0.35, fontSize: 10.2, color: C.muted, margin: 0, fit: "shrink" });
  s.addText("WHAT WE BRING", { x: 7.25, y: 4.68, w: 2.2, h: 0.2, fontSize: 10, bold: true, color: C.green, charSpacing: 1.3, margin: 0 });
  s.addText("Working prototype, distinctive case-board UI, real multi-file AI pipeline, and a phone-first demo.", { x: 7.25, y: 5.1, w: 4.9, h: 0.35, fontSize: 10.2, color: C.text, margin: 0, fit: "shrink" });
  footer(s, 12);
}

const out = path.join(__dirname, "BugWhisperer_iQOO_Pitch_Deck.pptx");
pptx.writeFile({ fileName: out }).then(() => {
  console.log(`written: ${out}`);
});
