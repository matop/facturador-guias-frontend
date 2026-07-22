import { Button } from '@/components/ui/button'
import type { GuiasGridVariant, GroupHeaderRowProps, GuiaRowProps } from './types'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

// PROTOTYPE (issue #13) — tokens del concepto "Control Room". No globales, no
// persisten fuera de esta rama. Fuente única — importado también por
// src/pages/guias-variants/controlRoom/ControlRoomView.tsx para no duplicar.
// Fondo bajado de #050505 a un slate oscuro (feedback: "fondo oscurísimo" +
// contraste insuficiente en texto secundario).
export const CR = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  borderStrong: '#475569',
  text: '#f1f5f9',
  textDim: '#94a3b8',
  accent: '#00ff88',
  accentFg: '#000000',
} as const

const COLUMN_COUNT = 8

function TableHead({ columnLabels }: { columnLabels: string[] }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: CR.surface, borderBottom: `1px solid ${CR.borderStrong}` }}>
        <th style={{ padding: '6px 8px' }} className="w-10" />
        <th style={{ padding: '6px 8px', color: CR.textDim }} className="text-left text-[10px] font-semibold uppercase tracking-wider font-mono w-10">#</th>
        {columnLabels.map((label) => (
          <th
            key={label}
            style={{ padding: '6px 8px', color: CR.textDim }}
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
        <td key={i} style={{ padding: '6px 8px', borderBottom: `1px solid ${CR.border}` }}>
          <div className="h-3 rounded-none" style={{ backgroundColor: CR.surface, width: i === 0 ? 12 : '70%' }} />
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return <>// NO HAY GUÍAS PARA LOS FILTROS SELECCIONADOS</>
}

// LED de estado — reemplaza el badge/chip pastel del concepto default.
function Led({ color, title }: { color: string; title?: string }) {
  return (
    <span
      title={title}
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}, 0 0 1px ${color}` }}
    />
  )
}

function GroupHeaderRow({ group, onFacturarAgrupador }: GroupHeaderRowProps) {
  const color = group.agrupadorColor
  return (
    <tr style={{ backgroundColor: CR.surface, borderTop: `1px solid ${CR.borderStrong}`, borderBottom: `1px solid ${CR.border}` }}>
      <td colSpan={COLUMN_COUNT} style={{ padding: '6px 8px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Led color={color} title={group.agrupadorCodigo} />
            <span className="text-xs font-bold font-mono tracking-wider" style={{ color: CR.text }}>
              {group.agrupadorCodigo}
            </span>
            {group.reglaIdl && (
              <span
                data-testid={`regla-badge-${group.agrupadorId}`}
                className="text-[10px] font-mono px-1.5 py-0.5"
                style={{ color: CR.textDim, border: `1px solid ${CR.border}` }}
                title="Regla de agrupación"
              >
                {group.reglaIdl}
              </span>
            )}
            <span className="text-xs font-mono" style={{ color: CR.textDim }}>
              {group.guias.length} {group.guias.length === 1 ? 'guía' : 'guías'}
              {' · '}
              <span className="font-bold" style={{ color: CR.text }}>{clpFormatter.format(group.totalMonto)}</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid={`btn-facturar-agrupador-${group.agrupadorId}`}
            onClick={onFacturarAgrupador}
            className="text-xs h-7 px-3 rounded-none font-mono uppercase tracking-wider hover:brightness-110 transition-all"
            style={{ backgroundColor: CR.accent, color: CR.accentFg, borderColor: CR.accent }}
          >
            Facturar <kbd className="ml-1 opacity-70">[F]</kbd>
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
        borderBottom: `1px solid ${CR.border}`,
        backgroundColor: isSelected ? color + '1a' : CR.bg,
      }}
    >
      <td style={{ padding: '6px 8px' }}>
        <input
          data-testid={`checkbox-${guia.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckbox(guia)}
          className="h-3.5 w-3.5 rounded-none border"
          style={{ accentColor: CR.accent, borderColor: CR.border }}
        />
      </td>
      <td className="whitespace-nowrap tabular-nums font-mono text-xs" style={{ padding: '6px 8px', color: CR.textDim }}>
        {globalIndex + 1}
      </td>
      <td className="whitespace-nowrap text-xs font-semibold font-mono" style={{ padding: '6px 8px', color: CR.text }}>
        {guia.numero}
      </td>
      <td className="whitespace-nowrap text-xs font-mono" style={{ padding: '6px 8px', color: CR.textDim }}>
        {guia.clienteNombre}
      </td>
      <td className="whitespace-nowrap text-xs font-mono" style={{ padding: '6px 8px', color: CR.textDim }}>
        {guia.fecha}
      </td>
      <td className="text-xs max-w-xs truncate" style={{ padding: '6px 8px', color: CR.text }}>
        {guia.descripcion}
      </td>
      <td className="whitespace-nowrap text-xs text-right tabular-nums font-mono" style={{ padding: '6px 8px', color: CR.textDim }}>
        {guia.cantidad}
      </td>
      <td className="whitespace-nowrap text-xs font-bold text-right font-mono" style={{ padding: '6px 8px', color: CR.accent }}>
        {clpFormatter.format(guia.montoNeto)}
      </td>
    </tr>
  )
}

export const controlRoomGridVariant: GuiasGridVariant = {
  key: 'control-room',
  rowHeightHeader: 36,
  rowHeightData: 30,
  containerStyle: { backgroundColor: CR.bg },
  TableHead,
  SkeletonRow,
  EmptyState,
  GroupHeaderRow,
  GuiaRow,
}
