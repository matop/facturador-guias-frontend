import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Guia } from '@/types'
import { getGridVariant } from './variants/registry'
import type { GuiaGroup } from './variants/types'

interface GuiasGridProps {
  guias: Guia[]
  loading: boolean
  onFacturarAgrupador: (agrupadorId: string, guias: Guia[]) => void
  selectedIds: Set<string>
  onSeleccionChange: (guia: Guia, checked: boolean) => void
  variant?: string
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
        reglaIdl: guia.reglaIdl,
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

const columnLabels = ['N° Guía', 'Cliente', 'Fecha', 'Descripción', 'Bultos', 'Monto Neto']

export function GuiasGrid({ guias, loading, onFacturarAgrupador, selectedIds, onSeleccionChange, variant }: GuiasGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const v = getGridVariant(variant)

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
    estimateSize: (i) => (flatItems[i]?.kind === 'header' ? v.rowHeightHeader : v.rowHeightData),
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0)

  const { TableHead, SkeletonRow, EmptyState, GroupHeaderRow, GuiaRow } = v

  if (loading) {
    return (
      <div role="status" data-testid="guias-grid-skeleton" style={v.containerStyle}>
        <table className={v.tableClassName}>
          <TableHead columnLabels={columnLabels} />
          <tbody className={v.tbodyClassName}>
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
      <div data-testid="guias-grid-empty" className="text-center py-12 font-mono" style={v.containerStyle}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div ref={parentRef} data-testid="guias-grid-virtual" className="overflow-auto" style={{ height: '600px', ...v.containerStyle }}>
      <div className="overflow-x-auto">
        <table className={v.tableClassName}>
          <TableHead columnLabels={columnLabels} />
          <tbody className={v.tbodyClassName}>
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
