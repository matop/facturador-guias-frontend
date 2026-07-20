/**
 * Utilidades compartidas para cálculo de períodos.
 *
 * Centraliza la lógica que antes estaba duplicada en:
 *  - src/services/http.ts          (periodoToYYYYMM)
 *  - src/pages/Clientes.tsx        (getMesLabel / MESES)
 *  - src/components/DateFilter/DateFilter.tsx  (getMonthBounds)
 */

export type Periodo = 'actual' | 'anterior'

const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Devuelve el objeto Date correspondiente al primer día del período. */
function periodoToDate(periodo: Periodo): Date {
  const now = new Date()
  const offset = periodo === 'anterior' ? -1 : 0
  return new Date(now.getFullYear(), now.getMonth() + offset, 1)
}

/**
 * Convierte un período en su representación 'YYYY-MM'.
 *
 * Ejemplos (ejecutado en mayo 2026):
 *   periodoToYYYYMM('actual')   → '2026-05'
 *   periodoToYYYYMM('anterior') → '2026-04'
 */
export function periodoToYYYYMM(periodo: Periodo): string {
  const d = periodoToDate(periodo)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

/**
 * Devuelve el rango completo de fechas y la etiqueta legible del período.
 *
 * Retorna:
 *   from  - primer día del mes en formato 'YYYY-MM-DD'
 *   to    - último día del mes en formato 'YYYY-MM-DD'
 *   label - nombre del mes y año, e.g. 'Mayo 2026'
 *
 * Ejemplos (ejecutado en mayo 2026):
 *   periodoToRange('actual')   → { from: '2026-05-01', to: '2026-05-31', label: 'Mayo 2026' }
 *   periodoToRange('anterior') → { from: '2026-04-01', to: '2026-04-30', label: 'Abril 2026' }
 */
export function periodoToRange(periodo: Periodo): { from: string; to: string; label: string } {
  const first = periodoToDate(periodo)
  const year  = first.getFullYear()
  const month = first.getMonth() // 0-indexed

  const from  = `${year}-${pad(month + 1)}-01`
  // new Date(year, month + 1, 0) → last day of `month`
  const last  = new Date(year, month + 1, 0)
  const to    = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`
  const label = `${MESES_ES[month]} ${year}`

  return { from, to, label }
}
