import { useState } from 'react'
import { Search, GitBranch, FileText, AlertCircle, Sparkles } from 'lucide-react'
import CameraInput from './CameraInput'

const DEMO_TRACES = [
  {
    name: 'Python — Null Reference',
    repo: 'https://github.com/pallets/flask',
    trace: `Traceback (most recent call last):
  File "app.py", line 15, in process_request
    result = handler.parse(user_input)
  File "utils/parser.py", line 42, in parse
    cleaned = data.strip().lower()
AttributeError: 'NoneType' object has no attribute 'strip'`,
  },
  {
    name: 'JavaScript — Type Error',
    repo: 'https://github.com/expressjs/express',
    trace: `TypeError: Cannot read properties of undefined (reading 'headers')
    at authenticate (middleware/auth.js:23:18)
    at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
    at next (node_modules/express/lib/router/route.js:144:13)
    at middleware/cors.js:28:9`,
  },
]

export default function InputPanel({ onSubmit, isLoading }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [stackTrace, setStackTrace] = useState('')
  const [error, setError] = useState('')
  const [cameraMode, setCameraMode] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!repoUrl.trim()) {
      setError('Enter a GitHub repository URL')
      return
    }
    if (!stackTrace.trim()) {
      setError('Paste a stack trace or error log')
      return
    }

    onSubmit({ repo_url: repoUrl.trim(), stack_trace: stackTrace.trim() })
  }

  const loadDemo = (demo) => {
    setRepoUrl(demo.repo)
    setStackTrace(demo.trace)
    setError('')
  }

  const handleCameraCapture = (imageData) => {
    // In production, this would process the image with OCR
    // For now, show a message asking user to paste the text
    setCameraMode(false)
    setError('Photo captured! Please also paste the stack trace text from the image above.')
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header - Mobile Optimized */}
      <div className="text-center mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-board-card border border-board-border text-board-muted text-xs md:text-sm mb-4 md:mb-6">
          <span className="w-2 h-2 rounded-full bg-high animate-pulse"></span>
          AI-Powered Debugging
        </div>
        <h1 className="font-detective text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-board-highlight mb-3 md:mb-4 tracking-tight">
          Bug Whisperer
        </h1>
        <p className="text-board-muted text-sm md:text-lg max-w-xl mx-auto leading-relaxed px-4">
          Paste a stack trace and a repo link. Our detective AI investigates your
          codebase, traces the root cause, and proposes the fix.
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleSubmit} className="relative">
        {/* Card */}
        <div className="bg-board-card border border-board-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-pin animate-fade-in">
          {/* Demo buttons - Mobile Scrollable */}
          <div className="mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-board-muted mb-2 md:mb-3 font-medium">Try a demo:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {DEMO_TRACES.map((demo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => loadDemo(demo)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs md:text-sm rounded-lg bg-board-accent border border-board-border
                    text-board-text hover:bg-board-border hover:text-board-highlight
                    transition-all duration-200 cursor-pointer"
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>

          {/* Repository URL */}
          <div className="mb-4 md:mb-5">
            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-board-text mb-2">
              <GitBranch size={14} className="text-board-muted" />
              Repository URL
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              disabled={isLoading}
              className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl bg-board-bg border border-board-border
                text-board-highlight placeholder-board-muted/50 font-mono text-xs md:text-sm
                focus:outline-none focus:border-board-pin focus:ring-1 focus:ring-board-pin/30
                transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Stack Trace */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-board-text">
                <FileText size={14} className="text-board-muted" />
                Stack Trace / Error Log
              </label>
              <CameraInput onCapture={handleCameraCapture} />
            </div>
            <textarea
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              placeholder={`Traceback (most recent call last):\n  File "app.py", line 15, in main\n    result = process(data)\nTypeError: unsupported operand type(s)`}
              disabled={isLoading}
              rows={6}
              className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-xl bg-board-bg border border-board-border
                text-board-highlight placeholder-board-muted/50 font-mono text-xs md:text-sm leading-relaxed
                focus:outline-none focus:border-board-pin focus:ring-1 focus:ring-board-pin/30
                transition-all duration-200 resize-y disabled:opacity-50"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 mb-4 rounded-xl bg-crime/10 border border-crime/30 text-crime text-xs md:text-sm">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button - Mobile Optimized */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 md:py-3.5 rounded-xl font-semibold text-sm md:text-base
              bg-gradient-to-r from-board-pin to-board-highlight text-board-bg
              hover:from-board-highlight hover:to-board-pin
              active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
              flex items-center justify-center gap-2"
          >
            <Search size={16} />
            {isLoading ? 'Investigating...' : 'Investigate'}
          </button>

          {/* Mobile Tip */}
          <p className="text-center text-xs text-board-muted/50 mt-3 md:hidden">
            Tip: Tap Camera to photograph a stack trace
          </p>
        </div>

        {/* Decorative pin */}
        <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full
          bg-gradient-to-b from-board-pin to-board-accent border-2 border-board-highlight/30
          shadow-lg z-10"></div>
      </form>

      {/* Mobile-First Features Banner */}
      <div className="mt-6 md:mt-8 grid grid-cols-3 gap-2 md:gap-4 px-2">
        <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-board-card/50 border border-board-border/50">
          <Sparkles size={18} className="text-board-pin mb-2" />
          <span className="text-[10px] md:text-xs text-board-muted">AI Analysis</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-board-card/50 border border-board-border/50">
          <FileText size={18} className="text-board-pin mb-2" />
          <span className="text-[10px] md:text-xs text-board-muted">Multi-File</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-board-card/50 border border-board-border/50">
          <Search size={18} className="text-board-pin mb-2" />
          <span className="text-[10px] md:text-xs text-board-muted">Root Cause</span>
        </div>
      </div>
    </div>
  )
}
