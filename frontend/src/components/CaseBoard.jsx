import { useRef, useEffect, useState } from 'react'
import { FileText, ChevronDown, Smartphone } from 'lucide-react'
import EvidenceCard from './EvidenceCard'
import FixPanel from './FixPanel'
import ShareButton from './ShareButton'

export default function CaseBoard({ result, onNewCase }) {
  const boardRef = useRef(null)
  const [showLines, setShowLines] = useState(false)
  const [cardPositions, setCardPositions] = useState([])

  useEffect(() => {
    // Delay showing connector lines until cards are positioned
    const timer = setTimeout(() => {
      setShowLines(true)
      updateCardPositions()
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Update positions on resize (mobile rotation, etc.)
  useEffect(() => {
    const handleResize = () => updateCardPositions()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updateCardPositions = () => {
    if (!boardRef.current) return
    const cards = boardRef.current.querySelectorAll('[data-evidence-index]')
    const positions = []
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      const boardRect = boardRef.current.getBoundingClientRect()
      positions.push({
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + 10,
        index: parseInt(card.dataset.evidenceIndex),
        role: card.dataset.role,
      })
    })
    setCardPositions(positions)
  }

  // Find root cause position for connector lines
  const rootCauseIdx = result.evidence.findIndex(
    (e) => e.role === 'prime_suspect'
  )

  return (
    <div ref={boardRef} className="w-full max-w-4xl mx-auto relative px-2 md:px-0">
      {/* Case Summary */}
      <div className="mb-6 md:mb-8 animate-slide-up opacity-0">
        <div className="bg-board-card border border-board-border rounded-2xl p-4 md:p-6 relative overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-board-pin/20 to-transparent" />
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-board-accent flex items-center justify-center flex-shrink-0 mt-1">
              <FileText size={20} className="text-board-pin" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-detective text-xl md:text-2xl font-bold text-board-highlight mb-2">
                Case Summary
              </h2>
              <p className="text-board-text text-sm md:text-base leading-relaxed">
                {result.case_summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First: Share + Stats Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-board-muted">
          <Smartphone size={16} className="text-board-pin" />
          <span>{result.files_fetched} files analyzed</span>
          <span className="px-2 py-0.5 rounded-full bg-board-accent text-xs">
            {result.trace_language}
          </span>
        </div>
        <ShareButton result={result} />
      </div>

      {/* Evidence Board */}
      <div className="mb-6 md:mb-8">
        <h3 className="font-detective text-lg md:text-xl font-semibold text-board-highlight mb-4 md:mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-suspect animate-pulse" />
          Evidence Board
        </h3>

        {/* SVG Connector Lines - Hidden on small mobile for performance */}
        {showLines && rootCauseIdx >= 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block" style={{ position: 'absolute' }}>
            {cardPositions.map((pos, i) => {
              if (pos.role === 'prime_suspect') return null
              const rootPos = cardPositions[rootCauseIdx]
              if (!rootPos) return null

              const lineKey = `line-${i}`
              const pathD = `M ${pos.x} ${pos.y} C ${pos.x} ${pos.y + 40}, ${rootPos.x} ${rootPos.y - 40}, ${rootPos.x} ${rootPos.y}`

              return (
                <path
                  key={lineKey}
                  d={pathD}
                  fill="none"
                  stroke={pos.role === 'crime_scene' ? '#ef4444' : '#4a3f2f'}
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                  opacity={0.5}
                  className="animate-draw-line"
                  style={{ strokeDashoffset: 1000 }}
                />
              )
            })}
          </svg>
        )}

        {/* Evidence Cards - Mobile Optimized */}
        <div className="space-y-3 md:space-y-4 relative z-20">
          {result.evidence.map((evidence, index) => (
            <EvidenceCard
              key={index}
              evidence={evidence}
              index={index}
              isRootCause={evidence.role === 'prime_suspect'}
            />
          ))}
        </div>
      </div>

      {/* Fix Panel */}
      {result.fix && (
        <FixPanel fix={result.fix} confidence={result.confidence} />
      )}

      {/* New Case Button - Mobile Friendly */}
      <div className="mt-8 md:mt-10 text-center animate-fade-in opacity-0" style={{ animationDelay: '800ms' }}>
        <button
          onClick={onNewCase}
          className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl
            bg-board-card border border-board-border text-board-text
            hover:bg-board-accent hover:text-board-highlight
            transition-all duration-200 group text-sm md:text-base
            active:scale-95"
        >
          <ChevronDown size={16} className="rotate-[270deg] group-hover:-translate-x-1 transition-transform" />
          New Investigation
        </button>
      </div>
    </div>
  )
}
