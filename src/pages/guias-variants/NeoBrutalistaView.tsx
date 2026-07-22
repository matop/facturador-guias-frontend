import { Search, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { Button } from '@/components/ui/button'
import { DateFilter } from '@/components/DateFilter'
import { NB } from '@/components/GuiasGrid/variants/neoBrutalista'
import { fmtMonto } from './format'
import type { GuiasViewProps } from './types'

// Sombra dura offset, sin blur — repetida en cards/botones para dar la
// sensación de recorte de cartón/papel. Mantenida acá (no en el token NB
// para que cada card controle su propio offset si lo necesitara).
const hardShadow = '4px 4px 0 0 #000'

// "Headings Syne 900": Syne ya está self-hosted en la app (@fontsource/syne,
// mapeado a font-display en tailwind.config.ts — mismo uso que AppLayout/
// AdminReglas), así que no hace falta cargar nada nuevo. Solo 400/700 están
// empaquetados (no 900) — se usa el 700 real vía font-bold en vez de
// simular el peso con la sans stack.
const headingClass = 'font-display font-bold uppercase tracking-tight'

// "Neo-Brutalismo Fiscal" — issue #14. Fondo claro, cards blancas con borde
// negro grueso (2-3px) y sombra dura offset (sin blur). Rojo fiscal como
// color de acción primaria, verde SAT como acento de éxito/totales. Botones
// que se "hunden" al click (translate-y + pierden la sombra). Tokens en
// src/components/GuiasGrid/variants/neoBrutalista.tsx (fuente única).
export function GuiasNeoBrutalistaView(props: GuiasViewProps) {
  const {
    clienteActivo, onLimpiarCliente, guiasError, loading, guiasPreFiltradas, agrupadores, montoTotal,
    hasActiveFilter, guiasFiltradas, montoFiltrado, filtroEsHomogeneo, onFacturarFiltro,
    busqueda, onBusquedaChange, filtrosAbiertos, onToggleFiltros, onDateRangeChange,
    filtroCliente, onFiltroClienteChange, clientes, filtroAgrupador, onFiltroAgrupadorChange,
    busquedaAgrupador, onBusquedaAgrupadorChange, agrupadoresFiltrados,
    onFacturarAgrupador, selectedIds, onSeleccionChange,
    seleccionActiva, montoSeleccion, onAbrirDialogo, onLimpiarSeleccion, searchInputRef,
  } = props

  const cardStyle = { backgroundColor: NB.surface, border: `3px solid ${NB.border}`, boxShadow: hardShadow }
  const nbPrimaryBtn = 'rounded-none font-black uppercase tracking-wider active:translate-y-1 active:shadow-none transition-transform'
  const nbPrimaryStyle = { backgroundColor: NB.primary, color: NB.primaryFg, border: `2px solid ${NB.border}`, boxShadow: hardShadow }

  return (
    <div data-testid="guias-page" className="space-y-4" style={{ backgroundColor: NB.bg, color: NB.text, padding: 16, margin: -12 }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold">
        <button
          onClick={onLimpiarCliente}
          className="flex items-center gap-1.5 transition-colors"
          style={{ color: NB.text }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Clientes
        </button>
        {clienteActivo && (
          <>
            <span style={{ color: NB.textDim }}>/</span>
            <span className={headingClass} style={{ color: NB.text }}>{clienteActivo.nombre}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 font-black"
              style={{ border: `2px solid ${NB.border}`, color: NB.text, backgroundColor: '#fff' }}
            >
              {clienteActivo.rut}
            </span>
          </>
        )}
      </div>

      <ErrorBanner error={guiasError} />

      {/* Métricas — cards blancas con borde negro y sombra dura */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3" data-testid="guias-metricas">
          {[
            { label: 'Guías pendientes', value: String(guiasPreFiltradas.length), color: NB.primary },
            { label: 'Agrupadores', value: String(agrupadores.length), color: NB.text },
            { label: 'Monto total', value: fmtMonto(montoTotal), color: NB.success },
          ].map((m) => (
            <div key={m.label} className="px-4 py-3" style={cardStyle}>
              <div className="text-[10px] uppercase tracking-wider font-black" style={{ color: NB.textDim }}>
                {m.label}
              </div>
              <div className={`text-2xl ${headingClass}`} style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Banner de filtro activo */}
      {hasActiveFilter && !loading && (
        <div
          data-testid="filtro-accion-banner"
          className="px-4 py-3 flex items-center justify-between gap-3 text-sm"
          style={cardStyle}
        >
          <div className="font-bold" style={{ color: NB.text }}>
            <span className="font-black" style={{ color: NB.primary }}>{guiasFiltradas.length}</span> guía{guiasFiltradas.length !== 1 ? 's' : ''} en el filtro
            {' · '}
            <span className="font-black" style={{ color: NB.success }}>{fmtMonto(montoFiltrado)}</span>
          </div>
          {filtroEsHomogeneo ? (
            <Button
              data-testid="btn-facturar-filtro"
              onClick={onFacturarFiltro}
              size="sm"
              className={`text-xs h-8 px-3 ${nbPrimaryBtn}`}
              style={nbPrimaryStyle}
            >
              Facturar filtro
            </Button>
          ) : (
            <span data-testid="filtro-heterogeneo-hint" className="text-xs italic font-semibold whitespace-nowrap shrink-0" style={{ color: NB.textDim }}>
              Acota a un cliente para facturar en lote
            </span>
          )}
        </div>
      )}

      {/* Panel de filtros */}
      <div style={cardStyle}>
        <div className="px-3 py-3 relative" style={{ borderBottom: `3px solid ${NB.border}` }}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: NB.textDim }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por N° guía, descripción o cliente..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm focus:outline-none font-semibold"
            style={{ backgroundColor: '#fff', color: NB.text, border: `2px solid ${NB.border}` }}
          />
        </div>

        <div className="px-3 py-2.5" style={{ borderBottom: filtrosAbiertos ? `3px solid ${NB.border}` : undefined }}>
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={onToggleFiltros}
            aria-expanded={filtrosAbiertos}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-black transition-colors"
            style={{ color: NB.text }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filtros
            {filtrosAbiertos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {filtrosAbiertos && (
          <>
            <div className="px-3 py-3" style={{ borderBottom: `3px solid ${NB.border}` }}>
              <DateFilter onChange={onDateRangeChange} />
            </div>

            <div className="px-3 py-3 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider font-black w-20 shrink-0" style={{ color: NB.textDim }}>
                  Cliente
                </span>
                <select
                  data-testid="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => onFiltroClienteChange(e.target.value)}
                  className="px-2 py-2 text-sm flex-1 focus:outline-none font-semibold rounded-none"
                  style={{ backgroundColor: '#fff', color: NB.text, border: `2px solid ${NB.border}` }}
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
                  <span className="text-[10px] uppercase tracking-wider font-black w-20 shrink-0" style={{ color: NB.textDim }}>
                    Agrupador
                  </span>

                  {agrupadores.length < 8 ? (
                    <>
                      <button
                        onClick={() => onFiltroAgrupadorChange('')}
                        className="text-xs px-2.5 py-1.5 font-bold transition-all"
                        style={
                          filtroAgrupador === ''
                            ? { backgroundColor: NB.primary, color: NB.primaryFg, border: `2px solid ${NB.border}` }
                            : { color: NB.text, border: `2px solid ${NB.border}`, backgroundColor: '#fff' }
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
                            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 font-bold transition-all"
                            style={{
                              border: `2px solid ${NB.border}`,
                              backgroundColor: isActive ? ag.color : '#fff',
                              color: NB.text,
                            }}
                          >
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ backgroundColor: ag.color, border: `1px solid ${NB.border}` }}
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
                        className="px-2 py-2 text-sm w-40 focus:outline-none font-semibold"
                        style={{ backgroundColor: '#fff', color: NB.text, border: `2px solid ${NB.border}` }}
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { onFiltroAgrupadorChange(e.target.value); onBusquedaAgrupadorChange('') }}
                        className="px-2 py-2 text-sm flex-1 focus:outline-none font-semibold"
                        style={{ backgroundColor: '#fff', color: NB.text, border: `2px solid ${NB.border}` }}
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
                    <span className="text-xs font-bold" style={{ color: NB.textDim }}>
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
      <div style={{ border: `3px solid ${NB.border}`, boxShadow: hardShadow }}>
        <GuiasGrid
          guias={guiasFiltradas}
          loading={loading}
          onFacturarAgrupador={onFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={onSeleccionChange}
          variant="neo-brutalista"
        />
      </div>

      {seleccionActiva.length > 0 && <div data-testid="bulk-bar-spacer" style={{ height: 88 }} />}

      {/* Bulk bar */}
      <div
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 px-5 py-3 transition-all duration-300"
        style={{
          backgroundColor: NB.surface,
          border: `3px solid ${NB.border}`,
          boxShadow: hardShadow,
          transform: `translateX(-50%) translateY(${seleccionActiva.length > 0 ? '0' : '90px'})`,
          opacity: seleccionActiva.length > 0 ? 1 : 0,
          pointerEvents: seleccionActiva.length > 0 ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className={`text-sm ${headingClass}`} style={{ color: NB.text }}>
          <span style={{ color: NB.primary }}>{seleccionActiva.length}</span> guía{seleccionActiva.length !== 1 ? 's' : ''} seleccionada{seleccionActiva.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-black" style={{ color: NB.success }}>{fmtMonto(montoSeleccion)}</span>
        <div className="w-px h-5" style={{ backgroundColor: NB.border }} />
        <Button
          data-testid="btn-facturar-seleccion"
          onClick={onAbrirDialogo}
          disabled={seleccionActiva.length === 0}
          className={`px-4 py-1.5 text-sm ${nbPrimaryBtn}`}
          style={nbPrimaryStyle}
        >
          Facturar Selección
          <span
            data-testid="facturar-seleccion-count"
            className="ml-1.5 text-xs font-black px-1.5 py-0.5"
            style={{ backgroundColor: '#fff', color: NB.primary, border: `2px solid ${NB.border}` }}
          >
            {seleccionActiva.length}
          </span>
        </Button>
        <button
          onClick={onLimpiarSeleccion}
          className="text-sm transition-colors"
          style={{ color: NB.text }}
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
