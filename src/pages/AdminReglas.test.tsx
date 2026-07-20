import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminReglas from './AdminReglas'
import * as api from '@/services/api'
import type { DiscoverResult, ReglaEmp, ReglaCliente } from '@/types'
import { useTenantStore } from '@/store/tenantStore'
import { mockClientes } from '@/test/mocks/fixtures'

vi.mock('@/services/api')

const mockDiscover: DiscoverResult = {
  empkey: '977',
  muestraGuias: 20,
  candidatos: [
    {
      tipo: 'campo-receptor',
      field: 'CmnaRecep',
      ocurrencias: 15,
      ejemplos: ['RENCA', 'QUILICURA'],
    },
    {
      tipo: 'campo-detalle',
      lineFilter: 'OBRA',
      key: 'Valor',
      ocurrencias: 8,
      ejemplos: ['OBRA-001'],
    },
  ],
}

const mockReglasCliente: ReglaCliente[] = [
  {
    reglaidl: '977_campo_receptor_CmnaRecep',
    empkey: '977',
    gclirut: '76.543.210-K',
    activa: true,
    reglanombre: null,
    reglaconfig: { type: 'campo-receptor', field: 'CmnaRecep' },
  },
  {
    reglaidl: '977_campo_detalle_OBRA_Valor',
    empkey: '977',
    gclirut: '76.543.210-K',
    activa: false,
    reglanombre: 'Por Obra',
    reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
  },
]

const mockReglaEmp: ReglaEmp = {
  reglaidl: '977_campo_detalle_OBRA_Valor',
  empkey: '977',
  reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
}

const clienteConReglas = mockClientes[0] // rut: '76.543.210-K'
const clienteSinReglas = mockClientes[1] // rut: '96.123.456-2'

beforeEach(() => {
  vi.clearAllMocks()
  useTenantStore.setState({ tenantId: '977', tenantNombre: 'INTEGRAC' })
  vi.mocked(api.fetchDiscoverCandidatos).mockResolvedValue(mockDiscover)
  vi.mocked(api.fetchClientes).mockResolvedValue(mockClientes)
  vi.mocked(api.fetchReglasPorCliente).mockResolvedValue(mockReglasCliente)
  vi.mocked(api.activarRegla).mockResolvedValue(mockReglaEmp)
  vi.mocked(api.assignReglaCliente).mockResolvedValue(undefined)
  vi.mocked(api.activarReglaCliente).mockResolvedValue(undefined)
  vi.mocked(api.updateReglanombre).mockResolvedValue(undefined)
})

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminReglas />
    </MemoryRouter>,
  )
}

async function selectCliente(rut: string) {
  const select = await screen.findByTestId('select-cliente')
  fireEvent.change(select, { target: { value: rut } })
}

