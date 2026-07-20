import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from './Sidebar'

function renderSidebar(currentPath = '/clientes') {
  return render(
    <MemoryRouter initialEntries={[currentPath]}>
      <Sidebar />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('has dark background', () => {
    const { container } = renderSidebar()
    expect(container.firstChild).toHaveClass('bg-card')
  })

  it('shows version footer', () => {
    renderSidebar()
    expect(screen.getByText(/gde sistema/i, { selector: 'p' })).toBeInTheDocument()
  })

  it('Clientes link active when on /clientes', () => {
    renderSidebar('/clientes')
    const link = screen.getByRole('link', { name: /clientes/i })
    expect(link.className).toMatch(/bg-primary|bg-blue/)
  })

  it('Guías link NOT active when on /clientes', () => {
    renderSidebar('/clientes')
    const link = screen.getByRole('link', { name: /guías/i })
    expect(link.className).not.toMatch(/bg-primary|bg-blue/)
  })

  it('Guías link active when on /guias', () => {
    renderSidebar('/guias')
    const link = screen.getByRole('link', { name: /guías/i })
    expect(link.className).toMatch(/bg-primary|bg-blue/)
  })

  it('no renderiza link a AdminReglas', () => {
    renderSidebar()
    expect(screen.queryByRole('link', { name: /configuración/i })).not.toBeInTheDocument()
  })
})
