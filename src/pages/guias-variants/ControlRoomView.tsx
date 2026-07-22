import { Search, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { Button } from '@/components/ui/button'
import { DateFilter } from '@/components/DateFilter'
import { CR } from '@/components/GuiasGrid/variants/controlRoom'
import { fmtMonto } from './format'
import type { GuiasViewProps } from './types'

// "Control Room" — issue #13. Bloomberg-terminal adaptado a facturación
// chilena. Bordes 1px siempre visibles, LEDs en vez de badges pastel, tabla
// densa (delegado a GuiasGrid variant="control-room"), botón primario
// cuadrado #00ff88, shortcuts de teclado visibles. Tokens en
// src/components/GuiasGrid/variants/controlRoom.tsx (fuente única).
export function GuiasControlRoomView(props: GuiasViewProps) {
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
