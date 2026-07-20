import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Clientes from './Clientes'
// ReglaActivaPopup es renderizado por Clientes internamente — fetchReglasEmpresa debe estar mockeado
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Cliente } from '@/types'

vi.mock('@/services/api', () => ({
  fetchClientes: vi.fn(),
  fetchReglasEmpresa: vi.fn(),
  assignReglaCliente: vi.fn(),
  fetchMetricas: vi.fn().mockResolvedValue({
    totalGuias: 10, clientesActivos: 2, factEst: 2, montoEstimado: 5000000,
    clientesConRezagadas: 0, tendenciaGuias: 0, tendenciaFactEst: 0, tendenciaClientes: 0,
  }),
}))

const mockClientes: Cliente[] = [
  { id: 'c1', nombre: 'Constructora Aconcagua S.A.', rut: '76543210-K', guiasPendientes: 14, factEst: 3, montoNeto: 10450000, reglaIdl: '977_campo_receptor_CmnaRecep' },
  { id: 'c2', nombre: 'Minera del Norte Ltda.', rut: '96123456-2', guiasPendientes: 9, factEst: 2, montoNeto: 7120000, reglaIdl: null },
]

const mockReglasEmpresa = [
  { reglaIdl: '977_campo_receptor_CmnaRecep', reglaDesc: 'Por comuna recep.' },
  { reglaIdl: '977_campo_detalle_OBRA', reglaDesc: 'Por obra' },
]

describe('Clientes page', () => {
  beforeEach(async () => {
    usePeriodoStore.setState({ periodo: 'actual' })
    useTenantStore.setState({ tenantId: 'test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockResolvedValue(mockClientes)
    vi.mocked(api.fetchReglasEmpresa).mockResolvedValue(mockReglasEmpresa)
    vi.mocked(api.assignReglaCliente).mockResolvedValue(undefined as never)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Clientes />
      </MemoryRouter>,
    )

  const renderPageWithNav = () =>
    render(
      <MemoryRouter initialEntries={['/clientes']}>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/guias" element={<div data-testid="guias-page">Guías</div>} />
        </Routes>
      </MemoryRouter>,
    )

  it('muestra skeleton inicialmente y luego carga clientes', async () => {
    renderPage()
    expect(screen.getByTestId('clientes-grid-skeleton')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument()
    })
  })

  it('muestra tabs tab-actual y tab-anterior', () => {
    renderPage()
    expect(screen.getByTestId('tab-actual')).toBeInTheDocument()
    expect(screen.getByTestId('tab-anterior')).toBeInTheDocument()
  })

  it('tab activo tiene clase border-primary cuando periodo=actual', () => {
    renderPage()
    expect(screen.getByTestId('tab-actual').className).toContain('border-primary')
  })

  it('tab inactivo NO tiene border-primary', () => {
    renderPage()
    const tabAnterior = screen.getByTestId('tab-anterior')
    expect(tabAnterior.className).not.toContain('border-primary')
    expect(tabAnterior.className).toContain('border-transparent')
  })

  it('click en tab-anterior cambia periodoStore a anterior', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('tab-anterior'))
    expect(usePeriodoStore.getState().periodo).toBe('anterior')
  })

  it('renderiza buscador con placeholder correcto', () => {
    renderPage()
    expect(screen.getByTestId('buscador')).toHaveAttribute('placeholder', 'Buscar por nombre o RUT...')
  })

  it('renderiza botón facturar-global-secundario', () => {
    renderPage()
    expect(screen.getByTestId('facturar-global-secundario')).toHaveTextContent('Facturar Global')
  })

  it('buscador dispara fetchClientes tras debounce al escribir', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockClear()

    await userEvent.type(screen.getByTestId('buscador'), 'a')

    await waitFor(
      () => { expect(api.fetchClientes).toHaveBeenCalled() },
      { timeout: 1000 },
    )
  })

  it('cambio de tab período dispara fetchClientes de nuevo', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockClear()

    await userEvent.click(screen.getByTestId('tab-anterior'))

    await waitFor(() => { expect(api.fetchClientes).toHaveBeenCalled() })
  })

  it('error en fetchClientes → clientes vacíos, sin crash', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.queryByTestId('clientes-grid-skeleton')).not.toBeInTheDocument()
    })
    expect(screen.getByText('No hay clientes para este período.')).toBeInTheDocument()
  })

  it('Ver Guías navega a /guias con clienteId del cliente', async () => {
    renderPageWithNav()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button', { name: 'Ver Guías' })
    await userEvent.click(buttons[0])
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  it('Facturar navega a /guias con clienteId del cliente', async () => {
    renderPageWithNav()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button', { name: 'Facturar' })
    await userEvent.click(buttons[0])
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  // ── ReglaActivaPopup (v3) ──────────────────────────────────────────────────

  it('click en ícono gestionar-regla abre popup con nombre del cliente', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByRole('dialog')).toHaveTextContent('Constructora Aconcagua S.A.')
  })

  it('el popup carga y muestra las reglas disponibles de la empresa', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))

    expect(await screen.findByText('Por comuna recep.')).toBeInTheDocument()
    expect(screen.getByText('Por obra')).toBeInTheDocument()
  })

  it('guardar en popup llama assignReglaCliente y re-fetch clientes', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))
    await screen.findByText('Por obra')

    // cliente c1 ya tiene regla → cambio dispara diálogo de resincronización
    await user.click(screen.getByLabelText(/por obra/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    // confirmar en el diálogo de resincronización (default: re-sincronizar)
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    const api = await import('@/services/api')
    await waitFor(() => {
      expect(api.assignReglaCliente).toHaveBeenCalledWith(
        '76543210-K',
        '977_campo_detalle_OBRA',
        expect.objectContaining({ recomputar: true }),
      )
    })
    await waitFor(() => {
      expect(api.fetchClientes).toHaveBeenCalledTimes(2) // mount + after save
    })
  })

  it('cancelar popup cierra sin llamar al servicio', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))
    await screen.findByText('Por obra')

    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const api = await import('@/services/api')
    expect(api.assignReglaCliente).not.toHaveBeenCalled()
  })
})
