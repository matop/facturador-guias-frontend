import type { ComponentType, CSSProperties } from 'react'
import type { Guia } from '@/types'

// Contrato compartido por todos los renderers de variante de GuiasGrid.
// Agregar una variante nueva (ej. issue #14/#15/#16) = escribir un archivo
// que exporte un objeto que cumpla esta interfaz y registrarlo en registry.tsx.
// GuiasGrid.tsx no debe modificarse para agregar una variante.

export interface GuiaGroup {
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  reglaIdl: string | null
  guias: Guia[]
  totalMonto: number
}

export interface GroupHeaderRowProps {
  group: GuiaGroup
  onFacturarAgrupador: () => void
}

export interface GuiaRowProps {
  guia: Guia
  group: GuiaGroup
  globalIndex: number
  isSelected: boolean
  onCheckbox: (guia: Guia) => void
}

export interface GuiasGridVariant {
  key: string
  rowHeightHeader: number
  rowHeightData: number
  containerStyle?: CSSProperties
  tableClassName?: string
  tbodyClassName?: string
  TableHead: ComponentType<{ columnLabels: string[] }>
  SkeletonRow: ComponentType
  EmptyState: ComponentType
  GroupHeaderRow: ComponentType<GroupHeaderRowProps>
  GuiaRow: ComponentType<GuiaRowProps>
}
