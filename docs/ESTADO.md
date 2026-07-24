# Estado — facturaGdes
Última actualización: 2026-06-01 — **PRD v4 frontend completo: T4 ReglasPorClienteModal step logic. 252 tests verdes.**

## Componentes ✅ Todos completos
Scaffold Vite+React TS · Tailwind CSS vars · Vitest+Testing Library · tipos TypeScript ·
AppLayout (KPI pills + GlobalConfirmModal) · Sidebar NavLink · React Router v6 ·
**capa de servicios modularizada** (http · clientesService · guiasService · facturasService · reglasService · api barrel) ·
ClientesGrid (ícono Settings2, sin columna Regla v3) · seleccionStore ·
periodoStore · tenantStore · themeStore · MetricsPanel · Vista Clientes · Vista Guías ·
DateFilter · agrupadorColors.ts · GuiasGrid · ConfirmDialog v2 · Vista Preview ·
Vista Historial · sistema dual temas · docs/DESIGN_SYSTEM.md v3.0.0 ·
AdminReglas (/admin/reglas, oculto del Sidebar) · `fetchReglasEmpresa` + `assignReglaCliente` ·
fecha real guía desde BD · header KPI pills conectados a API · MetricsPanel reactivo a periodo ·
**backendFetch context inyectable** · **src/utils/periodo.ts centralizado** · **ConfirmDialog sin side-effects** ·
**ReglasPorClienteModal (v4) — step logic primera activación vs cambio, onActivar acepta opciones?** ·
**ReglaActivaPopup (v3) — radio list reglas empresa, guardar via assignReglaCliente** ·
**GuiasGrid virtual scroll (@tanstack/react-virtual)** ·
**chips → combobox ≥ 8 agrupadores** · **AdminReglas orientado a cliente** ·
**Preview "Enviar a facturación"** · **DTOs camelCase (ProformaDto, FacturaResumenDto)** · **onFacturar navega a /guias?clienteId=**

## Pendientes
- [x] Verificar tests siguen verdes tras mejoras arquitectónicas — OK 2026-05-26 (fix: test stale ConfirmDialog.limpiar eliminado)
- [x] **PRD Flexibilidad Reglas + UX** — completo (Sprint 8+9, 2026-05-26)
  - [x] Renombrar "Emitir DTE" → "Enviar a facturación" en Preview ✅ 2026-05-26
  - [x] Virtual scroll en GuiasGrid ✅ 2026-05-26
  - [x] Chips → combobox cuando ≥ 8 agrupadores (mostrar `reglanombre`) ✅ 2026-05-26
  - [x] AdminReglas: selector de cliente + lista de reglas + activar + nombre de display ✅ 2026-05-26
  - [x] ⚠️ OPEN cambio de regla activa: RESUELTO 2026-06-01 — primera activación sin diálogo; cambio → diálogo con opciones re-sync o solo guías nuevas
- [x] `onFacturar` en Clientes.tsx navega a `/guias?clienteId=` ✅ 2026-05-27
- [x] **Discover por cliente en AdminReglas** — candidatos filtrados por `gclirut`, sin cliente = panel vacío ✅ 2026-05-27
- [x] **PRD v3 Regla Agrupadora (frontend)** — ReglaActivaPopup + ClientesGrid refactor + Sidebar ✅ 2026-05-28
- [x] Backend: `GET /empresas/:empkey/reglas` → `ReglaDisponible[]` — implementado en guias-middleware 2026-05-29
- [x] **PRD v4 frontend**: `ResincronizarReglaDialog` + lógica primera activación vs cambio en `ReglaActivaPopup` y `ReglasPorClienteModal` ✅ 2026-06-01
- [x] E2E flujo facturación con backends levantados ✅ 2026-07-24 — `e2e/emision.spec.ts`, corrido contra `:5173` + `:3334` reales
- [ ] Agregar `id_tenant_fk` en ERD Lucidchart
- [x] Silenciar warnings React Router v7 future flags ✅ 2026-06-01

## Historial Técnico

### 2026-06-01 — PRD v4 frontend T4: ReglasPorClienteModal step logic

