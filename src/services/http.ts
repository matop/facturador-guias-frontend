/**
 * Cliente HTTP base. Todas las llamadas al backend pasan por aquí.
 * Maneja: proxy Vite → localhost:3334, Content-Type JSON, errores HTTP.
 */

export class NotFoundError extends Error {
  constructor(message = 'Not found') { super(message); this.name = 'NotFoundError' }
}
export class ValidationError extends Error {
  constructor(message = 'Validation error') { super(message); this.name = 'ValidationError' }
}
export class UpstreamError extends Error {
  constructor(message = 'Upstream error') { super(message); this.name = 'UpstreamError' }
}
import { useTenantStore } from '@/store/tenantStore'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToYYYYMM } from '@/utils/periodo'

export { periodoToYYYYMM }

export function getContext() {
  const empkey = useTenantStore.getState().tenantId
  const periodo = periodoToYYYYMM(usePeriodoStore.getState().periodo)
  return { empkey, periodo }
}

/**
 * Realiza una petición HTTP al backend.
 *
 * @param path    - Ruta relativa (el proxy Vite la redirige a localhost:3334).
 * @param options - Parámetros de query, método HTTP y body JSON.
 * @param options.context - Contexto explícito `{ empkey, periodo }`. Si se
 *   provee, se usa directamente en lugar de leer los stores de Zustand.
 *   Útil en tests o en llamadas donde el contexto se conoce de antemano.
 *   Si se omite, se llama a `getContext()` de manera transparente (compatible
 *   con todos los callers existentes).
 */
export async function backendFetch<T>(
  path: string,
  options?: {
    params?: Record<string, string>
    method?: string
    body?: unknown
    context?: { empkey: string; periodo: string }
  },
): Promise<T> {
  const searchParams = new URLSearchParams(options?.params ?? {})
  const url = `${path}?${searchParams.toString()}`
  const init: RequestInit = { method: options?.method ?? 'GET' }
  if (options?.body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' }
    init.body = JSON.stringify(options.body)
  }
  const res = await fetch(url, init)
  if (!res.ok) {
    if (res.status === 404) throw new NotFoundError(`API error: ${res.status}`)
    if (res.status === 422) throw new ValidationError(`API error: ${res.status}`)
    if (res.status === 502 || res.status === 503) throw new UpstreamError(`API error: ${res.status}`)
    throw new Error(`API error: ${res.status}`)
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
