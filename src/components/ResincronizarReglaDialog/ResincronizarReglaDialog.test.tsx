import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResincronizarReglaDialog } from './ResincronizarReglaDialog'

const defaultProps = {
  clienteNombre: 'Constructora Aconcagua S.A.',
  reglaAnteriorDesc: 'Por OC',
  reglaNuevaDesc: 'Por Comuna',
  periodoDefault: '2026-05',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  defaultProps.onConfirm = vi.fn()
  defaultProps.onCancel = vi.fn()
})

describe('ResincronizarReglaDialog', () => {
  it('muestra nombre del cliente y reglas en el encabezado', () => {
    render(<ResincronizarReglaDialog {...defaultProps} />)
    expect(screen.getByText(/constructora aconcagua/i)).toBeInTheDocument()
    expect(screen.getByText(/por oc/i)).toBeInTheDocument()
    expect(screen.getByText(/por comuna/i)).toBeInTheDocument()
  })

  it('default seleccionado es "Re-sincronizar"', () => {
    render(<ResincronizarReglaDialog {...defaultProps} />)
    const radioResinc = screen.getByLabelText(/re-sincronizar guías del período/i)
    expect(radioResinc).toBeChecked()
    expect(screen.getByLabelText(/solo guías nuevas/i)).not.toBeChecked()
  })

  it('el selector de mes tiene el valor periodoDefault', () => {
    render(<ResincronizarReglaDialog {...defaultProps} />)
    const selector = screen.getByLabelText(/selector de mes/i) as HTMLInputElement
    expect(selector.value).toBe('2026-05')
  })

  it('al confirmar con "Re-sincronizar" llama onConfirm con recomputar=true y periodo', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ recomputar: true, periodo: '2026-05' })
  })

  it('al confirmar con "Solo guías nuevas" llama onConfirm con recomputar=false', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    await user.click(screen.getByLabelText(/solo guías nuevas/i))
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ recomputar: false })
  })

  it('cambiar el selector de mes actualiza el periodo enviado', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    const selector = screen.getByLabelText(/selector de mes/i)
    await user.clear(selector)
    await user.type(selector, '2026-03')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ recomputar: true, periodo: '2026-03' })
  })

  it('cancelar llama onCancel sin llamar onConfirm', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(defaultProps.onCancel).toHaveBeenCalled()
    expect(defaultProps.onConfirm).not.toHaveBeenCalled()
  })
})
