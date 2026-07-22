import { useState, useMemo, useCallback } from 'react'
import type { DateRange } from '@/components/DateFilter'
import { esLoteHomogeneo } from '@/utils/loteHomogeneo'
import type { Guia } from '@/types'

interface Agrupador {
  id: string
  codigo: string
  color: string
  nombre: string | null
}

export interface GuiasFiltersResult {
  busqueda: string
  setBusqueda: (v: string) => void
  filtroCliente: string
  setFiltroCliente: (id: string) => void
  filtroAgrupador: string
  setFiltroAgrupador: (id: string) => void
  busquedaAgrupador: string
  setBusquedaAgrupador: (v: string) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  guiasPreFiltradas: Guia[]
  guiasFiltradas: Guia[]
  agrupadores: Agrupador[]
  agrupadoresFiltrados: Agrupador[]
  montoTotal: number
  montoFiltrado: number
  hasActiveFilter: boolean
  filtroEsHomogeneo: boolean
  reset: () => void
}

export function useGuiasFilters(guias: Guia[], initialClienteId = ''): GuiasFiltersResult {
  const [busqueda, setBusqueda] = useState('')
  const [filtroCliente, setFiltroClienteRaw] = useState(initialClienteId)
  const [filtroAgrupador, setFiltroAgrupador] = useState('')
  const [busquedaAgrupador, setBusquedaAgrupador] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })

  const setFiltroCliente = useCallback((id: string) => {
    setFiltroClienteRaw(id)
    setFiltroAgrupador('')
  }, [])

  const reset = useCallback(() => {
    setBusqueda('')
    setFiltroClienteRaw('')
    setFiltroAgrupador('')
    setBusquedaAgrupador('')
    setDateRange({ from: null, to: null })
  }, [])

  const guiasPreFiltradas = useMemo(() => guias.filter((g) => {
    if (dateRange.from && g.fecha < dateRange.from) return false
    if (dateRange.to   && g.fecha > dateRange.to)   return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !g.numero.toLowerCase().includes(q) &&
        !g.descripcion.toLowerCase().includes(q) &&
        !g.clienteNombre.toLowerCase().includes(q)
      )
        return false
    }
    return true
  }), [guias, dateRange, busqueda])

  const agrupadores = useMemo(() => {
    const seen = new Map<string, Agrupador>()
    for (const g of guiasPreFiltradas) {
      if (g.agrupadorId && !seen.has(g.agrupadorId)) {
        seen.set(g.agrupadorId, {
          id: g.agrupadorId,
          codigo: g.agrupadorCodigo,
          color: g.agrupadorColor,
          nombre: g.agrupadorNombre,
        })
      }
    }
    return Array.from(seen.values())
  }, [guiasPreFiltradas])

  const agrupadoresFiltrados = useMemo(() => {
    if (!busquedaAgrupador) return agrupadores
    const q = busquedaAgrupador.toLowerCase()
    return agrupadores.filter((ag) => ag.codigo.toLowerCase().includes(q))
  }, [agrupadores, busquedaAgrupador])

  const guiasFiltradas = useMemo(() => {
    if (!filtroAgrupador) return guiasPreFiltradas
    return guiasPreFiltradas.filter((g) => g.agrupadorId === filtroAgrupador)
  }, [guiasPreFiltradas, filtroAgrupador])

  const montoTotal = useMemo(
    () => guiasPreFiltradas.reduce((s, g) => s + g.montoNeto, 0),
    [guiasPreFiltradas],
  )

  const montoFiltrado = useMemo(
    () => guiasFiltradas.reduce((s, g) => s + g.montoNeto, 0),
    [guiasFiltradas],
  )

  const hasActiveFilter = !!(filtroCliente || filtroAgrupador || dateRange.from)

  const filtroEsHomogeneo = useMemo(() => esLoteHomogeneo(guiasFiltradas), [guiasFiltradas])

  return {
    busqueda, setBusqueda,
    filtroCliente, setFiltroCliente,
    filtroAgrupador, setFiltroAgrupador,
    busquedaAgrupador, setBusquedaAgrupador,
    dateRange, setDateRange,
    guiasPreFiltradas, guiasFiltradas,
    agrupadores, agrupadoresFiltrados,
    montoTotal, montoFiltrado,
    hasActiveFilter,
    filtroEsHomogeneo,
    reset,
  }
}
