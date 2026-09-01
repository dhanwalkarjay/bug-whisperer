import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="w-full max-w-md mx-auto text-center py-16 animate-fade-in">
      {/* Error icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-crime/10 border-2 border-crime/30
        flex items-center justify-center">
        <AlertTriangle size={36} className="text-crime" />
      </div>

      {/* Message */}
      <h3 className="font-detective text-2xl font-bold text-board-highlight mb-3">
        Investigation Failed
      </h3>
      <p className="text-board-muted text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        {error || 'Something went wrong during the investigation. The trail went cold.'}
      </p>

      {/* Retry button */}
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-board-card border border-board-border text-board-text
          hover:bg-board-accent hover:text-board-highlight
          transition-all duration-200"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  )
}
