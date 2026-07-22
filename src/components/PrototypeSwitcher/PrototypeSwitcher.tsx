import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// PROTOTYPE-ONLY — floating variant switcher para prototipos /prototype (?variant=).
// No renderiza en build de producción. No promover a main junto con el ganador.

interface PrototypeVariant {
  key: string
  label: string
}

interface PrototypeSwitcherProps {
  variants: PrototypeVariant[]
  paramName?: string
}

export function PrototypeSwitcher({ variants, paramName = 'variant' }: PrototypeSwitcherProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const current = searchParams.get(paramName) ?? variants[0]?.key
  const index = Math.max(0, variants.findIndex((v) => v.key === current))

  const go = useCallback((next: number) => {
    const wrapped = (next + variants.length) % variants.length
    const params = new URLSearchParams(searchParams)
    params.set(paramName, variants[wrapped].key)
    setSearchParams(params, { replace: true })
  }, [searchParams, setSearchParams, variants, paramName])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
      if (e.key === 'ArrowLeft') go(index - 1)
      if (e.key === 'ArrowRight') go(index + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go, index])

  if (import.meta.env.PROD) return null
  if (variants.length === 0) return null

  const activeVariant = variants[index]

  return (
    <div
      data-testid="prototype-switcher"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-4 py-2 rounded-full bg-black text-white text-xs font-mono shadow-2xl border border-white/20 select-none"
    >
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Variante anterior"
        className="hover:text-white/70 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span data-testid="prototype-switcher-current">
        <strong>{activeVariant.key}</strong> — {activeVariant.label}
      </span>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Variante siguiente"
        className="hover:text-white/70 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