describe('AdminReglas', () => {
  // ─── Discover lifecycle (por cliente) ────────────────────────────────────

  it('sin cliente seleccionado no muestra sección de candidatos ni llama fetchDiscoverCandidatos', async () => {
    renderPage()
    // Wait for clientes to load (fetchClientes is called)
    await screen.findByTestId('select-cliente')
    expect(api.fetchDiscoverCandidatos).not.toHaveBeenCalled()
    expect(screen.queryByTestId('candidatos-skeleton')).not.toBeInTheDocument()
    expect(screen.queryByTestId('candidato-receptor_CmnaRecep')).not.toBeInTheDocument()
  })

  it('al seleccionar cliente llama fetchDiscoverCandidatos con el gclirut del cliente', async () => {
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await waitFor(() => {
      expect(api.fetchDiscoverCandidatos).toHaveBeenCalledWith(clienteSinReglas.rut)
    })
  })

  it('skeleton visible mientras carga después de seleccionar cliente', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockReturnValue(new Promise(() => {}))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    expect(screen.getByTestId('candidatos-skeleton')).toBeInTheDocument()
  })

  it('candidatos visibles después de seleccionar cliente y resolver', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')
    expect(screen.getByTestId('candidato-detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('al cambiar cliente los candidatos anteriores desaparecen de inmediato', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')

    // Block second discover so we can observe the intermediate state
    vi.mocked(api.fetchDiscoverCandidatos).mockReturnValue(new Promise(() => {}))
    await selectCliente(clienteConReglas.rut)

    expect(screen.queryByTestId('candidato-receptor_CmnaRecep')).not.toBeInTheDocument()
    expect(screen.getByTestId('candidatos-skeleton')).toBeInTheDocument()
  })

  it('estado vacío cuando el cliente no tiene candidatos', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockResolvedValue({ ...mockDiscover, candidatos: [] })
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('empty-candidatos')
  })

  it('error visible cuando discover falla al seleccionar cliente', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockRejectedValue(new Error('network'))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('error-discover')
  })

  // ─── Loading & initial state ──────────────────────────────────────────────

  it('shows skeleton while loading after client selected', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockReturnValue(new Promise(() => {}))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    expect(screen.getByTestId('candidatos-skeleton')).toBeInTheDocument()
  })

  it('shows candidates after selecting client and loading', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')
    expect(screen.getByTestId('candidato-detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('shows error when discover fails after client selected', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockRejectedValue(new Error('network'))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('error-discover')
  })

  it('shows empty state when no candidates after client selected', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockResolvedValue({ ...mockDiscover, candidatos: [] })
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('empty-candidatos')
  })

  // ─── Client selector ──────────────────────────────────────────────────────

  it('renders client selector with clientes options', async () => {
    renderPage()
    const select = await screen.findByTestId('select-cliente')
    expect(select).toBeInTheDocument()
    expect(screen.getByText(`${mockClientes[0].nombre} (${mockClientes[0].rut})`)).toBeInTheDocument()
  })

  it('sin cliente seleccionado no hay botón Asignar visible', async () => {
    renderPage()
    await screen.findByTestId('select-cliente')
    expect(screen.queryByTestId('btn-activar-receptor_CmnaRecep')).not.toBeInTheDocument()
    expect(screen.queryByTestId('btn-activar-detalle_OBRA_Valor')).not.toBeInTheDocument()
  })

  // ─── Client rules panel ───────────────────────────────────────────────────

  it('selecting a client loads their rules', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('reglas-cliente-list')
    expect(api.fetchReglasPorCliente).toHaveBeenCalledWith(clienteConReglas.rut)
  })

  it('shows loading skeleton while loading client rules', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockReturnValue(new Promise(() => {}))
    renderPage()
    await selectCliente(clienteConReglas.rut)
    expect(screen.getByTestId('reglas-cliente-skeleton')).toBeInTheDocument()
  })

  it('shows empty state when client has no rules', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('reglas-cliente-empty')
  })

  it('shows active badge on active rule and Activar button on inactive', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('reglas-cliente-list')
    // Active rule has no Activar button
    expect(screen.queryByTestId('btn-activar-regla-977_campo_receptor_CmnaRecep')).not.toBeInTheDocument()
    // Inactive rule has Activar button
    expect(screen.getByTestId('btn-activar-regla-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('activar regla cliente calls activarReglaCliente and refreshes', async () => {
    const reglasActualizadas: ReglaCliente[] = [
      { ...mockReglasCliente[0], activa: false },
      { ...mockReglasCliente[1], activa: true },
    ]
    vi.mocked(api.fetchReglasPorCliente)
      .mockResolvedValueOnce(mockReglasCliente)
      .mockResolvedValueOnce(reglasActualizadas)
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('btn-activar-regla-977_campo_detalle_OBRA_Valor')
    fireEvent.click(screen.getByTestId('btn-activar-regla-977_campo_detalle_OBRA_Valor'))
    await waitFor(() => {
      expect(api.activarReglaCliente).toHaveBeenCalledWith(clienteConReglas.rut, '977_campo_detalle_OBRA_Valor')
    })
    expect(api.fetchReglasPorCliente).toHaveBeenCalledTimes(2)
  })

  // ─── Discovery → assign candidate ─────────────────────────────────────────

  it('activate button is enabled after client is selected', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')
    expect(screen.getByTestId('btn-activar-receptor_CmnaRecep')).not.toBeDisabled()
  })

  it('activate button opens confirm modal with client in description', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-receptor_CmnaRecep')
    fireEvent.click(btn)
    expect(screen.getByTestId('btn-confirmar-activar')).toBeInTheDocument()
    expect(screen.getByTestId('btn-confirmar-activar').closest('div[class*="rounded-xl"]')!.textContent)
      .toContain('CmnaRecep')
  })

  it('confirm modal has optional nombre display input', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-receptor_CmnaRecep')
    fireEvent.click(btn)
    expect(screen.getByTestId('input-nombre-candidato')).toBeInTheDocument()
  })

  it('canceling closes modal', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-receptor_CmnaRecep')
    fireEvent.click(btn)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByTestId('btn-confirmar-activar')).not.toBeInTheDocument()
  })

  it('confirming calls activarRegla + assignReglaCliente and shows success', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    vi.mocked(api.activarRegla).mockResolvedValue(mockReglaEmp)
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-detalle_OBRA_Valor')
    fireEvent.click(btn)
    fireEvent.click(screen.getByTestId('btn-confirmar-activar'))
    await screen.findByTestId('success-msg')
    expect(api.activarRegla).toHaveBeenCalledWith({ type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' })
    expect(api.assignReglaCliente).toHaveBeenCalledWith(clienteSinReglas.rut, mockReglaEmp.reglaidl)
    expect(api.updateReglanombre).not.toHaveBeenCalled()
  })

  it('confirming with nombre calls updateReglanombre', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    vi.mocked(api.activarRegla).mockResolvedValue(mockReglaEmp)
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-detalle_OBRA_Valor')
    fireEvent.click(btn)
    fireEvent.change(screen.getByTestId('input-nombre-candidato'), { target: { value: 'Por Obra' } })
    fireEvent.click(screen.getByTestId('btn-confirmar-activar'))
    await screen.findByTestId('success-msg')
    expect(api.updateReglanombre).toHaveBeenCalledWith(mockReglaEmp.reglaidl, 'Por Obra')
  })

  it('shows error in modal when assign fails', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    vi.mocked(api.activarRegla).mockRejectedValue(new Error('fail'))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-detalle_OBRA_Valor')
    fireEvent.click(btn)
    fireEvent.click(screen.getByTestId('btn-confirmar-activar'))
    await screen.findByTestId('error-activar')
    expect(screen.getByTestId('btn-confirmar-activar')).toBeInTheDocument()
  })

  it('candidate active for client shows "Activa" badge and hides Asignar button', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('reglas-cliente-list')
    expect(screen.queryByTestId('btn-activar-receptor_CmnaRecep')).not.toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
  })

  // ─── Inline nombre edit ───────────────────────────────────────────────────

  it('edit nombre button opens inline editor', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep')
    fireEvent.click(screen.getByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep'))
    expect(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
  })

  it('saving nombre calls updateReglanombre and updates display', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep')
    fireEvent.click(screen.getByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep'))
    fireEvent.change(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep'), {
      target: { value: 'Por Comuna' },
    })
    fireEvent.click(screen.getByTestId('btn-save-nombre-977_campo_receptor_CmnaRecep'))
    await waitFor(() => {
      expect(api.updateReglanombre).toHaveBeenCalledWith('977_campo_receptor_CmnaRecep', 'Por Comuna')
    })
  })
})
