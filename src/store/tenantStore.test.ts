import { describe, it, expect, beforeEach } from 'vitest'
import { useTenantStore } from './tenantStore'

describe('tenantStore', () => {
  beforeEach(() => {
    useTenantStore.setState({ tenantId: '', tenantNombre: '' })
  })

  describe('estado inicial', () => {
    it('tenantId empieza en string vacío', () => {
      expect(useTenantStore.getState().tenantId).toBe('')
    })

    it('tenantNombre empieza en string vacío', () => {
      expect(useTenantStore.getState().tenantNombre).toBe('')
    })
  })

  describe('setTenant', () => {
    it('actualiza tenantId y tenantNombre', () => {
      useTenantStore.getState().setTenant('t-001', 'Empresa ABC')
      const state = useTenantStore.getState()
      expect(state.tenantId).toBe('t-001')
      expect(state.tenantNombre).toBe('Empresa ABC')
    })
  })

  describe('isTenantSet', () => {
    it('retorna false si tenantId es string vacío', () => {
      expect(useTenantStore.getState().isTenantSet()).toBe(false)
    })

    it('retorna true si tenantId no es string vacío', () => {
      useTenantStore.getState().setTenant('t-001', 'Empresa ABC')
      expect(useTenantStore.getState().isTenantSet()).toBe(true)
    })
  })
})
