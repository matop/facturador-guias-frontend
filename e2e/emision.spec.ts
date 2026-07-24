import { test, expect } from '@playwright/test'

// ATENCIÓN: este test aprueba y emite una proforma real contra empkey=977
// en el backend de QA (guias-middleware:3334). No correr contra producción.
// Requiere: `pnpm dev` (:5173) y guias-middleware (:3334) levantados.
test('emitir no pasa por /guias antes de llegar a /historial', async ({ page }) => {
  await page.goto('/clientes')

  await page.getByTestId('facturar-global-secundario').click()
  await page.getByTestId('guias-page').waitFor()

  await page.locator('[data-testid^="checkbox-"]').first().click()
  await page.getByTestId('btn-facturar-seleccion').click()
  await page.getByRole('button', { name: 'Confirmar emisión' }).click()

  await page.locator('h1:has-text("Previsualización de Facturas")').waitFor()
  await page.locator('[data-testid^="btn-aprobar-"]').first().click()

  const urls: string[] = []
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) urls.push(frame.url())
  })

  await page.getByTestId('btn-emitir').click()
  await page.waitForURL('**/historial')

  expect(urls.some((url) => url.includes('/guias'))).toBe(false)
})
