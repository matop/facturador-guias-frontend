# HANDOFF — Sesión de Diseño & Arquitectura Frontend
## facturaGdes (Facturador de Guías)
**Fecha:** 2026-07-22  
**Agente:** Kimi (Moonshot AI)  
**Input:** Repomix del repositorio `matop-facturador-guias-frontend`  
**Estado del repo al momento del análisis:** 252 tests verdes, React 18 + Vite + Tailwind v3 + Zustand, dark-only (Paleta Lucien), sin TanStack Query, sin FSD.

---

## 1. Diagnóstico Rápido del Codebase

### Lo que funciona bien ✅
- **Arquitectura de servicios limpia:** `http.ts` → `*Service.ts` → `api.ts` (barrel). Separación clara entre fetch base, dominio y export público.
- **Tests sólidos:** 252 tests con Vitest + Testing Library + MSW. Mocks centralizados en `fixtures.ts`.
- **Dark-only consistente:** Eliminación exitosa del tema dual (fase 1, 2026-07-20). Tokens CSS en `:root` mapeados a Tailwind.
- **Virtual scroll implementado:** `GuiasGrid` usa `@tanstack/react-virtual` con overscan.
- **Lógica de reglas avanzada:** `ReglaActivaPopup` + `ResincronizarReglaDialog` manejan primera activación vs cambio de regla con opciones de re-sync.
- **Zustand bien usado:** Stores pequeños y enfocados (`seleccionStore`, `periodoStore`, `tenantStore`).

### Lo que huele a "genérico SaaS 2023" ⚠️
- **Visual:** Cards con `border-border`, botones con `bg-primary`, tablas con `hover:bg-accent`. Es funcional pero sin personalidad fiscal.
- **Data fetching arcaico:** `useEffect + fetch` en casi todas las páginas. Sin caching, sin revalidación, sin deduping.
- **TypeScript "suelto":** IDs (`rut`, `clienteId`, `guiaId`) son todos `string`. El compilador no protege contra mezclarlos.
- **Estructura por capa técnica:** `components/`, `pages/`, `hooks/`, `services/`. No escala a 50+ pantallas ni a equipos grandes.
- **Sin code splitting:** Router carga todo síncrono. Bundle inicial innecesariamente grande.
- **Cero E2E:** 252 unitarios, pero ningún test recorre el flujo crítico de facturación end-to-end.

---

## 2. Cuatro Prototipos de Rediseño Visual

> **Nota para el agente futuro:** El usuario quiere romper con el estilo "Anthropic-clone" (azul corporativo, bordes sutiles, minimalismo genérico). Necesita **autenticidad fiscal** — que se sienta como una herramienta de trabajo para operadores de 30-60 años bajo presión.

### 2.1. "Control Room" — Densidad Operativa Industrial
**Concepto:** Bloomberg Terminal adaptado a facturación chilena.
- **Fondo:** `#050505` (negro mate, no azul Lucien).
- **Datos:** Todo en `font-mono` (JetBrains Mono o Roboto Mono ya instalado). Montos como displays de máquina.
- **Bordes:** Líneas de 1px `#222` visibles SIEMPRE. Grid de ingeniería.
- **Estados:** LEDs físicos (🟢🟡🔴) en vez de badges pastel.
- **Layout:** Tabla densa (padding 6px, no 16px). Sidebar colapsado por defecto.
- **Acción primaria:** Botón cuadrado, fondo `#00ff88` con texto negro, sin border-radius.
- **Keyboard shortcuts visibles:** `[F] Facturar`, `[R] Refrescar` en los botones.

