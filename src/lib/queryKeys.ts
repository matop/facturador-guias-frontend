export const queryKeys = {
  clientes: (tenantId: string, periodo: string, query: string) =>
    ['clientes', tenantId, periodo, query] as const,
  clientesAll: (tenantId: string) => ['clientes', tenantId] as const,
  metricas: (tenantId: string, periodo: string) => ['metricas', tenantId, periodo] as const,
  reglasEmpresa: (tenantId: string) => ['reglasEmpresa', tenantId] as const,
}
