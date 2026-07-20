import type { Factura } from '@/types'
import { backendFetch, getContext } from './http'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

interface ProformaDto {
  id: string
  folio: string
  cliente: { rut: string; nombre: string }
  regla: { id: string; descripcion: string }
  cantidadGuias: number
  montoTotal: string
  estado: string
  fecha: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESTADO_MAP: Record<string, Factura['estado']> = {
  BORRADOR: 'borrador',
  APROBADA: 'aprobada',
  ANULADA:  'rechazada',
  EMITIDA:  'emitida',
  FALLIDA:  'fallida',
}

function mapEstado(raw: string): Factura['estado'] {
  return ESTADO_MAP[raw.toUpperCase()] ?? 'borrador'
}

function mapProformaToFactura(d: ProformaDto, periodo: string): Factura {
  const neto = Number(d.montoTotal)
  const iva  = Math.round(neto * 0.19)
  return {
    id:              d.id,
    clienteId:       d.cliente.rut,
    clienteNombre:   d.cliente.nombre,
    agrupadorId:     d.regla.id,
    agrupadorCodigo: d.regla.descripcion,
    folio:           d.folio,
    periodo,
    montoNeto:       neto,
    iva,
    total:           neto + iva,
    fechaEmision:    d.fecha,
    estado:          mapEstado(d.estado),
    guias:           [],
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function fetchFacturas(params?: Record<string, string>): Promise<Factura[]> {
  const { empkey, periodo } = getContext()
  return backendFetch<ProformaDto[]>(`/empresas/${empkey}/facturas/proforma`, {
    params: { periodo, ...params },
  }).then((dtos) => dtos.map((d) => mapProformaToFactura(d, periodo)))
}

export async function emitirFacturas({
  aprobadas,
  anuladas,
}: {
  aprobadas: string[]
  anuladas: string[]
}): Promise<Factura[]> {
  const { empkey, periodo } = getContext()

  // 1. Crear/regenerar proformas BORRADOR (idempotente)
  await backendFetch(`/empresas/${empkey}/facturas/proforma/generar`, {
    method: 'POST',
    params: { periodo },
  })

  // 2. Obtener proformas con ids
  const dtos = await backendFetch<ProformaDto[]>(`/empresas/${empkey}/facturas/proforma`, {
    params: { periodo },
  })

  // 3. Aprobar / anular en paralelo
  const findDto = (reglaId: string) => dtos.find((d) => d.regla.id === reglaId)

  await Promise.all([
    ...aprobadas
      .map(findDto)
      .filter((d): d is ProformaDto => d !== undefined)
      .map((d) =>
        backendFetch(`/empresas/${empkey}/facturas/proforma/${d.id}/aprobar`, { method: 'PATCH' }),
      ),
    ...anuladas
      .map(findDto)
      .filter((d): d is ProformaDto => d !== undefined)
      .map((d) =>
        backendFetch(`/empresas/${empkey}/facturas/proforma/${d.id}/anular`, { method: 'PATCH' }),
      ),
  ])

  return fetchFacturas()
}
