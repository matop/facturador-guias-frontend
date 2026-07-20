import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Guia } from '@/types'
import { Button } from '@/components/ui/button'
import { getChipTextColor } from '@/utils/agrupadorColors'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

interface GuiasGridProps {
  guias: Guia[]
  loading: boolean
  onFacturarAgrupador: (agrupadorId: string, guias: Guia[]) => void
  selectedIds: Set<string>
  onSeleccionChange: (guia: Guia, checked: boolean) => void
}

interface GuiaGroup {
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  guias: Guia[]
  totalMonto: number
}

type FlatItem =
  | { kind: 'header'; group: GuiaGroup }
  | { kind: 'row'; guia: Guia; group: GuiaGroup; globalIndex: number }

function groupByAgrupador(guias: Guia[]): GuiaGroup[] {
  const map = new Map<string, GuiaGroup>()
  for (const guia of guias) {
    const existing = map.get(guia.agrupadorId)
    if (existing) {
      existing.guias.push(guia)
      existing.totalMonto += guia.montoNeto
    } else {
      map.set(guia.agrupadorId, {
        agrupadorId: guia.agrupadorId,
        agrupadorCodigo: guia.agrupadorCodigo,
        agrupadorColor: guia.agrupadorColor,
        guias: [guia],
        totalMonto: guia.montoNeto,
      })
    }
  }
  return Array.from(map.values())
}

function flattenGroups(groups: GuiaGroup[]): FlatItem[] {
  const items: FlatItem[] = []
  let globalIndex = 0
  for (const group of groups) {
    items.push({ kind: 'header', group })
    for (const guia of group.guias) {
      items.push({ kind: 'row', guia, group, globalIndex })
      globalIndex++
    }
  }
  return items
}

const COLUMN_COUNT = 8
const ROW_HEIGHT_HEADER = 46
const ROW_HEIGHT_DATA = 48

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

interface GroupHeaderRowProps {
  group: GuiaGroup
  onFacturarAgrupador: () => void
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
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide shadow-sm"
              style={{
                backgroundColor: color,
                color: chipText,
                boxShadow: `0 0 0 2px ${color}55`,
              }}
            >
              {group.agrupadorCodigo}
            </span>
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

interface GuiaRowProps {
  guia: Guia
  group: GuiaGroup
  globalIndex: number
  isSelected: boolean
  onCheckbox: (guia: Guia) => void
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

export function GuiasGrid({ guias, loading, onFacturarAgrupador, selectedIds, onSeleccionChange }: GuiasGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const handleCheckbox = (guia: Guia) => {
    onSeleccionChange(guia, !selectedIds.has(guia.id))
  }

  const handleFacturarAgrupador = (group: GuiaGroup) => {
    onFacturarAgrupador(group.agrupadorId, group.guias)
  }

  const groups = loading ? [] : groupByAgrupador(guias)
  const flatItems = loading ? [] : flattenGroups(groups)

  const rowVirtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => flatItems[i]?.kind === 'header' ? ROW_HEIGHT_HEADER : ROW_HEIGHT_DATA,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0)

  const tableHead = (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
        <th className="px-4 py-3 w-10" />
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-10">#</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">N° Guía</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Descripción</th>
        <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bultos</th>
        <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Monto Neto</th>
      </tr>
    </thead>
  )

  if (loading) {
    return (
      <div role="status" data-testid="guias-grid-skeleton">
        <table className="min-w-full divide-y divide-border">
          {tableHead}
          <tbody className="bg-card divide-y divide-border">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    )
  }

  if (guias.length === 0) {
    return (
      <div data-testid="guias-grid-empty" className="text-center py-12 text-muted-foreground">
        No hay guías para los filtros seleccionados.
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      data-testid="guias-grid-virtual"
      className="overflow-auto"
      style={{ height: '600px' }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          {tableHead}
          <tbody className="bg-card divide-y divide-border">
            {paddingTop > 0 && (
              <tr><td style={{ height: paddingTop }} /></tr>
            )}
            {virtualItems.map((vr) => {
              const item = flatItems[vr.index]
              if (!item) return null
              if (item.kind === 'header') {
                return (
                  <GroupHeaderRow
                    key={vr.key}
                    group={item.group}
                    onFacturarAgrupador={() => handleFacturarAgrupador(item.group)}
                  />
                )
              }
              return (
                <GuiaRow
                  key={vr.key}
                  guia={item.guia}
                  group={item.group}
                  globalIndex={item.globalIndex}
                  isSelected={selectedIds.has(item.guia.id)}
                  onCheckbox={handleCheckbox}
                />
              )
            })}
            {paddingBottom > 0 && (
              <tr><td style={{ height: paddingBottom }} /></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