### 2.2. "Neo-Brutalismo Fiscal" — Anti-diseño con Autoridad
**Concepto:** Las facturas son documentos legales. El diseño debe sentirse oficial pero irreverente.
- **Bordes:** 2px-3px sólidos, nunca `border-border`. Cada card tiene borde blanco puro + shadow offset de 4px.
- **Colores:** Primary es rojo fiscal (`#ff2d55`) o verde SAT (`#00c853`), no azul corporativo.
- **Tipografía:** Headings en `Syne` (ya existe) a 900 weight, tracking negativo.
- **Botones:** Se hunden al click (`translate(2px, 2px)` + shadow desaparece).
- **Tablas:** Alternancia de filas con colores pastel saturados (amarillo caja, rosa ticket).
- **Fondo:** `#fafafa` claro con cards blancas y bordes negros gruesos.

### 2.3. "Glassmorphism Cripto" — Fintech Premium
**Concepto:** El dinero que se mueve es serio. Interfaz de banco privado digital.
- **Fondo:** Gradiente animado sutil (azul profundo → violeta → azul, 20s loop).
- **Cards:** `backdrop-blur-xl`, fondo `rgba(255,255,255,0.03)`, borde `rgba(255,255,255,0.08)`.
- **Tipografía:** Números en `font-mono` con tracking amplio. Labels en 11px, mayúsculas, espaciado 0.1em.
- **Efectos:** Cards de métricas flotan. Modales entran con blur.
- **Inputs:** Sin fondo visible, solo bottom border que brilla al focus.
- **Botones:** `glass` con hover `bg-white/10`, border-radius full (pill shape).

### 2.4. "Terminal SII" — Modo Ingeniería
**Concepto:** Para el usuario avanzado o el contador. Todo se ve como un log de sistema.
- **Fondo:** Negro puro `#000000`.
- **Texto:** Ámbar fosforoso `#ffb000` para datos, blanco `#fff` para labels, verde `#00ff41` para éxito.
- **Layout:** Monospace absoluto. Guías como líneas de log.
- **Navegación:** Comandos de teclado visibles (`[F] Facturar`, `[R] Refrescar`).
- **Decoración:** ASCII art en headers. Separadores con `===`. Badges como tags de Git.
- **Efecto scanline:** Overlay sutil de líneas horizontales para efecto CRT.
- **Uso:** Power-user mode opcional (toggle en settings).

---

## 3. Skills Recomendadas para Invocar

El usuario debe buscar y activar estos skills en su entorno de agentes:

| Skill | Por qué es crítico aquí |
|---|---|
| **`feature-sliced-design`** | La estructura actual `components/pages/hooks/services` es técnica, no de dominio. FSD organiza por features (`entities/client`, `features/assign-rule`, `widgets/metrics-panel`), escala a 50+ pantallas. |
| **`tanstack-query-patterns`** | Todo el data fetching es `useEffect + fetch` (anti-patrón 2023). TanStack Query maneja caching, revalidación, deduping, estados de error globales sin boilerplate. |
| **`playwright-e2e`** | 252 tests unitarios, pero cero cobertura del flujo crítico: seleccionar cliente → filtrar guías → aprobar proformas → emitir. Un test E2E vale más que 20 unitarios para ese camino. |
| **`react-performance`** | `GuiasGrid` ya usa virtualización, pero el resto carga todo síncrono. Necesita `React.lazy()` en rutas, code-splitting por feature, y `React.memo` en tablas densas. |
| **`typescript-strict-patterns`** | IDs (`rut`, `clienteId`, `guiaId`) son todos `string`. Con **branded types** el compilador evita mezclar un RUT con un ID de guía. |

---

## 4. Siete Mejores Prácticas del Top 1% (Aplicables Hoy)

### 4.1. Server State vs Client State: Separación Absoluta
**Hoy:** `useEffect` con `fetchClientes`, `fetchGuias`, etc. en cada página.  
**Elite:** TanStack Query para todo estado del servidor. Zustand solo para estado efímero (selección activa, modales abiertos, filtros temporales).

```tsx
// ANTI-PATRÓN (hoy en el repo)
const [clientes, setClientes] = useState([])
useEffect(() => { fetchClientes().then(setClientes) }, [periodo])

// ELITE
const { data: clientes, isLoading } = useQuery({
  queryKey: ['clientes', periodo],
  queryFn: fetchClientes,
})
```

