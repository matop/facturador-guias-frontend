import type { Guia } from '@/types'
import { backendFetch, getContext } from './http'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

interface GrupoDto {
  valorAgrupador: string
  reglaIdl: string | null
  cantidadGuias: number
  montoTotal: string
  folios: Array<{ folio: string; fecha: string }>
}

interface GuiasAgrupadasItemDto {
  cliente: { rut: string; nombre: string }
  grupos: GrupoDto[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AGRUPADOR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function colorForRegla(regla: string): string {
  let h = 0
  for (let i = 0; i < regla.length; i++) h = (h * 31 + regla.charCodeAt(i)) & 0xffff
  return AGRUPADOR_COLORS[h % AGRUPADOR_COLORS.length]
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function fetchGuias(params?: Record<string, string>): Promise<Guia[]> {
  const { empkey, periodo } = getContext()
  const qp: Record<string, string> = { periodo }
  if (params?.clienteId) qp.rut = params.clienteId

  return backendFetch<GuiasAgrupadasItemDto[]>(`/empresas/${empkey}/guias/agrupadas`, { params: qp })
    .then((items) => {
      const guias: Guia[] = []
      for (const item of items) {
        for (const grupo of item.grupos) {
          const color = colorForRegla(grupo.valorAgrupador)
          const count = grupo.folios.length
          const montoByFolio = count > 0 ? Math.round(Number(grupo.montoTotal) / count) : 0
          for (const { folio, fecha } of grupo.folios) {
            guias.push({
              id:              `${item.cliente.rut}-${folio}`,
              numero:          folio,
              clienteId:       item.cliente.rut,
              clienteNombre:   item.cliente.nombre,
              fecha,
              descripcion:     grupo.valorAgrupador,
              cantidad:        1,
              montoNeto:       montoByFolio,
              agrupadorId:     grupo.valorAgrupador,
              agrupadorCodigo: grupo.valorAgrupador,
              agrupadorColor:  color,
              agrupadorNombre: null,
              estado:          'pendiente',
            })
          }
        }
      }
      return guias
    })
}
