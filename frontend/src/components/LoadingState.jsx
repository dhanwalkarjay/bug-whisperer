import { useState, useEffect } from 'react'
import { Search, FileSearch, Database, Brain } from 'lucide-react'

const MESSAGES = [
  { icon: Search, text: 'Scanning the crime scene...' },
  { icon: Database, text: 'Reading the file system...' },
  { icon: FileSearch, text: 'Cross-referencing evidence...' },
  { icon: Brain, text: 'Analyzing the root cause...' },
]

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % MESSAGES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto text-center py-16 animate-fade-in">
      {/* Magnifying glass animation */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-board-pin/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-board-pin/50 animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-4 rounded-full bg-board-card border border-board-border flex items-center justify-center">
          <Search size={28} className="text-board-pin animate-pulse" />
        </div>
      </div>

      {/* Status message */}
      <div className="space-y-3">
        {MESSAGES.map((msg, i) => {
          const Icon = msg.icon
          const isActive = i === currentStep
          const isPast = i < currentStep

          return (
            <div
              key={i}
              className={`flex items-center justify-center gap-2 text-sm transition-all duration-500 ${
                isActive
                  ? 'text-board-highlight opacity-100'
                  : isPast
                    ? 'text-board-pin opacity-60'
                    : 'text-board-muted/30 opacity-30'
              }`}
            >
              <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
              <span>{msg.text}</span>
              {isPast && <span className="text-high text-xs">✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
