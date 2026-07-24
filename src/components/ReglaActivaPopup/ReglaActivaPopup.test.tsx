import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithQuery } from '@/test/renderWithQuery'

vi.mock('@/services/api', () => ({
  fetchReglasEmpresa: vi.fn(),
  assignReglaCliente: vi.fn(),
}))

vi.mock('@/store/periodoStore', () => ({
  usePeriodoStore: vi.fn((selector: (s: { periodo: string }) => unknown) =>
    selector({ periodo: 'actual' }),
  ),
}))

vi.mock('@/utils/periodo', () => ({
  periodoToYYYYMM: vi.fn(() => '2026-05'),
}))

import * as api from '@/services/api'
import { ReglaActivaPopup } from './ReglaActivaPopup'

const mockReglas = [
  { reglaIdl: 'r1', reglaDesc: 'Por OC' },
  { reglaIdl: 'r2', reglaDesc: 'Por Comuna' },
]

const defaultProps = {
  clienteNombre: 'Constructora Aconcagua S.A.',
  rut: '76.543.210-K',
  reglaActual: 'r1',
  onClose: vi.fn(),
  onSaved: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  defaultProps.onClose = vi.fn()
  defaultProps.onSaved = vi.fn()
  vi.mocked(api.fetchReglasEmpresa).mockResolvedValue(mockReglas)
  vi.mocked(api.assignReglaCliente).mockResolvedValue(undefined)
})

describe('ReglaActivaPopup', () => {
  it('muestra el nombre del cliente en el título', async () => {
    renderWithQuery(<ReglaActivaPopup {...defaultProps} />)
    expect(await screen.findByText(/constructora aconcagua/i)).toBeInTheDocument()
  })

  it('muestra la regla activa actual', async () => {
    renderWithQuery(<ReglaActivaPopup {...defaultProps} />)
    await screen.findByText(/r1/)
    expect(screen.getByText(/r1/)).toBeInTheDocument()
  })

  it('muestra "Sin regla" cuando reglaActual es null', async () => {
    renderWithQuery(<ReglaActivaPopup {...defaultProps} reglaActual={null} />)
    const elements = await screen.findAllByText(/sin regla/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('carga y muestra las reglas disponibles', async () => {
    renderWithQuery(<ReglaActivaPopup {...defaultProps} />)
    expect(await screen.findByText('Por OC')).toBeInTheDocument()
    expect(screen.getByText('Por Comuna')).toBeInTheDocument()
  })

  it('al cancelar llama onClose sin llamar al servicio', async () => {
    const user = userEvent.setup()
    renderWithQuery(<ReglaActivaPopup {...defaultProps} />)
    await screen.findByText('Por OC')
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(defaultProps.onClose).toHaveBeenCalled()
    expect(api.assignReglaCliente).not.toHaveBeenCalled()
  })

  // ── Primera activación (reglaActual === null) ─────────────────────────────

  it('primera activación: llama assignReglaCliente sin opciones y cierra', async () => {
    const user = userEvent.setup()
    renderWithQuery(<ReglaActivaPopup {...defaultProps} reglaActual={null} />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por oc/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    await waitFor(() => {
      expect(api.assignReglaCliente).toHaveBeenCalledWith('76.543.210-K', 'r1')
      expect(defaultProps.onSaved).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('primera activación: no abre diálogo de resincronización', async () => {
    const user = userEvent.setup()
    renderWithQuery(<ReglaActivaPopup {...defaultProps} reglaActual={null} />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por oc/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    await waitFor(() => expect(defaultProps.onSaved).toHaveBeenCalled())
    expect(screen.queryByText(/re-sincronizar/i)).not.toBeInTheDocument()
  })

  // ── Cambio de regla (reglaActual !== null) ────────────────────────────────

  it('cambio de regla: abre diálogo de resincronización', async () => {
    const user = userEvent.setup()
    renderWithQuery(<ReglaActivaPopup {...defaultProps} reglaActual="r1" />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por comuna/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    const elements = await screen.findAllByText(/re-sincronizar/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('cambio de regla: al confirmar resync llama assignReglaCliente con opciones', async () => {
    const user = userEvent.setup()
    renderWithQuery(<ReglaActivaPopup {...defaultProps} reglaActual="r1" />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por comuna/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    // el diálogo aparece
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await waitFor(() => {
      expect(api.assignReglaCliente).toHaveBeenCalledWith(
        '76.543.210-K', 'r2', { recomputar: true, periodo: '2026-05' },
      )
      expect(defaultProps.onSaved).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('cambio de regla: cancelar en diálogo de resync vuelve al popup original', async () => {
    const user = userEvent.setup()
    renderWithQuery(<ReglaActivaPopup {...defaultProps} reglaActual="r1" />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por comuna/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    // debe volver al popup original
    expect(await screen.findByText(/regla de agrupación/i)).toBeInTheDocument()
    expect(api.assignReglaCliente).not.toHaveBeenCalled()
  })
})
