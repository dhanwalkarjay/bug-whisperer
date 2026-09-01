import { FileText, AlertTriangle, Search, HelpCircle, Crosshair } from 'lucide-react'

const ROLE_CONFIG = {
  crime_scene: {
    label: 'Crime Scene',
    icon: AlertTriangle,
    borderColor: 'border-crime',
    bgColor: 'bg-crime/5',
    textColor: 'text-crime',
    badgeBg: 'bg-crime/20',
    glowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
  },
  prime_suspect: {
    label: 'Prime Suspect',
    icon: Crosshair,
    borderColor: 'border-suspect',
    bgColor: 'bg-suspect/5',
    textColor: 'text-suspect',
    badgeBg: 'bg-suspect/20',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
  },
  accomplice: {
    label: 'Accomplice',
    icon: Search,
    borderColor: 'border-accomplice',
    bgColor: 'bg-accomplice/5',
    textColor: 'text-accomplice',
    badgeBg: 'bg-accomplice/20',
    glowColor: 'shadow-[0_0_12px_rgba(59,130,246,0.12)]',
  },
  red_herring: {
    label: 'Red Herring',
    icon: HelpCircle,
    borderColor: 'border-redherring',
    bgColor: 'bg-redherring/5',
    textColor: 'text-redherring',
    badgeBg: 'bg-redherring/20',
    glowColor: '',
  },
}

export default function EvidenceCard({ evidence, index, isRootCause }) {
  const role = evidence.role || 'accomplice'
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.accomplice
  const Icon = config.icon

  // Alternating slight rotations for the "pinned" effect
  const rotation = index % 2 === 0 ? 'rotate-[-0.3deg]' : 'rotate-[0.3deg]'
  const isPrime = role === 'prime_suspect' || isRootCause

  return (
    <div
      className={`relative group animate-pin-drop opacity-0 ${rotation} md:ml-4`}
      style={{ animationDelay: `${index * 150}ms` }}
      data-evidence-index={index}
      data-role={role}
    >
      {/* Pin dot */}
      <div className={`absolute -top-2 left-4 md:left-6 w-3 h-3 md:w-4 md:h-4 rounded-full
        ${isPrime ? 'bg-suspect' : 'bg-board-pin'}
        border-2 border-board-highlight/40 shadow-lg z-10
        group-hover:scale-110 transition-transform duration-200`}
      />

      {/* Card */}
      <div
        className={`relative p-3 md:p-5 rounded-xl border-2
          ${config.borderColor} ${config.bgColor}
          ${isPrime ? config.glowColor + ' border-2 shadow-pin-hover' : 'shadow-pin'}
          bg-board-card/80 backdrop-blur-sm
          group-hover:-translate-y-1 transition-all duration-300`}
      >
        {/* Role badge */}
        <div className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full
          ${config.badgeBg} ${config.textColor} text-[10px] md:text-xs font-semibold mb-2 md:mb-3`}>
          <Icon size={10} className="md:w-3 md:h-3" />
          {config.label}
        </div>

        {/* File + Line */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
          <FileText size={12} className="text-board-muted flex-shrink-0 md:w-3.5 md:h-3.5" />
          <span className="font-mono text-[11px] md:text-sm text-board-highlight truncate">
            {evidence.file}
          </span>
          <span className="text-board-muted text-[10px] md:text-xs flex-shrink-0">
            :{evidence.line}
          </span>
        </div>

        {/* Note */}
        <p className="text-board-text text-xs md:text-sm leading-relaxed">
          {evidence.note}
        </p>

        {/* Decorative corner tape */}
        {isPrime && (
          <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 overflow-hidden rounded-tr-xl">
            <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rotate-45 bg-suspect/30" />
          </div>
        )}
      </div>
    </div>
  )
}
