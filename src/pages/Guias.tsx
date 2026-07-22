import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, FileText, Tag, Receipt, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { MetricCard } from '@/components/MetricCard'
import { PrototypeSwitcher } from '@/components/PrototypeSwitcher'
import { Button } from '@/components/ui/button'
import type { SummaryRow } from '@/components/ConfirmDialog/ConfirmDialog'
import { DateFilter } from '@/components/DateFilter'
import { useSeleccionStore } from '@/store/seleccionStore'
import { fetchGuias, fetchClientes } from '@/services/api'
import { getChipTextColor } from '@/utils/agrupadorColors'
import { useGuiasFilters } from '@/hooks/useGuiasFilters'
import type { GuiasFiltersResult } from '@/hooks/useGuiasFilters'
import type { Guia, Cliente } from '@/types'
import type { DateRange } from '@/components/DateFilter'

type AgrupadorResumen = GuiasFiltersResult['agrupadores'][number]

const clpFmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

function fmtMonto(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return clpFmt.format(n)
}

const PROTOTYPE_VARIANTS = [
  { key: 'default', label: 'Actual (Lucien)' },
  { key: 'control-room', label: 'Control Room' },
]

// PROTOTYPE (issue #13) — tokens locales del concepto "Control Room". No globales,
// no persisten fuera de esta rama. Ver docs/DESIGN_SYSTEM.md para los tokens reales.
const CR = {
  bg: '#050505',
  surface: '#0a0a0a',
  border: '#222222',
  borderStrong: '#333333',
  text: '#e5e5e5',
  textDim: '#7a7a7a',
  accent: '#00ff88',
  accentFg: '#000000',
} as const

interface GuiasViewProps {
  clienteActivo: Cliente | undefined
  onLimpiarCliente: () => void
  guiasError: Error | null
  loading: boolean
  guiasPreFiltradas: Guia[]
  agrupadores: AgrupadorResumen[]
  montoTotal: number
  hasActiveFilter: boolean
  guiasFiltradas: Guia[]
  montoFiltrado: number
  filtroEsHomogeneo: boolean
  onFacturarFiltro: () => void
  busqueda: string
  onBusquedaChange: (v: string) => void
  filtrosAbiertos: boolean
  onToggleFiltros: () => void
  onDateRangeChange: (range: DateRange) => void
  filtroCliente: string
  onFiltroClienteChange: (v: string) => void
  clientes: Cliente[]
  filtroAgrupador: string
  onFiltroAgrupadorChange: (v: string) => void
  busquedaAgrupador: string
  onBusquedaAgrupadorChange: (v: string) => void
  agrupadoresFiltrados: AgrupadorResumen[]
  onFacturarAgrupador: (agrupadorId: string, guias: Guia[]) => void
  selectedIds: Set<string>
  onSeleccionChange: (guia: Guia, checked: boolean) => void
  seleccionActiva: Guia[]
  montoSeleccion: number
  onAbrirDialogo: () => void
  onLimpiarSeleccion: () => void
  searchInputRef: React.RefObject<HTMLInputElement>
}

