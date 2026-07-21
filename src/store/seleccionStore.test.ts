import { describe, it, expect, beforeEach } from 'vitest'
import { useSeleccionStore } from './seleccionStore'
import type { Guia } from '@/types'

// Helper factory para crear guías de test
function crearGuia(overrides: Partial<Guia> = {}): Guia {
  return {
    id: 'g1',
    numero: '001',
    clienteId: 'c1',
    clienteNombre: 'Cliente Uno',
    fecha: '2026-04-15',
    descripcion: 'Despacho materiales',
    cantidad: 10,
    montoNeto: 50000,
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC-100',
    agrupadorColor: '#3b82f6',
    agrupadorNombre: null,
    estado: 'pendiente',
    ...overrides,
  }
}

describe('seleccionStore', () => {
  beforeEach(() => {
    useSeleccionStore.getState().limpiar()
  })

  // ─── Estado inicial ───────────────────────────────────
  describe('estado inicial', () => {
    it('seleccionActiva empieza vacío', () => {
      const { seleccionActiva } = useSeleccionStore.getState()
      expect(seleccionActiva).toEqual([])
    })
  })

  // ─── agregar(guia) ────────────────────────────────────
  describe('agregar', () => {
    it('agrega una guía al array', () => {
      const guia = crearGuia()
      useSeleccionStore.getState().agregar(guia)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0]).toEqual(guia)
    })

    it('primer elemento siempre se agrega sin restricción', () => {
      const guia = crearGuia({ id: 'first', clienteId: 'cx', fecha: '2025-12-01' })
      useSeleccionStore.getState().agregar(guia)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })

    it('no duplica si ya existe el mismo id', () => {
      const guia = crearGuia({ id: 'g1' })
      useSeleccionStore.getState().agregar(guia)
      useSeleccionStore.getState().agregar(guia)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })

    it('rechaza si la guía tiene clienteId diferente al de las ya seleccionadas', () => {
      const guia1 = crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' })
      const guia2 = crearGuia({ id: 'g2', clienteId: 'c2', fecha: '2026-04-12' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g1')
    })

    it('rechaza si la guía tiene un mes diferente al de las ya seleccionadas', () => {
      const guia1 = crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-15' })
      const guia2 = crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-05-10' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g1')
    })

    it('agrega correctamente si mismo cliente y mismo mes', () => {
      const guia1 = crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' })
      const guia2 = crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-25' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(2)
    })
  })

  // ─── quitar(guiaId) ───────────────────────────────────
  describe('quitar', () => {
    it('elimina la guía con ese id del array', () => {
      const guia1 = crearGuia({ id: 'g1' })
      const guia2 = crearGuia({ id: 'g2', fecha: '2026-04-20' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      useSeleccionStore.getState().quitar('g1')
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g2')
    })

    it('si el id no existe, no falla', () => {
      const guia = crearGuia({ id: 'g1' })
      useSeleccionStore.getState().agregar(guia)
      useSeleccionStore.getState().quitar('inexistente')
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })
  })

  // ─── limpiar() ────────────────────────────────────────
  describe('limpiar', () => {
    it('vacía seleccionActiva', () => {
      useSeleccionStore.getState().agregar(crearGuia({ id: 'g1' }))
      useSeleccionStore.getState().agregar(crearGuia({ id: 'g2', fecha: '2026-04-20' }))
      useSeleccionStore.getState().limpiar()
      expect(useSeleccionStore.getState().seleccionActiva).toEqual([])
    })
  })

  // ─── agregarLote(guias) ───────────────────────────────
  describe('agregarLote', () => {
    it('agrega todas las guías del lote si pasan validación (selección vacía, lote homogéneo)', () => {
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-20' }),
        crearGuia({ id: 'g3', clienteId: 'c1', fecha: '2026-04-25' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(3)
    })

    it('agrega lote compatible con selección existente (mismo cliente y mes)', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g0', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-20' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(3)
    })

    it('NO agrega nada si el lote es heterogéneo en clienteId', () => {
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c2', fecha: '2026-04-20' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toEqual([])
    })

    it('NO agrega nada si el lote es heterogéneo en mes', () => {
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-05-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toEqual([])
    })

    it('NO agrega nada si mezcla con selección existente de diferente cliente', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g0', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c2', fecha: '2026-04-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g0')
    })

    it('NO agrega nada si mezcla con selección existente de diferente mes', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g0', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-05-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g0')
    })

    it('no duplica guías que ya están en la selección', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-05' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(2)
    })

    it('lote vacío no modifica el estado', () => {
      useSeleccionStore.getState().agregar(crearGuia({ id: 'g0' }))
      useSeleccionStore.getState().agregarLote([])
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })
  })

  // ─── Selectors derivados ──────────────────────────────
  describe('selectors derivados', () => {
    describe('clienteActivoId', () => {
      it('retorna null si seleccionActiva está vacío', () => {
        expect(useSeleccionStore.getState().clienteActivoId()).toBeNull()
      })

      it('retorna el clienteId de las guías seleccionadas', () => {
        useSeleccionStore.getState().agregar(crearGuia({ clienteId: 'c99' }))
        expect(useSeleccionStore.getState().clienteActivoId()).toBe('c99')
      })
    })

    describe('mesActivo', () => {
      it('retorna null si seleccionActiva está vacío', () => {
        expect(useSeleccionStore.getState().mesActivo()).toBeNull()
      })

      it('retorna YYYY-MM del mes de las guías seleccionadas', () => {
        useSeleccionStore.getState().agregar(crearGuia({ fecha: '2026-04-15' }))
        expect(useSeleccionStore.getState().mesActivo()).toBe('2026-04')
      })
    })
  })
})
