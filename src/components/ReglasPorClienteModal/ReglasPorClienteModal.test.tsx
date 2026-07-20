import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReglasPorClienteModal } from './ReglasPorClienteModal'
import type { ReglaCliente } from '@/types'

vi.mock('@/store/periodoStore', () => ({
  usePeriodoStore: vi.fn((selector: (s: { periodo: string }) => unknown) =>
    selector({ periodo: 'actual' }),
  ),
}))

vi.mock('@/utils/periodo', () => ({
  periodoToYYYYMM: vi.fn(() => '2026-05'),
}))

const mockReglas: ReglaCliente[] = [
  {
    reglaidl: '977_campo_receptor_CmnaRecep',
    empkey: '977',
    gclirut: '76543210-K',
    activa: true,
    reglanombre: 'Por comuna',
    reglaconfig: { type: 'campo-receptor', field: 'CmnaRecep' },
  },
  {
    reglaidl: '977_campo_detalle_OBRA_Valor',
    empkey: '977',
    gclirut: '76543210-K',
    activa: false,
    reglanombre: null,
    reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
  },
]

const mockReglasSinActiva: ReglaCliente[] = mockReglas.map((r) => ({ ...r, activa: false }))

const defaultProps = {
  clienteNombre: 'Constructora Aconcagua S.A.',
  rut: '76543210-K',
  reglas: mockReglas,
  loading: false,
  activando: null as string | null,
  onActivar: vi.fn(),
  onClose: vi.fn(),
}

function renderModal(props = {}) {
  return render(<ReglasPorClienteModal {...defaultProps} {...props} />)
}

beforeEach(() => {
  defaultProps.onActivar = vi.fn()
  defaultProps.onClose = vi.fn()
})

describe('ReglasPorClienteModal', () => {
  it('muestra el nombre del cliente en el título', () => {
    renderModal()
    expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Constructora Aconcagua S.A.')
  })

  it('muestra skeleton cuando loading=true', () => {
    renderModal({ loading: true })
    expect(screen.getByTestId('reglas-skeleton')).toBeInTheDocument()
  })

  it('lista todas las reglas', () => {
    renderModal()
    expect(screen.getByTestId('regla-row-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
    expect(screen.getByTestId('regla-row-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('muestra el reglanombre cuando existe', () => {
    renderModal()
    expect(screen.getByTestId('regla-row-977_campo_receptor_CmnaRecep')).toHaveTextContent('Por comuna')
  })

  it('muestra el reglaidl técnico cuando reglanombre es null', () => {
    renderModal()
    expect(screen.getByTestId('regla-row-977_campo_detalle_OBRA_Valor')).toHaveTextContent('OBRA · Valor')
  })

  it('marca badge Activa en la regla activa', () => {
    renderModal()
    expect(screen.getByTestId('badge-activa-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
  })

  it('no muestra badge Activa en regla inactiva', () => {
    renderModal()
    expect(screen.queryByTestId('badge-activa-977_campo_detalle_OBRA_Valor')).not.toBeInTheDocument()
  })

  it('no muestra botón Activar para la regla ya activa', () => {
    renderModal()
    expect(screen.queryByTestId('btn-activar-977_campo_receptor_CmnaRecep')).not.toBeInTheDocument()
  })

  it('muestra botón Activar para regla inactiva', () => {
    renderModal()
    expect(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('muestra spinner en el botón de la regla que está activando', () => {
    renderModal({ activando: '977_campo_detalle_OBRA_Valor' })
    expect(screen.getByTestId('btn-activando-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('llama onClose al click en el botón cerrar', () => {
    renderModal()
    fireEvent.click(screen.getByTestId('btn-cerrar'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('llama onClose al click en el overlay', () => {
    renderModal()
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('muestra mensaje cuando no hay reglas', () => {
    renderModal({ reglas: [] })
    expect(screen.getByTestId('empty-reglas')).toBeInTheDocument()
  })

  describe('inline edit reglanombre', () => {
    it('muestra botón editar por cada regla', () => {
      renderModal()
      expect(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
      expect(screen.getByTestId('btn-editar-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
    })

    it('al click en editar muestra input con valor actual', () => {
      renderModal()
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep'))
      const input = screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('Por comuna')
    })

    it('al click en editar regla sin nombre el input queda vacío', () => {
      renderModal()
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_detalle_OBRA_Valor'))
      expect(screen.getByTestId('input-nombre-977_campo_detalle_OBRA_Valor')).toHaveValue('')
    })

    it('al guardar llama onRenombrar con reglaidl y nuevo nombre', () => {
      const onRenombrar = vi.fn()
      renderModal({ onRenombrar })
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep'))
      fireEvent.change(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep'), {
        target: { value: 'Nueva región' },
      })
      fireEvent.click(screen.getByTestId('btn-guardar-977_campo_receptor_CmnaRecep'))
      expect(onRenombrar).toHaveBeenCalledWith('977_campo_receptor_CmnaRecep', 'Nueva región')
    })

    it('al cancelar oculta el input', () => {
      renderModal()
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep'))
      expect(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
      fireEvent.click(screen.getByTestId('btn-cancelar-editar-977_campo_receptor_CmnaRecep'))
      expect(screen.queryByTestId('input-nombre-977_campo_receptor_CmnaRecep')).not.toBeInTheDocument()
    })

    it('muestra spinner de guardando cuando renombrando coincide con reglaidl', () => {
      renderModal({ renombrando: '977_campo_receptor_CmnaRecep' })
      expect(screen.getByTestId('spinner-renombrando-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
    })
  })

  // ── Primera activación (sin regla activa) ─────────────────────────────────

  it('primera activación: llama onActivar sin opciones directamente', () => {
    renderModal({ reglas: mockReglasSinActiva })
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    expect(defaultProps.onActivar).toHaveBeenCalledWith('977_campo_detalle_OBRA_Valor')
  })

  it('primera activación: no abre diálogo de resincronización', () => {
    renderModal({ reglas: mockReglasSinActiva })
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    expect(screen.queryByText(/re-sincronizar/i)).not.toBeInTheDocument()
  })

  // ── Cambio de regla (hay regla activa) ────────────────────────────────────

  it('cambio de regla: abre diálogo de resincronización al activar', async () => {
    renderModal()
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    const elements = await screen.findAllByText(/re-sincronizar/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('cambio de regla: al confirmar llama onActivar con opciones', async () => {
    const user = userEvent.setup()
    renderModal()
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await waitFor(() => {
      expect(defaultProps.onActivar).toHaveBeenCalledWith(
        '977_campo_detalle_OBRA_Valor',
        { recomputar: true, periodo: '2026-05' },
      )
    })
  })

  it('cambio de regla: cancelar en diálogo de resync vuelve al modal original', async () => {
    const user = userEvent.setup()
    renderModal()
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(await screen.findByTestId('modal-titulo')).toBeInTheDocument()
    expect(defaultProps.onActivar).not.toHaveBeenCalled()
  })
})
