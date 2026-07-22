import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuiasGrid } from './GuiasGrid'
import { mockGuias } from '@/test/mocks/fixtures'

// Mock @tanstack/react-virtual so all items render in jsdom (no real scroll container dimensions)
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

describe('GuiasGrid', () => {
  // Only May guías — avoids mixing months in agregarLote validation
  const mayoGuias = mockGuias.filter((g) => g.fecha.startsWith('2026-05'))

  const defaultProps = {
    guias: mayoGuias,
    loading: false,
    onFacturarAgrupador: vi.fn(),
    selectedIds: new Set<string>(),
    onSeleccionChange: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onFacturarAgrupador = vi.fn()
    defaultProps.onSeleccionChange = vi.fn()
    defaultProps.selectedIds = new Set<string>()
  })

  it('shows skeleton when loading=true', () => {
    render(<GuiasGrid {...defaultProps} loading={true} />)
    expect(screen.getByTestId('guias-grid-skeleton')).toBeInTheDocument()
  })

  it('shows empty state when guias=[]', () => {
    render(<GuiasGrid {...defaultProps} guias={[]} />)
    expect(screen.getByTestId('guias-grid-empty')).toBeInTheDocument()
    expect(
      screen.getByText('No hay guías para los filtros seleccionados.'),
    ).toBeInTheDocument()
  })

  it('renders guía rows from props', () => {
    render(<GuiasGrid {...defaultProps} />)
    expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
    expect(screen.getByTestId('guia-row-g2')).toBeInTheDocument()
    expect(screen.getByTestId('guia-row-g3')).toBeInTheDocument()
    expect(screen.getByTestId('guia-row-g4')).toBeInTheDocument()
  })

  it('rows have background color style', () => {
    render(<GuiasGrid {...defaultProps} />)
    const row = screen.getByTestId('guia-row-g1')
    expect(row.getAttribute('style')).toContain('background-color')
  })

  it('checkbox is unchecked initially', () => {
    render(<GuiasGrid {...defaultProps} />)
    const checkbox = screen.getByTestId('checkbox-g1') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('clicking unchecked checkbox calls onSeleccionChange(guia, true)', async () => {
    const user = userEvent.setup()
    render(<GuiasGrid {...defaultProps} />)
    await user.click(screen.getByTestId('checkbox-g1'))
    expect(defaultProps.onSeleccionChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'g1' }),
      true,
    )
  })

  it('clicking checked checkbox calls onSeleccionChange(guia, false)', async () => {
    const user = userEvent.setup()
    render(<GuiasGrid {...defaultProps} selectedIds={new Set(['g1'])} />)
    const checkbox = screen.getByTestId('checkbox-g1') as HTMLInputElement
    expect(checkbox.checked).toBe(true)

    await user.click(checkbox)
    expect(defaultProps.onSeleccionChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'g1' }),
      false,
    )
  })

  it('"Facturar Agrupador" button calls onFacturarAgrupador with group guías', async () => {
    const user = userEvent.setup()
    render(<GuiasGrid {...defaultProps} />)
    await user.click(screen.getByTestId('btn-facturar-agrupador-a1'))

    expect(defaultProps.onFacturarAgrupador).toHaveBeenCalledWith(
      'a1',
      expect.arrayContaining([
        expect.objectContaining({ id: 'g1' }),
        expect.objectContaining({ id: 'g2' }),
      ]),
    )
  })

  it('group header shows agrupadorCodigo', () => {
    render(<GuiasGrid {...defaultProps} />)
    const oc0001Elements = screen.getAllByText('OC 0001')
    expect(oc0001Elements.length).toBeGreaterThanOrEqual(1)
    const oc0002Elements = screen.getAllByText('OC 0002')
    expect(oc0002Elements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders virtual scroll container when guias are present', () => {
    render(<GuiasGrid {...defaultProps} />)
    expect(screen.getByTestId('guias-grid-virtual')).toBeInTheDocument()
  })

  it('shows reglaIdl badge in group header when the group has one', () => {
    const guiasConRegla = mayoGuias.map((g) =>
      g.agrupadorId === 'a1' ? { ...g, reglaIdl: '977_campo_receptor_CmnaRecep' } : g,
    )
    render(<GuiasGrid {...defaultProps} guias={guiasConRegla} />)
    const badge = screen.getByTestId('regla-badge-a1')
    expect(badge).toHaveTextContent('977_campo_receptor_CmnaRecep')
  })

  it('does not show reglaIdl badge when the group has no regla', () => {
    render(<GuiasGrid {...defaultProps} />)
    expect(screen.queryByTestId('regla-badge-a1')).not.toBeInTheDocument()
  })
})
