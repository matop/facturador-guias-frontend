import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientesGrid } from './ClientesGrid'
import { mockClientes } from '@/test/mocks/fixtures'

describe('ClientesGrid', () => {
  const defaultProps = {
    clientes: mockClientes,
    loading: false,
    hasQuery: false,
    onVerGuias: vi.fn(),
    onFacturar: vi.fn(),
    onGestionarRegla: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onVerGuias = vi.fn()
    defaultProps.onFacturar = vi.fn()
    defaultProps.onGestionarRegla = vi.fn()
  })

  it('muestra skeleton cuando loading=true', () => {
    render(<ClientesGrid {...defaultProps} loading={true} />)
    expect(screen.getByTestId('clientes-grid-skeleton')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('no muestra datos de clientes cuando loading', () => {
    render(<ClientesGrid {...defaultProps} loading={true} />)
    expect(screen.queryByText('Constructora Aconcagua S.A.')).not.toBeInTheDocument()
  })

  it('muestra mensaje vacío cuando clientes=[] y loading=false', () => {
    render(<ClientesGrid {...defaultProps} clientes={[]} />)
    expect(screen.getByText('No hay clientes para este período.')).toBeInTheDocument()
  })

  it('renderiza todos los clientes con nombre y RUT', () => {
    render(<ClientesGrid {...defaultProps} />)
    expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument()
    expect(screen.getByText('76.543.210-K')).toBeInTheDocument()
    expect(screen.getByText('Minera del Norte Ltda.')).toBeInTheDocument()
  })

  it('muestra guíasPendientes correctamente', () => {
    render(<ClientesGrid {...defaultProps} />)
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('14')
  })

  it('formatea monto neto en CLP', () => {
    render(<ClientesGrid {...defaultProps} />)
    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toMatch(/10[.,]450[.,]000/)
  })

  it('llama onVerGuias con id al click en Ver Guías', async () => {
    const user = userEvent.setup()
    render(<ClientesGrid {...defaultProps} />)
    await user.click(screen.getAllByText('Ver Guías')[0])
    expect(defaultProps.onVerGuias).toHaveBeenCalledWith('c1')
  })

  it('llama onFacturar con id al click en Facturar', async () => {
    const user = userEvent.setup()
    render(<ClientesGrid {...defaultProps} />)
    await user.click(screen.getAllByText('Facturar')[0])
    expect(defaultProps.onFacturar).toHaveBeenCalledWith('c1')
  })

  it('no renderiza botones de acción cuando loading', () => {
    render(<ClientesGrid {...defaultProps} loading={true} />)
    expect(screen.queryByText('Ver Guías')).not.toBeInTheDocument()
    expect(screen.queryByText('Facturar')).not.toBeInTheDocument()
  })

  // ── Regla por cliente (v3) ─────────────────────────────────────────────────

  it('no renderiza columna "Regla" en el header', () => {
    render(<ClientesGrid {...defaultProps} />)
    expect(screen.queryByRole('columnheader', { name: /regla/i })).not.toBeInTheDocument()
  })

  it('no renderiza badge de regla ni botón Sin regla', () => {
    render(<ClientesGrid {...defaultProps} />)
    expect(screen.queryByTestId('regla-badge-76.543.210-K')).not.toBeInTheDocument()
    expect(screen.queryByTestId('regla-sin-regla-96.123.456-2')).not.toBeInTheDocument()
  })

  it('renderiza ícono de gestión de regla por cada cliente', () => {
    render(<ClientesGrid {...defaultProps} />)
    const iconBtns = screen.getAllByTestId(/gestionar-regla-/)
    expect(iconBtns.length).toBe(mockClientes.length)
  })

  it('click en ícono de regla llama onGestionarRegla con rut del cliente', async () => {
    const user = userEvent.setup()
    render(<ClientesGrid {...defaultProps} />)
    await user.click(screen.getByTestId('gestionar-regla-76.543.210-K'))
    expect(defaultProps.onGestionarRegla).toHaveBeenCalledWith('76.543.210-K')
  })
})