**Archivos modificados:**
- `src/components/ReglasPorClienteModal/ReglasPorClienteModal.tsx` — step logic idéntico a `ReglaActivaPopup`: primera activación (sin `r.activa`) → `onActivar(reglaidl)` directo; cambio de regla → `ResincronizarReglaDialog` step. `onActivar` extendido a `(reglaidl, opciones?) => void`. Imports: `usePeriodoStore`, `periodoToYYYYMM`, `ResincronizarReglaDialog`.
- `src/components/ReglasPorClienteModal/ReglasPorClienteModal.test.tsx` — mocks `usePeriodoStore` + `periodoToYYYYMM` al inicio. 4 tests nuevos: primera activación llama `onActivar` sin opciones, primera activación no abre diálogo, cambio de regla abre diálogo, confirmar llama `onActivar` con opciones, cancelar vuelve al modal. Test "llama onActivar con reglaidl al click" reemplazado por variante primera-activación (usa `mockReglasSinActiva`).

**Decisiones:**
- `handleActivar` intercept interno: si `reglas.find(r => r.activa)` existe → diálogo; si no → put directo. El parent sigue siendo responsable del estado `activando` y del refresh post-guardado.
- Después de `handleConfirmResinc` el modal vuelve a step `'select'` (no se cierra solo) — el parent decide cuándo cerrar según el ciclo async.
- `reglaLabel()` existente se reutiliza para calcular `reglaAnteriorDesc` / `reglaNuevaDesc` del diálogo.

**Resultado:** 248 → **252 tests** ✅ (+4 netos)

## Bugs resueltos
- **Chips agrupador mostraban "Smoke test nombre: 977_CMNA_RENCA"**: Smoke test de guias-middleware actualizaba `reglanombre` a `"Smoke test nombre"` en BD real sin restaurar. UI usaba `${ag.nombre}: ${ag.codigo}` — mostraba nombre+codigo concatenados. Solución: formato → `ag.nombre || ag.codigo`; smoke test restaura `reglanombre → null` en `afterAll`.
- **`clientesConRezagadas` siempre mostraba 0**: `fetchMetricas` tenía hardcodeado `clientesConRezagadas: 0`. Solución: fetch paralelo del mes anterior al cargar métricas del período actual.
- **Subtitle "X con entregas mes anterior" no tenía sentido viendo período anterior**: Label estático sin contexto del período activo. Solución: subtitle condicional basado en `periodo` del store.
- **Botón "Facturar" no navegaba**: `onFacturar` en `Clientes.tsx` solo hacía `console.log`. Causa: placeholder nunca reemplazado. Solución: `navigate(\`/guias?clienteId=${id}\`)` — idéntico a "Ver Guías". `Clientes.test.tsx` +1 test.
- **`backendFetch` SyntaxError en void responses**: `res.json()` en endpoints PUT/PATCH que retornan 200 sin body. Solución: `const text = await res.text(); return text ? JSON.parse(text) : undefined`. `src/services/http.ts`.
- **Fecha guía siempre día 1 del mes**: `fetchGuias` hardcodeaba `${periodo}-01`. Causa: `GrupoDto.folios` solo mandaba folio sin fecha. Solución: backend incluye `guifechaemision` en cada entrada del array de folios.
- **Pill "Facturar" mostraba cantidad de guías**: `AppLayout` usaba `metricas?.totalGuias` en lugar de `metricas?.factEst`. One-liner fix.
- **MetricsPanel no actualizaba al cambiar período**: `useEffect` sin deps. Solución: agregar `periodo` del store como dep.
- **Emisión en Preview redirigía a `/guias` en vez de `/historial`**: desde que `BrowserRouter` activó `future.v7_startTransition`, `navigate('/historial')` corre en la lane de transición de React pero `limpiar()` (Zustand, síncrono) no — el guard-effect que redirige a `/guias` cuando `seleccionActiva.length === 0` podía disparar antes de que la navegación a `/historial` se confirmara, mandando al usuario a `/guias` en un flash. Solución: envolver `navigate` + `limpiar` en el mismo `startTransition` dentro de `handleEmitir` (`Preview.tsx`). Nota: el test unitario (`MemoryRouter` + `future` flag) no reproduce la carrera porque `act()` de Testing Library flushea el scheduler sincrónicamente — la cobertura real de esta regresión es el E2E (`e2e/emision.spec.ts`).

## Contexto Crítico

