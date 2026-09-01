import { useState } from 'react'
import { Copy, Check, FileCode, Lightbulb, Shield } from 'lucide-react'

export default function FixPanel({ fix, confidence }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fix.suggested_code)
      setCopied(true)
      // Haptic feedback on copy (mobile)
      if (navigator.vibrate) navigator.vibrate(50)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = fix.suggested_code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(50)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const confidenceColors = {
    high: 'text-high',
    medium: 'text-suspect',
    low: 'text-crime',
  }

  return (
    <div className="animate-stamp opacity-0" style={{ animationDelay: '600ms' }}>
      {/* Case Closed Banner */}
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-5 md:mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-board-border" />
        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full
          border-2 border-high/40 bg-high/10">
          <Shield size={14} className="text-high md:w-[18px] md:h-[18px]" />
          <span className="font-detective text-sm md:text-lg font-bold text-high tracking-wide">
            Case Closed
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-board-border" />
      </div>

      {/* Fix Card */}
      <div className="relative bg-board-card border-2 border-high/30 rounded-2xl p-4 md:p-6 lg:p-8
        shadow-[0_0_30px_rgba(34,197,94,0.1)] animate-pulse-glow">
        {/* Confidence badge - mobile top-right */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 lg:top-6 lg:right-6">
          <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider
            border-2 ${confidence === 'high'
              ? 'border-high/40 bg-high/10 text-high'
              : confidence === 'medium'
                ? 'border-suspect/40 bg-suspect/10 text-suspect'
                : 'border-crime/40 bg-crime/10 text-crime'
            }`}>
            {confidence} confidence
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-high/15 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={16} className="text-high md:w-5 md:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-detective text-lg md:text-xl font-bold text-board-highlight">
              Suggested Fix
            </h3>
            <p className="text-[11px] md:text-sm text-board-muted truncate">
              {fix.file}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-board-text text-xs md:text-sm leading-relaxed mb-4 md:mb-5 pl-10 md:pl-[52px]">
          {fix.explanation}
        </p>

        {/* Code Block - Mobile Optimized */}
        <div className="relative bg-board-bg rounded-xl border border-board-border overflow-hidden">
          {/* Code header */}
          <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2 border-b border-board-border bg-board-card/50">
            <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-board-muted truncate">
              <FileCode size={12} className="flex-shrink-0 md:w-3.5 md:h-3.5" />
              <span className="font-mono truncate">{fix.file}</span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1 rounded-lg text-[10px] md:text-xs font-medium
                transition-all duration-200 flex-shrink-0 ml-2
                ${copied
                  ? 'bg-high/20 text-high'
                  : 'bg-board-accent hover:bg-board-border text-board-text hover:text-board-highlight'
                }`}
            >
              {copied ? <Check size={12} className="md:w-3.5 md:h-3.5" /> : <Copy size={12} className="md:w-3.5 md:h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Code content */}
          <pre className="p-3 md:p-4 overflow-x-auto text-xs md:text-sm leading-relaxed">
            <code className="font-mono text-board-highlight">
              {fix.suggested_code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
