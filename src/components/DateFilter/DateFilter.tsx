import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarX2 } from 'lucide-react'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToRange } from '@/utils/periodo'

export interface DateRange {
  from: string | null
  to: string | null
}

export interface DateFilterProps {
  onChange: (range: DateRange) => void
}

// ─── component ────────────────────────────────────────────────────────────────

export function DateFilter({ onChange }: DateFilterProps) {
  const periodo = usePeriodoStore((s) => s.periodo)
  const setPeriodo = usePeriodoStore((s) => s.setPeriodo)

  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [isCustomRange, setIsCustomRange] = useState(false)

  const { from: boundsMin, to: boundsMax, label: boundsLabel } = periodoToRange(periodo)

  // Reset when period changes
  useEffect(() => {
    setFromInput('')
    setToInput('')
    setIsCustomRange(false)
  }, [periodo])

  // Fire onChange whenever range state changes
  useEffect(() => {
    if (!isCustomRange) {
      onChange({ from: boundsMin, to: boundsMax })
    } else {
      onChange({
        from: fromInput || null,
        to: toInput || null,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromInput, toInput, isCustomRange, boundsMin, boundsMax])

  function togglePeriodo() {
    setPeriodo(periodo === 'actual' ? 'anterior' : 'actual')
  }

  function handleFromChange(val: string) {
    setFromInput(val)
    setIsCustomRange(true)
  }

  function handleToChange(val: string) {
    setToInput(val)
    setIsCustomRange(true)
  }

  function resetRange() {
    setFromInput('')
    setToInput('')
    setIsCustomRange(false)
  }

  return (
    <div
      data-testid="date-filter"
      className="flex items-center gap-3 flex-wrap bg-card border border-border rounded-xl px-4 py-3"
    >
      {/* ── Period navigation ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        {/* Tab: Mes Anterior */}
        <button
          type="button"
          data-testid="tab-anterior"
          onClick={() => setPeriodo('anterior')}
          className={[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            periodo === 'anterior'
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          ].join(' ')}
        >
          Mes Anterior
        </button>

        {/* Tab: Mes Actual */}
        <button
          type="button"
          data-testid="tab-actual"
          onClick={() => setPeriodo('actual')}
          className={[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            periodo === 'actual'
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          ].join(' ')}
        >
          Mes Actual
        </button>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border" />

      {/* ── Arrow + month label ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          data-testid="periodo-prev"
          onClick={togglePeriodo}
          aria-label="Período anterior"
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          data-testid="periodo-label"
          className="font-mono text-sm font-semibold text-foreground min-w-[108px] text-center select-none"
        >
          {boundsLabel}
        </span>

        <button
          type="button"
          data-testid="periodo-next"
          onClick={togglePeriodo}
          aria-label="Período siguiente"
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border" />

      {/* ── Date range picker ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">
          Desde
        </label>
        <input
          data-testid="date-from"
          type="date"
          value={fromInput}
          min={boundsMin}
          max={toInput || boundsMax}
          onChange={(e) => handleFromChange(e.target.value)}
          className="border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <label className="text-xs font-medium text-muted-foreground">
          Hasta
        </label>
        <input
          data-testid="date-to"
          type="date"
          value={toInput}
          min={fromInput || boundsMin}
          max={boundsMax}
          onChange={(e) => handleToChange(e.target.value)}
          className="border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* ── "Todo el mes" reset button (only when custom range active) ── */}
      {isCustomRange && (
        <button
          type="button"
          data-testid="todo-el-mes"
          onClick={resetRange}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <CalendarX2 className="w-3.5 h-3.5" />
          Todo el mes
        </button>
      )}
    </div>
  )
}