### 4.2. Feature-Sliced Design: Reestructuración de Carpetas
**Hoy:**
```
src/components/ClientesGrid/
src/pages/Clientes.tsx
src/services/clientesService.ts
```

**Elite (FSD):**
```
src/entities/client/ui/ClientesGrid.tsx
src/entities/client/api/clientesService.ts
src/entities/client/model/types.ts
src/features/assign-rule/ui/ReglaActivaPopup.tsx
src/features/assign-rule/api/reglasService.ts
src/widgets/metrics-panel/ui/MetricsPanel.tsx
src/app/router.tsx
src/app/store/
```

### 4.3. Branded Types: TypeScript que Protege
**Hoy:** `rut: string`, `clienteId: string`, `guiaId: string` son intercambiables.  
**Elite:**
```typescript
type RUT = string & { __brand: 'RUT' }
type ClienteId = string & { __brand: 'ClienteId' }
type GuiaId = string & { __brand: 'GuiaId' }

function facturar(clienteId: ClienteId, guiaId: GuiaId) {}
facturar(guiaId, clienteId) // ❌ ERROR EN COMPILACIÓN
```

### 4.4. Route-Based Code Splitting
**Hoy:** Router importa todo síncronamente.  
**Elite:**
```tsx
const Clientes = lazy(() => import('@/pages/Clientes'))
const Guias = lazy(() => import('@/pages/Guias'))

<Route path="/clientes" element={
  <Suspense fallback={<PageSkeleton />}>
    <Clientes />
  </Suspense>
} />
```

### 4.5. MSW en Desarrollo (no solo en Tests)
**Hoy:** `mockServiceWorker.js` existe en `public/` pero probablemente solo se usa en tests.  
**Elite:** Activar MSW en `main.tsx` en modo DEV. Permite trabajar frontend sin backend levantado y garantiza que tests y dev usen los mismos contratos de API.

### 4.6. Biome en vez de ESLint + Prettier
**Hoy:** `eslint.config.js` + posible Prettier.  
**Elite:** Biome (Rust-based) formatea y lintea en ~50ms. En monorepo con pnpm workspaces, cambia la experiencia de desarrollo.

### 4.7. Changesets + Semantic Release
**Hoy:** `pnpm-workspace.yaml` existe pero sin automatización de versionado.  
**Elite:** Changesets automatiza versionado semántico y changelogs. Usado por Vercel, Shopify, Astro.

---

## 5. Roadmap Recomendado de 4 Semanas

### Semana 1: Rediseño Visual Piloto
- Elegir UNO de los 4 prototipos (recomendación: **Control Room** para operadores reales, **Neo-Brutal** para diferenciación de mercado).
- Aplicarlo SOLO a la vista de Guías (`Guias.tsx` + `GuiasGrid.tsx`) — la pantalla más usada.
- No tocar lógica de negocio. Solo tokens de color, bordes, tipografía, y spacing.
- Invocar skills: `frontend-design`, `web-design-guidelines`, `ui-ux-pro-max`.

### Semana 2: Migración a TanStack Query
- Instalar `@tanstack/react-query`.
- Migrar `Clientes.tsx` y `Guias.tsx` a `useQuery` / `useMutation`.
- Eliminar todos los `useEffect` que hacen fetch directo.
- Reemplar estados locales de loading/error por los de TanStack Query.
- Invocar skill: `tanstack-query-patterns`.

### Semana 3: TypeScript Estricto + Branded Types
- Definir branded types en `src/types/index.ts`.
- Refactorizar `clientesService.ts`, `guiasService.ts`, `facturasService.ts` para usarlos.
- Activar `strict: true` en `tsconfig.json` si no está.
- Invocar skill: `typescript-strict-patterns`.

