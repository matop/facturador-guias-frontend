import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Guia } from '@/types'
import { Button } from '@/components/ui/button'
import { getChipTextColor } from '@/utils/agrupadorColors'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

// PROTOTYPE (issue #13 — "Control Room") — tokens locales del concepto, no globales.
// Ver Guias.tsx para el resto del concepto y el switcher de variantes.
const CR = {
  bg: '#050505',
  surface: '#0a0a0a',
  border: '#222222',
  borderStrong: '#333333',
  text: '#e5e5e5',
  textDim: '#7a7a7a',
  accent: '#00ff88',
  accentFg: '#000000',
} as const

type GridVariant = 'default' | 'control-room'

interface GuiasGridProps {
  guias: Guia[]
  loading: boolean
  onFacturarAgrupador: (agrupadorId: string, guias: Guia[]) => void
  selectedIds: Set<string>
  onSeleccionChange: (guia: Guia, checked: boolean) => void
  variant?: GridVariant
}

interface GuiaGroup {
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  reglaIdl: string | null
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

const COLUMN_COUNT = 8
const ROW_HEIGHT_HEADER = 46
const ROW_HEIGHT_DATA = 48
const ROW_HEIGHT_HEADER_CR = 36
const ROW_HEIGHT_DATA_CR = 30

// LED de estado — reemplaza el badge/chip pastel en el concepto "Control Room".
function Led({ color, title }: { color: string; title?: string }) {
  return (
    <span
      title={title}
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}, 0 0 1px ${color}` }}
    />
  )
}

function SkeletonRow({ variant }: { variant: GridVariant }) {
  if (variant === 'control-room') {
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
  variant: GridVariant
}

function GroupHeaderRow({ group, onFacturarAgrupador, variant }: GroupHeaderRowProps) {
  const color = group.agrupadorColor

  if (variant === 'control-room') {
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

interface GuiaRowProps {
  guia: Guia
  group: GuiaGroup
  globalIndex: number
  isSelected: boolean
  onCheckbox: (guia: Guia) => void
  variant: GridVariant
}

function GuiaRow({ guia, group, globalIndex, isSelected, onCheckbox, variant }: GuiaRowProps) {
  const color = group.agrupadorColor

  if (variant === 'control-room') {
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

export function GuiasGrid({ guias, loading, onFacturarAgrupador, selectedIds, onSeleccionChange, variant = 'default' }: GuiasGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const isCR = variant === 'control-room'

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
    estimateSize: (i) => {
      const header = flatItems[i]?.kind === 'header'
      if (isCR) return header ? ROW_HEIGHT_HEADER_CR : ROW_HEIGHT_DATA_CR
      return header ? ROW_HEIGHT_HEADER : ROW_HEIGHT_DATA
    },
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0)

  const columnLabels = ['N° Guía', 'Cliente', 'Fecha', 'Descripción', 'Bultos', 'Monto Neto']

  const tableHead = isCR ? (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: CR.surface, borderBottom: `1px solid ${CR.borderStrong}` }}>
        <th style={{ padding: '6px 8px' }} className="w-10" />
        <th style={{ padding: '6px 8px' }} className="text-left text-[10px] font-semibold uppercase tracking-wider font-mono w-10">#</th>
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
  ) : (
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
      <div role="status" data-testid="guias-grid-skeleton" style={isCR ? { backgroundColor: CR.bg } : undefined}>
        <table className={isCR ? 'min-w-full' : 'min-w-full divide-y divide-border'}>
          {tableHead}
          <tbody className={isCR ? undefined : 'bg-card divide-y divide-border'}>
            <SkeletonRow variant={variant} />
            <SkeletonRow variant={variant} />
            <SkeletonRow variant={variant} />
          </tbody>
        </table>
      </div>
    )
  }

  if (guias.length === 0) {
    return (
      <div
        data-testid="guias-grid-empty"
        className="text-center py-12 font-mono"
        style={isCR ? { backgroundColor: CR.bg, color: CR.textDim } : undefined}
      >
        {isCR ? '// NO HAY GUÍAS PARA LOS FILTROS SELECCIONADOS' : (
          <span className="text-muted-foreground">No hay guías para los filtros seleccionados.</span>
        )}
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      data-testid="guias-grid-virtual"
      className="overflow-auto"
      style={{ height: '600px', ...(isCR ? { backgroundColor: CR.bg } : {}) }}
    >
      <div className="overflow-x-auto">
        <table className={isCR ? 'min-w-full' : 'min-w-full divide-y divide-border'}>
          {tableHead}
          <tbody className={isCR ? undefined : 'bg-card divide-y divide-border'}>
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
                    variant={variant}
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
                  variant={variant}
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
