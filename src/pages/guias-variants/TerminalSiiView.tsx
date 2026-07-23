import { Search, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { Button } from '@/components/ui/button'
import { DateFilter } from '@/components/DateFilter'
import { TS } from '@/components/GuiasGrid/variants/terminalSii'
import { fmtMonto } from './format'
import type { GuiasViewProps } from './types'

// ASCII banner — construido con repeat() en vez de hardcodear guiones para
// garantizar que top/bottom calcen con el ancho del título sin contar
// caracteres a mano.
function AsciiBanner({ title }: { title: string }) {
  const label = ` ${title} `
  const line = '─'.repeat(label.length)
  const banner = `┌${line}┐\n│${label}│\n└${line}┘`
  return (
    <pre
      className="text-[10px] leading-tight font-mono select-none"
      style={{ color: TS.text, textShadow: `0 0 3px ${TS.text}55` }}
      aria-hidden="true"
    >
      {banner}
    </pre>
  )
}

// "Terminal SII" — issue #16. Modo ingeniería: fondo negro puro, ámbar
// fosforoso para datos, verde fósforo para éxito/selección/totales, layout
// monospace absoluto tipo log de sistema, prompts $/> visibles, banner ASCII
// y overlay de scanline CRT. Tokens en
// src/components/GuiasGrid/variants/terminalSii.tsx (fuente única).
export function GuiasTerminalSiiView(props: GuiasViewProps) {
  const {
    clienteActivo, onLimpiarCliente, guiasError, loading, guiasPreFiltradas, agrupadores, montoTotal,
    hasActiveFilter, guiasFiltradas, montoFiltrado, filtroEsHomogeneo, onFacturarFiltro,
    busqueda, onBusquedaChange, filtrosAbiertos, onToggleFiltros, onDateRangeChange,
    filtroCliente, onFiltroClienteChange, clientes, filtroAgrupador, onFiltroAgrupadorChange,
    busquedaAgrupador, onBusquedaAgrupadorChange, agrupadoresFiltrados,
    onFacturarAgrupador, selectedIds, onSeleccionChange,
    seleccionActiva, montoSeleccion, onAbrirDialogo, onLimpiarSeleccion, searchInputRef,
  } = props

  const panelStyle = { backgroundColor: TS.surface, border: `1px solid ${TS.border}` }
  const tsPrimaryBtn = 'rounded-none font-mono uppercase tracking-wider hover:brightness-110 transition-all'
  const tsPrimaryStyle = { backgroundColor: TS.success, color: TS.bg, borderColor: TS.success }
  const glow = { textShadow: `0 0 3px ${TS.text}55` }
  const glowSuccess = { textShadow: `0 0 3px ${TS.success}55` }

  return (
    <div
      data-testid="guias-page"
      className="relative space-y-3 font-mono"
      style={{ backgroundColor: TS.bg, color: TS.text, padding: 12, margin: -12 }}
    >
      {/* Overlay CRT scanline — puramente decorativo, no captura eventos. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)`,
          mixBlendMode: 'multiply',
          animation: 'tsFlicker 6s infinite',
        }}
      />
      <style>{`
        @keyframes tsFlicker {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
          52% { opacity: 0.85; }
          54% { opacity: 1; }
        }
      `}</style>

      {/* Banner ASCII + breadcrumb */}
      <div>
        <AsciiBanner title="GUIAS.SII // TERMINAL MODE" />
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider mt-1">
          <button
            onClick={onLimpiarCliente}
            className="flex items-center gap-1.5 transition-colors"
            style={{ color: TS.dim }}
          >
            <ArrowLeft className="w-3 h-3" />
            $ cd ../clientes
          </button>
          {clienteActivo && (
            <>
              <span style={{ color: TS.border }}>/</span>
              <span style={{ color: TS.text }}>{clienteActivo.nombre}</span>
              <span className="text-[10px] px-1.5 py-0.5" style={{ border: `1px solid ${TS.border}`, color: TS.success }}>
                {clienteActivo.rut}
              </span>
            </>
          )}
        </div>
      </div>

      <ErrorBanner error={guiasError} />

      {/* Métricas — franja densa tipo log, LEDs en bloque, totales en verde. */}
      {!loading && (
        <div className="grid grid-cols-3" style={panelStyle} data-testid="guias-metricas">
          {[
            { label: 'guias_pendientes', value: String(guiasPreFiltradas.length), led: TS.success, valueColor: TS.text },
            { label: 'agrupadores', value: String(agrupadores.length), led: TS.text, valueColor: TS.text },
            { label: 'monto_total', value: fmtMonto(montoTotal), led: TS.success, valueColor: TS.success },
          ].map((m, i) => (
            <div
              key={m.label}
              className="px-4 py-3"
              style={{ borderLeft: i > 0 ? `1px solid ${TS.border}` : undefined }}
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider" style={{ color: TS.dim }}>
                <span style={{ color: m.led, textShadow: `0 0 4px ${m.led}` }}>■</span>
                {m.label}
              </div>
              <div className="text-xl font-bold" style={{ color: m.valueColor, textShadow: `0 0 3px ${m.valueColor}55` }}>
                {m.value}
              </div>
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
          <div style={{ color: TS.text }}>
            <span style={{ color: TS.success, ...glowSuccess }}>{guiasFiltradas.length}</span> guía{guiasFiltradas.length !== 1 ? 's' : ''} en el filtro
            {' · '}
            <span style={{ color: TS.success, ...glowSuccess }}>{fmtMonto(montoFiltrado)}</span>
          </div>
          {filtroEsHomogeneo ? (
            <Button
              data-testid="btn-facturar-filtro"
              onClick={onFacturarFiltro}
              size="sm"
              className={`text-xs h-7 px-3 ${tsPrimaryBtn}`}
              style={tsPrimaryStyle}
            >
              $ facturar --filtro <kbd className="ml-1 opacity-70">[F]</kbd>
            </Button>
          ) : (
            <span data-testid="filtro-heterogeneo-hint" className="text-xs italic whitespace-nowrap shrink-0" style={{ color: TS.dim }}>
              Acota a un cliente para facturar en lote
            </span>
          )}
        </div>
      )}

      {/* Panel de filtros */}
      <div style={panelStyle}>
        <div className="px-3 py-2.5 relative" style={{ borderBottom: `1px solid ${TS.border}` }}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: TS.dim }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="> buscar --guia --desc --cliente [/]"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm focus:outline-none"
            style={{ backgroundColor: TS.bg, color: TS.text, border: `1px solid ${TS.border}` }}
          />
        </div>

        <div className="px-3 py-2" style={{ borderBottom: filtrosAbiertos ? `1px solid ${TS.border}` : undefined }}>
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={onToggleFiltros}
            aria-expanded={filtrosAbiertos}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors"
            style={{ color: TS.dim }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            $ filtros --toggle <kbd className="opacity-60">[⇧F]</kbd>
            {filtrosAbiertos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {filtrosAbiertos && (
          <>
            <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${TS.border}` }}>
              <DateFilter onChange={onDateRangeChange} />
            </div>

            <div className="px-3 py-2.5 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider w-20 shrink-0" style={{ color: TS.dim }}>
                  --cliente
                </span>
                <select
                  data-testid="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => onFiltroClienteChange(e.target.value)}
                  className="px-2 py-1.5 text-sm flex-1 focus:outline-none"
                  style={{ backgroundColor: TS.bg, color: TS.text, border: `1px solid ${TS.border}` }}
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
                  <span className="text-[10px] uppercase tracking-wider w-20 shrink-0" style={{ color: TS.dim }}>
                    --agrupador
                  </span>

                  {agrupadores.length < 8 ? (
                    <>
                      <button
                        onClick={() => onFiltroAgrupadorChange('')}
                        className="text-xs px-2.5 py-1 transition-all"
                        style={
                          filtroAgrupador === ''
                            ? { backgroundColor: TS.success, color: TS.bg, border: `1px solid ${TS.success}` }
                            : { color: TS.dim, border: `1px solid ${TS.border}` }
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
                              border: `1px solid ${isActive ? ag.color : TS.border}`,
                              color: isActive ? TS.text : TS.dim,
                            }}
                          >
                            <span
                              style={{ color: ag.color, textShadow: isActive ? `0 0 4px ${ag.color}` : undefined }}
                            >
                              ■
                            </span>
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
                        placeholder="> buscar agrupador..."
                        className="px-2 py-1.5 text-sm w-40 focus:outline-none"
                        style={{ backgroundColor: TS.bg, color: TS.text, border: `1px solid ${TS.border}` }}
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { onFiltroAgrupadorChange(e.target.value); onBusquedaAgrupadorChange('') }}
                        className="px-2 py-1.5 text-sm flex-1 focus:outline-none"
                        style={{ backgroundColor: TS.bg, color: TS.text, border: `1px solid ${TS.border}` }}
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
                    <span className="text-xs" style={{ color: TS.dim }}>
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
      <div style={{ border: `1px solid ${TS.border}` }}>
        <GuiasGrid
          guias={guiasFiltradas}
          loading={loading}
          onFacturarAgrupador={onFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={onSeleccionChange}
          variant="terminal-sii"
        />
      </div>

      {seleccionActiva.length > 0 && <div data-testid="bulk-bar-spacer" style={{ height: 80 }} />}

      {/* Bulk bar */}
      <div
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 px-5 py-3 transition-all duration-300"
        style={{
          backgroundColor: TS.surface,
          border: `1px solid ${TS.borderStrong}`,
          boxShadow: `0 0 24px ${TS.success}22`,
          transform: `translateX(-50%) translateY(${seleccionActiva.length > 0 ? '0' : '90px'})`,
          opacity: seleccionActiva.length > 0 ? 1 : 0,
          pointerEvents: seleccionActiva.length > 0 ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="text-sm font-bold" style={{ color: TS.text, ...glow }}>
          <span style={{ color: TS.success, ...glowSuccess }}>{seleccionActiva.length}</span> guía{seleccionActiva.length !== 1 ? 's' : ''} seleccionada{seleccionActiva.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm" style={{ color: TS.success, ...glowSuccess }}>{fmtMonto(montoSeleccion)}</span>
        <div className="w-px h-5" style={{ backgroundColor: TS.border }} />
        <Button
          data-testid="btn-facturar-seleccion"
          onClick={onAbrirDialogo}
          disabled={seleccionActiva.length === 0}
          className={`px-4 py-1.5 text-sm ${tsPrimaryBtn}`}
          style={tsPrimaryStyle}
        >
          $ facturar --seleccion
          <span
            data-testid="facturar-seleccion-count"
            className="ml-1.5 text-xs font-bold px-1.5 py-0.5"
            style={{ backgroundColor: TS.bg, color: TS.success, border: `1px solid ${TS.success}` }}
          >
            {seleccionActiva.length}
          </span>
          <kbd className="ml-1 opacity-70">[⏎]</kbd>
        </Button>
        <button
          onClick={onLimpiarSeleccion}
          className="text-sm transition-colors"
          style={{ color: TS.dim }}
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
