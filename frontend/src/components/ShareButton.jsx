import { useState } from 'react'
import { Share2, Copy, Check, ExternalLink } from 'lucide-react'

export default function ShareButton({ result }) {
  const [copied, setCopied] = useState(false)

  const shareText = `🕵️ Bug Whisperer Investigation\n\n${result.case_summary}\n\n🎯 Root Cause: ${result.root_cause?.file}:${result.root_cause?.line}\n${result.root_cause?.explanation}\n\n🔧 Fix: ${result.fix?.explanation}\n\nConfidence: ${result.confidence}\n\n---\nAnalyzed with Bug Whisperer AI`

  const handleShare = async () => {
    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bug Whisperer Investigation',
          text: shareText,
        })
      } catch (err) {
        // User cancelled or error - fall back to clipboard
        if (err.name !== 'AbortError') {
          copyToClipboard()
        }
      }
    } else {
      // Fallback to clipboard
      copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = shareText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openInNewTab = () => {
    const encoded = encodeURIComponent(shareText)
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')
  }

  return (
    <div className="flex items-center gap-2">
      {/* Share button (mobile share sheet) */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-board-accent border border-board-border text-board-text
          hover:bg-board-border hover:text-board-highlight
          transition-all duration-200 text-sm font-medium
          active:scale-95"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
          border text-sm font-medium transition-all duration-200 active:scale-95
          ${copied
            ? 'bg-high/10 border-high/30 text-high'
            : 'bg-board-accent border-board-border text-board-text hover:bg-board-border hover:text-board-highlight'
          }`}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Tweet button */}
      <button
        onClick={openInNewTab}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-board-accent border border-board-border text-board-text
          hover:bg-board-border hover:text-board-highlight
          transition-all duration-200 text-sm font-medium
          active:scale-95"
      >
        <ExternalLink size={16} />
        <span className="hidden sm:inline">Tweet</span>
      </button>
    </div>
  )
}
