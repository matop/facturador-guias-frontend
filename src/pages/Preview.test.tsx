import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PreviewPage from './Preview'
import { useSeleccionStore } from '@/store/seleccionStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Guia } from '@/types'

vi.mock('@/services/api', () => ({
  emitirFacturas: vi.fn(),
}))

const mockGuias: Guia[] = [
  { id: 'g1', numero: '4401', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-05-03', descripcion: 'Hormigón premezclado', cantidad: 1, montoNeto: 1290000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g2', numero: '4402', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-05-05', descripcion: 'Fierro galvanizado', cantidad: 24, montoNeto: 480000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g3', numero: '4403', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-05-07', descripcion: 'Cemento Portland', cantidad: 50, montoNeto: 750000, agrupadorId: 'a2', agrupadorCodigo: 'OC 0002', agrupadorColor: '#dcfce7', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
]

describe('Preview page', () => {
  beforeEach(async () => {
    useSeleccionStore.setState({ seleccionActiva: mockGuias })
    useTenantStore.setState({ tenantId: 'tenant-test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.emitirFacturas).mockResolvedValue(undefined as never)
  })

  const renderPage = (initialEntries = ['/preview']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/guias" element={<div data-testid="guias-page">Guías Page</div>} />
          <Route path="/historial" element={<div data-testid="historial-page">Historial Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

  // ── Redirect ────────────────────────────────────────────────────────────────

  it('redirige a /guias si seleccionActiva está vacía', () => {
    useSeleccionStore.setState({ seleccionActiva: [] })
    renderPage()
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  // ── Renderizado inicial ────────────────────────────────────────────────────

  it('muestra título y nombre del cliente', () => {
    renderPage()
    expect(screen.getByText('Previsualización de Facturas')).toBeInTheDocument()
    expect(screen.getByText(/Constructora Aconcagua S\.A\./)).toBeInTheDocument()
  })

  it('renderiza una proforma por agrupadorId', () => {
    renderPage()
    expect(screen.getByTestId('proforma-a1')).toBeInTheDocument()
    expect(screen.getByTestId('proforma-a2')).toBeInTheDocument()
  })

  it('muestra el código de agrupador en cada proforma', () => {
    renderPage()
    expect(screen.getByText('OC 0001')).toBeInTheDocument()
    expect(screen.getByText('OC 0002')).toBeInTheDocument()
  })

  it('muestra singular "guía" para proforma con 1 guía', () => {
    renderPage()
    expect(screen.getByTestId('proforma-a2')).toHaveTextContent('1 guía')
  })

  it('muestra plural "guías" para proforma con varias guías', () => {
    renderPage()
    expect(screen.getByTestId('proforma-a1')).toHaveTextContent('2 guías')
  })

  it('botón "Enviar a facturación" está deshabilitado con 0 aprobadas', () => {
    renderPage()
    expect(screen.getByTestId('btn-emitir')).toBeDisabled()
  })

  // ── Aprobar / Rechazar ─────────────────────────────────────────────────────

  it('aprobar una proforma habilita el botón emitir', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('btn-emitir')).not.toBeDisabled()
  })

  it('aprobar muestra badge "Aprobada" en la proforma', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('proforma-a1')).toHaveTextContent('Aprobada')
  })

  it('click en aprobar dos veces vuelve a pendiente y deshabilita emitir', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('btn-emitir')).toBeDisabled()
  })

  it('rechazar muestra badge "Rechazada" en la proforma', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-rechazar-a1'))
    expect(screen.getByTestId('proforma-a1')).toHaveTextContent('Rechazada')
  })

  it('click en rechazar dos veces vuelve a pendiente', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-rechazar-a1'))
    await user.click(screen.getByTestId('btn-rechazar-a1'))
    expect(screen.getByTestId('proforma-a1')).not.toHaveTextContent('Rechazada')
    expect(screen.getByTestId('btn-emitir')).toBeDisabled()
  })

  it('botón emitir muestra count de aprobadas cuando hay más de una', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-aprobar-a2'))
    expect(screen.getByTestId('btn-emitir')).toHaveTextContent('Enviar a facturación (2)')
  })

  it('botón emitir muestra "(1)" al aprobar una sola proforma', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('btn-emitir')).toHaveTextContent('Enviar a facturación (1)')
  })

  // ── Emisión ────────────────────────────────────────────────────────────────

  it('emitir llama emitirFacturas y navega a /historial', async () => {
    const user = userEvent.setup()
    const api = await import('@/services/api')
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-emitir'))
    await waitFor(() => {
      expect(vi.mocked(api.emitirFacturas)).toHaveBeenCalledOnce()
    })
    await waitFor(() => {
      expect(screen.getByTestId('historial-page')).toBeInTheDocument()
    })
  })

  it('muestra "Emitiendo..." mientras se procesa', async () => {
    const user = userEvent.setup()
    const api = await import('@/services/api')
    vi.mocked(api.emitirFacturas).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500)),
    )
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-emitir'))
    expect(screen.getByTestId('btn-emitir')).toHaveTextContent('Enviando...')
  })

  it('error en emitirFacturas muestra mensaje de error', async () => {
    const user = userEvent.setup()
    const api = await import('@/services/api')
    vi.mocked(api.emitirFacturas).mockRejectedValue(new Error('fail'))
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-emitir'))
    await waitFor(() => {
      expect(screen.getByTestId('error-emision')).toBeInTheDocument()
    })
    expect(screen.getByTestId('error-emision')).toHaveTextContent('Error al emitir')
  })

  // ── Cancelar ───────────────────────────────────────────────────────────────

  it('cancelar navega a /guias', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-cancelar'))
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })
})
