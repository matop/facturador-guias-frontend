import { Button } from '@/components/ui/button'
import { getChipTextColor } from '@/utils/agrupadorColors'
import type { GuiasGridVariant, GroupHeaderRowProps, GuiaRowProps } from './types'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

// PROTOTYPE (issue #14) — tokens del concepto "Neo-Brutalismo Fiscal". No
// globales, no persisten fuera de esta rama. Fuente única — importado también
// por src/pages/guias-variants/NeoBrutalistaView.tsx para no duplicar.
// Rojo fiscal como color primario de acción; verde SAT como acento de
// éxito/totales. Fondo claro, cards blancas con borde negro grueso + sombra
// dura sin blur (firma visual neo-brutalista).
export const NB = {
  bg: '#f5f5f0',
  surface: '#ffffff',
  border: '#000000',
  primary: '#dc2626',
  primaryFg: '#ffffff',
  success: '#16a34a',
  text: '#111111',
  textDim: '#525252',
} as const

const COLUMN_COUNT = 8

// Sombra dura característica del neo-brutalismo: offset sólido, sin blur.
const hardShadow = '3px 3px 0 0 #000'

function TableHead({ columnLabels }: { columnLabels: string[] }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: NB.text, borderBottom: `3px solid ${NB.border}` }}>
        <th style={{ padding: '8px 8px' }} className="w-10" />
        <th style={{ padding: '8px 8px', color: '#ffffff' }} className="text-left text-[10px] font-black uppercase tracking-wider w-10">#</th>
        {columnLabels.map((label) => (
          <th
            key={label}
            style={{ padding: '8px 8px', color: '#ffffff' }}
            className={`text-[10px] font-black uppercase tracking-wider ${label === 'Bultos' || label === 'Monto Neto' ? 'text-right' : 'text-left'}`}
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
        <td key={i} style={{ padding: '8px 8px', borderBottom: `2px solid ${NB.border}` }}>
          <div className="h-3" style={{ backgroundColor: '#d4d4d4', width: i === 0 ? 12 : '70%' }} />
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return (
    <span className="font-black uppercase tracking-tight" style={{ color: NB.text }}>
      Sin guías para los filtros seleccionados
    </span>
  )
}

function GroupHeaderRow({ group, onFacturarAgrupador }: GroupHeaderRowProps) {
  // Pastel saturado (alpha alto) — a diferencia del variant "default", que usa
  // un wash muy claro (~0x0d/0x22), acá subimos la saturación percibida.
  const color = group.agrupadorColor
  const chipText = getChipTextColor(color)
  return (
    <tr style={{ backgroundColor: color, borderTop: `3px solid ${NB.border}`, borderBottom: `3px solid ${NB.border}` }}>
      <td colSpan={COLUMN_COUNT} style={{ padding: '8px 10px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center px-2.5 py-1 text-xs font-black uppercase tracking-wide"
              style={{ backgroundColor: NB.text, color: '#ffffff', border: `2px solid ${NB.border}` }}
            >
              {group.agrupadorCodigo}
            </span>
            {group.reglaIdl && (
              <span
                data-testid={`regla-badge-${group.agrupadorId}`}
                className="text-[10px] font-bold px-1.5 py-0.5"
                style={{ color: chipText, border: `2px solid ${NB.border}` }}
                title="Regla de agrupación"
              >
                {group.reglaIdl}
              </span>
            )}
            <span className="text-xs font-bold" style={{ color: chipText }}>
              {group.guias.length} {group.guias.length === 1 ? 'guía' : 'guías'}
              {' · '}
              <span className="font-black">{clpFormatter.format(group.totalMonto)}</span>
            </span>
          </div>
          <Button
            size="sm"
            data-testid={`btn-facturar-agrupador-${group.agrupadorId}`}
            onClick={onFacturarAgrupador}
            className="text-xs h-7 px-3 rounded-none font-black uppercase tracking-wider active:translate-y-1 active:shadow-none transition-transform"
            style={{ backgroundColor: NB.primary, color: NB.primaryFg, border: `2px solid ${NB.border}`, boxShadow: hardShadow }}
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
  // Filas alternadas: par → pastel saturado del agrupador, impar → blanco. El
  // seleccionado se marca con el rojo fiscal en baja opacidad, por encima de
  // ambos.
  const baseBg = globalIndex % 2 === 0 ? color + 'bf' : NB.surface
  return (
    <tr
      data-testid={`guia-row-${guia.id}`}
      style={{
        borderBottom: `2px solid ${NB.border}`,
        backgroundColor: isSelected ? NB.primary + '33' : baseBg,
      }}
    >
      <td style={{ padding: '7px 8px' }}>
        <input
          data-testid={`checkbox-${guia.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckbox(guia)}
          className="h-4 w-4 rounded-none border-2 cursor-pointer"
          style={{ accentColor: NB.primary, borderColor: NB.border }}
        />
      </td>
      <td className="whitespace-nowrap tabular-nums text-xs font-bold" style={{ padding: '7px 8px', color: NB.textDim }}>
        {globalIndex + 1}
      </td>
      <td className="whitespace-nowrap text-xs font-black" style={{ padding: '7px 8px', color: NB.text }}>
        {guia.numero}
      </td>
      <td className="whitespace-nowrap text-xs font-semibold" style={{ padding: '7px 8px', color: NB.text }}>
        {guia.clienteNombre}
      </td>
      <td className="whitespace-nowrap text-xs font-semibold" style={{ padding: '7px 8px', color: NB.textDim }}>
        {guia.fecha}
      </td>
      <td className="text-xs max-w-xs truncate font-medium" style={{ padding: '7px 8px', color: NB.text }}>
        {guia.descripcion}
      </td>
      <td className="whitespace-nowrap text-xs text-right tabular-nums font-bold" style={{ padding: '7px 8px', color: NB.text }}>
        {guia.cantidad}
      </td>
      <td className="whitespace-nowrap text-xs font-black text-right" style={{ padding: '7px 8px', color: NB.success }}>
        {clpFormatter.format(guia.montoNeto)}
      </td>
    </tr>
  )
}

export const neoBrutalistaGridVariant: GuiasGridVariant = {
  key: 'neo-brutalista',
  rowHeightHeader: 40,
  rowHeightData: 32,
  containerStyle: { backgroundColor: NB.bg },
  TableHead,
  SkeletonRow,
  EmptyState,
  GroupHeaderRow,
  GuiaRow,
}
