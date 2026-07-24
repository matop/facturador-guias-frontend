import type { Periodo } from '@/types'

/** Scope de toda query al backend: tenant activa + período activo. */
export interface QueryContext {
  tenantId: string
  periodo: Periodo
}

export const queryKeys = {
  clientes: (ctx: QueryContext, query: string) =>
    ['clientes', ctx.tenantId, ctx.periodo, query] as const,
  /** Prefijo de todas las keys de `clientes` de la tenant — para invalidar sin importar período/query. */
  clientesAll: (ctx: QueryContext) => ['clientes', ctx.tenantId] as const,
  metricas: (ctx: QueryContext) => ['metricas', ctx.tenantId, ctx.periodo] as const,
  reglasEmpresa: (ctx: QueryContext) => ['reglasEmpresa', ctx.tenantId] as const,
}
