import { useState, useEffect } from 'react'
import { Search, Github, Zap, Download, Smartphone } from 'lucide-react'
import InputPanel from './components/InputPanel'
import CaseBoard from './components/CaseBoard'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'

const API_BASE = '/api'

function App() {
  const [state, setState] = useState('input') // input | loading | result | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration failed:', err)
        })
      })
    }
  }, [])

  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  const handleInvestigate = async ({ repo_url, stack_trace }) => {
    setState('loading')
    setError('')

    try {
      const response = await fetch(`${API_BASE}/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url, stack_trace }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.detail || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      setState('result')

      // Haptic feedback on success (mobile)
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to the backend server. Make sure the API is running on port 8000.')
      } else {
        setError(err.message || 'An unexpected error occurred')
      }
      setState('error')

      // Haptic feedback on error (mobile)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100])
      }
    }
  }

  const handleNewCase = () => {
    setState('input')
    setResult(null)
    setError('')
  }

  const handleRetry = () => {
    setState('input')
    setError('')
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative z-10 flex flex-col">
      {/* Nav - Mobile Optimized */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-board-bg/80 border-b border-board-border safe-area-top">
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-board-pin to-board-highlight
              flex items-center justify-center">
              <Search size={14} className="text-board-bg" />
            </div>
            <span className="font-detective text-base md:text-lg font-bold text-board-highlight">
              Bug Whisperer
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Install PWA button */}
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg
                  bg-board-accent border border-board-border text-board-text text-xs
                  hover:bg-board-border transition-all duration-200
                  active:scale-95"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-board-muted">
              <Zap size={14} className="text-high" />
              Powered by Groq
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-board-muted hover:text-board-highlight transition-colors p-1"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-3 md:px-4 py-6 md:py-12">
        {state === 'input' && (
          <InputPanel onSubmit={handleInvestigate} isLoading={false} />
        )}

        {state === 'loading' && (
          <>
            <InputPanel onSubmit={handleInvestigate} isLoading={true} />
            <LoadingState />
          </>
        )}

        {state === 'result' && result && (
          <CaseBoard result={result} onNewCase={handleNewCase} />
        )}

        {state === 'error' && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}
      </main>

      {/* Footer - Mobile Optimized */}
      <footer className="border-t border-board-border py-4 md:py-6 mt-auto safe-area-bottom">
        <div className="max-w-5xl mx-auto px-3 md:px-4 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-board-muted">
          <span>Built with</span>
          <span className="text-crime">♥</span>
          <span>for hackathon judges who know the pain of debugging at 2am</span>
        </div>
        <div className="text-center mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-board-card/50 border border-board-border/50 text-[10px] text-board-muted/50">
            <Smartphone size={10} />
            Mobile-first • PWA Ready
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
