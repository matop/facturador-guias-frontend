import type { GuiasFiltersResult } from '@/hooks/useGuiasFilters'
import type { Guia, Cliente } from '@/types'
import type { DateRange } from '@/components/DateFilter'

export type AgrupadorResumen = GuiasFiltersResult['agrupadores'][number]

// Props compartidas por toda vista de variante de /guias. Guias.tsx posee el
// estado y la carga de datos; cada variante solo decide cómo renderizarlos.
// Agregar una variante nueva (issue #14/#15/#16): crear un archivo hermano que
// exporte un componente con esta firma y registrarlo en registry.tsx.
export interface GuiasViewProps {
  clienteActivo: Cliente | undefined
  onLimpiarCliente: () => void
  guiasError: Error | null
  loading: boolean
  guiasPreFiltradas: Guia[]
  agrupadores: AgrupadorResumen[]
  montoTotal: number
  hasActiveFilter: boolean
  guiasFiltradas: Guia[]
  montoFiltrado: number
  filtroEsHomogeneo: boolean
  onFacturarFiltro: () => void
  busqueda: string
  onBusquedaChange: (v: string) => void
  filtrosAbiertos: boolean
  onToggleFiltros: () => void
  onDateRangeChange: (range: DateRange) => void
  filtroCliente: string
  onFiltroClienteChange: (v: string) => void
  clientes: Cliente[]
  filtroAgrupador: string
  onFiltroAgrupadorChange: (v: string) => void
  busquedaAgrupador: string
  onBusquedaAgrupadorChange: (v: string) => void
  agrupadoresFiltrados: AgrupadorResumen[]
  onFacturarAgrupador: (agrupadorId: string, guias: Guia[]) => void
  selectedIds: Set<string>
  onSeleccionChange: (guia: Guia, checked: boolean) => void
  seleccionActiva: Guia[]
  montoSeleccion: number
  onAbrirDialogo: () => void
  onLimpiarSeleccion: () => void
  searchInputRef: React.RefObject<HTMLInputElement>
}
