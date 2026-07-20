import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'
import { useSeleccionStore } from '@/store/seleccionStore'
import { mockGuias } from '@/test/mocks/fixtures'

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    titulo: 'Confirmar facturación',
    mensaje: 'Se facturarán 5 guías seleccionadas.',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onConfirm = vi.fn()
    defaultProps.onCancel = vi.fn()
    useSeleccionStore.setState({ seleccionActiva: [] })
  })

  it('renders null when open=false', () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} open={false} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders dialog when open=true', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
  })

  it('shows titulo and mensaje', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByTestId('confirm-dialog-titulo')).toHaveTextContent(
      'Confirmar facturación',
    )
    expect(screen.getByTestId('confirm-dialog-mensaje')).toHaveTextContent(
      'Se facturarán 5 guías seleccionadas.',
    )
  })

  it('calls onConfirm when "Confirmar" clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    await user.click(screen.getByTestId('btn-confirmar'))
    expect(defaultProps.onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when "Cancelar" clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    await user.click(screen.getByTestId('btn-cancelar'))
    expect(defaultProps.onCancel).toHaveBeenCalledOnce()
  })

  it('does NOT call limpiar() when "Confirmar" clicked', async () => {
    const user = userEvent.setup()
    useSeleccionStore.getState().agregar(mockGuias[0])
    expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)

    render(<ConfirmDialog {...defaultProps} />)
    await user.click(screen.getByTestId('btn-confirmar'))

    expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
  })
})
