import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PrototypeSwitcher } from '@/components/PrototypeSwitcher'
import type { SummaryRow } from '@/components/ConfirmDialog/ConfirmDialog'
import { useSeleccionStore } from '@/store/seleccionStore'
import { fetchGuias, fetchClientes } from '@/services/api'
import { useGuiasFilters } from '@/hooks/useGuiasFilters'
import type { Guia, Cliente } from '@/types'
import { clpFmt } from './guias-variants/format'
import { GUIAS_VARIANTS, getGuiasView } from './guias-variants/registry'
import type { GuiasViewProps } from './guias-variants/types'

export default function GuiasPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const seleccionActiva = useSeleccionStore((s) => s.seleccionActiva)
  const agregar = useSeleccionStore((s) => s.agregar)
  const quitar = useSeleccionStore((s) => s.quitar)

  const [guias, setGuias] = useState<Guia[]>([])
  const [loading, setLoading] = useState(true)
  const [guiasError, setGuiasError] = useState<Error | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const ActiveView = getGuiasView(searchParams.get('variant') ?? 'default')

  const {
    busqueda, setBusqueda,
    filtroCliente, setFiltroCliente,
    filtroAgrupador, setFiltroAgrupador,
    busquedaAgrupador, setBusquedaAgrupador,
    dateRange, setDateRange,
    guiasPreFiltradas, guiasFiltradas,
    agrupadores, agrupadoresFiltrados,
    montoTotal, montoFiltrado,
    hasActiveFilter, filtroEsHomogeneo,
  } = useGuiasFilters(guias, searchParams.get('clienteId') ?? '')

  useEffect(() => {
    fetchClientes().then(setClientes).catch(() => setClientes([]))
  }, [])

  const loadGuias = useCallback(async () => {
    setLoading(true)
    setGuiasError(null)
    try {
      const params: Record<string, string> = {}
      if (filtroCliente)  params.clienteId = filtroCliente
      if (dateRange.from) params.from = dateRange.from
      if (dateRange.to)   params.to   = dateRange.to
      const data = await fetchGuias(params)
      setGuias(data)
    } catch (err) {
      setGuiasError(err instanceof Error ? err : new Error('Error al cargar guías'))
      setGuias([])
    } finally {
      setLoading(false)
    }
  }, [filtroCliente, dateRange])

  useEffect(() => {
    loadGuias()
  }, [loadGuias])

  useEffect(() => {
    useSeleccionStore.getState().limpiar()
  }, [filtroCliente])

  // Shortcut "/" enfoca la búsqueda — visible en el concepto Control Room.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
      e.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const selectedIds = useMemo(
    () => new Set(seleccionActiva.map((g) => g.id)),
    [seleccionActiva],
  )

  const handleSeleccionChange = useCallback((guia: Guia, checked: boolean) => {
    if (checked) agregar(guia)
    else quitar(guia.id)
  }, [agregar, quitar])

  const montoSeleccion = useMemo(
    () => seleccionActiva.reduce((s, g) => s + g.montoNeto, 0),
    [seleccionActiva]
  )

  const clienteActivo: Cliente | undefined = clientes.find((c) => c.id === filtroCliente)

  const handleFacturarAgrupador = (_agrupadorId: string, agrupadorGuias: Guia[]) => {
    useSeleccionStore.getState().agregarLote(agrupadorGuias)
    setDialogOpen(true)
  }

  const handleFacturarFiltro = () => {
    useSeleccionStore.getState().agregarLote(guiasFiltradas)
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    setDialogOpen(false)
    navigate('/preview')
  }

  const handleCancel = () => {
    useSeleccionStore.getState().limpiar()
    setDialogOpen(false)
  }

  // Build summary rows for the confirm dialog
  const dialogSummary: SummaryRow[] = useMemo(() => {
    const iva = Math.round(montoSeleccion * 0.19)
    return [
      { label: 'Guías seleccionadas', value: String(seleccionActiva.length) },
      { label: 'Monto Neto', value: clpFmt.format(montoSeleccion) },
      { label: 'IVA (19%)', value: clpFmt.format(iva) },
      { label: 'Total con IVA', value: clpFmt.format(montoSeleccion + iva), highlight: true },
    ]
  }, [seleccionActiva.length, montoSeleccion])

  const viewProps: GuiasViewProps = {
    clienteActivo,
    onLimpiarCliente: () => setFiltroCliente(''),
    guiasError,
    loading,
    guiasPreFiltradas,
    agrupadores,
    montoTotal,
    hasActiveFilter,
    guiasFiltradas,
    montoFiltrado,
    filtroEsHomogeneo,
    onFacturarFiltro: handleFacturarFiltro,
    busqueda,
    onBusquedaChange: setBusqueda,
    filtrosAbiertos,
    onToggleFiltros: () => setFiltrosAbiertos((v) => !v),
    onDateRangeChange: setDateRange,
    filtroCliente,
    onFiltroClienteChange: setFiltroCliente,
    clientes,
    filtroAgrupador,
    onFiltroAgrupadorChange: setFiltroAgrupador,
    busquedaAgrupador,
    onBusquedaAgrupadorChange: setBusquedaAgrupador,
    agrupadoresFiltrados,
    onFacturarAgrupador: handleFacturarAgrupador,
    selectedIds,
    onSeleccionChange: handleSeleccionChange,
    seleccionActiva,
    montoSeleccion,
    onAbrirDialogo: () => setDialogOpen(true),
    onLimpiarSeleccion: () => useSeleccionStore.getState().limpiar(),
    searchInputRef,
  }

  return (
    <>
      <ActiveView {...viewProps} />

      <ConfirmDialog
        open={dialogOpen}
        titulo="Confirmar facturación"
        subtitulo={`Se procesarán ${seleccionActiva.length} guía${seleccionActiva.length !== 1 ? 's' : ''} seleccionada${seleccionActiva.length !== 1 ? 's' : ''} para facturación.`}
        warning="Se generará una proforma en memoria para revisar antes de confirmar el envío a facturación. Nada se emite al SII en este paso."
        summary={dialogSummary}
        confirmLabel="Confirmar emisión"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <PrototypeSwitcher variants={GUIAS_VARIANTS} />
    </>
  )
}
