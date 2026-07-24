import { useMemo } from 'react'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import type { QueryContext } from '@/lib/queryKeys'

/**
 * Tenant activa + período activo, que siempre viajan juntos como scope de
 * cualquier query al backend. Fuente única para armar query keys — no leer
 * `useTenantStore`/`usePeriodoStore` por separado sólo para eso.
 */
export function useQueryContext(): QueryContext {
  const tenantId = useTenantStore((s) => s.tenantId)
  const periodo = usePeriodoStore((s) => s.periodo)

  return useMemo(() => ({ tenantId, periodo }), [tenantId, periodo])
}
