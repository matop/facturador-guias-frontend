import { Button } from '@/components/ui/button'
import type { GuiasGridVariant, GroupHeaderRowProps, GuiaRowProps } from './types'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

// PROTOTYPE (issue #16) — tokens del concepto "Terminal SII". Modo ingeniería:
// fondo negro puro, ámbar fosforoso para datos, verde fósforo para éxito /
// selección / totales. No globales, no persisten fuera de esta rama. Fuente
// única — importado también por src/pages/guias-variants/TerminalSiiView.tsx
// para no duplicar.
export const TS = {
  bg: '#000000',
  surface: '#0a0a0a',
  border: '#332200',
  borderStrong: '#4d3300',
  text: '#ffb000',
  dim: '#996600',
  success: '#00ff41',
  successDim: '#0a3d1a',
} as const

const COLUMN_COUNT = 8

// LED tipo bloque — reemplaza el dot redondeado de control-room por un
// carácter de bloque ASCII, más "terminal".
function Led({ color, title }: { color: string; title?: string }) {
  return (
    <span
      title={title}
      aria-hidden="true"
      className="inline-block leading-none"
      style={{ color, textShadow: `0 0 4px ${color}` }}
    >
      ■
    </span>
  )
}

function TableHead({ columnLabels }: { columnLabels: string[] }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: TS.surface, borderBottom: `1px solid ${TS.borderStrong}` }}>
        <th style={{ padding: '6px 8px' }} className="w-10" />
        <th style={{ padding: '6px 8px', color: TS.dim }} className="text-left text-[10px] font-semibold uppercase tracking-wider font-mono w-10">
          #
        </th>
        {columnLabels.map((label) => (
          <th
            key={label}
            style={{ padding: '6px 8px', color: TS.dim }}
            className={`text-[10px] font-semibold uppercase tracking-wider font-mono ${label === 'Bultos' || label === 'Monto Neto' ? 'text-right' : 'text-left'}`}
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
        <td key={i} style={{ padding: '6px 8px', borderBottom: `1px solid ${TS.border}` }}>
          <div className="h-3 rounded-none" style={{ backgroundColor: TS.surface, width: i === 0 ? 12 : '70%' }} />
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return <>{'> NO_DATA :: sin guías para los filtros seleccionados_'}</>
}

function GroupHeaderRow({ group, onFacturarAgrupador }: GroupHeaderRowProps) {
  const color = group.agrupadorColor
  return (
    <tr style={{ backgroundColor: TS.surface, borderTop: `1px solid ${TS.borderStrong}`, borderBottom: `1px solid ${TS.border}` }}>
      <td colSpan={COLUMN_COUNT} style={{ padding: '6px 8px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Led color={color} title={group.agrupadorCodigo} />
            <span className="text-xs font-bold font-mono tracking-wider" style={{ color: TS.text }}>
              {group.agrupadorCodigo}
            </span>
            {group.reglaIdl && (
              <span
                data-testid={`regla-badge-${group.agrupadorId}`}
                className="text-[10px] font-mono px-1.5 py-0.5"
                style={{ color: TS.dim, border: `1px solid ${TS.border}` }}
                title="Regla de agrupación"
              >
                [{group.reglaIdl}]
              </span>
            )}
            <span className="text-xs font-mono" style={{ color: TS.dim }}>
              {group.guias.length} {group.guias.length === 1 ? 'guía' : 'guías'}
              {' · '}
              <span className="font-bold" style={{ color: TS.success, textShadow: `0 0 3px ${TS.success}66` }}>
                {clpFormatter.format(group.totalMonto)}
              </span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid={`btn-facturar-agrupador-${group.agrupadorId}`}
            onClick={onFacturarAgrupador}
            className="text-xs h-7 px-3 rounded-none font-mono uppercase tracking-wider hover:brightness-110 transition-all"
            style={{ backgroundColor: TS.success, color: TS.bg, borderColor: TS.success }}
          >
            $ facturar <kbd className="ml-1 opacity-70">[F]</kbd>
          </Button>
        </div>
      </td>
    </tr>
  )
}

function GuiaRow({ guia, group, globalIndex, isSelected, onCheckbox }: GuiaRowProps) {
  const color = group.agrupadorColor
  return (
    <tr
      data-testid={`guia-row-${guia.id}`}
      className="transition-colors border-l-2"
      style={{
        borderLeftColor: color,
        borderBottom: `1px solid ${TS.border}`,
        backgroundColor: isSelected ? TS.successDim : TS.bg,
      }}
    >
      <td style={{ padding: '6px 8px' }}>
        <input
          data-testid={`checkbox-${guia.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckbox(guia)}
          className="h-3.5 w-3.5 rounded-none border"
          style={{ accentColor: TS.success, borderColor: TS.border }}
        />
      </td>
      <td className="whitespace-nowrap tabular-nums font-mono text-xs" style={{ padding: '6px 8px', color: TS.dim }}>
        {globalIndex + 1}
      </td>
      <td
        className="whitespace-nowrap text-xs font-semibold font-mono"
        style={{ padding: '6px 8px', color: isSelected ? TS.success : TS.text }}
      >
        {guia.numero}
      </td>
      <td className="whitespace-nowrap text-xs font-mono" style={{ padding: '6px 8px', color: TS.dim }}>
        {guia.clienteNombre}
      </td>
      <td className="whitespace-nowrap text-xs font-mono" style={{ padding: '6px 8px', color: TS.dim }}>
        {guia.fecha}
      </td>
      <td className="text-xs max-w-xs truncate font-mono" style={{ padding: '6px 8px', color: TS.text }}>
        {guia.descripcion}
      </td>
      <td className="whitespace-nowrap text-xs text-right tabular-nums font-mono" style={{ padding: '6px 8px', color: TS.dim }}>
        {guia.cantidad}
      </td>
      <td
        className="whitespace-nowrap text-xs font-bold text-right font-mono"
        style={{ padding: '6px 8px', color: TS.success, textShadow: `0 0 3px ${TS.success}55` }}
      >
        {clpFormatter.format(guia.montoNeto)}
      </td>
    </tr>
  )
}

export const terminalSiiGridVariant: GuiasGridVariant = {
  key: 'terminal-sii',
  rowHeightHeader: 36,
  rowHeightData: 30,
  containerStyle: { backgroundColor: TS.bg },
  tableClassName: 'w-full',
  TableHead,
  SkeletonRow,
  EmptyState,
  GroupHeaderRow,
  GuiaRow,
}
