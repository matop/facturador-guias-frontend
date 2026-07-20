import { create } from 'zustand'

interface TenantState {
  tenantId: string
  tenantNombre: string
  setTenant: (id: string, nombre: string) => void
  isTenantSet: () => boolean
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenantId: '',
  tenantNombre: '',
  setTenant: (id, nombre) => set({ tenantId: id, tenantNombre: nombre }),
  isTenantSet: () => get().tenantId !== '',
}))
