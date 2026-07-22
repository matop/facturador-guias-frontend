import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, FileText, Tag, Receipt, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { MetricCard } from '@/components/MetricCard'
import type { SummaryRow } from '@/components/ConfirmDialog/ConfirmDialog'
import { DateFilter } from '@/components/DateFilter'
import { useSeleccionStore } from '@/store/seleccionStore'
import { fetchGuias, fetchClientes } from '@/services/api'
import { getChipTextColor } from '@/utils/agrupadorColors'
import { useGuiasFilters } from '@/hooks/useGuiasFilters'
import type { Guia, Cliente } from '@/types'

const clpFmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

function fmtMonto(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return clpFmt.format(n)
}

export default function GuiasPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const seleccionActiva = useSeleccionStore((s) => s.seleccionActiva)
  const agregar = useSeleccionStore((s) => s.agregar)
  const quitar = useSeleccionStore((s) => s.quitar)

  const [guias, setGuias] = useState<Guia[]>([])
  const [loading, setLoading] = useState(true)
  const [guiasError, setGuiasError] = useState<Error | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const {
    busqueda, setBusqueda,
    filtroCliente, setFiltroCliente,
    filtroAgrupador, setFiltroAgrupador,
    busquedaAgrupador, setBusquedaAgrupador,
    dateRange, setDateRange,
    guiasPreFiltradas, guiasFiltradas,
    agrupadores, agrupadoresFiltrados,
    montoTotal, montoFiltrado,
    hasActiveFilter, filtroEsHomogeneo,
  } = useGuiasFilters(guias, searchParams.get('clienteId') ?? '')

  useEffect(() => {
    fetchClientes().then(setClientes).catch(() => setClientes([]))
  }, [])

  const loadGuias = useCallback(async () => {
    setLoading(true)
    setGuiasError(null)
    try {
      const params: Record<string, string> = {}
      if (filtroCliente)  params.clienteId = filtroCliente
      if (dateRange.from) params.from = dateRange.from
      if (dateRange.to)   params.to   = dateRange.to
      const data = await fetchGuias(params)
      setGuias(data)
    } catch (err) {
      setGuiasError(err instanceof Error ? err : new Error('Error al cargar guías'))
      setGuias([])
    } finally {
      setLoading(false)
    }
  }, [filtroCliente, dateRange])

  useEffect(() => {
    loadGuias()
  }, [loadGuias])

  useEffect(() => {
    useSeleccionStore.getState().limpiar()
  }, [filtroCliente])

  const selectedIds = useMemo(
    () => new Set(seleccionActiva.map((g) => g.id)),
    [seleccionActiva],
  )

  const handleSeleccionChange = useCallback((guia: Guia, checked: boolean) => {
    if (checked) agregar(guia)
    else quitar(guia.id)
  }, [agregar, quitar])

  const montoSeleccion = useMemo(
    () => seleccionActiva.reduce((s, g) => s + g.montoNeto, 0),
    [seleccionActiva]
  )

  const clienteActivo: Cliente | undefined = clientes.find((c) => c.id === filtroCliente)

  const handleFacturarAgrupador = (_agrupadorId: string, agrupadorGuias: Guia[]) => {
    useSeleccionStore.getState().agregarLote(agrupadorGuias)
    setDialogOpen(true)
  }

  const handleFacturarFiltro = () => {
    useSeleccionStore.getState().agregarLote(guiasFiltradas)
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    setDialogOpen(false)
    navigate('/preview')
  }

  const handleCancel = () => {
    useSeleccionStore.getState().limpiar()
    setDialogOpen(false)
  }

  // Build summary rows for the confirm dialog
  const dialogSummary: SummaryRow[] = useMemo(() => {
    const iva = Math.round(montoSeleccion * 0.19)
    return [
      { label: 'Guías seleccionadas', value: String(seleccionActiva.length) },
      { label: 'Monto Neto', value: clpFmt.format(montoSeleccion) },
      { label: 'IVA (19%)', value: clpFmt.format(iva) },
      { label: 'Total con IVA', value: clpFmt.format(montoSeleccion + iva), highlight: true },
    ]
  }, [seleccionActiva.length, montoSeleccion])

  return (
    <div data-testid="guias-page" className="space-y-4">

      {/* Breadcrumb cuando hay cliente activo */}
      {clienteActivo && (
        <div data-testid="breadcrumb" className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setFiltroCliente('')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Clientes
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{clienteActivo.nombre}</span>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono border"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--primary)',
              borderColor: 'var(--primary)' + '44',
            }}
          >
            {clienteActivo.rut}
          </span>
        </div>
      )}

      <ErrorBanner error={guiasError} />

      {/* Metric cards */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3" data-testid="guias-metricas">
          <MetricCard
            icon={<FileText className="w-3.5 h-3.5" aria-hidden="true" />}
            label="Guías de despacho"
            value={guiasPreFiltradas.length}
            subtitle="pendientes de facturar"
          />

          <MetricCard
            icon={<Tag className="w-3.5 h-3.5" aria-hidden="true" />}
            label="Agrupadores detectados"
            value={agrupadores.length}
            subtitle={agrupadores.length > 0 ? agrupadores.map((a) => a.codigo).join(' · ') : '—'}
            accentColor="var(--muted-foreground)"
          />

          <MetricCard
            icon={<Receipt className="w-3.5 h-3.5" aria-hidden="true" />}
            label="Monto total"
            value={fmtMonto(montoTotal)}
            subtitle={`~${agrupadores.length || 1} factura${agrupadores.length !== 1 ? 's' : ''} a emitir`}
          />
        </div>
      )}

      {/* Filter action banner — barra compacta de una línea, visible cuando hay filtro activo */}
      {hasActiveFilter && !loading && (
        <div
          data-testid="filtro-accion-banner"
          className="rounded-lg px-3.5 py-2 flex items-center justify-between gap-3 bg-gradient-to-br from-primary to-lucien-700 text-sm"
        >
          <div className="text-white font-medium truncate">
            <span className="font-mono text-blue-200">{guiasFiltradas.length}</span>
            {' '}guía{guiasFiltradas.length !== 1 ? 's' : ''} en el filtro
            {' · '}
            <span className="font-mono text-blue-200">{fmtMonto(montoFiltrado)}</span>
          </div>
          {filtroEsHomogeneo ? (
            <button
              data-testid="btn-facturar-filtro"
              onClick={handleFacturarFiltro}
              className="bg-white font-semibold text-xs px-3 py-1 rounded-md transition-colors hover:opacity-90 whitespace-nowrap shrink-0"
              style={{ color: 'var(--primary)' }}
            >
              Facturar filtro
            </button>
          ) : (
            <span data-testid="filtro-heterogeneo-hint" className="text-xs text-blue-100/80 italic whitespace-nowrap shrink-0">
              Acota a un cliente para facturar en lote
            </span>
          )}
        </div>
      )}

      {/* Panel de filtros unificado */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border">

        {/* Búsqueda — siempre visible */}
        <div className="px-4 py-3 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por N° guía, descripción o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Toggle Filtros */}
        <div className="px-4 py-2">
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filtros
            {filtrosAbiertos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {filtrosAbiertos && (
          <>
            {/* Fecha */}
            <div className="px-4 py-3">
              <DateFilter onChange={setDateRange} />
            </div>

            {/* Cliente → Agrupador */}
            <div className="px-4 py-3 flex flex-col gap-3">
              {/* Fila cliente */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20 shrink-0">
                  Cliente
                </span>
                <select
                  data-testid="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fila agrupador — chips (< 8) o combobox (>= 8) */}
              {agrupadores.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap" data-testid="agrupador-chips">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20 shrink-0">
                    Agrupador
                  </span>

                  {agrupadores.length < 8 ? (
                    <>
                      {/* Chip "Todos" */}
                      <button
                        onClick={() => setFiltroAgrupador('')}
                        className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                          filtroAgrupador === ''
                            ? 'font-semibold'
                            : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                        }`}
                        style={
                          filtroAgrupador === ''
                            ? { backgroundColor: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }
                            : undefined
                        }
                      >
                        Todos
                      </button>

                      {/* Chips por agrupador */}
                      {agrupadores.map((ag) => {
                        const isActive = filtroAgrupador === ag.id
                        const chipText = getChipTextColor(ag.color)
                        return (
                          <button
                            key={ag.id}
                            data-testid={`chip-agrupador-${ag.id}`}
                            onClick={() => setFiltroAgrupador(isActive ? '' : ag.id)}
                            className="text-xs px-3 py-1 rounded-full border font-medium transition-all font-mono tracking-wide"
                            style={
                              isActive
                                ? {
                                    backgroundColor: ag.color,
                                    color: chipText,
                                    borderColor: ag.color,
                                    boxShadow: `0 0 0 2px ${ag.color}55`,
                                  }
                                : {
                                    backgroundColor: ag.color + '22',
                                    color: ag.color,
                                    borderColor: ag.color + '66',
                                  }
                            }
                          >
                            {ag.nombre || ag.codigo}
                          </button>
                        )
                      })}
                    </>
                  ) : (
                    /* Combobox con búsqueda para >= 8 agrupadores */
                    <div className="flex items-center gap-2 flex-1" data-testid="agrupador-combobox">
                      <input
                        data-testid="combobox-agrupador-busqueda"
                        type="text"
                        value={busquedaAgrupador}
                        onChange={(e) => setBusquedaAgrupador(e.target.value)}
                        placeholder="Buscar agrupador..."
                        className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground w-40 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { setFiltroAgrupador(e.target.value); setBusquedaAgrupador('') }}
                        className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Todos los agrupadores</option>
                        {agrupadoresFiltrados.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.nombre || ag.codigo}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {filtroAgrupador && (
                    <span className="text-xs text-muted-foreground">
                      · {guiasFiltradas.length} guía{guiasFiltradas.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Grilla de guías */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <GuiasGrid
          guias={guiasFiltradas}
          loading={loading}
          onFacturarAgrupador={handleFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={handleSeleccionChange}
        />
      </div>

      {seleccionActiva.length > 0 && <div data-testid="bulk-bar-spacer" style={{ height: 96 }} />}

      {/* Bulk bar — flotante centrado cuando hay selección, estilo mockup */}
      <div
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all duration-300"
        style={{
          backgroundColor: 'var(--popover)',
          boxShadow: '0 8px 40px rgba(29,34,66,.40)',
          transform: `translateX(-50%) translateY(${seleccionActiva.length > 0 ? '0' : '90px'})`,
          opacity: seleccionActiva.length > 0 ? 1 : 0,
          pointerEvents: seleccionActiva.length > 0 ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="text-sm font-semibold text-white">
          <span className="text-blue-300 font-mono">{seleccionActiva.length}</span> guía{seleccionActiva.length !== 1 ? 's' : ''} seleccionada{seleccionActiva.length !== 1 ? 's' : ''}
        </span>
        <span className="text-blue-300 font-mono text-sm">{fmtMonto(montoSeleccion)}</span>
        <div className="w-px h-5 bg-white/20" />
        <button
          data-testid="btn-facturar-seleccion"
          onClick={() => setDialogOpen(true)}
          disabled={seleccionActiva.length === 0}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Facturar Selección
          <span
            data-testid="facturar-seleccion-count"
            className="ml-1.5 bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
          >
            {seleccionActiva.length}
          </span>
        </button>
        <button
          onClick={() => useSeleccionStore.getState().limpiar()}
          className="text-white/40 hover:text-white text-sm transition-colors"
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        titulo="Confirmar facturación"
        subtitulo={`Se procesarán ${seleccionActiva.length} guía${seleccionActiva.length !== 1 ? 's' : ''} seleccionada${seleccionActiva.length !== 1 ? 's' : ''} para facturación.`}
        warning="Se generará una proforma en memoria para revisar antes de confirmar el envío a facturación. Nada se emite al SII en este paso."
        summary={dialogSummary}
        confirmLabel="Confirmar emisión"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
