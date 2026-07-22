import type { Guia } from '@/types'

export const getMes = (fecha: string): string => fecha.slice(0, 7) // 'YYYY-MM'

// Regla de no-mezcla (CLAUDE.md § Reglas de Negocio, no negociable): una
// factura nunca puede mezclar guías de distintos clientes ni de distintos
// meses. Fuente única de este chequeo — usado tanto por seleccionStore
// (para no descartar lotes en silencio) como por useGuiasFilters (para
// habilitar/ocultar la acción de facturación masiva por filtro).
export function esLoteHomogeneo(guias: Guia[]): boolean {
  if (guias.length === 0) return false
  const clienteId = guias[0].clienteId
  const mes = getMes(guias[0].fecha)
  return guias.every((g) => g.clienteId === clienteId && getMes(g.fecha) === mes)
}
