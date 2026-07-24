import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import '@fontsource/syne/400.css'
import '@fontsource/syne/700.css'
import '@fontsource/roboto-mono/400.css'
import '@fontsource/roboto-mono/500.css'
import '@fontsource/roboto-mono/600.css'
import '@fontsource/roboto-mono/700.css'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
)

async function prepare() {
  if (import.meta.env.DEV) {
    const { useTenantStore } = await import('./store/tenantStore')
    const { usePeriodoStore } = await import('./store/periodoStore')

    // TODO: reemplazar por auth real cuando esté disponible
    useTenantStore.getState().setTenant('977', 'INTEGRAC')

    // Detectar rezagadas: si anterior tiene guías pendientes, arrancar en ese período
    const empkey = useTenantStore.getState().tenantId
    const now = new Date()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const anteriorMes = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`

    const tieneRezagadas = await fetch(`/empresas/${empkey}/clientes?periodo=${anteriorMes}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((clientes: Array<{ cantidadGuias: number }>) =>
        Array.isArray(clientes) && clientes.some((c) => c.cantidadGuias > 0),
      )
      .catch(() => false)

    usePeriodoStore.getState().initPeriodo(tieneRezagadas)
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </StrictMode>,
  )
})
