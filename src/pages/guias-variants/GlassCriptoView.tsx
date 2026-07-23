import { Search, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { Button } from '@/components/ui/button'
import { DateFilter } from '@/components/DateFilter'
import { GC } from '@/components/GuiasGrid/variants/glassCripto'
import { fmtMonto } from './format'
import type { GuiasViewProps } from './types'

// "Glassmorphism Cripto" — issue #15. Fintech premium: fondo con gradiente
// animado sutil (keyframes propios, ver <style> scoped abajo — no se toca
// index.css ni tailwind.config), paneles glass (backdrop-blur-xl +
// bg-white/5 + border-white/10) SOLO en el chrome estático de la página
// (filtros, métricas, bulk bar). La tabla (GuiasGrid variant="glass-cripto")
// NUNCA usa backdrop-blur por fila — motivo documentado junto a GuiaRow en
// src/components/GuiasGrid/variants/glassCripto.tsx (costo de repintar el
// filtro de blur en cada frame de scroll sobre una lista virtualizada densa).
// Tokens de color en glassCripto.tsx (fuente única, reusada acá como `GC`).
export function GuiasGlassCriptoView(props: GuiasViewProps) {
  const {
    clienteActivo, onLimpiarCliente, guiasError, loading, guiasPreFiltradas, agrupadores, montoTotal,
    hasActiveFilter, guiasFiltradas, montoFiltrado, filtroEsHomogeneo, onFacturarFiltro,
    busqueda, onBusquedaChange, filtrosAbiertos, onToggleFiltros, onDateRangeChange,
    filtroCliente, onFiltroClienteChange, clientes, filtroAgrupador, onFiltroAgrupadorChange,
    busquedaAgrupador, onBusquedaAgrupadorChange, agrupadoresFiltrados,
    onFacturarAgrupador, selectedIds, onSeleccionChange,
    seleccionActiva, montoSeleccion, onAbrirDialogo, onLimpiarSeleccion, searchInputRef,
  } = props

  const glassPanel = 'backdrop-blur-xl bg-white/5 border border-white/10'
  const label = 'text-[11px] uppercase tracking-widest font-mono'
  const pillGlassBtn = 'rounded-full backdrop-blur bg-white/10 border border-white/20 font-mono uppercase tracking-widest hover:bg-white/15 transition-all'
  const primaryPillBtn = 'rounded-full backdrop-blur font-mono uppercase tracking-widest hover:brightness-110 transition-all'
  const primaryPillStyle = { backgroundColor: GC.accent, color: GC.accentFg, borderColor: GC.accent }

  return (
    <div
      data-testid="guias-page"
      className="gc-animated-bg space-y-4"
      style={{ color: GC.text, padding: 16, margin: -12, borderRadius: 12 }}
    >
      {/* Scoped keyframes — issue #15: gradiente animado sutil, sin tocar index.css */}
      <style>{`
        @keyframes gcGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gc-animated-bg {
          background: linear-gradient(120deg, #0a0e17, #131a2e, #1a1030, #0d1f28, #0a0e17);
          background-size: 300% 300%;
          animation: gcGradientShift 22s ease infinite;
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono">
        <button
          onClick={onLimpiarCliente}
          className="flex items-center gap-1.5 transition-colors"
          style={{ color: GC.textDim }}
        >
          <ArrowLeft className="w-3 h-3" />
          Clientes
        </button>
        {clienteActivo && (
          <>
            <span style={{ color: GC.border }}>/</span>
            <span style={{ color: GC.text }}>{clienteActivo.nombre}</span>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full backdrop-blur bg-white/10 border border-white/20 tracking-widest"
              style={{ color: GC.accent }}
            >
              {clienteActivo.rut}
            </span>
          </>
        )}
      </div>

      <ErrorBanner error={guiasError} />

      {/* Métricas — franja glass */}
      {!loading && (
        <div className={`grid grid-cols-3 rounded-2xl overflow-hidden ${glassPanel}`} data-testid="guias-metricas">
          {[
            { labelText: 'Guías pendientes', value: String(guiasPreFiltradas.length), dot: GC.accent },
            { labelText: 'Agrupadores', value: String(agrupadores.length), dot: GC.accent2 },
            { labelText: 'Monto total', value: fmtMonto(montoTotal), dot: GC.accent },
          ].map((m, i) => (
            <div
              key={m.labelText}
              className="px-5 py-4"
              style={{ borderLeft: i > 0 ? `1px solid ${GC.border}` : undefined }}
            >
              <div className={`flex items-center gap-1.5 ${label}`} style={{ color: GC.textDim }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.dot, boxShadow: `0 0 6px ${m.dot}` }} />
                {m.labelText}
              </div>
              <div className="text-2xl font-bold font-mono tracking-widest" style={{ color: GC.text }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Banner de filtro activo */}
      {hasActiveFilter && !loading && (
        <div
          data-testid="filtro-accion-banner"
          className={`px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs ${glassPanel}`}
        >
          <div style={{ color: GC.text }} className="font-mono">
            <span className="font-bold tracking-widest" style={{ color: GC.accent }}>{guiasFiltradas.length}</span> guía{guiasFiltradas.length !== 1 ? 's' : ''} en el filtro
            {' · '}
            <span className="font-bold tracking-widest" style={{ color: GC.accent }}>{fmtMonto(montoFiltrado)}</span>
          </div>
          {filtroEsHomogeneo ? (
            <Button
              data-testid="btn-facturar-filtro"
              onClick={onFacturarFiltro}
              size="sm"
              className={`text-[11px] h-8 px-4 ${primaryPillBtn}`}
              style={primaryPillStyle}
            >
              Facturar filtro
            </Button>
          ) : (
            <span data-testid="filtro-heterogeneo-hint" className="text-xs italic whitespace-nowrap shrink-0" style={{ color: GC.textDim }}>
              Acota a un cliente para facturar en lote
            </span>
          )}
        </div>
      )}

      {/* Panel de filtros */}
      <div className={`rounded-2xl overflow-hidden ${glassPanel}`}>
        <div className="px-4 py-3 relative" style={{ borderBottom: `1px solid ${GC.border}` }}>
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: GC.textDim }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por N° guía, descripción o cliente..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-full focus:outline-none bg-white/5 border border-white/10 placeholder:text-slate-500"
            style={{ color: GC.text }}
          />
        </div>

        <div className="px-4 py-2.5" style={{ borderBottom: filtrosAbiertos ? `1px solid ${GC.border}` : undefined }}>
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={onToggleFiltros}
            aria-expanded={filtrosAbiertos}
            className={`flex items-center gap-1.5 ${label} transition-colors`}
            style={{ color: GC.textDim }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filtros
            {filtrosAbiertos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {filtrosAbiertos && (
          <>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${GC.border}` }}>
              <DateFilter onChange={onDateRangeChange} />
            </div>

            <div className="px-4 py-3 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className={`${label} w-20 shrink-0`} style={{ color: GC.textDim }}>
                  Cliente
                </span>
                <select
                  data-testid="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => onFiltroClienteChange(e.target.value)}
                  className="px-3 py-2 text-sm flex-1 rounded-full focus:outline-none bg-white/5 border border-white/10"
                  style={{ color: GC.text }}
                >
                  <option value="" style={{ color: '#000' }}>Todos los clientes</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id} style={{ color: '#000' }}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {agrupadores.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap" data-testid="agrupador-chips">
                  <span className={`${label} w-20 shrink-0`} style={{ color: GC.textDim }}>
                    Agrupador
                  </span>

                  {agrupadores.length < 8 ? (
                    <>
                      <button
                        onClick={() => onFiltroAgrupadorChange('')}
                        className="text-xs px-3 py-1.5 rounded-full backdrop-blur transition-all"
                        style={
                          filtroAgrupador === ''
                            ? { backgroundColor: GC.accent, color: GC.accentFg, border: `1px solid ${GC.accent}` }
                            : { color: GC.textDim, border: `1px solid ${GC.border}`, backgroundColor: 'rgba(255,255,255,0.05)' }
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
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full backdrop-blur transition-all"
                            style={{
                              border: `1px solid ${isActive ? ag.color : GC.border}`,
                              color: isActive ? GC.text : GC.textDim,
                              backgroundColor: isActive ? ag.color + '22' : 'rgba(255,255,255,0.05)',
                            }}
                          >
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: ag.color, boxShadow: isActive ? `0 0 5px ${ag.color}` : undefined }}
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
                        className="px-3 py-1.5 text-sm w-40 rounded-full focus:outline-none bg-white/5 border border-white/10 placeholder:text-slate-500"
                        style={{ color: GC.text }}
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { onFiltroAgrupadorChange(e.target.value); onBusquedaAgrupadorChange('') }}
                        className="px-3 py-1.5 text-sm flex-1 rounded-full focus:outline-none bg-white/5 border border-white/10"
                        style={{ color: GC.text }}
                      >
                        <option value="" style={{ color: '#000' }}>Todos los agrupadores</option>
                        {agrupadoresFiltrados.map((ag) => (
                          <option key={ag.id} value={ag.id} style={{ color: '#000' }}>
                            {ag.nombre || ag.codigo}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {filtroAgrupador && (
                    <span className="text-xs font-mono" style={{ color: GC.textDim }}>
                      · {guiasFiltradas.length} guía{guiasFiltradas.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Grilla — sin backdrop-blur dentro (ver comentario de perf en glassCripto.tsx) */}
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <GuiasGrid
          guias={guiasFiltradas}
          loading={loading}
          onFacturarAgrupador={onFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={onSeleccionChange}
          variant="glass-cripto"
        />
      </div>

      {seleccionActiva.length > 0 && <div data-testid="bulk-bar-spacer" style={{ height: 88 }} />}

      {/* Bulk bar — chrome flotante, glass completo */}
      <div
        className={`fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-300 ${glassPanel}`}
        style={{
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${GC.accent}22`,
          transform: `translateX(-50%) translateY(${seleccionActiva.length > 0 ? '0' : '90px'})`,
          opacity: seleccionActiva.length > 0 ? 1 : 0,
          pointerEvents: seleccionActiva.length > 0 ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="text-sm font-bold font-mono tracking-widest" style={{ color: GC.text }}>
          <span style={{ color: GC.accent }}>{seleccionActiva.length}</span> guía{seleccionActiva.length !== 1 ? 's' : ''} seleccionada{seleccionActiva.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-mono tracking-widest" style={{ color: GC.accent }}>{fmtMonto(montoSeleccion)}</span>
        <div className="w-px h-5" style={{ backgroundColor: GC.border }} />
        <Button
          data-testid="btn-facturar-seleccion"
          onClick={onAbrirDialogo}
          disabled={seleccionActiva.length === 0}
          className={`px-5 py-2 text-sm ${primaryPillBtn}`}
          style={primaryPillStyle}
        >
          Facturar Selección
          <span
            data-testid="facturar-seleccion-count"
            className="ml-1.5 text-xs font-bold px-2 py-0.5 rounded-full font-mono"
            style={{ backgroundColor: GC.accentFg, color: GC.accent, border: `1px solid ${GC.accent}` }}
          >
            {seleccionActiva.length}
          </span>
        </Button>
        <button
          onClick={onLimpiarSeleccion}
          className={`p-1.5 rounded-full ${pillGlassBtn}`}
          style={{ color: GC.textDim }}
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
