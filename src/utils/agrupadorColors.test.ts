import { describe, it, expect } from 'vitest'
import { getChipTextColor, getAgrupadorTextColor } from './agrupadorColors'

describe('getChipTextColor', () => {
  it('elige negro para cyan #06b6d4 (blanco solo da ~2.4:1, no cumple WCAG)', () => {
    // Caso reportado en el issue: la fórmula sin gamma elegía blanco por error.
    expect(getChipTextColor('#06b6d4')).toBe('#1a1a1a')
  })

  it('elige blanco para un azul oscuro saturado', () => {
    expect(getChipTextColor('#1e3a8a')).toBe('#ffffff')
  })

  it('elige negro para amarillo claro', () => {
    expect(getChipTextColor('#fef9c3')).toBe('#1a1a1a')
  })

  it('elige blanco para negro puro', () => {
    expect(getChipTextColor('#000000')).toBe('#ffffff')
  })

  it('elige negro para blanco puro', () => {
    expect(getChipTextColor('#ffffff')).toBe('#1a1a1a')
  })

  it('retorna blanco por defecto si el hex es inválido', () => {
    expect(getChipTextColor('#fff')).toBe('#ffffff')
  })
})

describe('getAgrupadorTextColor (alias deprecado)', () => {
  it('delega en getChipTextColor', () => {
    expect(getAgrupadorTextColor('#06b6d4')).toBe(getChipTextColor('#06b6d4'))
  })
})
