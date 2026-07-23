import { Button } from '@/components/ui/button'
import type { GuiasGridVariant, GroupHeaderRowProps, GuiaRowProps } from './types'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

// PROTOTYPE (issue #15) — tokens del concepto "Glassmorphism Cripto". Fintech
// premium: fondo oscuro con gradiente animado (ver GlassCriptoView.tsx),
// paneles glass (blur+translúcido) SOLO en el chrome de la página — nunca en
// filas de esta grilla (ver comentario junto a GuiaRow). Fuente única de la
// paleta — importada también por src/pages/guias-variants/GlassCriptoView.tsx.
export const GC = {
  bg: '#0a0e17',
  surface: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
  borderStrong: 'rgba(255,255,255,0.18)',
  text: '#f1f5f9',
  textDim: '#94a3b8',
  accent: '#22d3ee',
  accent2: '#a78bfa',
  accentFg: '#04141a',
} as const

const COLUMN_COUNT = 8

function TableHead({ columnLabels }: { columnLabels: string[] }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: '#0d1220', borderBottom: `1px solid ${GC.borderStrong}` }}>
        <th style={{ padding: '8px 10px' }} className="w-10" />
        <th style={{ padding: '8px 10px', color: GC.textDim }} className="text-left text-[11px] font-semibold uppercase tracking-widest font-mono w-10">#</th>
        {columnLabels.map((label) => (
          <th
            key={label}
            style={{ padding: '8px 10px', color: GC.textDim }}
            className={`text-[11px] font-semibold uppercase tracking-widest font-mono ${label === 'Bultos' || label === 'Monto Neto' ? 'text-right' : 'text-left'}`}
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
        <td key={i} style={{ padding: '8px 10px', borderBottom: `1px solid ${GC.border}` }}>
          <div className="h-3 rounded-full" style={{ backgroundColor: GC.border, width: i === 0 ? 12 : '70%' }} />
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return (
    <span className="text-[11px] uppercase tracking-widest font-mono" style={{ color: GC.textDim }}>
      Sin guías para los filtros seleccionados
    </span>
  )
}

function GroupHeaderRow({ group, onFacturarAgrupador }: GroupHeaderRowProps) {
  const color = group.agrupadorColor
  return (
    // Fondo plano semitransparente (sin backdrop-blur): esta fila se repite por
    // cada agrupador dentro de la lista virtualizada — mismo criterio que GuiaRow.
    <tr style={{ backgroundColor: color + '1f', borderTop: `1px solid ${GC.borderStrong}`, borderBottom: `1px solid ${GC.border}` }}>
      <td colSpan={COLUMN_COUNT} style={{ padding: '8px 10px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span className="text-xs font-bold font-mono tracking-widest uppercase" style={{ color: GC.text }}>
              {group.agrupadorCodigo}
            </span>
            {group.reglaIdl && (
              <span
                data-testid={`regla-badge-${group.agrupadorId}`}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{ color: GC.textDim, border: `1px solid ${GC.border}` }}
                title="Regla de agrupación"
              >
                {group.reglaIdl}
              </span>
            )}
            <span className="text-xs font-mono" style={{ color: GC.textDim }}>
              {group.guias.length} {group.guias.length === 1 ? 'guía' : 'guías'}
              {' · '}
              <span className="font-bold tracking-widest" style={{ color: GC.text }}>{clpFormatter.format(group.totalMonto)}</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid={`btn-facturar-agrupador-${group.agrupadorId}`}
            onClick={onFacturarAgrupador}
            className="text-[11px] h-7 px-3.5 rounded-full font-mono uppercase tracking-widest hover:brightness-110 transition-all"
            style={{ backgroundColor: GC.accent + '26', color: GC.accent, borderColor: GC.accent + '55' }}
          >
            Facturar
          </Button>
        </div>
      </td>
    </tr>
  )
}

function GuiaRow({ guia, group, globalIndex, isSelected, onCheckbox }: GuiaRowProps) {
  const color = group.agrupadorColor
  return (
    // Decisión de performance (issue #15): esta grilla es virtualizada y puede
    // renderizar cientos de filas mientras se hace scroll — aplicar
    // backdrop-blur por fila forzaría recomputar el filtro de blur en cada
    // frame de scroll, muy costoso. Por eso las filas usan solo color plano
    // semitransparente; el glassmorphism (backdrop-blur) se reserva al chrome
    // estático de la página (panel de filtros, métricas, barra de selección).
    <tr
      data-testid={`guia-row-${guia.id}`}
      className="transition-colors border-l-2"
      style={{
        borderLeftColor: color,
        borderBottom: `1px solid ${GC.border}`,
        backgroundColor: isSelected ? color + '24' : 'transparent',
      }}
    >
      <td style={{ padding: '7px 10px' }}>
        <input
          data-testid={`checkbox-${guia.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckbox(guia)}
          className="h-3.5 w-3.5 rounded"
          style={{ accentColor: GC.accent, borderColor: GC.border }}
        />
      </td>
      <td className="whitespace-nowrap tabular-nums font-mono text-xs tracking-widest" style={{ padding: '7px 10px', color: GC.textDim }}>
        {globalIndex + 1}
      </td>
      <td className="whitespace-nowrap text-xs font-semibold font-mono tracking-widest" style={{ padding: '7px 10px', color: GC.text }}>
        {guia.numero}
      </td>
      <td className="whitespace-nowrap text-xs" style={{ padding: '7px 10px', color: GC.textDim }}>
        {guia.clienteNombre}
      </td>
      <td className="whitespace-nowrap text-xs font-mono" style={{ padding: '7px 10px', color: GC.textDim }}>
        {guia.fecha}
      </td>
      <td className="text-xs max-w-xs truncate" style={{ padding: '7px 10px', color: GC.text }}>
        {guia.descripcion}
      </td>
      <td className="whitespace-nowrap text-xs text-right tabular-nums font-mono tracking-widest" style={{ padding: '7px 10px', color: GC.textDim }}>
        {guia.cantidad}
      </td>
      <td className="whitespace-nowrap text-xs font-bold text-right font-mono tracking-widest" style={{ padding: '7px 10px', color: GC.accent }}>
        {clpFormatter.format(guia.montoNeto)}
      </td>
    </tr>
  )
}

export const glassCriptoGridVariant: GuiasGridVariant = {
  key: 'glass-cripto',
  rowHeightHeader: 38,
  rowHeightData: 32,
  containerStyle: { backgroundColor: GC.bg },
  tableClassName: 'w-full',
  TableHead,
  SkeletonRow,
  EmptyState,
  GroupHeaderRow,
  GuiaRow,
}
