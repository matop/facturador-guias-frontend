import { defineConfig } from '@playwright/test'

// El backend guias-middleware (:3334) debe estar levantado externamente
// antes de correr esta suite — no se declara acá porque no es parte del
// frontend y su ciclo de vida (datos QA reales) no debe gestionarlo Playwright.
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
})
