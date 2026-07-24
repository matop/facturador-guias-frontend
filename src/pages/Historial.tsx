import { useQuery } from '@tanstack/react-query'
import { fetchFacturas } from '@/services/api'
import { useQueryContext } from '@/hooks/useQueryContext'
import { queryKeys } from '@/lib/queryKeys'
import { Badge } from '@/components/ui/badge'
import type { Factura } from '@/types'

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

type BadgeVariant = 'success' | 'primary' | 'danger' | 'default'

const ESTADO_BADGE: Record<
  Factura['estado'],
  { label: string; variant: BadgeVariant }
> = {
  emitida:   { label: 'Emitida',   variant: 'success'  },
  aprobada:  { label: 'Aprobada',  variant: 'primary'  },
  rechazada: { label: 'Rechazada', variant: 'danger'   },
  fallida:   { label: 'Fallida',   variant: 'danger'   },
  borrador:  { label: 'Borrador',  variant: 'default'  },
}

function formatFecha(iso?: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: i === 1 ? '60%' : '80%' }} />
        </td>
      ))}
    </tr>
  )
}

export default function HistorialPage() {
  const ctx = useQueryContext()

  const {
    data: facturas = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: queryKeys.facturas(ctx),
    queryFn: () => fetchFacturas(),
  })

  const totalEmitidas = facturas.filter((f) => f.estado === 'emitida').length
  const montoTotal = facturas.reduce((sum, f) => sum + f.total, 0)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Historial de Facturación</h1>
          {!loading && facturas.length > 0 && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{facturas.length}</strong>{' '}
                {facturas.length === 1 ? 'factura' : 'facturas'}
              </span>
              <span className="text-border">|</span>
              <span>
                <strong className="text-foreground">{totalEmitidas}</strong> emitidas
              </span>
              <span className="text-border">|</span>
              <span>
                Total: <strong className="text-foreground">{clp.format(montoTotal)}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6">
        {isError && (
          <div className="mb-4 px-4 py-3 bg-danger-50 border border-destructive rounded-lg text-sm text-destructive" data-testid="error-historial">
            Error al cargar el historial.
          </div>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Agrupador</th>
                  <th className="px-4 py-3">Período</th>
                  <th className="px-4 py-3">Fecha Emisión</th>
                  <th className="px-4 py-3 text-right">Monto Neto</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

                {!loading && facturas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground" data-testid="empty-historial">
                      No hay facturas emitidas en este período
                    </td>
                  </tr>
                )}

                {!loading &&
                  facturas.map((f) => {
                    const badge = ESTADO_BADGE[f.estado] ?? ESTADO_BADGE.borrador
                    return (
                      <tr
                        key={f.id}
                        data-testid={`fila-factura-${f.id}`}
                        className="border-b border-border hover:bg-accent transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-foreground">{f.folio}</td>
                        <td className="px-4 py-3 text-foreground">{f.clienteNombre ?? f.clienteId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.agrupadorCodigo ?? f.agrupadorId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.periodo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatFecha(f.fechaEmision)}</td>
                        <td className="px-4 py-3 text-right text-foreground">{clp.format(f.montoNeto)}</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">{clp.format(f.total)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
