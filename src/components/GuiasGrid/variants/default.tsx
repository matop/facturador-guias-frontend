import { Button } from '@/components/ui/button'
import { getChipTextColor } from '@/utils/agrupadorColors'
import type { GuiasGridVariant, GroupHeaderRowProps, GuiaRowProps } from './types'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

const COLUMN_COUNT = 8

function TableHead({ columnLabels }: { columnLabels: string[] }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
        <th className="px-4 py-3 w-10" />
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-10">#</th>
        {columnLabels.map((label) => (
          <th
            key={label}
            className={`px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ${label === 'Bultos' || label === 'Monto Neto' ? 'text-right' : ''}`}
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
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-4" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-6" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-28" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-40" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-10" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
    </tr>
  )
}

function EmptyState() {
  return <span className="text-muted-foreground">No hay guías para los filtros seleccionados.</span>
}

function GroupHeaderRow({ group, onFacturarAgrupador }: GroupHeaderRowProps) {
  const color = group.agrupadorColor
  const chipText = getChipTextColor(color)
  return (
    <tr style={{ backgroundColor: color + '22', borderTop: `2px solid ${color}44` }}>
      <td colSpan={COLUMN_COUNT} className="px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide"
              style={{
                backgroundColor: color,
                color: chipText,
                boxShadow: `0 0 0 2px ${color}55`,
              }}
            >
              {group.agrupadorCodigo}
            </span>
            {group.reglaIdl && (
              <span
                data-testid={`regla-badge-${group.agrupadorId}`}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground border border-border"
                title="Regla de agrupación"
              >
                {group.reglaIdl}
              </span>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {group.guias.length} {group.guias.length === 1 ? 'guía' : 'guías'}
              {' · '}
              <span className="font-semibold text-foreground">{clpFormatter.format(group.totalMonto)}</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid={`btn-facturar-agrupador-${group.agrupadorId}`}
            onClick={onFacturarAgrupador}
            style={{
              borderColor: color,
              color: color,
              backgroundColor: color + '12',
            }}
            className="text-xs h-7 px-3 hover:opacity-80 font-semibold"
          >
            Facturar este agrupador
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
      className="hover:brightness-95 transition-all border-l-[3px]"
      style={{
        borderLeftColor: color,
        backgroundColor: isSelected ? color + '22' : color + '0d',
      }}
    >
      <td className="px-4 py-3 pl-6">
        <input
          data-testid={`checkbox-${guia.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckbox(guia)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap tabular-nums">
        {globalIndex + 1}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-foreground font-mono">
        {guia.numero}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {guia.clienteNombre}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
        {guia.fecha}
      </td>
      <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
        {guia.descripcion}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground text-right tabular-nums">
        {guia.cantidad}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-foreground text-right font-mono">
        {clpFormatter.format(guia.montoNeto)}
      </td>
    </tr>
  )
}

export const defaultGridVariant: GuiasGridVariant = {
  key: 'default',
  rowHeightHeader: 46,
  rowHeightData: 48,
  tableClassName: 'min-w-full divide-y divide-border',
  tbodyClassName: 'bg-card divide-y divide-border',
  TableHead,
  SkeletonRow,
  EmptyState,
  GroupHeaderRow,
  GuiaRow,
}
