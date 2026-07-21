import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GuiasPage from './Guias'
import { useSeleccionStore } from '@/store/seleccionStore'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Guia, Cliente } from '@/types'

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count, estimateSize }: { count: number; estimateSize: (i: number) => number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        key: i,
        start: 0,
        end: estimateSize(i),
        size: estimateSize(i),
        lane: 0,
      })),
    getTotalSize: () => 0,
  }),
}))

vi.mock('@/services/api', () => ({
  fetchGuias:    vi.fn(),
  fetchClientes: vi.fn(),
}))

const mockClientes: Cliente[] = [
  { id: 'c1', nombre: 'Constructora Aconcagua S.A.', rut: '76.543.210-K', guiasPendientes: 14, factEst: 3, montoNeto: 10450000, reglaIdl: null },
  { id: 'c2', nombre: 'Minera del Norte Ltda.', rut: '96.123.456-2', guiasPendientes: 9, factEst: 2, montoNeto: 7120000, reglaIdl: null },
]

const mockGuias: Guia[] = [
  { id: 'g1', numero: '4401', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-06-03', descripcion: 'Hormigón premezclado', cantidad: 1, montoNeto: 1290000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, estado: 'pendiente' },
  { id: 'g2', numero: '4402', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-06-05', descripcion: 'Fierro galvanizado', cantidad: 24, montoNeto: 480000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, estado: 'pendiente' },
  { id: 'g3', numero: '4403', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-06-07', descripcion: 'Cemento Portland', cantidad: 50, montoNeto: 750000, agrupadorId: 'a2', agrupadorCodigo: 'OC 0002', agrupadorColor: '#dcfce7', agrupadorNombre: null, estado: 'pendiente' },
  { id: 'g4', numero: '4404', clienteId: 'c2', clienteNombre: 'Minera del Norte Ltda.', fecha: '2026-06-04', descripcion: 'Explosivos industriales', cantidad: 10, montoNeto: 2350000, agrupadorId: 'a3', agrupadorCodigo: 'DIR Santiago Centro', agrupadorColor: '#fef9c3', agrupadorNombre: null, estado: 'pendiente' },
]

describe('Guias page', () => {
  beforeEach(async () => {
    useSeleccionStore.setState({ seleccionActiva: [] })
    usePeriodoStore.setState({ periodo: 'actual' })
    useTenantStore.setState({ tenantId: 'tenant-test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(mockGuias)
    vi.mocked(api.fetchClientes).mockResolvedValue(mockClientes)
  })

  const renderPage = (initialEntries = ['/guias']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/guias" element={<GuiasPage />} />
          <Route path="/preview" element={<div>Preview Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

  // ── Layout inicial ────────────────────────────────────────────────────────

  it('does NOT render breadcrumb when no client is selected', () => {
    renderPage()
    expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
  })

  it('shows search input, date-filter and filtro-cliente', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/buscar por n° guía/i)).toBeInTheDocument()
    expect(screen.getByTestId('date-filter')).toBeInTheDocument()
    expect(screen.getByTestId('filtro-cliente')).toBeInTheDocument()
  })

  it('does NOT render legacy "Guía DTE" badge', () => {
    renderPage()
    expect(screen.queryByText('Guía DTE')).not.toBeInTheDocument()
  })

  it('does NOT render legacy "Ver solo sin agrupador" checkbox', () => {
    renderPage()
    expect(screen.queryByText(/sin agrupador/i)).not.toBeInTheDocument()
  })

  it('no cascading filtro-agrupador select present', () => {
    renderPage()
    expect(screen.queryByTestId('filtro-agrupador')).not.toBeInTheDocument()
  })

  // ── Carga de guías ────────────────────────────────────────────────────────

  it('loads guías on mount and renders rows', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
    })
    expect(screen.getByTestId('guia-row-g2')).toBeInTheDocument()
  })

  it('pre-fills filtroCliente from URL ?clienteId param', async () => {
    renderPage(['/guias?clienteId=c1'])
    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).value).toBe('c1')
    })
  })

  // ── Metric cards ──────────────────────────────────────────────────────────

  it('renders metric cards after guías load', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('guias-metricas')).toBeInTheDocument()
    })
    expect(screen.getByText('pendientes de facturar')).toBeInTheDocument()
    expect(screen.getByText(/facturas? a emitir/i)).toBeInTheDocument()
  })

  it('metric card reflects total guías count', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('guias-metricas')).toBeInTheDocument()
    })
    expect(screen.getByTestId('guias-metricas')).toHaveTextContent(String(mockGuias.length))
  })

  // ── Agrupador chips ────────────────────────────────────────────────────────

  it('renders agrupador chips after guías load', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('agrupador-chips')).toBeInTheDocument()
    })
    expect(screen.getByTestId('chip-agrupador-a1')).toBeInTheDocument()
    expect(screen.getByTestId('chip-agrupador-a2')).toBeInTheDocument()
    expect(screen.getByTestId('chip-agrupador-a3')).toBeInTheDocument()
  })

  it('clicking agrupador chip filters grid to only that agrupador', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect(screen.getByTestId('chip-agrupador-a1')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('chip-agrupador-a1'))

    await waitFor(() => {
      expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
      expect(screen.getByTestId('guia-row-g2')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('guia-row-g3')).not.toBeInTheDocument()
    expect(screen.queryByTestId('guia-row-g4')).not.toBeInTheDocument()
  })

  it('clicking active chip again deselects it and shows all guías', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect(screen.getByTestId('chip-agrupador-a1')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('chip-agrupador-a1'))
    await user.click(screen.getByTestId('chip-agrupador-a1'))

    await waitFor(() => {
      expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
      expect(screen.getByTestId('guia-row-g3')).toBeInTheDocument()
      expect(screen.getByTestId('guia-row-g4')).toBeInTheDocument()
    })
  })

  // ── Breadcrumb ─────────────────────────────────────────────────────────────

  it('shows breadcrumb with client name and RUT when client is selected', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    })
    const breadcrumb = screen.getByTestId('breadcrumb')
    expect(within(breadcrumb).getByText('Constructora Aconcagua S.A.')).toBeInTheDocument()
    expect(within(breadcrumb).getByText('76.543.210-K')).toBeInTheDocument()
  })

  it('clicking breadcrumb "Clientes" resets client filter and removes breadcrumb', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /clientes/i }))

    await waitFor(() => {
      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
    })
    expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).value).toBe('')
  })

  // ── Filtro cliente ────────────────────────────────────────────────────────

  it('selecting cliente updates dropdown value', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')
    expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).value).toBe('c1')
  })

  it('clearing cliente dropdown removes breadcrumb', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')
    await user.selectOptions(screen.getByTestId('filtro-cliente'), '')

    await waitFor(() => {
      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
    })
  })

  it('changing filtro-cliente clears an active selection (no cross-cliente selección fantasma)', async () => {
    const user = userEvent.setup()
    renderPage()

    useSeleccionStore.getState().agregar(mockGuias[0])

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).not.toBeDisabled()
    })

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c2')

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).toBeDisabled()
    })
    expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(0)
  })

  // ── Facturar Selección ────────────────────────────────────────────────────

  it('"Facturar Selección" button is disabled when nothing is selected', () => {
    renderPage()
    expect(screen.getByTestId('btn-facturar-seleccion')).toBeDisabled()
  })

  it('"Facturar Selección" button is enabled after adding a guía to the store', async () => {
    renderPage()
    useSeleccionStore.getState().agregar(mockGuias[0])

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).not.toBeDisabled()
    })
  })

  it('clicking "Facturar Selección" opens ConfirmDialog', async () => {
    const user = userEvent.setup()
    renderPage()

    useSeleccionStore.getState().agregar(mockGuias[0])

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).not.toBeDisabled()
    })

    await user.click(screen.getByTestId('btn-facturar-seleccion'))

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    })
  })

  it('"Facturar Selección" shows count of selected guías', async () => {
    renderPage()
    useSeleccionStore.getState().agregar(mockGuias[0])
    useSeleccionStore.getState().agregar(mockGuias[1])

    await waitFor(() => {
      expect(screen.getByTestId('facturar-seleccion-count')).toHaveTextContent('2')
    })
  })

  // ── Agrupador combobox (>= 8 agrupadores) ─────────────────────────────────

  it('shows combobox instead of chips when there are 8 or more agrupadores', async () => {
    const guiasWith8Agrupadores: Guia[] = Array.from({ length: 8 }, (_, i) => ({
      id: `gx${i}`,
      numero: `500${i}`,
      clienteId: 'c1',
      clienteNombre: 'Test',
      fecha: '2026-06-01',
      descripcion: 'Test',
      cantidad: 1,
      montoNeto: 1000,
      agrupadorId: `ax${i}`,
      agrupadorCodigo: `ZONA-${i}`,
      agrupadorColor: '#dbeafe',
      agrupadorNombre: null,
      estado: 'pendiente' as const,
    }))
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(guiasWith8Agrupadores)
    renderPage()
    await waitFor(() => expect(screen.getByTestId('agrupador-combobox')).toBeInTheDocument())
    expect(screen.queryByTestId('chip-agrupador-ax0')).not.toBeInTheDocument()
  })

  it('combobox search input filters options', async () => {
    const guiasWith8Agrupadores: Guia[] = Array.from({ length: 8 }, (_, i) => ({
      id: `gx${i}`,
      numero: `500${i}`,
      clienteId: 'c1',
      clienteNombre: 'Test',
      fecha: '2026-06-01',
      descripcion: 'Test',
      cantidad: 1,
      montoNeto: 1000,
      agrupadorId: `ax${i}`,
      agrupadorCodigo: i < 4 ? `NORTE-${i}` : `SUR-${i}`,
      agrupadorColor: '#dbeafe',
      agrupadorNombre: null,
      estado: 'pendiente' as const,
    }))
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(guiasWith8Agrupadores)
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByTestId('combobox-agrupador-busqueda')).toBeInTheDocument())
    await user.type(screen.getByTestId('combobox-agrupador-busqueda'), 'NORTE')
    const select = screen.getByTestId('combobox-agrupador-select') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.text)
    expect(options.filter((t) => t.startsWith('NORTE'))).toHaveLength(4)
    expect(options.filter((t) => t.startsWith('SUR'))).toHaveLength(0)
  })

  it('shows chips when there are exactly 7 agrupadores', async () => {
    const guiasWith7: Guia[] = Array.from({ length: 7 }, (_, i) => ({
      id: `gy${i}`,
      numero: `600${i}`,
      clienteId: 'c1',
      clienteNombre: 'Test',
      fecha: '2026-06-01',
      descripcion: 'Test',
      cantidad: 1,
      montoNeto: 1000,
      agrupadorId: `ay${i}`,
      agrupadorCodigo: `GRP-${i}`,
      agrupadorColor: '#dbeafe',
      agrupadorNombre: null,
      estado: 'pendiente' as const,
    }))
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(guiasWith7)
    renderPage()
    await waitFor(() => expect(screen.getByTestId('chip-agrupador-ay0')).toBeInTheDocument())
    expect(screen.queryByTestId('agrupador-combobox')).not.toBeInTheDocument()
  })
})