function GuiasDefaultView(props: GuiasViewProps) {
  const {
    clienteActivo, onLimpiarCliente, guiasError, loading, guiasPreFiltradas, agrupadores, montoTotal,
    hasActiveFilter, guiasFiltradas, montoFiltrado, filtroEsHomogeneo, onFacturarFiltro,
    busqueda, onBusquedaChange, filtrosAbiertos, onToggleFiltros, onDateRangeChange,
    filtroCliente, onFiltroClienteChange, clientes, filtroAgrupador, onFiltroAgrupadorChange,
    busquedaAgrupador, onBusquedaAgrupadorChange, agrupadoresFiltrados,
    onFacturarAgrupador, selectedIds, onSeleccionChange,
    seleccionActiva, montoSeleccion, onAbrirDialogo, onLimpiarSeleccion, searchInputRef,
  } = props

  return (
    <div data-testid="guias-page" className="space-y-4">

      {/* Breadcrumb cuando hay cliente activo */}
      {clienteActivo && (
        <div data-testid="breadcrumb" className="flex items-center gap-2 text-sm">
          <button
            onClick={onLimpiarCliente}
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
              onClick={onFacturarFiltro}
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
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por N° guía, descripción o cliente..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Toggle Filtros */}
        <div className="px-4 py-2">
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={onToggleFiltros}
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
              <DateFilter onChange={onDateRangeChange} />
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
                  onChange={(e) => onFiltroClienteChange(e.target.value)}
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
                        onClick={() => onFiltroAgrupadorChange('')}
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
                            onClick={() => onFiltroAgrupadorChange(isActive ? '' : ag.id)}
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
                        onChange={(e) => onBusquedaAgrupadorChange(e.target.value)}
                        placeholder="Buscar agrupador..."
                        className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground w-40 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { onFiltroAgrupadorChange(e.target.value); onBusquedaAgrupadorChange('') }}
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
          onFacturarAgrupador={onFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={onSeleccionChange}
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
          onClick={onAbrirDialogo}
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
          onClick={onLimpiarSeleccion}
          className="text-white/40 hover:text-white text-sm transition-colors"
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── "Control Room" — issue #13. Bloomberg-terminal adaptado a facturación ────
// Bordes 1px #222 siempre visibles, LEDs en vez de badges pastel, tabla densa
// (padding 6px, delegado a GuiasGrid variant="control-room"), botón primario
// cuadrado #00ff88, shortcuts de teclado visibles.
function GuiasControlRoomView(props: GuiasViewProps) {
  const {
    clienteActivo, onLimpiarCliente, guiasError, loading, guiasPreFiltradas, agrupadores, montoTotal,
    hasActiveFilter, guiasFiltradas, montoFiltrado, filtroEsHomogeneo, onFacturarFiltro,
    busqueda, onBusquedaChange, filtrosAbiertos, onToggleFiltros, onDateRangeChange,
    filtroCliente, onFiltroClienteChange, clientes, filtroAgrupador, onFiltroAgrupadorChange,
    busquedaAgrupador, onBusquedaAgrupadorChange, agrupadoresFiltrados,
    onFacturarAgrupador, selectedIds, onSeleccionChange,
    seleccionActiva, montoSeleccion, onAbrirDialogo, onLimpiarSeleccion, searchInputRef,
  } = props

  const panelStyle = { backgroundColor: CR.surface, border: `1px solid ${CR.border}` }
  const crPrimaryBtn = 'rounded-none font-mono uppercase tracking-wider hover:brightness-110 transition-all'
  const crPrimaryStyle = { backgroundColor: CR.accent, color: CR.accentFg, borderColor: CR.accent }

  return (
    <div data-testid="guias-page" className="space-y-3 font-mono" style={{ backgroundColor: CR.bg, color: CR.text, padding: 12, margin: -12 }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
        <button
          onClick={onLimpiarCliente}
          className="flex items-center gap-1.5 transition-colors"
          style={{ color: CR.textDim }}
        >
          <ArrowLeft className="w-3 h-3" />
          Clientes
        </button>
        {clienteActivo && (
          <>
            <span style={{ color: CR.border }}>/</span>
            <span style={{ color: CR.text }}>{clienteActivo.nombre}</span>
            <span className="text-[10px] px-1.5 py-0.5" style={{ border: `1px solid ${CR.border}`, color: CR.accent }}>
              {clienteActivo.rut}
            </span>
          </>
        )}
      </div>

      <ErrorBanner error={guiasError} />

      {/* Métricas — franja densa con LEDs, sin cards redondeadas */}
      {!loading && (
        <div className="grid grid-cols-3" style={panelStyle} data-testid="guias-metricas">
          {[
            { label: 'Guías pendientes', value: String(guiasPreFiltradas.length), led: CR.accent },
            { label: 'Agrupadores', value: String(agrupadores.length), led: '#ffb000' },
            { label: 'Monto total', value: fmtMonto(montoTotal), led: CR.accent },
          ].map((m, i) => (
            <div
              key={m.label}
              className="px-4 py-3"
              style={{ borderLeft: i > 0 ? `1px solid ${CR.border}` : undefined }}
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider" style={{ color: CR.textDim }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.led, boxShadow: `0 0 4px ${m.led}` }} />
                {m.label}
              </div>
              <div className="text-xl font-bold" style={{ color: CR.text }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Banner de filtro activo */}
      {hasActiveFilter && !loading && (
        <div
          data-testid="filtro-accion-banner"
          className="px-3.5 py-2 flex items-center justify-between gap-3 text-xs"
          style={panelStyle}
        >
          <div style={{ color: CR.text }}>
            <span style={{ color: CR.accent }}>{guiasFiltradas.length}</span> guía{guiasFiltradas.length !== 1 ? 's' : ''} en el filtro
            {' · '}
            <span style={{ color: CR.accent }}>{fmtMonto(montoFiltrado)}</span>
          </div>
          {filtroEsHomogeneo ? (
            <Button
              data-testid="btn-facturar-filtro"
              onClick={onFacturarFiltro}
              size="sm"
              className={`text-xs h-7 px-3 ${crPrimaryBtn}`}
              style={crPrimaryStyle}
            >
              Facturar filtro <kbd className="ml-1 opacity-70">[F]</kbd>
            </Button>
          ) : (
            <span data-testid="filtro-heterogeneo-hint" className="text-xs italic whitespace-nowrap shrink-0" style={{ color: CR.textDim }}>
              Acota a un cliente para facturar en lote
            </span>
          )}
        </div>
      )}

      {/* Panel de filtros */}
      <div style={panelStyle}>
        <div className="px-3 py-2.5 relative" style={{ borderBottom: `1px solid ${CR.border}` }}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: CR.textDim }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por N° guía, descripción o cliente... [/]"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm focus:outline-none"
            style={{ backgroundColor: CR.bg, color: CR.text, border: `1px solid ${CR.border}` }}
          />
        </div>

        <div className="px-3 py-2" style={{ borderBottom: filtrosAbiertos ? `1px solid ${CR.border}` : undefined }}>
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={onToggleFiltros}
            aria-expanded={filtrosAbiertos}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors"
            style={{ color: CR.textDim }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filtros <kbd className="opacity-60">[⇧F]</kbd>
            {filtrosAbiertos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {filtrosAbiertos && (
          <>
            <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${CR.border}` }}>
              <DateFilter onChange={onDateRangeChange} />
            </div>

            <div className="px-3 py-2.5 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider w-20 shrink-0" style={{ color: CR.textDim }}>
                  Cliente
                </span>
                <select
                  data-testid="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => onFiltroClienteChange(e.target.value)}
                  className="px-2 py-1.5 text-sm flex-1 focus:outline-none"
                  style={{ backgroundColor: CR.bg, color: CR.text, border: `1px solid ${CR.border}` }}
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {agrupadores.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap" data-testid="agrupador-chips">
                  <span className="text-[10px] uppercase tracking-wider w-20 shrink-0" style={{ color: CR.textDim }}>
                    Agrupador
                  </span>

                  {agrupadores.length < 8 ? (
                    <>
                      <button
                        onClick={() => onFiltroAgrupadorChange('')}
                        className="text-xs px-2.5 py-1 transition-all"
                        style={
                          filtroAgrupador === ''
                            ? { backgroundColor: CR.accent, color: CR.accentFg, border: `1px solid ${CR.accent}` }
                            : { color: CR.textDim, border: `1px solid ${CR.border}` }
                        }
                      >
                        Todos
                      </button>

                      {agrupadores.map((ag) => {
                        const isActive = filtroAgrupador === ag.id
                        return (
                          <button
                            key={ag.id}
                            data-testid={`chip-agrupador-${ag.id}`}
                            onClick={() => onFiltroAgrupadorChange(isActive ? '' : ag.id)}
                            className="flex items-center gap-1.5 text-xs px-2.5 py-1 transition-all"
                            style={{
                              border: `1px solid ${isActive ? ag.color : CR.border}`,
                              color: isActive ? CR.text : CR.textDim,
                            }}
                          >
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: ag.color, boxShadow: isActive ? `0 0 4px ${ag.color}` : undefined }}
                            />
                            {ag.nombre || ag.codigo}
                          </button>
                        )
                      })}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 flex-1" data-testid="agrupador-combobox">
                      <input
                        data-testid="combobox-agrupador-busqueda"
                        type="text"
                        value={busquedaAgrupador}
                        onChange={(e) => onBusquedaAgrupadorChange(e.target.value)}
                        placeholder="Buscar agrupador..."
                        className="px-2 py-1.5 text-sm w-40 focus:outline-none"
                        style={{ backgroundColor: CR.bg, color: CR.text, border: `1px solid ${CR.border}` }}
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { onFiltroAgrupadorChange(e.target.value); onBusquedaAgrupadorChange('') }}
                        className="px-2 py-1.5 text-sm flex-1 focus:outline-none"
                        style={{ backgroundColor: CR.bg, color: CR.text, border: `1px solid ${CR.border}` }}
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
                    <span className="text-xs" style={{ color: CR.textDim }}>
                      · {guiasFiltradas.length} guía{guiasFiltradas.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Grilla */}
      <div style={{ border: `1px solid ${CR.border}` }}>
        <GuiasGrid
          guias={guiasFiltradas}
          loading={loading}
          onFacturarAgrupador={onFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={onSeleccionChange}
          variant="control-room"
        />
      </div>

      {seleccionActiva.length > 0 && <div data-testid="bulk-bar-spacer" style={{ height: 80 }} />}

      {/* Bulk bar */}
      <div
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 px-5 py-3 transition-all duration-300"
        style={{
          backgroundColor: CR.surface,
          border: `1px solid ${CR.borderStrong}`,
          boxShadow: `0 0 24px ${CR.accent}22`,
          transform: `translateX(-50%) translateY(${seleccionActiva.length > 0 ? '0' : '90px'})`,
          opacity: seleccionActiva.length > 0 ? 1 : 0,
          pointerEvents: seleccionActiva.length > 0 ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="text-sm font-bold" style={{ color: CR.text }}>
          <span style={{ color: CR.accent }}>{seleccionActiva.length}</span> guía{seleccionActiva.length !== 1 ? 's' : ''} seleccionada{seleccionActiva.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm" style={{ color: CR.accent }}>{fmtMonto(montoSeleccion)}</span>
        <div className="w-px h-5" style={{ backgroundColor: CR.border }} />
        <Button
          data-testid="btn-facturar-seleccion"
          onClick={onAbrirDialogo}
          disabled={seleccionActiva.length === 0}
          className={`px-4 py-1.5 text-sm ${crPrimaryBtn}`}
          style={crPrimaryStyle}
        >
          Facturar Selección
          <span
            data-testid="facturar-seleccion-count"
            className="ml-1.5 text-xs font-bold px-1.5 py-0.5"
            style={{ backgroundColor: CR.accentFg, color: CR.accent, border: `1px solid ${CR.accent}` }}
          >
            {seleccionActiva.length}
          </span>
          <kbd className="ml-1 opacity-70">[⏎]</kbd>
        </Button>
        <button
          onClick={onLimpiarSeleccion}
          className="text-sm transition-colors"
          style={{ color: CR.textDim }}
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
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
  const searchInputRef = useRef<HTMLInputElement>(null)

  const variant = searchParams.get('variant') === 'control-room' ? 'control-room' : 'default'

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

  // Shortcut "/" enfoca la búsqueda — visible en el concepto Control Room.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
      e.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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

  const viewProps: GuiasViewProps = {
    clienteActivo,
    onLimpiarCliente: () => setFiltroCliente(''),
    guiasError,
    loading,
    guiasPreFiltradas,
    agrupadores,
    montoTotal,
    hasActiveFilter,
    guiasFiltradas,
    montoFiltrado,
    filtroEsHomogeneo,
    onFacturarFiltro: handleFacturarFiltro,
    busqueda,
    onBusquedaChange: setBusqueda,
    filtrosAbiertos,
    onToggleFiltros: () => setFiltrosAbiertos((v) => !v),
    onDateRangeChange: setDateRange,
    filtroCliente,
    onFiltroClienteChange: setFiltroCliente,
    clientes,
    filtroAgrupador,
    onFiltroAgrupadorChange: setFiltroAgrupador,
    busquedaAgrupador,
    onBusquedaAgrupadorChange: setBusquedaAgrupador,
    agrupadoresFiltrados,
    onFacturarAgrupador: handleFacturarAgrupador,
    selectedIds,
    onSeleccionChange: handleSeleccionChange,
    seleccionActiva,
    montoSeleccion,
    onAbrirDialogo: () => setDialogOpen(true),
    onLimpiarSeleccion: () => useSeleccionStore.getState().limpiar(),
    searchInputRef,
  }

  return (
    <>
      {variant === 'control-room'
        ? <GuiasControlRoomView {...viewProps} />
        : <GuiasDefaultView {...viewProps} />}

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

      <PrototypeSwitcher variants={PROTOTYPE_VARIANTS} />
    </>
  )
}