### Semana 4: E2E + Performance
- Agregar un test Playwright que recorra el flujo crítico:
  1. Login / selección de tenant
  2. Seleccionar cliente en `/clientes`
  3. Filtrar guías en `/guias`
  4. Seleccionar guías y abrir `/preview`
  5. Aprobar proformas y emitir
  6. Verificar en `/historial`
- Implementar `React.lazy()` en rutas del router.
- Auditar re-renders con React DevTools Profiler.
- Invocar skills: `playwright-e2e`, `react-performance`.

---

## 6. Contexto Crítico del Repositorio (para no romper nada)

### Tokens de Color Vigentes (NO modificarlos sin aprobación)
Todos definidos en `src/index.css` y mapeados en `tailwind.config.ts`:
- `--background: #080d2c` → `bg-background`
- `--card: #13183a` → `bg-card`
- `--primary: #505daa` → `bg-primary`
- `--muted-foreground: #9aa4d4` → `text-muted-foreground`
- `--border: #303d78` → `border-border`

### Reglas Inquebrantables del Design System
1. **NO tocar lógica de negocio.** Solo JSX, clases Tailwind, estructura UI.
2. **PROHIBIDO hardcodear colores.** Usar tokens semánticos exclusivamente.
3. **Componentes UI base obligatorios.** Usar `@/components/ui/button`, `input`, `card`, `select`. Nunca HTML crudo.
4. **Lucide-react es la única fuente de iconos.** No emojis, no SVGs inline, no MUI Icons.
5. **El sistema es dark-only.** No hay toggle de tema. El tema claro fue eliminado el 2026-07-20.

### Endpoints del Backend (guias-middleware)
- Base: proxy Vite → `localhost:3334`
- `GET /empresas/:empkey/clientes?periodo=YYYY-MM`
- `GET /empresas/:empkey/guias/agrupadas?periodo=YYYY-MM`
- `PUT /empresas/:empkey/clientes/:rut/regla` (body: `{ reglaIdl, recomputar?, periodo? }`)
- `POST /empresas/:empkey/facturas/proforma/generar`
- `PATCH /empresas/:empkey/facturas/proforma/:id/aprobar|anular`

### Decisiones de Arquitectura Ya Tomadas
- `tenantId` hardcodeado `'977'` en `main.tsx` (pendiente auth real).
- `ReglaActivaPopup` y `ReglasPorClienteModal` comparten la misma lógica de step (primera activación vs cambio con resync).
- `AdminReglas` existe en router pero está oculto del Sidebar (código intacto, no accesible al operador).
- `fetchMetricas` no tiene endpoint propio — computa en cliente desde `/clientes`.
- `backendFetch` acepta `context?: { empkey, periodo }` inyectable para tests.

---

## 7. Checklist para el Agente Futuro

Antes de tocar cualquier UI en este repo:
- [ ] ¿Usa exclusivamente tokens de color del sistema (no hex hardcodeados)?
- [ ] ¿Usa componentes de `src/components/ui/` en lugar de HTML crudo?
- [ ] ¿Los iconos provienen de `lucide-react`?
- [ ] ¿La vista es scrolleable con `overflow-y-auto`?
- [ ] ¿Es responsive (probado en `md` y `lg`)?
- [ ] ¿Los elementos interactivos tienen estados hover/focus/disabled?
- [ ] ¿Inputs tienen labels o `aria-label`?
- [ ] ¿El sidebar funciona colapsado y expandido?
- [ ] ¿Se respeta la paleta institucional (Lucien) — sin hex fuera de tokens?
- [ ] ¿No se modificó ningún hook, servicio, ni lógica de negocio?
- [ ] ¿Compila sin errores TypeScript?
- [ ] ¿No hay `console.log` innecesarios?
- [ ] ¿Imports no usados eliminados?

---

*Documento generado automáticamente al finalizar la sesión de diseño y arquitectura.*
*Para continuar: copiar este handoff como contexto inicial en la siguiente sesión y especificar qué prototipo o práctica se va a implementar.*
