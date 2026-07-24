import { startTransition, useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSeleccionStore } from '@/store/seleccionStore'
import { emitirFacturas } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Guia } from '@/types'

type EstadoProforma = 'pendiente' | 'aprobada' | 'rechazada'

interface Proforma {
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  guias: Guia[]
  montoNeto: number
  iva: number
  total: number
}

const IVA_RATE = 0.19

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

function buildProformas(guias: Guia[]): Proforma[] {
  const map = new Map<string, Proforma>()
  for (const g of guias) {
    if (!map.has(g.agrupadorId)) {
      map.set(g.agrupadorId, {
        agrupadorId: g.agrupadorId,
        agrupadorCodigo: g.agrupadorCodigo,
        agrupadorColor: g.agrupadorColor,
        guias: [],
        montoNeto: 0,
        iva: 0,
        total: 0,
      })
    }
    const p = map.get(g.agrupadorId)!
    p.guias.push(g)
    p.montoNeto += g.montoNeto
    p.iva = Math.round(p.montoNeto * IVA_RATE)
    p.total = p.montoNeto + p.iva
  }
  return Array.from(map.values())
}

export default function PreviewPage() {
  const navigate = useNavigate()
  const seleccionActiva = useSeleccionStore((s) => s.seleccionActiva)
  const limpiar = useSeleccionStore((s) => s.limpiar)

  const proformas = useMemo(() => buildProformas(seleccionActiva), [seleccionActiva])

  const [estados, setEstados] = useState<Record<string, EstadoProforma>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emitidoRef = useRef(false)

  useEffect(() => {
    if (seleccionActiva.length === 0 && !emitidoRef.current) {
      navigate('/guias', { replace: true })
    }
  }, [seleccionActiva, navigate])

  useEffect(() => {
    const initial: Record<string, EstadoProforma> = {}
    for (const p of proformas) {
      initial[p.agrupadorId] = 'pendiente'
    }
    setEstados(initial)
  }, [proformas])

  function toggleEstado(agrupadorId: string, accion: 'aprobada' | 'rechazada') {
    setEstados((prev) => ({
      ...prev,
      [agrupadorId]: prev[agrupadorId] === accion ? 'pendiente' : accion,
    }))
  }

  const aprobadas = proformas.filter((p) => estados[p.agrupadorId] === 'aprobada')
  const montoTotalAprobado = aprobadas.reduce((sum, p) => sum + p.total, 0)

  const clienteNombre = seleccionActiva[0]?.clienteNombre ?? ''
  const periodo = seleccionActiva[0]?.fecha.slice(0, 7) ?? ''

  async function handleEmitir() {
    if (aprobadas.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const agrupadoresAprobados = aprobadas.map((p) => p.agrupadorId)
      const agrupadoresAnulados = proformas
        .filter((p) => estados[p.agrupadorId] === 'rechazada')
        .map((p) => p.agrupadorId)
      await emitirFacturas({ aprobadas: agrupadoresAprobados, anuladas: agrupadoresAnulados })
      emitidoRef.current = true
      startTransition(() => {
        navigate('/historial', { replace: true })
        limpiar()
      })
    } catch {
      setError('Error al emitir los DTE. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (seleccionActiva.length === 0) return null

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Previsualización de Facturas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {clienteNombre} &middot; Período {periodo}
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <span className="font-medium text-foreground">{proformas.length}</span>{' '}
            {proformas.length === 1 ? 'factura proforma' : 'facturas proforma'}
            {aprobadas.length > 0 && (
              <span className="ml-3 text-success font-medium">
                {aprobadas.length} aprobada{aprobadas.length > 1 ? 's' : ''} &middot; {clp.format(montoTotalAprobado)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Proformas */}
      <div className="flex-1 p-6 space-y-4">
        {proformas.map((p) => {
          const estado = estados[p.agrupadorId] ?? 'pendiente'
          return (
            <div
              key={p.agrupadorId}
              data-testid={`proforma-${p.agrupadorId}`}
              className={`bg-card rounded-lg border-2 transition-colors ${
                estado === 'aprobada'
                  ? 'border-success-600'
                  : estado === 'rechazada'
                    ? 'border-danger-600'
                    : 'border-border'
              }`}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-lg"
                style={{ backgroundColor: p.agrupadorColor }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{p.agrupadorCodigo}</span>
                  <span className="text-muted-foreground text-sm">&middot; {p.guias.length} guía{p.guias.length !== 1 ? 's' : ''}</span>
                </div>
                {estado !== 'pendiente' && (
                  <Badge variant={estado === 'aprobada' ? 'success' : 'danger'}>
                    {estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                  </Badge>
                )}
              </div>

              {/* Tabla de guías */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
                      <th className="px-4 py-2">N° Guía</th>
                      <th className="px-4 py-2">Fecha</th>
                      <th className="px-4 py-2">Descripción</th>
                      <th className="px-4 py-2 text-right">Monto Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.guias.map((g) => (
                      <tr key={g.id} className="border-b border-border">
                        <td className="px-4 py-2 font-mono text-foreground">{g.numero}</td>
                        <td className="px-4 py-2 text-foreground">{g.fecha}</td>
                        <td className="px-4 py-2 text-foreground">{g.descripcion}</td>
                        <td className="px-4 py-2 text-right text-foreground">{clp.format(g.montoNeto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer totales + acciones */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-b-lg">
                <div className="text-sm text-muted-foreground space-x-4">
                  <span>Neto: <strong className="text-foreground font-semibold">{clp.format(p.montoNeto)}</strong></span>
                  <span>IVA 19%: <strong className="text-foreground font-semibold">{clp.format(p.iva)}</strong></span>
                  <span>Total: <strong className="text-foreground font-semibold">{clp.format(p.total)}</strong></span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`btn-rechazar-${p.agrupadorId}`}
                    onClick={() => toggleEstado(p.agrupadorId, 'rechazada')}
                    className={
                      estado === 'rechazada'
                        ? 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive'
                        : 'text-muted-foreground hover:border-destructive hover:text-destructive'
                    }
                  >
                    Rechazar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`btn-aprobar-${p.agrupadorId}`}
                    onClick={() => toggleEstado(p.agrupadorId, 'aprobada')}
                    className={
                      estado === 'aprobada'
                        ? 'bg-success text-white border-success hover:bg-success'
                        : 'text-muted-foreground hover:border-success hover:text-success'
                    }
                  >
                    Aprobar
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-2 px-4 py-3 bg-danger-50 border border-destructive rounded-lg text-sm text-destructive" data-testid="error-emision">
          {error}
        </div>
      )}

      {/* Footer acciones */}
      <div className="bg-card border-t border-border px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          data-testid="btn-cancelar"
          onClick={() => navigate('/guias')}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="default"
          data-testid="btn-emitir"
          onClick={handleEmitir}
          disabled={aprobadas.length === 0 || loading}
        >
          {loading
            ? 'Enviando...'
            : `Enviar a facturación${aprobadas.length > 0 ? ` (${aprobadas.length})` : ''}`}
        </Button>
      </div>
    </div>
  )
}