- **guias-middleware** (backend): base URL vacía + proxy Vite `/empresas → localhost:3334`.
- **`tenantId`** hardcodeado `'977'` en `main.tsx`. Al implementar auth, reemplazar `setTenant('977', 'INTEGRAC')`.
- **Design system**: `docs/DESIGN_SYSTEM.md` v3.0.0 — leer SIEMPRE antes de tocar UI.
- **Tailwind**: `bg-primary` = `#505daa` dark / `#1971c2` light via CSS var `--primary`. Sidebar `bg-slate-900` fijo.
- **Theming**: `html.light` activa paleta Gdes; sin ella rige Lucien (dark). Topbar usa `var(--topbar-bg/border)`.
- **`agrupadorColor`**: Tailwind 500 saturado (`#3b82f6`). Usar `getChipTextColor(color)` para contraste WCAG. NO usar `getAgrupadorTextColor` (deprecado).
- **`periodoToYYYYMM()` y `periodoToRange()`**: en `src/utils/periodo.ts`. `periodoToRange` retorna `{from, to, label}`. Stores y pages nunca calculan fechas — todo via este módulo.
- **`backendFetch` context**: acepta `context?: {empkey, periodo}` opcional. Útil para tests sin stores. Callers existentes no requieren cambio.
- **`fetchGuias` aplana `GuiasAgrupadasItemDto`**: `Guia.id = ${rut}-${folio}`, `Guia.agrupadorId = grupo.regla`, `Guia.agrupadorColor` via `colorForRegla()`.
- **`fetchMetricas`**: no tiene endpoint propio — llama `/clientes` y computa en cliente. Vive en `clientesService.ts`.
- **`emitirFacturas`**: `POST generar` → `GET proforma` → `PATCH aprobar/anular` en paralelo. Vive en `facturasService.ts`.
- **Capa de servicios**: `http.ts` (base) → `*Service.ts` (dominio) → `api.ts` (barrel público). Imports nuevos deben apuntar al servicio específico, no al barrel.
- **`colorForRegla`**: privado en `guiasService.ts`. Genera color determinístico por hash de string de regla. No exportar.
- **`mapEstado`** y **`mapProformaToFactura`**: privados en `facturasService.ts`.
- **Postman Collection**: `facturaGdes.postman_collection.json` en raíz. Variables colección: `base_url=localhost:3334`, `empkey=977`, `periodo=2026-05`.
- **Tests de página**: `vi.mock('@/services/api')` — NO MSW. Mockear TODAS las funciones que el componente y sus hijos puedan llamar (incluir `fetchMetricas` si se renderiza `<MetricsPanel />`, `fetchReglasEmpresa` si se renderiza `<ReglaActivaPopup />`).
- **`vi.clearAllMocks()` en `beforeEach`** — obligatorio cuando se verifica `toHaveBeenCalledTimes(N)`.
- **Vista Preview guard**: navega a `/guias` si `seleccionActiva.length === 0` vía `useEffect`.
- **DateFilter auto-aplica bounds**: al montar emite `onChange` con rango completo del mes activo.
- **`fetchReglaActiva`** puede devolver array vacío o 404 → `.catch(() => [])`.
- **Luminancia WCAG**: `(0.299R + 0.587G + 0.114B)/255 > 0.55` → texto oscuro; si no → texto blanco.
- **Reglas de negocio**: nunca mezclar guías de distintos meses NI distintos clientes en una factura.
- **Algoritmo agrupador**: 100% en backend. Frontend solo consume `agrupadorCodigo` + `agrupadorColor`.
- **`ReglaActivaPopup`** (v3): fetches sus reglas internamente via `fetchReglasEmpresa`. Requiere endpoint `GET /empresas/:empkey/reglas` en guias-middleware (pendiente). Props: `clienteNombre`, `rut`, `reglaActual`, `onClose`, `onSaved`.
- **`Cliente.reglaIdl`** (v3): reemplaza `reglaAsignada + reglanombre`. Backend debe enviar `reglaIdl` en DTO `/clientes`. `clientesService` ya mapea el campo nuevo.
- **AdminReglas**: ruta `/admin/reglas` existe en router pero sin link en Sidebar. Código intacto, no accesible para el operador.
- **E2E Playwright**: `e2e/emision.spec.ts` + `pnpm test:e2e` — flujo completo de facturación contra `:5173` + backend real `:3334` (empkey=977). Requiere ambos levantados manualmente; cada corrida aprueba/emite una proforma real en QA.
- **`.claude/worktrees/`**: worktrees de git dejados por trabajo anterior quedaban dentro del glob por defecto de Vitest y rompían `pnpm test` (React duplicado entre `node_modules` de cada worktree). Excluidos explícitamente en `vitest.config.ts` (`test.exclude`).
