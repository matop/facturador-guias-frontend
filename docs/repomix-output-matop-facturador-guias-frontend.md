This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
.github/
  workflows/
    ci.yml
docs/
  DESIGN_SYSTEM.md
  ESTADO.md
  prd-flexibilidad-reglas-y-ux-2026-05-26.md
  PRD-regla-agrupadora-v3-frontend.md
  PRD-regla-agrupadora-v4-frontend.md
public/
  mockServiceWorker.js
src/
  components/
    AppLayout/
      AppLayout.test.tsx
      AppLayout.tsx
    ClientesGrid/
      ClientesGrid.test.tsx
      ClientesGrid.tsx
      index.ts
    ConfirmDialog/
      ConfirmDialog.test.tsx
      ConfirmDialog.tsx
      index.ts
    DateFilter/
      DateFilter.tsx
      index.ts
    ErrorBanner/
      ErrorBanner.tsx
    ErrorBoundary/
      ErrorBoundary.tsx
    GuiasGrid/
      GuiasGrid.test.tsx
      GuiasGrid.tsx
      index.ts
    MetricCard/
      index.ts
      MetricCard.tsx
    MetricsPanel/
      index.ts
      MetricsPanel.test.tsx
      MetricsPanel.tsx
    ReglaActivaPopup/
      ReglaActivaPopup.test.tsx
      ReglaActivaPopup.tsx
    ReglasPorClienteModal/
      index.ts
      ReglasPorClienteModal.test.tsx
      ReglasPorClienteModal.tsx
    ResincronizarReglaDialog/
      ResincronizarReglaDialog.test.tsx
      ResincronizarReglaDialog.tsx
    Sidebar/
      Sidebar.test.tsx
      Sidebar.tsx
    ui/
      badge.tsx
      button.tsx
      card.tsx
      input.tsx
      select.tsx
      skeleton.tsx
  hooks/
    useGuiasFilters.test.ts
    useGuiasFilters.ts
  lib/
    utils.ts
  pages/
    AdminReglas.test.tsx
    AdminReglas.tsx
    Clientes.test.tsx
    Clientes.tsx
    Guias.test.tsx
    Guias.tsx
    Historial.test.tsx
    Historial.tsx
    Preview.test.tsx
    Preview.tsx
  services/
    api.ts
    clientesService.test.ts
    clientesService.ts
    facturasService.ts
    guiasService.test.ts
    guiasService.ts
    http.ts
    reglasService.test.ts
    reglasService.ts
  store/
    periodoStore.test.ts
    periodoStore.ts
    seleccionStore.test.ts
    seleccionStore.ts
    tenantStore.test.ts
    tenantStore.ts
  test/
    mocks/
      fixtures.ts
    setup.ts
  types/
    index.ts
  utils/
    agrupadorColors.test.ts
    agrupadorColors.ts
    loteHomogeneo.ts
    periodo.ts
  App.tsx
  index.css
  main.tsx
  router.test.tsx
  router.tsx
  vite-env.d.ts
.gitignore
CLAUDE.md
CONTEXT.md
eslint.config.js
facturaGdes.postman_collection.json
index.html
package.json
pnpm-workspace.yaml
postcss.config.js
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
vitest.config.ts
````

# Files

## File: .github/workflows/ci.yml
````yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 11

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test -- --run
````

## File: docs/DESIGN_SYSTEM.md
````markdown
# Sistema de Diseño — facturaGdes (Sistema de Facturación Automatizada)

> **Versión:** 3.2.0 | **Última actualización:** Julio 2026
>
> Este documento es la **fuente única de verdad** para toda decisión visual y de componentes del sistema de facturación.
> Cualquier agente o desarrollador que trabaje en la UI **DEBE** leer y respetar este archivo antes de escribir código.

---

## 0. Reglas Inquebrantables

Estas reglas tienen prioridad absoluta. Si entran en conflicto con cualquier otra sección, ganan.

1. **NO tocar lógica de negocio.** Hooks, servicios, llamadas a API, cálculos de precios y cualquier código que no sea puramente de presentación son intocables. Solo se modifica lo relacionado al frontend visual: JSX, clases de Tailwind, estructura de componentes UI y estilos CSS.
2. **Coherencia visual total.** Cada pantalla del sistema debe verse como parte de la misma aplicación. Si un patrón visual existe en una pantalla, debe replicarse idénticamente en las demás.
3. **PROHIBIDO hardcodear colores.** Usar exclusivamente las variables semánticas definidas en `index.css` y mapeadas en la sección de tokens de este documento (ej. `bg-primary`, `text-foreground`, `border-border`). Nunca usar valores arbitrarios como `bg-[#1E40AF]` cuando existe un token equivalente.
4. **Componentes UI base obligatorios.** Antes de crear un `<button>`, `<input>`, `<select>` o `<table>` HTML crudo, verificar si existe un componente en `src/components/ui/`. Si existe, usarlo. Si no existe, crearlo siguiendo el patrón de los existentes (CVA + forwardRef).
5. **Verificación post-cambio.** Al terminar cualquier cambio de UI, invocar las skills `frontend-design`, `web-design-guidelines`, `ui-ux-pro-max` y `vercel-react-best-practices` para validar que se siguen las mejores prácticas de desarrollo de interfaces web, experiencia de usuario y programación React.

---

## 1. Visión y Principios

Estamos construyendo una herramienta de trabajo **rápida, predecible y accesible** para entornos de alto tráfico (minimarkets, repuestos). Nuestros usuarios tienen entre 30 y 60 años y trabajan bajo presión. Cada decisión de diseño se mide contra estos principios:

| Principio | Significado |
|---|---|
| **Keyboard-First** | Todos los flujos principales (búsqueda, cobro, navegación) deben poder completarse sin mouse. Atajos de teclado visibles en los botones. |
| **Cero Carga Cognitiva** | Las acciones primarias son obvias. No sacrificamos usabilidad por estética minimalista. |
| **Accesibilidad (WCAG AA)** | Contraste alto y tipografía legible no son negociables. Elementos semánticos HTML, `aria-label` donde corresponda, y navegación por teclado en todos los componentes. |
| **Velocidad percibida** | Transiciones suaves (`transition-all duration-300`), estados de carga claros, y auto-focus en inputs críticos. |

---

## 2. Stack Tecnológico Frontend

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React | 18 |
| Lenguaje | TypeScript | strict |
| Estilos | Tailwind CSS | 3.x |
| Build Tool | Vite | — |
| Routing | React Router | v6 |
| Estado global | Zustand | — |
| Componentes UI | Primitivos propios (patrón shadcn/ui, sin Radix) | — |
| Variantes | class-variance-authority (CVA) | — |
| Iconos | lucide-react | — |
| Tests | Vitest + @testing-library/react | — |
| Mocks de API | MSW 2 (node server para tests) | — |

### Reglas del stack

- **Tailwind v3** — la configuración de colores vive en `tailwind.config.ts` (no en `index.css`).
- Los tokens de color se definen como CSS custom properties en `src/index.css` y se mapean en `tailwind.config.ts`.
- **NO** modificar tokens en `index.css` sin aprobación explícita.
- **Lucide-react** es la única fuente de iconos. Prohibido usar emojis, SVGs inline, o Material UI Icons como iconos de interfaz.

---

## 3. Estructura de Archivos

```
src/
├── pages/
│   ├── Clientes.tsx      # Vista principal post-login (tabs período, buscador, ClientesGrid)
│   ├── Guias.tsx         # Vista de guías (DateFilter, chips agrupador, GuiasGrid, bulk-bar)
│   ├── Preview.tsx       # Previsualización y aprobación de facturas proforma
│   └── Historial.tsx     # Auditoría post-emisión
├── components/
│   ├── AppLayout/        # Layout shell (sidebar + header + Outlet)
│   ├── Sidebar/          # Sidebar con NavLink activo (bg-card)
│   ├── MetricsPanel/     # Panel superior de métricas (3 cards)
│   ├── ClientesGrid/     # Grilla con skeleton + empty state
│   ├── GuiasGrid/        # Grilla agrupada por agrupador, checkboxes
│   ├── DateFilter/       # Tabs mes + flechas ◄► + datepicker
│   ├── ConfirmDialog/    # Modal de confirmación (auto-deselect onCancel)
│   └── ui/               # Primitivos shadcn/ui (button, input, card, dialog…)
├── store/
│   ├── seleccionStore.ts # Guías seleccionadas (Zustand)
│   ├── periodoStore.ts   # Mes activo (Actual / Anterior)
│   └── tenantStore.ts    # Tenant activa
├── services/
│   ├── api.ts            # apiFetch con tenantId+periodo automáticos
│   ├── guiasService.ts
│   └── facturasService.ts
├── utils/
│   └── agrupadorColors.ts  # PASTEL_TO_TEXT + getAgrupadorTextColor()
├── types/
│   └── index.ts          # Cliente, Guia, Agrupador, Factura, MetricasResumen, Periodo
├── test/
│   ├── setup.ts          # MSW server setup global
│   └── mocks/
│       ├── handlers.ts   # GET /api/clientes, /api/metricas, /api/guias
│       └── fixtures.ts   # 5 clientes + guías + métricas
├── router.tsx            # / → /clientes, /guias, /preview, /historial
└── index.css             # CSS custom properties (paleta Lucien, NO modificar sin aprobación)
```

---

## 4. Sistema de Tokens de Diseño

Todos los tokens están definidos como CSS custom properties en `src/index.css` y mapeados a clases de Tailwind en `tailwind.config.ts`. **Siempre usar la clase de Tailwind**, nunca el valor hex directo.

El sistema es **dark-only** (Paleta Lucien, azul/violeta profundo). El tema claro Gdes
y su toggle (`themeStore`, botón Sun/Moon en el header) existieron hasta mayo 2026 y
fueron eliminados el 2026-07-20 (fase 1 del rediseño frontend) — no hay alternancia de
tema en la aplicación.

---

### 4.1. Colores (`:root`)

> **Paleta Lucien** — azul/violeta profundo. Único tema del sistema.

#### Fondos y Superficies

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--background` | `bg-background` | `#080d2c` | Fondo general |
| `--card` | `bg-card` | `#13183a` | Tarjetas, paneles |
| `--popover` | `bg-popover` | `#1d2242` | Popovers, dropdowns |
| `--muted` | `bg-muted` | `#0c133d` | Fondos secundarios |
| `--accent` | `bg-accent` | `#1d2242` | Hover general |
| `--secondary` | `bg-secondary` | `#1d2242` | Botones secundarios |

#### Texto

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--foreground` | `text-foreground` | `#ffffff` | Texto principal |
| `--card-foreground` | `text-card-foreground` | `#ffffff` | Texto en tarjetas |
| `--muted-foreground` | `text-muted-foreground` | `#8a94c4` | Labels, placeholders, descripciones |
| `--popover-foreground` | `text-popover-foreground` | `#ffffff` | Texto en popovers |

#### Acción Principal

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--primary` | `bg-primary` | `#505daa` | Botones primarios, sidebar activo |
| `--primary-foreground` | `text-primary-foreground` | `#ffffff` | Texto sobre primary |
| `--ring` | `ring-ring` | `#505daa` | Anillo de focus |

**Hover sobre primary:** `hover:bg-primary/90`

#### Bordes e Inputs

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--border` | `border-border` | `#1d2242` | Bordes estándar |
| `--input` | `border-input` | `#0c133d` | Bordes de inputs |

#### Topbar (dark)

| Token CSS | Uso |
|---|---|
| `--topbar-bg: #0c133d` | Fondo del header |
| `--topbar-border: #1d2242` | Línea inferior del header |
| `--topbar-pill-bg: #1d2242` | Fondo de pills de info |
| `--topbar-pill-border: #505daa` | Borde de pills |
| `--topbar-pill-text: #ffffff` | Texto en pills |
| `--topbar-icon-color: #505daa` | Color de iconos |
| `--topbar-btn-bg: #505daa` | Fondo del botón Facturar Global |
| `--topbar-btn-hover: #6b79c7` | Hover del botón Facturar Global |

---

### 4.2. (Reservado)

> El tema claro Gdes (paleta navy/blue, clase `html.light`) fue eliminado el
> 2026-07-20 junto con su toggle. Ver §4.1 para la única paleta vigente.

---

### 4.2b. Estados Semánticos

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--destructive` | `bg-destructive` | `#DC2626` / `#c62828` | Errores, eliminar |
| `--destructive-foreground` | `text-destructive-foreground` | `#ffffff` | Texto sobre destructive |
| `success` | `text-success` | `#16A34A` | Éxito, emisión DTE OK |

---

### 4.2c. Escala Extendida Lucien (`lucien-*`)

Definida en `tailwind.config.ts`. Usar para acentos y gradientes en dark mode:

| Clase | Hex | Uso típico |
|---|---|---|
| `bg-lucien-50` | `#e8eaf6` | Fondos sutiles de acento |
| `bg-lucien-100` | `#c5cae9` | Badges, tags |
| `bg-lucien-200` | `#9fa8da` | Bordes activos |
| `bg-lucien-500` | `#505daa` | = Primary dark |
| `bg-lucien-700` | `#3d4a8a` | Hover sobre primary |
| `bg-lucien-900` | `#2a3570` | Active state |

#### Escala de Peligro (`danger-*`)

| Clase | Hex | Uso típico |
|---|---|---|
| `bg-danger-50` | `#3A1010` | Fondo de alerta (dark) |
| `bg-danger-100` | `#4A1515` | Fondo de error (dark) |
| `bg-danger-600` | `#DC2626` | = Destructive |
| `bg-danger-700` | `#B91C1C` | Hover sobre destructive |

#### Escala de Advertencia (`warning-*`)

| Clase | Hex | Uso típico |
|---|---|---|
| `bg-warning-50` | `#332510` | Fondo de alerta suave (dark) |
| `bg-warning-100` | `#4A3517` | Fondo de alerta (dark) |
| `bg-warning-600` | `#F59E0B` | Texto/ícono de advertencia |
| `bg-warning-700` | `#B45309` | Hover sobre advertencia |

#### Escala de Éxito (`success-*`)

| Clase | Hex | Uso típico |
|---|---|---|
| `text-success` (`DEFAULT`) | `#16A34A` | Éxito, emisión DTE OK (botón Aprobar/badge) |
| `bg-success-50` | `#10281B` | Fondo de alerta suave (dark) |
| `bg-success-100` | `#1A3D28` | Fondo de badge de éxito |
| `bg-success-600` | `#22C55E` | Texto/ícono de éxito |

#### Colores de Categoría (`category-*`)

Usados para distinguir tipo de regla/candidato de agrupación (ej. `AdminReglas.tsx`):
badges "Receptor" vs "Detalle". Usar con opacidad Tailwind (`/20`, `/40`) en vez de hex + alpha manual.

| Clase | Hex | Uso típico |
|---|---|---|
| `text-category-receptor` | `#60A5FA` | Badge "Receptor" (campo del receptor) |
| `text-category-detalle` | `#A78BFA` | Badge "Detalle" (línea de detalle) |

---

### 4.3. Tipografía

#### Familias tipográficas

| Tipo | Familia | Clase Tailwind | Uso |
|---|---|---|---|
| Sans-serif (body) | `system-ui` (stack `sans` por defecto de Tailwind) | `font-sans` | Todo el texto de interfaz. **Nunca hubo `Inter` instalado ni mapeado** — el body usa el stack del sistema. |
| Display | `Syne` + fallback `sans` (vía `@fontsource/syne`, pesos 400/700) | `font-display` | Títulos de marca y headings destacados (logo, títulos de sección) |
| Monospace | `Roboto Mono` + fallback `mono` (vía `@fontsource/roboto-mono`, pesos 400/500/600/700) | `font-mono` | Códigos de barra, SKU, valores numéricos de métricas |

Ambas familias se importan en `src/main.tsx` (los CSS de `@fontsource/*`, que sirven `.woff2` locales — sin CDN) y se mapean en `tailwind.config.ts` (`fontFamily.display`, `fontFamily.mono`) reutilizando `defaultTheme.fontFamily` como fallback.

**Regla:** Las columnas de código de barra/SKU y los valores numéricos de las métricas **deben** usar `font-mono`. Los títulos de marca/sección usan `font-display` (nunca `style={{fontFamily:...}}` inline).

#### Inputs numéricos (cantidad, precio)

Los campos `type="number"` **no deben mostrar flechas/spinners** del navegador. Los valores se ingresan exclusivamente por teclado. Esto se aplica globalmente vía CSS en `theme.css`:

```css
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
```

**Regla:** Nunca revertir esta regla. Si se necesita un stepper numérico, construir un componente custom con botones `+`/`-` usando `<Button variant="ghost" size="icon">`.

#### Tamaños de fuente

| Clase | Uso |
|---|---|
| `text-xs` | Labels pequeños, metadata |
| `text-sm` | Texto secundario, descripciones |
| `text-base` | Texto principal (16px) — **tamaño por defecto** |
| `text-lg` | Subtítulos, headings de sección |
| `text-xl` | Headings medianos |
| `text-2xl` | Headings grandes |
| `text-4xl` | Números destacados (totales, montos) |

#### Pesos de fuente

| Clase | Valor | Uso |
|---|---|---|
| `font-normal` | 400 | Texto regular |
| `font-medium` | 500 | Labels, texto importante |
| `font-semibold` | 600 | Headings, títulos de sección |
| `font-bold` | 700 | Totales, énfasis fuerte |

---

### 4.4. Espaciado

#### Padding y Margin

| Contexto | Clase |
|---|---|
| Componentes pequeños | `p-3`, `px-4 py-3` |
| Componentes medianos | `p-4`, `px-4 py-4` |
| Contenedores principales | `p-6`, `px-6 py-4` |

#### Gaps (Flexbox/Grid)

| Tamaño | Clase |
|---|---|
| Pequeño | `gap-2` |
| Mediano | `gap-3`, `gap-4` |
| Grande | `gap-6` |

### 4.5. Bordes, Radios y Sombras

#### Bordes

| Tipo | Clase |
|---|---|
| Estándar | `border border-border` |
| Enfatizado | `border-2 border-border` |
| Direccional | `border-t`, `border-b`, `border-r`, `border-l` |

#### Radios de borde

| Tipo | Clase | Valor |
|---|---|---|
| Estándar (cards) | `rounded-lg` | 0.5rem |
| Grande | `rounded-xl` | 0.75rem |
| Circular | `rounded-full` | — |

#### Sombras

> **Regla (desde fase 5):** las sombras se reservan **exclusivamente** para overlays flotantes (modales y la bulk bar). Todo lo demás —cards, sidebar, botones, header, paneles, grillas— se separa del fondo con **borde** (`border border-border`), nunca con sombra.

| Nivel | Clase | Uso |
|---|---|---|
| Overlay | `shadow-xl` / `shadow-2xl` | **Único uso permitido:** modales (`ConfirmDialog`, `ReglasPorClienteModal`, `ResincronizarReglaDialog`, modal Facturar Global, modal de `AdminReglas`) y la bulk bar flotante de `Guias.tsx`. |

Los antiguos niveles `shadow-sm`/`shadow-md`/`shadow-lg` sobre cards, botones, sidebar (logo + toggle), header y paneles fueron **eliminados en fase 5**. Si un elemento necesita destacarse del fondo y no es un overlay flotante, usar borde.

---

## 5. Arquitectura de Componentes

### 5.1. Componentes Base (`src/components/ui/`)

Estos son los primitivos del sistema. Se construyen con el patrón shadcn/ui, pero **sin Radix** (no está instalado): **CVA + forwardRef + cn()**.

#### `<Button />`

Variantes disponibles: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
Tamaños: `default`, `sm`, `lg`, `icon`.

```tsx
// Acción principal
<Button variant="default" size="lg">Cobrar [Enter]</Button>

// Acción secundaria
<Button variant="outline">Limpiar</Button>

// Eliminar
<Button variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button>

// Acción sutil
<Button variant="ghost" size="sm">Ver más</Button>
```

**Regla:** Nunca usar `<button>` HTML crudo. Siempre importar desde `@/components/ui/button`.

#### Jerarquía Visual de Botones (patrón definitivo)

| Nivel | Variante | Clases adicionales | Uso en facturaGdes |
|---|---|---|---|
| **Primario** | `variant="default"` | `bg-primary text-white` | Facturar Global, Confirmar emisión DTE |
| **Secundario por fila** | `variant="outline"` | `border-primary text-primary bg-primary/5` | Facturar cliente (btn-f del mockup) |
| **Neutro** | `variant="outline"` | (sin clases extra) | Ver Guías, acciones secundarias (btn-s del mockup) |

```tsx
// Acción global/irreversible
<Button variant="default">Facturar Global</Button>

// Acción por fila (outline azul)
<Button variant="outline" className="border-primary text-primary bg-primary/5">
  Facturar
</Button>

// Acción secundaria (outline neutro)
<Button variant="outline">Ver Guías</Button>
```

#### `<Input />`

```tsx
// Input estándar
<Input placeholder="Buscar..." />

// Input de escáner (monospace, grande)
<Input autoFocus className="font-mono text-lg" placeholder="Escanear código..." />
```

**Regla:** Nunca usar `<input>` HTML crudo. Siempre importar desde `@/components/ui/input`.

#### `<Card />`

Sistema compuesto: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Pedido Actual</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>
```

**Regla:** Todo bloque de información principal debe envolverse en el sistema Card. No armar divs con sombras manualmente.

#### `<Dialog />`

El `DialogContent` tiene `max-h-[85vh]` y usa `flex flex-col` para evitar desbordamiento. El contenido central (entre `DialogHeader` y `DialogFooter`) **debe** incluir `overflow-y-auto min-h-0` para que sea scrolleable cuando el contenido excede el alto disponible.

```tsx
<DialogContent className="sm:max-w-lg">
  <DialogHeader>...</DialogHeader>
  <div className="space-y-4 overflow-y-auto min-h-0">
    {/* Contenido scrolleable */}
  </div>
  <DialogFooter>...</DialogFooter>
</DialogContent>
```

#### `<Select />`

Select propio (`src/components/ui/select.tsx`, sin Radix) con sub-componentes: `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`.

**Regla:** Nunca usar `<select>` HTML crudo.

### 5.2. Componentes Pendientes de Creación

Si se necesita alguno de estos, crearlo en `src/components/ui/` siguiendo el patrón existente:

- [ ] `Table` — (`<Table>`, `<TableRow>`, `<TableCell>`, etc.)
- [ ] `Badge` — Para estados de stock, categorías
- [ ] `AlertDialog` — Para confirmaciones destructivas (distinto a `Dialog`)
- [ ] `Drawer` — Para paneles laterales
- [ ] `Tabs` — Para navegación por pestañas
- [ ] `Tooltip` — Para información contextual en modo sidebar colapsado
- [ ] `SearchInput` — Input con ícono de lupa y autoFocus
- [ ] `Skeleton` — Placeholder de carga para tablas y cards
- [ ] `Combobox` — Select con búsqueda (para catálogo de productos)

---

## 6. Patrones de Layout

### 6.1. Layout Principal (`App.tsx`)

```tsx
<div className="h-screen flex bg-background">
  <Sidebar
    currentView={currentView}
    onViewChange={setCurrentView}
    isCollapsed={isSidebarCollapsed}
  />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Header
      onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      isSidebarCollapsed={isSidebarCollapsed}
    />
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {renderView()}
    </main>
  </div>
</div>
```

**Reglas:**
- El layout raíz ocupa `h-screen` completa.
- `<main>` siempre es scrolleable con `overflow-y-auto`.
- Usar `min-w-0` en flex children para evitar overflow.

### 6.2. Sidebar

El sidebar **es colapsable** (`useState` local en `Sidebar.tsx`), alternando entre
`w-64` (expandido) y `w-20` (colapsado), con un botón `ChevronLeft`/`ChevronRight`
flotante en el borde derecho.

```tsx
<aside className={cn('relative bg-card flex flex-col shrink-0 transition-all duration-300', collapsed ? 'w-20' : 'w-64')}>

  {/* Brand */}
  <div className="px-4 py-6 border-b border-border flex items-center">
    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
      <span className="text-primary-foreground font-bold text-xl">G</span>
    </div>
    {!collapsed && (
      <div className="min-w-0">
        <span className="text-foreground font-semibold text-base leading-tight block truncate">GDE Sistema</span>
        <span className="text-muted-foreground text-xs uppercase tracking-wide">Gestión de Guías</span>
      </div>
    )}
  </div>

  {/* Toggle button */}
  <Button variant="outline" size="icon" onClick={() => setCollapsed(!collapsed)}
    className="absolute -right-3 top-7 h-6 w-6 rounded-full border-border p-0 text-muted-foreground hover:text-foreground">
    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
  </Button>

  {/* Navegación con NavLink */}
  <nav className="flex-1 px-3 py-4">
    <NavLink
      to="/clientes"
      className={({ isActive }) =>
        cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary/20 text-primary border-l-2 border-primary pl-[10px]'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground')
      }
    >
      <Users size={16} />
      Clientes
    </NavLink>
    {/* … NavLink de Guías … */}
  </nav>
</aside>
```

**Reglas:**
- Sidebar: `bg-card` fijo — no cambia con el estado colapsado/expandido (recolor a token semántico en fase 5; antes era `bg-slate-900`).
- Link activo: `bg-primary/20 text-primary border-l-2 border-primary`.
- Link inactivo: `text-muted-foreground hover:bg-accent hover:text-foreground` (tokens semánticos; antes `text-slate-400 hover:bg-white/5 hover:text-white`).
- Sin sombras: ni el logo ni el botón de toggle usan `shadow-*` (eliminadas en fase 5); la separación es por borde.
- Ítem `/preview` solo visible cuando `seleccionActiva.length > 0`.
- El botón de toggle usa `variant="outline"` de `<Button>` (que ya provee `bg-card`) — no agregar `style`/hex de fondo adicional.
- Solo dos entradas activas hoy: `Clientes` y `Guías`. `/admin/reglas` queda fuera de la navegación (comentado en el código) — ver §"Fuera de Alcance" en `CLAUDE.md`.

### 6.3. Header / Topbar

El header usa CSS custom properties de topbar (`--topbar-*`, definidas en `index.css`).

```tsx
<header
  className="border-b px-6 py-3 flex items-center justify-between"
  style={{
    backgroundColor: 'var(--topbar-bg)',
    borderColor: 'var(--topbar-border)',
  }}
>
  {/* Título de la vista activa (del PAGE_META según useLocation) */}
  <div className="text-sm font-semibold text-foreground">{pageTitle}</div>

  {/* Pills de info */}
  <div
    className="text-xs px-2 py-1 rounded border"
    style={{
      background: 'var(--topbar-pill-bg)',
      borderColor: 'var(--topbar-pill-border)',
      color: 'var(--topbar-pill-text)',
    }}
  >
    {tenantName}
  </div>

  {/* Botón Facturar Global */}
  <button
    style={{ backgroundColor: 'var(--topbar-btn-bg)' }}
    className="text-white text-sm px-3 py-1.5 rounded hover:opacity-90"
    onClick={openGlobalConfirmModal}
  >
    Facturar Global
  </button>
</header>
```

**Reglas:**
- Usar `var(--topbar-*)` en vez de hex hardcodeados en el header.
- El título de vista viene del mapa `PAGE_META` en `AppLayout.tsx` (no usar `<h1>`).
- **Facturar Global** dual: una instancia en el header (siempre visible) + otra entre tabs de período en Vista Clientes.
- No hay toggle de tema en el header — fue eliminado (ver §4.1).

### 6.4. Tarjetas (Card-Based Layout)

Todo bloque de información debe vivir en una tarjeta:

```tsx
{/* Tarjeta simple */}
<Card>
  <CardContent className="p-6">
    {/* Contenido */}
  </CardContent>
</Card>

{/* Tarjeta con header separado */}
<Card>
  <CardHeader className="border-b border-border">
    <CardTitle className="text-foreground font-semibold text-lg">Título</CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    {/* Contenido */}
  </CardContent>
</Card>
```

### 6.5. Vistas Scrolleables

```tsx
{/* Contenedor principal con scroll vertical */}
<div className="flex-1 overflow-y-auto p-6 space-y-6">
  {/* Contenido */}
</div>

{/* Tabla con scroll horizontal */}
<div className="overflow-x-auto">
  <table>...</table>
</div>
```

**Regla:** Toda vista principal debe ser scrolleable. Nunca crear layouts que corten contenido.

---

## 7. Estados Interactivos

### 7.1. Hover

```tsx
className="hover:bg-accent transition-colors"
```

### 7.2. Focus

```tsx
className="focus:outline-none focus:ring-4 focus:ring-ring/20"
```

### 7.3. Active / Click

```tsx
className="active:scale-[0.99]"
```

### 7.4. Disabled

```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### 7.5. Combinación completa (ejemplo input)

```tsx
className="w-full px-4 py-3 text-base border-2 border-input rounded-lg
  focus:outline-none focus:ring-4 focus:ring-ring/20
  bg-card text-foreground placeholder:text-muted-foreground
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors"
```

---

## 8. Iconos

### Biblioteca única: `lucide-react`

```tsx
import { ShoppingCart, Package, Settings, Plus, Trash2, Search, Menu } from 'lucide-react';
```

### Tamaños estándar

| Tamaño | Clase | Uso |
|---|---|---|
| 16px | `w-4 h-4` | Iconos en inputs, badges |
| 20px | `w-5 h-5` | **Estándar** — sidebar, botones |
| 24px | `w-6 h-6` | Header, acciones principales |

### Colores

| Contexto | Clase |
|---|---|
| Sobre fondo primary | `text-primary-foreground` |
| Acción/acento | `text-primary` |
| Sidebar activo | `text-primary` |
| Sidebar inactivo | heredado del texto padre |
| Destructivo | `text-destructive` |

### Prohibiciones

- **NO** usar emojis como iconos.
- **NO** usar SVGs inline cuando existe icono equivalente en lucide-react.
- **NO** usar Material UI Icons (`@mui/icons-material`) como iconos de interfaz.

---

## 9. Responsive Design

### Breakpoints (Tailwind estándar)

| Prefijo | Ancho mínimo |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

### Enfoque: Mobile-First

```tsx
{/* Ocultar texto en móvil, mostrar en tablet+ */}
<span className="hidden sm:inline">Notificaciones</span>

{/* Grid responsivo: 1 col → 2 col → 4 col */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>

{/* Layout 2 columnas: 1 col en móvil, 2/3 + 1/3 en desktop */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Principal */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

### Layout flexible con proporciones

```tsx
className="flex-[65]"  // 65% del espacio
className="flex-[35]"  // 35% del espacio
```

---

## 10. Patrones de Estado y Datos

> **Nota:** Esta sección documenta patrones existentes para referencia. NO modificar la implementación de estos hooks/estados.

### Manejo de arrays inmutable

```tsx
// Agregar
setItems((prev) => [...prev, newItem]);

// Actualizar
setItems((prev) => prev.map((item) =>
  item.id === targetId ? { ...item, quantity: item.quantity + 1 } : item
));

// Eliminar
setItems((prev) => prev.filter((item) => item.id !== targetId));
```

### Mensajes de error temporales

```tsx
{error && (
  <div className="px-4 py-3 bg-danger-50 border border-destructive rounded-lg">
    <p className="text-destructive font-medium text-base">{error}</p>
  </div>
)}
```

### Auto-focus en inputs

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);
```

---

## 11. Accesibilidad (WCAG AA)

### Requisitos obligatorios

1. **Elementos semánticos:** Usar `<header>`, `<main>`, `<nav>`, `<aside>`, `<button>`, `<table>` — nunca `<div>` con `onClick` simulando un botón.
2. **Labels en inputs:** Todo `<Input>` debe tener un `<label>` asociado o `aria-label`.
3. **Contraste:** Los pares foreground/background deben cumplir WCAG AA (ratio ≥ 4.5:1 para texto, ≥ 3:1 para texto grande).
4. **Navegación por teclado:** Todos los elementos interactivos deben ser alcanzables con Tab y activables con Enter/Space.
5. **Focus visible:** Nunca eliminar el indicador de focus. Usar `focus:ring-4 focus:ring-ring/20`.
6. **Atajos de teclado:** Mostrar el atajo en el label del botón (ej. `Cobrar [Enter]`).

---

## 12. Localización

### Idioma: Español (es-ES)

Toda la interfaz está en español.

### Formato de fechas

```tsx
new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
```

### Formato de horas

```tsx
new Date().toLocaleTimeString('es-ES');
```

### Formato de precios

```tsx
`$${total.toFixed(2)}`
```

---

## 13. Performance

- Usar `useRef` para referencias DOM, nunca `document.getElementById`.
- Keys únicas en listas: `key={item.id}` — nunca índices de array.
- Auto-focus con `useRef` + `useEffect`, no con atributo `autoFocus` en componentes condicionales.
- Lazy load de imágenes cuando aplique.
- Evitar re-renders: extraer componentes cuando un estado local causa re-render de una lista grande.

---

## 14. Convenciones de Código

### TypeScript

- **Todos** los archivos son `.tsx`.
- Definir `interface` para props de cada componente.
- Nunca usar `any`.

```tsx
interface FiltersBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function FiltersBar({ searchTerm, onSearchChange }: FiltersBarProps) {
  // ...
}
```

### Componentes

- Functional components con hooks.
- **Named exports** para todos (excepto `App.tsx` que usa default export).
- PascalCase para nombres.
- Un componente por archivo.

### Imports (orden)

```tsx
// 1. React y hooks
import { useState, useRef, useEffect } from 'react';

// 2. Componentes UI base
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// 3. Componentes locales
import { FiltersBar } from './FiltersBar';

// 4. Hooks y servicios
import { usePrecios } from '@/hooks/usePrecios';

// 5. Tipos
import type { Precio } from '@/types/precios';

// 6. Iconos
import { Search, Plus, Trash2 } from 'lucide-react';
```

### Constantes y estado

- Siempre `const` o `let`, nunca `var`.
- No mutar estado directamente — siempre funciones de actualización inmutables.
- No crear componentes dentro de otros componentes.

---

## 15. Convenciones de Commits

```
[tipo]: descripción breve en español
```

Tipos: `feat`, `fix`, `refactor`, `style`, `docs`, `test`

Ejemplos:
```
feat: agregar vista de inventario
fix: corregir cálculo de total en POS
style: actualizar estilos de botones primarios
refactor: extraer componente FiltersBar
```

---

## 16. Checklist Pre-Cambio de UI

Antes de considerar terminado cualquier cambio visual:

- [ ] Usa exclusivamente tokens de color del sistema (no hex hardcodeados)
- [ ] Usa componentes de `ui/` en lugar de HTML crudo
- [ ] Los iconos provienen de `lucide-react`
- [ ] La vista es scrolleable con `overflow-y-auto`
- [ ] Es responsive (probado en breakpoints `md` y `lg` como mínimo)
- [ ] Los elementos interactivos tienen estados hover/focus/disabled
- [ ] Inputs tienen labels o `aria-label`
- [ ] El sidebar funciona colapsado y expandido
- [ ] Se respeta la paleta institucional (Lucien) — sin hex hardcodeados fuera de tokens
- [ ] No se modificó ningún hook, servicio, ni lógica de negocio
- [ ] Se verificó con las skills `frontend-design`, `web-design-guidelines`, `ui-ux-pro-max` y `vercel-react-best-practices`
- [ ] Compila sin errores TypeScript
- [ ] No hay `console.log` innecesarios
- [ ] Imports no usados eliminados

---

## 17. Mejores Prácticas — Resumen Rápido

### HACER

- Usar componentes funcionales con hooks
- Definir interfaces para todas las props
- Usar semantic HTML (`<button>`, `<header>`, `<nav>`)
- Implementar estados de loading/error
- Mantener componentes pequeños y enfocados
- Usar `font-mono` para datos numéricos y códigos
- Hacer todas las vistas scrolleables
- Respetar la paleta institucional
- Mostrar atajos de teclado en botones principales

### NO HACER

- No usar `any` en TypeScript
- No mutar estado directamente
- No usar índices como keys en listas
- No crear archivos HTML standalone (todo en React)
- No usar emojis para iconos
- No crear layouts que corten contenido
- No usar `<div onClick>` en lugar de `<button>`
- No ignorar estados hover/focus/disabled
- No tocar hooks, servicios, ni lógica de negocio existente

---

## 18. Historial: Eliminación del Tema Claro (2026-07-20)

> El sistema tuvo un tema dual (Dark Lucien ↔ Light Gdes) con toggle persistido en
> `localStorage` vía `themeStore` (Zustand) hasta mayo 2026. La fase 1 del rediseño
> frontend (2026-07-20) eliminó `src/store/themeStore.ts`, el botón toggle Sun/Moon
> del header, la clase `html.light` y sus reglas en `index.css`. El sistema es
> **dark-only** desde entonces — ver §4.1 para la paleta vigente.

### Contraste validado (WCAG AA) — paleta única

| Par | Dark (Lucien) | Ratio |
|---|---|---|
| foreground / background | `#fff` / `#080d2c` | ≥ 7:1 ✓ |
| muted-foreground / card | `#9aa4d4` / `#13183a` | ≥ 4.5:1 ✓ |
| primary / background | `#505daa` / `#080d2c` | ≥ 4.5:1 ✓ |
````

## File: docs/ESTADO.md
````markdown
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
- [ ] E2E flujo facturación con backends levantados
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
````

## File: docs/prd-flexibilidad-reglas-y-ux-2026-05-26.md
````markdown
# PRD — Flexibilidad de Reglas por Cliente + Mejoras UX Guias

**Fecha:** 2026-05-26
**Repos afectados:** `facturaGdes` (frontend), `guias-middleware` (backend)
**Origen:** Sesión grill-with-docs 2026-05-26

---

## Problem Statement

El operador de facturación enfrenta dos clases de problemas:

1. **Rigidez de reglas:** Hoy cada Cliente tiene exactamente una Regla de agrupación almacenada. Si un Cliente necesita cambiar cómo se agrupan sus guías (por ejemplo, pasar de "por comuna" a "por orden de compra"), el operador debe modificar la BD directamente. No existe UI para gestionar múltiples reglas por cliente ni para activar/desactivar una.

2. **Fricciones de UX en Guias:** La vista principal tiene nomenclatura ambigua ("Emitir DTE" cuando no se emite al SII), no soporta virtualizacion para tenants con miles de guías, y los chips de agrupador se vuelven inmanejables cuando un tenant tiene muchos agrupadores distintos.

---

## Solution

Extender el modelo de Regla para que un Cliente pueda tener **N Reglas configuradas, una activa**, gestionadas desde `AdminReglas` con selector de Cliente. Cada Regla tendrá un **Nombre de display** configurable por el operador. En paralelo, corregir la nomenclatura en Preview, implementar virtual scroll en GuiasGrid, y reemplazar chips por combobox cuando hay 8 o más agrupadores.

---

## User Stories

1. Como operador, quiero que el botón principal de Preview diga "Enviar a facturación" en lugar de "Emitir DTE", para entender que la acción aprueba la proforma en el sistema sin emitir al SII.
2. Como operador, quiero que cada proforma en Preview tenga botones "Aprobar" y "Rechazar" individuales, y el botón "Enviar a facturación" confirme el lote de aprobadas.
3. Como operador, quiero que la lista de guías use virtual scroll, para que la vista sea fluida incluso con miles de guías en el período.
4. Como operador, quiero ver chips de agrupador cuando hay pocos (menos de 8), y un combobox con búsqueda cuando hay 8 o más, para no perder espacio visual con tenants de muchos agrupadores.
5. Como operador, quiero que los filtros de cliente y agrupador estén visibles por defecto (no colapsados), para poder filtrar sin pasos adicionales.
6. Como operador, quiero seleccionar un Cliente dentro de AdminReglas y ver todas las reglas disponibles para ese cliente, para gestionar sus reglas sin salir de la pantalla de administración.
7. Como operador, quiero poder configurar múltiples reglas para un mismo Cliente y elegir cuál está activa, para tener flexibilidad sin modificar la BD directamente.
8. Como operador, quiero poder asignar un nombre legible a cada Regla (ej: "Por comuna", "Por OC"), para identificarlas fácilmente en chips, combobox y Preview sin ver nombres técnicos de campos XML.
9. Como operador, quiero que si no asigno nombre a una Regla, el sistema muestre el nombre técnico como fallback (ej: `CmnaRecep`), para que siempre haya algo legible.
10. Como operador, quiero cambiar la regla activa de un Cliente desde AdminReglas, para adaptar el criterio de agrupación cuando el cliente lo solicita.
11. Como operador, quiero que los chips y combobox de agrupador muestren el nombre de display de la regla (no el field técnico), para entender qué representa cada grupo.
12. Como operador, quiero que la Preview muestre el nombre de display de cada Factura Proforma, para identificar a qué agrupador pertenece sin descifrar códigos técnicos.
13. Como operador, quiero que un Cliente sin regla asignada aparezca con agrupador `_sin_regla`, para identificar guías pendientes de configuración.
14. Como administrador del sistema, quiero que el Sync lea la regla activa de cada cliente al calcular el agrupador, para que el cambio de regla activa se refleje en el próximo sync sin intervención técnica.

---

## Implementation Decisions

### Backend — guias-middleware

**Schema `gde.reglacliente`**
- Cambio de PK: de `(empkey, gclirut)` a `(empkey, gclirut, reglaidl)` — permite múltiples reglas por cliente.
- Nuevo campo: `activa boolean NOT NULL DEFAULT false`.
- Constraint parcial: `UNIQUE (empkey, gclirut) WHERE activa = true` — enforcea exactamente una regla activa por cliente a nivel de BD.

**Schema `gde.reglaemp`**
- Nuevo campo: `reglanombre varchar(120) NULL` — nombre de display definido por el operador. Nullable; cuando es null la UI usa el fallback técnico.

**API nuevos endpoints (o modificación de existentes)**
- `GET /empresas/:empkey/clientes/:gclirut/reglas` — lista todas las reglas configuradas para el cliente con flag `activa`.
- `PUT /empresas/:empkey/clientes/:gclirut/reglas/:reglaidl/activar` — desactiva la activa actual y activa la indicada (transacción atómica).
- `PATCH /empresas/:empkey/reglas/:reglaidl` — actualiza `reglanombre`.

**Sync**
- Al calcular el agrupador de una guía, consulta `reglacliente WHERE activa = true` para el cliente receptor. Sin cambios en la interfaz del Sync — solo la query cambia.

**Decisión abierta**
- ⚠️ ¿Puede el operador cambiar la regla activa a mitad del proceso de facturación del mes? Pendiente de definición. Por ahora, el cambio se permite en cualquier momento desde Admin; el impacto sobre guías ya agrupadas queda fuera de scope.

### Frontend — facturaGdes

**Preview**
- Renombrar botón "Emitir DTE" → "Enviar a facturación".
- El flujo per-proforma ("Aprobar" / "Rechazar") no cambia.

**GuiasGrid**
- Implementar virtual scroll (librería a decidir en implementación; `@tanstack/react-virtual` es candidato natural dado que ya usan TanStack Query).
- La lista completa de guías del período permanece en memoria — no paginación.

**Filtro de agrupador**
- Umbral: si `agrupadores.length < 8` → chips (comportamiento actual).
- Si `agrupadores.length >= 8` → combobox con búsqueda por nombre de display.
- Los chips y opciones del combobox muestran `reglanombre` con fallback al label técnico.

**Filtros**
- `collapsed = false` por defecto. No se introduce estado colapsable por ahora.

**AdminReglas**
- Agregar selector de Cliente al inicio de la página (dropdown o combobox buscable).
- Al seleccionar un cliente: mostrar sus reglas configuradas con indicador de cuál está activa y botón "Activar" por regla.
- Al activar una regla desde el Descubrimiento de Candidatos: mostrar campo opcional "Nombre de display" antes de confirmar.
- Campo editable de nombre de display por regla ya configurada.

---

## Testing Decisions

**Qué hace un buen test aquí:** testea comportamiento observable del operador (qué ve, qué puede hacer), no detalles de implementación (qué función se llama internamente).

**Módulos a testear:**

- `AdminReglas` — selección de cliente carga sus reglas; activar una regla desactiva la anterior; nombre de display se guarda y aparece en la lista.
- `GuiasGrid` — con 1000+ guías mock, el DOM no renderiza todas las filas simultáneamente (verificar con count de nodos).
- Filtro de agrupador — con 7 agrupadores muestra chips; con 8 muestra combobox; el combobox filtra por texto.
- Preview — botón dice "Enviar a facturación"; disabled cuando no hay aprobadas; enabled cuando hay al menos una aprobada.
- Backend: endpoint `PUT /activar` es atómico — si falla a mitad, ninguna regla queda sin activa.

**Prior art:** Los tests existentes en `AdminReglas.test.tsx` y `GuiasGrid` tests son la referencia de estilo.

---

## Out of Scope

- Emisión real al SII (EMITIDA → Genexus) — último en el roadmap, no se toca.
- Agrupación compuesta (dos reglas aplicadas simultáneamente sobre la misma guía).
- Historial de cambios de regla activa por cliente.
- Impacto retroactivo de cambio de regla sobre guías ya agrupadas en el período en curso.
- Filtros colapsables en Guias.

---

## Further Notes

- El Nombre de Regla (`reglanombre`) debe propagarse a todos los puntos de la UI donde hoy aparece el label técnico: chips, combobox, header de grupo en GuiasGrid, cards en Preview.
- La decisión "¿puede el operador cambiar la regla activa a mitad del mes?" debe resolverse antes de implementar el endpoint `PUT /activar` — puede requerir validaciones adicionales o un modal de advertencia.
- `facturaGdes/CONTEXT.md` y `guias-middleware/CONTEXT.md` están actualizados con los términos de este PRD.
````

## File: docs/PRD-regla-agrupadora-v3-frontend.md
````markdown
# PRD — Regla Agrupadora v3: Frontend (UX Refactor)

**Estado:** Listo para implementar
**Fecha:** 2026-05-28
**Requiere:** PRD-regla-agrupadora-v3-backend.md completado

---

## Problem Statement

La pantalla de Clientes actualmente muestra la regla activa de cada cliente como columna visible en la tabla, junto a un botón "Gestionar Regla" que abre un modal con múltiples opciones. Esto preocupa al desarrollador senior porque:

1. Expone información de configuración en una pantalla operativa, creando confusión y riesgo de modificaciones inadvertidas.
2. El operador puede cambiar la regla de un cliente desde la misma pantalla donde factura — mezclando contextos transaccional y de configuración.
3. La pantalla `AdminReglas` permite discovery y asignación de reglas, un nivel de control que no corresponde al operador diario.

---

## Solution

- Sacar la columna "Regla" de `ClientesGrid` y reemplazarla por un **ícono de acción** al final de la fila
- El ícono abre un **popup simple** que muestra la regla activa y permite cambiarla (elige de la lista de reglas disponibles para esa empresa)
- Ocultar `AdminReglas` del `Sidebar` — el código queda vivo para reuso futuro, pero no es accesible al operador

---

## User Stories

1. Como operador, quiero que la tabla de clientes no muestre la regla activa como columna, para que la pantalla sea más limpia y operativa.
2. Como operador, quiero acceder a la configuración de regla de un cliente haciendo clic en un ícono de lápiz/puntos al final de su fila, para que la acción sea intencional y no accidental.
3. Como operador, quiero que el popup me muestre cuál es la regla activa del cliente y una lista de las reglas disponibles para cambiarla, para poder hacer el cambio de manera informada.
4. Como operador, quiero confirmar el cambio de regla dentro del popup antes de que se aplique, para evitar cambios accidentales.
5. Como operador, quiero que la pantalla principal de clientes no tenga links ni accesos a pantallas de configuración avanzada, para no co-responsabilizarme con errores de configuración.
6. Como desarrollador, quiero que el código de `AdminReglas` quede intacto aunque no esté en la navegación, para poder reutilizar su lógica en el futuro.

---

## Implementation Decisions

### ClientesGrid: cambios

- **Eliminar** columna "Regla" (actualmente muestra `reglanombre ?? reglaAsignada`)
- **Eliminar** acción "Gestionar Regla" del menú de acciones
- **Agregar** ícono al final de cada fila (lápiz o `MoreHorizontal`/`Settings2`) que dispara el nuevo popup
- El ícono solo aparece si el cliente tiene guías (mismo criterio que las otras acciones)

### Nuevo popup: `ReglaActivaPopup`

Componente modal simple (puede reutilizar `Dialog` de shadcn):

```
┌─────────────────────────────────────┐
│ Regla de agrupación — [NombreCliente]│
├─────────────────────────────────────┤
│ Regla activa: [ReglaIdL] o "Sin regla"│
│                                     │
│ Cambiar a:                          │
│ ○ ReglaIdL_1 — Descripción          │
│ ○ ReglaIdL_2 — Descripción          │
│ ○ Sin regla                         │
│                                     │
│          [Cancelar] [Guardar]       │
└─────────────────────────────────────┘
```

- Carga las reglas disponibles para la empresa vía `GET /empresas/:empkey/reglas` (nuevo endpoint simple)
- Al guardar: `PUT /empresas/:empkey/clientes/:rut/regla` con `{ reglaIdl }`
- Tras guardar: re-fetch clientes para reflejar cambio en la tabla

### Sidebar: cambio

- Eliminar el link a `/admin/reglas` del `Sidebar`
- La ruta `/admin/reglas` sigue existiendo en el router — solo no hay link visible

### Tipos actualizados

```typescript
// Cliente ya no tiene reglanombre — solo reglaIdl
interface Cliente {
  // ...campos existentes...
  reglaIdl: string | null   // reemplaza reglaAsignada + reglanombre
}

// ReglaDisponible para el popup
interface ReglaDisponible {
  reglaIdl: string
  reglaDesc: string
}
```

### Módulos a crear/modificar

| Módulo | Acción | Descripción |
|---|---|---|
| `ReglaActivaPopup` | Crear | Dialog: muestra regla activa + selector para cambiar |
| `ClientesGrid` | Modificar | Eliminar columna Regla, reemplazar acción por ícono |
| `Sidebar` | Modificar | Eliminar link AdminReglas |
| `clientesService` | Modificar | Adaptar al nuevo shape de `Cliente` (sin `reglanombre`) |
| `reglasService` | Modificar | Agregar `fetchReglasEmpresa()` para poblar el selector del popup |
| `types/index.ts` | Modificar | `Cliente.reglaIdl`, nueva interface `ReglaDisponible` |
| `ReglasPorClienteModal` | Eliminar o conservar | Ya no se usa en el flujo principal |
| `AdminReglas` | No tocar | Solo sacar del Sidebar |

---

## Testing Decisions

**Principio:** Testear comportamiento desde la perspectiva del usuario — lo que ve y puede hacer — no los detalles internos del componente.

### Qué testear

- **`ReglaActivaPopup`**: renderiza regla activa, muestra lista de reglas disponibles, llama al servicio correcto al guardar, cierra al cancelar
- **`ClientesGrid`**: ya no renderiza columna "Regla", el ícono de acción está presente, clic en ícono abre el popup
- **`Sidebar`**: no renderiza link a AdminReglas

### Prior art

- `src/components/ReglasPorClienteModal/ReglasPorClienteModal.test.tsx` — patrón para testear modales con acciones asíncronas
- `src/components/ClientesGrid/ClientesGrid.test.tsx` — patrón para testear grid con mock de servicios

---

## Out of Scope

- UI para crear o editar reglas — solo el dev puede hacerlo via SQL seeds
- Mostrar historial de reglas anteriores del cliente
- Confirmación de advertencia al cambiar regla a mitad de mes — se permite sin restricción (mismo criterio que v2)
- Cualquier cambio a las páginas `Guias`, `Preview`, `Historial`

---

## Further Notes

- Este PRD **supercede** `prd-flexibilidad-reglas-y-ux-2026-05-26.md` en lo que respecta a `ClientesGrid` y `AdminReglas`.
- `ReglasPorClienteModal` puede quedar en el código o eliminarse — no hay riesgo en ninguna dirección.
- El nuevo popup es deliberadamente más simple que el modal anterior — menos opciones = menos riesgo de error del operador.
````

## File: docs/PRD-regla-agrupadora-v4-frontend.md
````markdown
# PRD — Regla Agrupadora v4 Frontend: Diálogo de Re-sincronización

**Estado:** Listo para implementar
**Fecha:** 2026-06-01
**Supercede:** Resuelve la decisión abierta de `prd-flexibilidad-reglas-y-ux-2026-05-26.md` ("¿puede el operador cambiar la regla activa a mitad del mes?")
**Requiere:** PRD-regla-agrupadora-v5-backend.md completado

---

## Problem Statement

Hoy el operador puede cambiar la regla de un cliente desde `ReglaActivaPopup` o `ReglasPorClienteModal`, pero:

1. No se distingue entre primera asignación y cambio de regla — el comportamiento es el mismo en ambos casos.
2. Cuando ya existe una regla y el operador quiere cambiarla, no tiene forma de elegir si las guías del mes en curso deben ser re-clasificadas con la nueva regla o si solo las guías nuevas (futuros syncs) deben usarla.
3. No existe UI para seleccionar el período a re-sincronizar.

---

## Solution

Agregar un diálogo de confirmación que aparece **únicamente al cambiar una regla ya asignada** (no en primera activación). El diálogo ofrece dos opciones al operador: re-sincronizar guías del período elegido, o dejar las guías existentes intactas y aplicar la nueva regla solo a guías futuras.

---

## User Stories

1. Como operador, quiero que al asignar la primera regla a un cliente el cambio se aplique sin ningún diálogo adicional, para no interrumpir mi flujo de trabajo.
2. Como operador, quiero que al cambiar la regla de un cliente que ya tiene una asignada aparezca un diálogo que me pregunte si deseo re-sincronizar las guías existentes.
3. Como operador, quiero que el diálogo de re-sincronización me ofrezca la opción "Re-sincronizar guías del período" con un selector de mes, para poder re-clasificar guías ya guardadas con el nuevo criterio.
4. Como operador, quiero que el selector de mes en el diálogo tenga como valor por defecto el mes que estoy viendo en la UI, para no tener que cambiarlo en el caso más común.
5. Como operador, quiero que el diálogo me ofrezca la opción "Solo guías nuevas", para preservar la clasificación de guías ya facturadas o en proceso.
6. Como operador, quiero poder cambiar el mes en el selector a un mes anterior ("backdoor"), para cubrir el caso excepcional de re-sincronización de períodos cerrados.
7. Como operador, quiero que el diálogo aparezca tanto desde `ReglaActivaPopup` como desde `ReglasPorClienteModal`, para tener el mismo comportamiento sin importar desde dónde haga el cambio.

---

## Implementation Decisions

### Detección de primera activación vs cambio de regla

El frontend detecta el caso comparando la regla actualmente asignada al cliente (`cliente.reglaIdl`) con el nuevo valor elegido:

- `cliente.reglaIdl === null` y se elige una regla → primera activación → llamar `PUT regla` con solo `{ reglaidl }`, sin diálogo.
- `cliente.reglaIdl !== null` y se elige una regla diferente → cambio → mostrar diálogo antes de hacer el PUT.

### Nuevo componente: `ResincronizarReglaDialog`

```
┌──────────────────────────────────────────────┐
│ Cambio de regla — [NombreCliente]            │
├──────────────────────────────────────────────┤
│ La regla activa cambiará de [ReglaAnterior]  │
│ a [ReglaNueva].                              │
│                                              │
│ ¿Deseas re-sincronizar guías existentes?     │
│                                              │
│ ● Re-sincronizar guías del período:          │
│   [selector mes: YYYY-MM ▼]                  │
│                                              │
│ ○ Solo guías nuevas                          │
│   (las guías existentes conservan su         │
│    clasificación anterior)                   │
│                                              │
│             [Cancelar] [Confirmar]           │
└──────────────────────────────────────────────┘
```

- El default seleccionado es "Re-sincronizar" con el mes activo de la UI.
- El selector de mes permite navegar a meses anteriores (sin límite de fecha mínima).
- Al confirmar: llama `PUT regla` con `{ reglaidl, recomputar: true, periodo }` o `{ reglaidl, recomputar: false }`.

### Firma del servicio actualizada

```typescript
// clientesService.ts
assignReglaCliente(
  rut: string,
  reglaidl: string,
  opciones?: { recomputar: boolean; periodo?: string }
): Promise<void>
// → PUT /empresas/:empkey/clientes/:rut/regla
//   body: { reglaidl, recomputar?, periodo? }
```

### Flujo completo desde `ReglaActivaPopup`

1. Operador elige nueva regla y hace clic en "Guardar".
2. Si `cliente.reglaIdl === null` → llamar servicio directo, cerrar popup, re-fetch clientes.
3. Si `cliente.reglaIdl !== null` → cerrar popup, abrir `ResincronizarReglaDialog`.
4. Operador elige opción en el diálogo y confirma.
5. Llamar servicio con parámetros, cerrar diálogo, re-fetch clientes.

### Mismo flujo desde `ReglasPorClienteModal`

Igual que el popup. El diálogo `ResincronizarReglaDialog` es compartido entre ambos puntos de entrada.

### Estado del selector de mes

El mes por defecto es el `periodo` activo en la UI (el que el operador tiene seleccionado en el filtro de mes global). Se pasa como prop al abrir el diálogo.

### Módulos a crear/modificar

| Módulo | Acción | Descripción |
|---|---|---|
| `ResincronizarReglaDialog` | Crear | Dialog con selector de mes + dos opciones |
| `ReglaActivaPopup` | Modificar | Detectar primera activación vs cambio; abrir diálogo cuando corresponde |
| `ReglasPorClienteModal` | Modificar | Ídem — mismo flujo que ReglaActivaPopup |
| `clientesService.assignReglaCliente` | Modificar | Aceptar `opciones?: { recomputar, periodo? }` |

---

## Testing Decisions

**Principio:** Testear lo que el operador ve y puede hacer. No testear si se llama `fetch` internamente.

### Módulos a testear

| Módulo | Qué testear |
|---|---|
| `ResincronizarReglaDialog` | Renderiza con reglas correctas; default "Re-sincronizar" seleccionado; selector de mes editable; confirmar llama servicio con parámetros correctos; cancelar no llama servicio |
| `ReglaActivaPopup` | Primera activación → no muestra diálogo, llama servicio directo; cambio de regla → muestra diálogo |
| `ReglasPorClienteModal` | Mismo comportamiento que `ReglaActivaPopup` ante primera activación y cambio |

### Prior art

- `src/components/ReglasPorClienteModal/ReglasPorClienteModal.test.tsx` — patrón para modales con acciones asíncronas
- `src/components/ReglaActivaPopup/ReglaActivaPopup.test.tsx` — patrón para popup de selección de regla

---

## Out of Scope

- UI para crear o editar reglas — solo el dev puede hacerlo via SQL seeds.
- Mostrar historial de reglas anteriores del cliente.
- Re-fetch desde el backoffice durante la re-sincronización — el backend solo recomputa sobre datos en DB.
- Cambios a páginas de Guias, Preview o Historial.

---

## Further Notes

- El diálogo no bloquea el cambio de regla — el operador siempre puede elegir "Solo guías nuevas" para hacer el cambio sin riesgo.
- El período por defecto del selector es el mes activo de la UI, no necesariamente el mes actual del calendario. Si el operador está viendo el mes anterior, el diálogo abre con ese mes preseleccionado.
- `ResincronizarReglaDialog` es stateless respecto al store global — recibe todo por props y comunica la decisión vía callback.
````

## File: public/mockServiceWorker.js
````javascript
/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker.
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 */

const PACKAGE_VERSION = '2.14.6'
const INTEGRITY_CHECKSUM = '4db4a41e972cec1b64cc569c66952d82'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

addEventListener('install', function () {
  self.skipWaiting()
})

addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

addEventListener('message', async function (event) {
  const clientId = Reflect.get(event.source || {}, 'id')

  if (!clientId || !self.clients) {
    return
  }

  const client = await self.clients.get(clientId)

  if (!client) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: {
          packageVersion: PACKAGE_VERSION,
          checksum: INTEGRITY_CHECKSUM,
        },
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: {
          client: {
            id: client.id,
            frameType: client.frameType,
          },
        },
      })
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

addEventListener('fetch', function (event) {
  const requestInterceptedAt = Date.now()

  // Bypass navigation requests.
  if (event.request.mode === 'navigate') {
    return
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (
    event.request.cache === 'only-if-cached' &&
    event.request.mode !== 'same-origin'
  ) {
    return
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been terminated (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return
  }

  const requestId = crypto.randomUUID()
  event.respondWith(handleRequest(event, requestId, requestInterceptedAt))
})

/**
 * @param {FetchEvent} event
 * @param {string} requestId
 * @param {number} requestInterceptedAt
 */
async function handleRequest(event, requestId, requestInterceptedAt) {
  const client = await resolveMainClient(event)
  const requestCloneForEvents = event.request.clone()
  const response = await getResponse(
    event,
    client,
    requestId,
    requestInterceptedAt,
  )

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    const serializedRequest = await serializeRequest(requestCloneForEvents)

    // Clone the response so both the client and the library could consume it.
    const responseClone = response.clone()

    sendToClient(
      client,
      {
        type: 'RESPONSE',
        payload: {
          isMockedResponse: IS_MOCKED_RESPONSE in response,
          request: {
            id: requestId,
            ...serializedRequest,
          },
          response: {
            type: responseClone.type,
            status: responseClone.status,
            statusText: responseClone.statusText,
            headers: Object.fromEntries(responseClone.headers.entries()),
            body: responseClone.body,
          },
        },
      },
      responseClone.body ? [serializedRequest.body, responseClone.body] : [],
    )
  }

  return response
}

/**
 * Resolve the main client for the given event.
 * Client that issues a request doesn't necessarily equal the client
 * that registered the worker. It's with the latter the worker should
 * communicate with during the response resolving phase.
 * @param {FetchEvent} event
 * @returns {Promise<Client | undefined>}
 */
async function resolveMainClient(event) {
  const client = await self.clients.get(event.clientId)

  if (activeClientIds.has(event.clientId)) {
    return client
  }

  if (client?.frameType === 'top-level') {
    return client
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  return allClients
    .filter((client) => {
      // Get only those clients that are currently visible.
      return client.visibilityState === 'visible'
    })
    .find((client) => {
      // Find the client ID that's recorded in the
      // set of clients that have registered the worker.
      return activeClientIds.has(client.id)
    })
}

/**
 * @param {FetchEvent} event
 * @param {Client | undefined} client
 * @param {string} requestId
 * @param {number} requestInterceptedAt
 * @returns {Promise<Response>}
 */
async function getResponse(event, client, requestId, requestInterceptedAt) {
  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = event.request.clone()

  function passthrough() {
    // Cast the request headers to a new Headers instance
    // so the headers can be manipulated with.
    const headers = new Headers(requestClone.headers)

    // Remove the "accept" header value that marked this request as passthrough.
    // This prevents request alteration and also keeps it compliant with the
    // user-defined CORS policies.
    const acceptHeader = headers.get('accept')
    if (acceptHeader) {
      const values = acceptHeader.split(',').map((value) => value.trim())
      const filteredValues = values.filter(
        (value) => value !== 'msw/passthrough',
      )

      if (filteredValues.length > 0) {
        headers.set('accept', filteredValues.join(', '))
      } else {
        headers.delete('accept')
      }
    }

    return fetch(requestClone, { headers })
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough()
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(client.id)) {
    return passthrough()
  }

  // Notify the client that a request has been intercepted.
  const serializedRequest = await serializeRequest(event.request)
  const clientMessage = await sendToClient(
    client,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        interceptedAt: requestInterceptedAt,
        ...serializedRequest,
      },
    },
    [serializedRequest.body],
  )

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE': {
      return respondWithMock(clientMessage.data)
    }

    case 'PASSTHROUGH': {
      return passthrough()
    }
  }

  return passthrough()
}

/**
 * @param {Client} client
 * @param {any} message
 * @param {Array<Transferable>} transferrables
 * @returns {Promise<any>}
 */
function sendToClient(client, message, transferrables = []) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(message, [
      channel.port2,
      ...transferrables.filter(Boolean),
    ])
  })
}

/**
 * @param {Response} response
 * @returns {Response}
 */
function respondWithMock(response) {
  // Setting response status code to 0 is a no-op.
  // However, when responding with a "Response.error()", the produced Response
  // instance will have status code set to 0. Since it's not possible to create
  // a Response instance with status code 0, handle that use-case separately.
  if (response.status === 0) {
    return Response.error()
  }

  const mockedResponse = new Response(response.body, response)

  Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, {
    value: true,
    enumerable: true,
  })

  return mockedResponse
}

/**
 * @param {Request} request
 */
async function serializeRequest(request) {
  return {
    url: request.url,
    mode: request.mode,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    cache: request.cache,
    credentials: request.credentials,
    destination: request.destination,
    integrity: request.integrity,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    body: await request.arrayBuffer(),
    keepalive: request.keepalive,
  }
}
````

## File: src/components/AppLayout/AppLayout.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { usePeriodoStore } from '@/store/periodoStore'
import type { MetricasResumen } from '@/types'

vi.mock('@/services/api', () => ({
  fetchMetricas: vi.fn().mockResolvedValue({
    totalGuias: 38,
    clientesActivos: 9,
    factEst: 9,
    montoEstimado: 15000000,
    clientesConRezagadas: 0,
    tendenciaGuias: 0,
    tendenciaFactEst: 0,
    tendenciaClientes: 0,
  } satisfies MetricasResumen),
}))

function renderWithRouter(initialPath = '/clientes') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/clientes" element={<div>Clientes page</div>} />
          <Route path="/guias" element={<div>Guías page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AppLayout', () => {
  beforeEach(() => {
    usePeriodoStore.setState({ periodo: 'actual' })
  })

  it('renders sidebar with brand name', () => {
    renderWithRouter()
    expect(screen.getByText('GDE Sistema')).toBeInTheDocument()
  })

  it('renders sidebar subtitle', () => {
    renderWithRouter()
    expect(screen.getByText(/gestión de guías/i)).toBeInTheDocument()
  })

  it('shows Clientes nav link', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /clientes/i })).toBeInTheDocument()
  })

  it('shows Guías nav link', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /guías/i })).toBeInTheDocument()
  })

  it('marks Clientes link as active when on /clientes', () => {
    renderWithRouter('/clientes')
    const link = screen.getByRole('link', { name: /clientes/i })
    expect(link.className).toMatch(/bg-primary/)
  })

  it('renders the outlet (child page content)', () => {
    renderWithRouter('/clientes')
    expect(screen.getByText('Clientes page')).toBeInTheDocument()
  })

  it('renders header with Facturar Global button', () => {
    renderWithRouter()
    expect(screen.getByRole('button', { name: /facturar global/i })).toBeInTheDocument()
  })

  it('renders header metric pills', () => {
    renderWithRouter()
    expect(screen.getByTestId('header-metric-guias')).toBeInTheDocument()
    expect(screen.getByTestId('header-metric-facturas')).toBeInTheDocument()
    expect(screen.getByTestId('header-metric-clientes')).toBeInTheDocument()
  })
})
````

## File: src/components/AppLayout/AppLayout.tsx
````typescript
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FileText, Receipt, Users, AlertTriangle } from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar'
import { usePeriodoStore } from '@/store/periodoStore'
import { fetchMetricas } from '@/services/api'
import type { MetricasResumen } from '@/types'

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/clientes':     { title: 'Clientes',              sub: 'Todos los clientes' },
  '/guias':        { title: 'Guías de Despacho',      sub: 'Vista por agrupador' },
  '/preview':      { title: 'Previsualización',       sub: 'Revisión antes de emitir al SII' },
  '/historial':    { title: 'Historial',              sub: 'Auditoría post-emisión' },
  '/admin/reglas': { title: 'Reglas de Agrupación',  sub: 'Configuración del campo agrupador' },
}

const clpFmt = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const PERIODO_LABEL: Record<string, string> = {
  actual:   'Mes Actual',
  anterior: 'Mes Anterior',
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const periodo = usePeriodoStore((s) => s.periodo)
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false)
  const [metricas, setMetricas] = useState<MetricasResumen | null>(null)

  useEffect(() => {
    fetchMetricas().then(setMetricas).catch(() => {})
  }, [periodo])

  const page      = PAGE_META[location.pathname] ?? { title: '', sub: '' }
  const montoNeto = metricas?.montoEstimado ?? 0
  const iva       = Math.round(montoNeto * 0.19)

  const metricPills = [
    { testId: 'header-metric-guias',    label: 'Guías',    value: metricas?.totalGuias      ?? '–', icon: <FileText className="w-4 h-4" /> },
    { testId: 'header-metric-facturas', label: 'Facturar', value: metricas?.factEst         ?? '–', icon: <Receipt  className="w-4 h-4" /> },
    { testId: 'header-metric-clientes', label: 'Clientes', value: metricas?.clientesActivos ?? '–', icon: <Users    className="w-4 h-4" /> },
  ]

  const globalSummary = [
    { label: 'Clientes a facturar', value: metricas ? String(metricas.clientesActivos)      : '–' },
    { label: 'Guías de despacho',   value: metricas ? String(metricas.totalGuias)            : '–' },
    { label: 'Monto Neto',          value: metricas ? clpFmt.format(montoNeto)               : '–' },
    { label: 'IVA (19%)',           value: metricas ? clpFmt.format(iva)                     : '–' },
    { label: 'Total con IVA',       value: metricas ? clpFmt.format(montoNeto + iva)         : '–', highlight: true },
  ]

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header
          className="border-b px-6 flex items-center gap-4 shrink-0"
          style={{
            height: '64px',
            backgroundColor: 'var(--topbar-bg)',
            borderColor: 'var(--topbar-border)',
          }}
        >
          {/* Page title */}
          <div className="flex-1 min-w-0">
            <div
              className="font-display font-bold text-[18px] leading-tight truncate"
              style={{ color: 'var(--topbar-pill-text)' }}
            >
              {page.title}
            </div>
            {page.sub && (
              <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--topbar-pill-text)', opacity: 0.55 }}>
                {page.sub}
              </p>
            )}
          </div>

          {/* KPI chips */}
          <div className="flex items-center gap-1.5">
            {metricPills.map((pill) => (
              <span
                key={pill.testId}
                data-testid={pill.testId}
                className="flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'var(--topbar-pill-bg)',
                  borderColor: 'var(--topbar-pill-border)',
                  color: 'var(--topbar-pill-text)',
                }}
              >
                <span style={{ color: 'var(--topbar-icon-color)' }}>{pill.icon}</span>
                <span className="font-medium">{pill.label}</span>
                <span className="font-bold" style={{ color: 'var(--topbar-icon-color)' }}>{pill.value}</span>
              </span>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Facturar Global */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--topbar-btn-bg)' }}
              onClick={() => setGlobalDialogOpen(true)}
            >
              <Receipt className="w-4 h-4" />
              Facturar Global
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Confirm Modal */}
      {globalDialogOpen && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setGlobalDialogOpen(false) }}
        >
          <div className="bg-card rounded-xl shadow-2xl border border-border w-[520px] max-w-[92vw] p-7">
            {/* Title */}
            <h2 className="font-display text-[17px] font-bold text-foreground mb-1">
              Facturar Global · {PERIODO_LABEL[periodo] ?? periodo}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Se procesarán todas las guías pendientes del período.
            </p>

            {/* Warning box */}
            <div
              className="flex gap-3 items-start rounded-lg p-3.5 mb-5 bg-warning-50 border border-warning-100"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning-600" />
              <p className="text-sm leading-relaxed text-warning-600">
                Esta acción emitirá facturas para <strong>todos los clientes</strong> con guías
                pendientes. El proceso <strong>no puede revertirse</strong> una vez enviado al SII.
              </p>
            </div>

            {/* Summary rows */}
            <div className="border border-border rounded-lg overflow-hidden mb-5">
              {globalSummary.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-3"
                  style={{
                    borderBottom: i < globalSummary.length - 1 ? '1px solid var(--border)' : 'none',
                    backgroundColor: row.highlight ? 'var(--secondary)' : undefined,
                    fontWeight: row.highlight ? 700 : undefined,
                  }}
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span
                    className="font-mono font-semibold"
                    style={{
                      color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                      fontSize: row.highlight ? '14px' : undefined,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setGlobalDialogOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setGlobalDialogOpen(false); navigate('/preview') }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Receipt className="w-4 h-4" />
                Confirmar emisión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
````

## File: src/components/ClientesGrid/ClientesGrid.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientesGrid } from './ClientesGrid'
import { mockClientes } from '@/test/mocks/fixtures'

describe('ClientesGrid', () => {
  const defaultProps = {
    clientes: mockClientes,
    loading: false,
    hasQuery: false,
    onVerGuias: vi.fn(),
    onFacturar: vi.fn(),
    onGestionarRegla: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onVerGuias = vi.fn()
    defaultProps.onFacturar = vi.fn()
    defaultProps.onGestionarRegla = vi.fn()
  })

  it('muestra skeleton cuando loading=true', () => {
    render(<ClientesGrid {...defaultProps} loading={true} />)
    expect(screen.getByTestId('clientes-grid-skeleton')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('no muestra datos de clientes cuando loading', () => {
    render(<ClientesGrid {...defaultProps} loading={true} />)
    expect(screen.queryByText('Constructora Aconcagua S.A.')).not.toBeInTheDocument()
  })

  it('muestra mensaje vacío cuando clientes=[] y loading=false', () => {
    render(<ClientesGrid {...defaultProps} clientes={[]} />)
    expect(screen.getByText('No hay clientes para este período.')).toBeInTheDocument()
  })

  it('renderiza todos los clientes con nombre y RUT', () => {
    render(<ClientesGrid {...defaultProps} />)
    expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument()
    expect(screen.getByText('76.543.210-K')).toBeInTheDocument()
    expect(screen.getByText('Minera del Norte Ltda.')).toBeInTheDocument()
  })

  it('muestra guíasPendientes correctamente', () => {
    render(<ClientesGrid {...defaultProps} />)
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('14')
  })

  it('formatea monto neto en CLP', () => {
    render(<ClientesGrid {...defaultProps} />)
    const rows = screen.getAllByRole('row')
    expect(rows[1].textContent).toMatch(/10[.,]450[.,]000/)
  })

  it('llama onVerGuias con id al click en Ver Guías', async () => {
    const user = userEvent.setup()
    render(<ClientesGrid {...defaultProps} />)
    await user.click(screen.getAllByText('Ver Guías')[0])
    expect(defaultProps.onVerGuias).toHaveBeenCalledWith('c1')
  })

  it('llama onFacturar con id al click en Facturar', async () => {
    const user = userEvent.setup()
    render(<ClientesGrid {...defaultProps} />)
    await user.click(screen.getAllByText('Facturar')[0])
    expect(defaultProps.onFacturar).toHaveBeenCalledWith('c1')
  })

  it('no renderiza botones de acción cuando loading', () => {
    render(<ClientesGrid {...defaultProps} loading={true} />)
    expect(screen.queryByText('Ver Guías')).not.toBeInTheDocument()
    expect(screen.queryByText('Facturar')).not.toBeInTheDocument()
  })

  // ── Regla por cliente (v3) ─────────────────────────────────────────────────

  it('no renderiza columna "Regla" en el header', () => {
    render(<ClientesGrid {...defaultProps} />)
    expect(screen.queryByRole('columnheader', { name: /regla/i })).not.toBeInTheDocument()
  })

  it('no renderiza badge de regla ni botón Sin regla', () => {
    render(<ClientesGrid {...defaultProps} />)
    expect(screen.queryByTestId('regla-badge-76.543.210-K')).not.toBeInTheDocument()
    expect(screen.queryByTestId('regla-sin-regla-96.123.456-2')).not.toBeInTheDocument()
  })

  it('renderiza ícono de gestión de regla por cada cliente', () => {
    render(<ClientesGrid {...defaultProps} />)
    const iconBtns = screen.getAllByTestId(/gestionar-regla-/)
    expect(iconBtns.length).toBe(mockClientes.length)
  })

  it('click en ícono de regla llama onGestionarRegla con rut del cliente', async () => {
    const user = userEvent.setup()
    render(<ClientesGrid {...defaultProps} />)
    await user.click(screen.getByTestId('gestionar-regla-76.543.210-K'))
    expect(defaultProps.onGestionarRegla).toHaveBeenCalledWith('76.543.210-K')
  })
})
````

## File: src/components/ClientesGrid/ClientesGrid.tsx
````typescript
import { Settings2 } from 'lucide-react'
import type { Cliente } from '@/types'
import { Button } from '@/components/ui/button'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

interface ClientesGridProps {
  clientes: Cliente[]
  loading: boolean
  hasQuery: boolean
  onVerGuias: (id: string) => void
  onFacturar: (id: string) => void
  onGestionarRegla: (rut: string) => void
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-muted rounded w-48 mb-2" />
        <div className="h-3 bg-muted rounded w-28" />
      </td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
    </tr>
  )
}

export function ClientesGrid({
  clientes,
  loading,
  hasQuery,
  onVerGuias,
  onFacturar,
  onGestionarRegla,
}: ClientesGridProps) {
  if (loading) {
    return (
      <div role="status" data-testid="clientes-grid-skeleton">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente / RUT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guías Pend.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Factura Estimada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Monto Neto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <SkeletonRow /><SkeletonRow /><SkeletonRow />
          </tbody>
        </table>
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {hasQuery ? 'Ningún cliente coincide con la búsqueda.' : 'No hay clientes para este período.'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente / RUT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guías Pend.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fact. Est.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Monto Neto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-accent transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-foreground">{c.nombre}</div>
                <div className="text-xs text-muted-foreground">{c.rut}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{c.guiasPendientes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{c.factEst}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{clpFormatter.format(c.montoNeto)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onVerGuias(c.id)}>
                    Ver Guías
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary bg-primary/5 hover:bg-primary/15"
                    onClick={() => onFacturar(c.id)}
                  >
                    Facturar
                  </Button>
                  <button
                    data-testid={`gestionar-regla-${c.rut}`}
                    aria-label="Gestionar regla"
                    onClick={() => onGestionarRegla(c.rut)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
````

## File: src/components/ClientesGrid/index.ts
````typescript
export { ClientesGrid } from './ClientesGrid'
````

## File: src/components/ConfirmDialog/ConfirmDialog.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'
import { useSeleccionStore } from '@/store/seleccionStore'
import { mockGuias } from '@/test/mocks/fixtures'

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    titulo: 'Confirmar facturación',
    mensaje: 'Se facturarán 5 guías seleccionadas.',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onConfirm = vi.fn()
    defaultProps.onCancel = vi.fn()
    useSeleccionStore.setState({ seleccionActiva: [] })
  })

  it('renders null when open=false', () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} open={false} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders dialog when open=true', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
  })

  it('shows titulo and mensaje', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByTestId('confirm-dialog-titulo')).toHaveTextContent(
      'Confirmar facturación',
    )
    expect(screen.getByTestId('confirm-dialog-mensaje')).toHaveTextContent(
      'Se facturarán 5 guías seleccionadas.',
    )
  })

  it('calls onConfirm when "Confirmar" clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    await user.click(screen.getByTestId('btn-confirmar'))
    expect(defaultProps.onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when "Cancelar" clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)
    await user.click(screen.getByTestId('btn-cancelar'))
    expect(defaultProps.onCancel).toHaveBeenCalledOnce()
  })

  it('does NOT call limpiar() when "Confirmar" clicked', async () => {
    const user = userEvent.setup()
    useSeleccionStore.getState().agregar(mockGuias[0])
    expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)

    render(<ConfirmDialog {...defaultProps} />)
    await user.click(screen.getByTestId('btn-confirmar'))

    expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
  })
})
````

## File: src/components/ConfirmDialog/ConfirmDialog.tsx
````typescript
import { AlertTriangle } from 'lucide-react'

export interface SummaryRow {
  label: string
  value: string
  highlight?: boolean
}

interface ConfirmDialogProps {
  open: boolean
  titulo: string
  /** @deprecated use subtitulo */
  mensaje?: string
  subtitulo?: string
  warning?: string
  summary?: SummaryRow[]
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  titulo,
  mensaje,
  subtitulo,
  warning,
  summary,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const displaySub = subtitulo ?? mensaje
  if (!open) return null

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div
      data-testid="confirm-dialog"
      className="fixed inset-0 z-[800] flex items-center justify-center transition-opacity"
      style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel() }}
    >
      <div
        className="bg-card rounded-xl shadow-2xl border border-border w-[520px] max-w-[92vw] p-7"
        style={{ transform: 'scale(1)' }}
      >
        {/* Title */}
        <h2
          data-testid="confirm-dialog-titulo"
          className="text-[17px] font-bold text-foreground mb-1"
        >
          {titulo}
        </h2>
        {displaySub && (
          <p
            data-testid="confirm-dialog-mensaje"
            className="text-sm text-muted-foreground mb-4"
          >
            {displaySub}
          </p>
        )}

        {/* Warning box */}
        {warning && (
          <div className="flex gap-3 items-start rounded-lg p-3.5 mb-5 bg-warning-50 border border-warning-100"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning-600" />
            <p className="text-sm leading-relaxed text-warning-600"
              dangerouslySetInnerHTML={{ __html: warning }}
            />
          </div>
        )}

        {/* Summary rows */}
        {summary && summary.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden mb-5">
            {summary.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-3"
                style={{
                  borderBottom: i < summary.length - 1 ? '1px solid var(--border)' : 'none',
                  backgroundColor: row.highlight ? 'var(--secondary)' : undefined,
                  fontWeight: row.highlight ? 700 : undefined,
                }}
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span
                  className="font-mono font-semibold"
                  style={{
                    color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                    fontSize: row.highlight ? '14px' : undefined,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 justify-end">
          <button
            data-testid="btn-cancelar"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Cancelar
          </button>
          <button
            data-testid="btn-confirmar"
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
````

## File: src/components/ConfirmDialog/index.ts
````typescript
export { ConfirmDialog } from './ConfirmDialog'
export type { SummaryRow } from './ConfirmDialog'
````

## File: src/components/DateFilter/DateFilter.tsx
````typescript
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarX2 } from 'lucide-react'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToRange } from '@/utils/periodo'

export interface DateRange {
  from: string | null
  to: string | null
}

export interface DateFilterProps {
  onChange: (range: DateRange) => void
}

// ─── component ────────────────────────────────────────────────────────────────

export function DateFilter({ onChange }: DateFilterProps) {
  const periodo = usePeriodoStore((s) => s.periodo)
  const setPeriodo = usePeriodoStore((s) => s.setPeriodo)

  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [isCustomRange, setIsCustomRange] = useState(false)

  const { from: boundsMin, to: boundsMax, label: boundsLabel } = periodoToRange(periodo)

  // Reset when period changes
  useEffect(() => {
    setFromInput('')
    setToInput('')
    setIsCustomRange(false)
  }, [periodo])

  // Fire onChange whenever range state changes
  useEffect(() => {
    if (!isCustomRange) {
      onChange({ from: boundsMin, to: boundsMax })
    } else {
      onChange({
        from: fromInput || null,
        to: toInput || null,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromInput, toInput, isCustomRange, boundsMin, boundsMax])

  function togglePeriodo() {
    setPeriodo(periodo === 'actual' ? 'anterior' : 'actual')
  }

  function handleFromChange(val: string) {
    setFromInput(val)
    setIsCustomRange(true)
  }

  function handleToChange(val: string) {
    setToInput(val)
    setIsCustomRange(true)
  }

  function resetRange() {
    setFromInput('')
    setToInput('')
    setIsCustomRange(false)
  }

  return (
    <div
      data-testid="date-filter"
      className="flex items-center gap-3 flex-wrap bg-card border border-border rounded-xl px-4 py-3"
    >
      {/* ── Period navigation ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        {/* Tab: Mes Anterior */}
        <button
          type="button"
          data-testid="tab-anterior"
          onClick={() => setPeriodo('anterior')}
          className={[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            periodo === 'anterior'
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          ].join(' ')}
        >
          Mes Anterior
        </button>

        {/* Tab: Mes Actual */}
        <button
          type="button"
          data-testid="tab-actual"
          onClick={() => setPeriodo('actual')}
          className={[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            periodo === 'actual'
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          ].join(' ')}
        >
          Mes Actual
        </button>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border" />

      {/* ── Arrow + month label ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          data-testid="periodo-prev"
          onClick={togglePeriodo}
          aria-label="Período anterior"
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          data-testid="periodo-label"
          className="font-mono text-sm font-semibold text-foreground min-w-[108px] text-center select-none"
        >
          {boundsLabel}
        </span>

        <button
          type="button"
          data-testid="periodo-next"
          onClick={togglePeriodo}
          aria-label="Período siguiente"
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border" />

      {/* ── Date range picker ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">
          Desde
        </label>
        <input
          data-testid="date-from"
          type="date"
          value={fromInput}
          min={boundsMin}
          max={toInput || boundsMax}
          onChange={(e) => handleFromChange(e.target.value)}
          className="border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <label className="text-xs font-medium text-muted-foreground">
          Hasta
        </label>
        <input
          data-testid="date-to"
          type="date"
          value={toInput}
          min={fromInput || boundsMin}
          max={boundsMax}
          onChange={(e) => handleToChange(e.target.value)}
          className="border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* ── "Todo el mes" reset button (only when custom range active) ── */}
      {isCustomRange && (
        <button
          type="button"
          data-testid="todo-el-mes"
          onClick={resetRange}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <CalendarX2 className="w-3.5 h-3.5" />
          Todo el mes
        </button>
      )}
    </div>
  )
}
````

## File: src/components/DateFilter/index.ts
````typescript
export { DateFilter } from './DateFilter'
export type { DateRange, DateFilterProps } from './DateFilter'
````

## File: src/components/ErrorBanner/ErrorBanner.tsx
````typescript
interface ErrorBannerProps {
  error: Error | null
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {error.message}
    </div>
  )
}
````

## File: src/components/ErrorBoundary/ErrorBoundary.tsx
````typescript
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" className="p-8 text-center">
          <p className="font-semibold text-destructive">Error inesperado</p>
          <p className="text-sm text-muted-foreground mt-1">{this.state.error?.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
````

## File: src/components/GuiasGrid/GuiasGrid.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuiasGrid } from './GuiasGrid'
import { mockGuias } from '@/test/mocks/fixtures'

// Mock @tanstack/react-virtual so all items render in jsdom (no real scroll container dimensions)
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count, estimateSize }: { count: number; estimateSize: (i: number) => number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        key: i,
        start: 0,
        end: estimateSize(i),
        size: estimateSize(i),
        lane: 0,
      })),
    getTotalSize: () => 0,
  }),
}))

describe('GuiasGrid', () => {
  // Only May guías — avoids mixing months in agregarLote validation
  const mayoGuias = mockGuias.filter((g) => g.fecha.startsWith('2026-05'))

  const defaultProps = {
    guias: mayoGuias,
    loading: false,
    onFacturarAgrupador: vi.fn(),
    selectedIds: new Set<string>(),
    onSeleccionChange: vi.fn(),
  }

  beforeEach(() => {
    defaultProps.onFacturarAgrupador = vi.fn()
    defaultProps.onSeleccionChange = vi.fn()
    defaultProps.selectedIds = new Set<string>()
  })

  it('shows skeleton when loading=true', () => {
    render(<GuiasGrid {...defaultProps} loading={true} />)
    expect(screen.getByTestId('guias-grid-skeleton')).toBeInTheDocument()
  })

  it('shows empty state when guias=[]', () => {
    render(<GuiasGrid {...defaultProps} guias={[]} />)
    expect(screen.getByTestId('guias-grid-empty')).toBeInTheDocument()
    expect(
      screen.getByText('No hay guías para los filtros seleccionados.'),
    ).toBeInTheDocument()
  })

  it('renders guía rows from props', () => {
    render(<GuiasGrid {...defaultProps} />)
    expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
    expect(screen.getByTestId('guia-row-g2')).toBeInTheDocument()
    expect(screen.getByTestId('guia-row-g3')).toBeInTheDocument()
    expect(screen.getByTestId('guia-row-g4')).toBeInTheDocument()
  })

  it('rows have background color style', () => {
    render(<GuiasGrid {...defaultProps} />)
    const row = screen.getByTestId('guia-row-g1')
    expect(row.getAttribute('style')).toContain('background-color')
  })

  it('checkbox is unchecked initially', () => {
    render(<GuiasGrid {...defaultProps} />)
    const checkbox = screen.getByTestId('checkbox-g1') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('clicking unchecked checkbox calls onSeleccionChange(guia, true)', async () => {
    const user = userEvent.setup()
    render(<GuiasGrid {...defaultProps} />)
    await user.click(screen.getByTestId('checkbox-g1'))
    expect(defaultProps.onSeleccionChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'g1' }),
      true,
    )
  })

  it('clicking checked checkbox calls onSeleccionChange(guia, false)', async () => {
    const user = userEvent.setup()
    render(<GuiasGrid {...defaultProps} selectedIds={new Set(['g1'])} />)
    const checkbox = screen.getByTestId('checkbox-g1') as HTMLInputElement
    expect(checkbox.checked).toBe(true)

    await user.click(checkbox)
    expect(defaultProps.onSeleccionChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'g1' }),
      false,
    )
  })

  it('"Facturar Agrupador" button calls onFacturarAgrupador with group guías', async () => {
    const user = userEvent.setup()
    render(<GuiasGrid {...defaultProps} />)
    await user.click(screen.getByTestId('btn-facturar-agrupador-a1'))

    expect(defaultProps.onFacturarAgrupador).toHaveBeenCalledWith(
      'a1',
      expect.arrayContaining([
        expect.objectContaining({ id: 'g1' }),
        expect.objectContaining({ id: 'g2' }),
      ]),
    )
  })

  it('group header shows agrupadorCodigo', () => {
    render(<GuiasGrid {...defaultProps} />)
    const oc0001Elements = screen.getAllByText('OC 0001')
    expect(oc0001Elements.length).toBeGreaterThanOrEqual(1)
    const oc0002Elements = screen.getAllByText('OC 0002')
    expect(oc0002Elements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders virtual scroll container when guias are present', () => {
    render(<GuiasGrid {...defaultProps} />)
    expect(screen.getByTestId('guias-grid-virtual')).toBeInTheDocument()
  })

  it('shows reglaIdl badge in group header when the group has one', () => {
    const guiasConRegla = mayoGuias.map((g) =>
      g.agrupadorId === 'a1' ? { ...g, reglaIdl: '977_campo_receptor_CmnaRecep' } : g,
    )
    render(<GuiasGrid {...defaultProps} guias={guiasConRegla} />)
    const badge = screen.getByTestId('regla-badge-a1')
    expect(badge).toHaveTextContent('977_campo_receptor_CmnaRecep')
  })

  it('does not show reglaIdl badge when the group has no regla', () => {
    render(<GuiasGrid {...defaultProps} />)
    expect(screen.queryByTestId('regla-badge-a1')).not.toBeInTheDocument()
  })
})
````

## File: src/components/GuiasGrid/GuiasGrid.tsx
````typescript
import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Guia } from '@/types'
import { Button } from '@/components/ui/button'
import { getChipTextColor } from '@/utils/agrupadorColors'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

interface GuiasGridProps {
  guias: Guia[]
  loading: boolean
  onFacturarAgrupador: (agrupadorId: string, guias: Guia[]) => void
  selectedIds: Set<string>
  onSeleccionChange: (guia: Guia, checked: boolean) => void
}

interface GuiaGroup {
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  reglaIdl: string | null
  guias: Guia[]
  totalMonto: number
}

type FlatItem =
  | { kind: 'header'; group: GuiaGroup }
  | { kind: 'row'; guia: Guia; group: GuiaGroup; globalIndex: number }

function groupByAgrupador(guias: Guia[]): GuiaGroup[] {
  const map = new Map<string, GuiaGroup>()
  for (const guia of guias) {
    const existing = map.get(guia.agrupadorId)
    if (existing) {
      existing.guias.push(guia)
      existing.totalMonto += guia.montoNeto
    } else {
      map.set(guia.agrupadorId, {
        agrupadorId: guia.agrupadorId,
        agrupadorCodigo: guia.agrupadorCodigo,
        agrupadorColor: guia.agrupadorColor,
        reglaIdl: guia.reglaIdl,
        guias: [guia],
        totalMonto: guia.montoNeto,
      })
    }
  }
  return Array.from(map.values())
}

function flattenGroups(groups: GuiaGroup[]): FlatItem[] {
  const items: FlatItem[] = []
  let globalIndex = 0
  for (const group of groups) {
    items.push({ kind: 'header', group })
    for (const guia of group.guias) {
      items.push({ kind: 'row', guia, group, globalIndex })
      globalIndex++
    }
  }
  return items
}

const COLUMN_COUNT = 8
const ROW_HEIGHT_HEADER = 46
const ROW_HEIGHT_DATA = 48

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-4" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-6" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-16" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-28" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-20" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-40" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-10" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
    </tr>
  )
}

interface GroupHeaderRowProps {
  group: GuiaGroup
  onFacturarAgrupador: () => void
}

function GroupHeaderRow({ group, onFacturarAgrupador }: GroupHeaderRowProps) {
  const color = group.agrupadorColor
  const chipText = getChipTextColor(color)
  return (
    <tr style={{ backgroundColor: color + '22', borderTop: `2px solid ${color}44` }}>
      <td colSpan={COLUMN_COUNT} className="px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide"
              style={{
                backgroundColor: color,
                color: chipText,
                boxShadow: `0 0 0 2px ${color}55`,
              }}
            >
              {group.agrupadorCodigo}
            </span>
            {group.reglaIdl && (
              <span
                data-testid={`regla-badge-${group.agrupadorId}`}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground border border-border"
                title="Regla de agrupación"
              >
                {group.reglaIdl}
              </span>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {group.guias.length} {group.guias.length === 1 ? 'guía' : 'guías'}
              {' · '}
              <span className="font-semibold text-foreground">{clpFormatter.format(group.totalMonto)}</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid={`btn-facturar-agrupador-${group.agrupadorId}`}
            onClick={onFacturarAgrupador}
            style={{
              borderColor: color,
              color: color,
              backgroundColor: color + '12',
            }}
            className="text-xs h-7 px-3 hover:opacity-80 font-semibold"
          >
            Facturar este agrupador
          </Button>
        </div>
      </td>
    </tr>
  )
}

interface GuiaRowProps {
  guia: Guia
  group: GuiaGroup
  globalIndex: number
  isSelected: boolean
  onCheckbox: (guia: Guia) => void
}

function GuiaRow({ guia, group, globalIndex, isSelected, onCheckbox }: GuiaRowProps) {
  const color = group.agrupadorColor
  return (
    <tr
      data-testid={`guia-row-${guia.id}`}
      className="hover:brightness-95 transition-all border-l-[3px]"
      style={{
        borderLeftColor: color,
        backgroundColor: isSelected ? color + '22' : color + '0d',
      }}
    >
      <td className="px-4 py-3 pl-6">
        <input
          data-testid={`checkbox-${guia.id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckbox(guia)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap tabular-nums">
        {globalIndex + 1}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-foreground font-mono">
        {guia.numero}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {guia.clienteNombre}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
        {guia.fecha}
      </td>
      <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
        {guia.descripcion}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground text-right tabular-nums">
        {guia.cantidad}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-foreground text-right font-mono">
        {clpFormatter.format(guia.montoNeto)}
      </td>
    </tr>
  )
}

export function GuiasGrid({ guias, loading, onFacturarAgrupador, selectedIds, onSeleccionChange }: GuiasGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const handleCheckbox = (guia: Guia) => {
    onSeleccionChange(guia, !selectedIds.has(guia.id))
  }

  const handleFacturarAgrupador = (group: GuiaGroup) => {
    onFacturarAgrupador(group.agrupadorId, group.guias)
  }

  const groups = loading ? [] : groupByAgrupador(guias)
  const flatItems = loading ? [] : flattenGroups(groups)

  const rowVirtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => flatItems[i]?.kind === 'header' ? ROW_HEIGHT_HEADER : ROW_HEIGHT_DATA,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0)

  const tableHead = (
    <thead className="sticky top-0 z-10">
      <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
        <th className="px-4 py-3 w-10" />
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-10">#</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">N° Guía</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
        <th className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Descripción</th>
        <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bultos</th>
        <th className="px-4 py-3 text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Monto Neto</th>
      </tr>
    </thead>
  )

  if (loading) {
    return (
      <div role="status" data-testid="guias-grid-skeleton">
        <table className="min-w-full divide-y divide-border">
          {tableHead}
          <tbody className="bg-card divide-y divide-border">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    )
  }

  if (guias.length === 0) {
    return (
      <div data-testid="guias-grid-empty" className="text-center py-12 text-muted-foreground">
        No hay guías para los filtros seleccionados.
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      data-testid="guias-grid-virtual"
      className="overflow-auto"
      style={{ height: '600px' }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          {tableHead}
          <tbody className="bg-card divide-y divide-border">
            {paddingTop > 0 && (
              <tr><td style={{ height: paddingTop }} /></tr>
            )}
            {virtualItems.map((vr) => {
              const item = flatItems[vr.index]
              if (!item) return null
              if (item.kind === 'header') {
                return (
                  <GroupHeaderRow
                    key={vr.key}
                    group={item.group}
                    onFacturarAgrupador={() => handleFacturarAgrupador(item.group)}
                  />
                )
              }
              return (
                <GuiaRow
                  key={vr.key}
                  guia={item.guia}
                  group={item.group}
                  globalIndex={item.globalIndex}
                  isSelected={selectedIds.has(item.guia.id)}
                  onCheckbox={handleCheckbox}
                />
              )
            })}
            {paddingBottom > 0 && (
              <tr><td style={{ height: paddingBottom }} /></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
````

## File: src/components/GuiasGrid/index.ts
````typescript
export { GuiasGrid } from './GuiasGrid'
````

## File: src/components/MetricCard/index.ts
````typescript
export { MetricCard } from './MetricCard'
````

## File: src/components/MetricCard/MetricCard.tsx
````typescript
import type { ReactNode } from 'react'

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subtitle: string
  accentColor?: string
  testId?: string
}

export function MetricCard({
  icon,
  label,
  value,
  subtitle,
  accentColor = 'var(--primary)',
  testId,
}: MetricCardProps) {
  return (
    <div
      data-testid={testId}
      className="bg-card border border-border rounded-xl p-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accentColor }} />
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-medium text-foreground font-mono leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
    </div>
  )
}
````

## File: src/components/MetricsPanel/index.ts
````typescript
export { MetricsPanel } from './MetricsPanel'
````

## File: src/components/MetricsPanel/MetricsPanel.test.tsx
````typescript
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MetricsPanel } from './MetricsPanel'

vi.mock('@/services/api', () => ({
  fetchMetricas: vi.fn(),
}))

const mockData = {
  totalGuias: 98,
  clientesActivos: 6,
  factEst: 14,
  montoEstimado: 76000000,
  clientesConRezagadas: 4,
  tendenciaGuias: 12,
  tendenciaFactEst: 8,
  tendenciaClientes: 1,
}

describe('MetricsPanel', () => {
  beforeEach(async () => {
    const { fetchMetricas } = await import('@/services/api')
    vi.mocked(fetchMetricas).mockResolvedValue(mockData)
  })

  describe('estado de carga', () => {
    it('muestra un indicador de carga mientras fetch está en progreso', () => {
      render(<MetricsPanel />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('datos cargados', () => {
    it('muestra el valor totalGuias (98)', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('98')).toBeInTheDocument()
      })
    })

    it('muestra el valor clientesActivos (6)', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument()
      })
    })

    it('muestra el monto estimado formateado ($76,0M)', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('$76,0M')).toBeInTheDocument()
      })
    })

    it('muestra la etiqueta "Total guías pendientes"', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('Total guías pendientes')).toBeInTheDocument()
      })
    })

    it('muestra la etiqueta "Clientes involucrados"', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('Clientes involucrados')).toBeInTheDocument()
      })
    })

    it('muestra la etiqueta "Estimación a facturar"', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('Estimación a facturar')).toBeInTheDocument()
      })
    })

    it('muestra subtítulo con clientes con rezagadas', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('4 con rezagadas del mes anterior')).toBeInTheDocument()
      })
    })

    it('muestra subtítulo con facturas proyectadas', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('~14 facturas proyectadas')).toBeInTheDocument()
      })
    })
  })
})
````

## File: src/components/MetricsPanel/MetricsPanel.tsx
````typescript
import { useEffect, useState, type ReactNode } from 'react'
import { FileText, Users, Receipt } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MetricCard } from '@/components/MetricCard'
import { fetchMetricas } from '@/services/api'
import { usePeriodoStore } from '@/store/periodoStore'
import type { MetricasResumen } from '@/types'

interface MetricCardData {
  label: string
  value: string | number
  subtitle: string
  icon: ReactNode
}

function fmtMonto(n: number): string {
  return '$' + (n / 1_000_000).toFixed(1).replace('.', ',') + 'M'
}

export function MetricsPanel() {
  const [metricas, setMetricas] = useState<MetricasResumen | null>(null)
  const [loading, setLoading] = useState(true)
  const periodo = usePeriodoStore((s) => s.periodo)

  useEffect(() => {
    setLoading(true)
    fetchMetricas()
      .then((data: MetricasResumen) => {
        setMetricas(data)
        setLoading(false)
      })
  }, [periodo])

  if (loading || !metricas) {
    return (
      <div role="status" className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-24 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards: MetricCardData[] = [
    {
      label: 'Total guías pendientes',
      value: metricas.totalGuias,
      subtitle: 'en todos los clientes activos',
      icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      label: 'Clientes involucrados',
      value: metricas.clientesActivos,
      subtitle: periodo === 'anterior'
        ? 'período anterior activo'
        : metricas.clientesConRezagadas > 0
          ? `${metricas.clientesConRezagadas} con rezagadas del mes anterior`
          : 'sin rezagadas del mes anterior',
      icon: <Users className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      label: 'Estimación a facturar',
      value: fmtMonto(metricas.montoEstimado),
      subtitle: `~${metricas.factEst} facturas proyectadas`,
      icon: <Receipt className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  )
}
````

## File: src/components/ReglaActivaPopup/ReglaActivaPopup.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/services/api', () => ({
  fetchReglasEmpresa: vi.fn(),
  assignReglaCliente: vi.fn(),
}))

vi.mock('@/store/periodoStore', () => ({
  usePeriodoStore: vi.fn((selector: (s: { periodo: string }) => unknown) =>
    selector({ periodo: 'actual' }),
  ),
}))

vi.mock('@/utils/periodo', () => ({
  periodoToYYYYMM: vi.fn(() => '2026-05'),
}))

import * as api from '@/services/api'
import { ReglaActivaPopup } from './ReglaActivaPopup'

const mockReglas = [
  { reglaIdl: 'r1', reglaDesc: 'Por OC' },
  { reglaIdl: 'r2', reglaDesc: 'Por Comuna' },
]

const defaultProps = {
  clienteNombre: 'Constructora Aconcagua S.A.',
  rut: '76.543.210-K',
  reglaActual: 'r1',
  onClose: vi.fn(),
  onSaved: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  defaultProps.onClose = vi.fn()
  defaultProps.onSaved = vi.fn()
  vi.mocked(api.fetchReglasEmpresa).mockResolvedValue(mockReglas)
  vi.mocked(api.assignReglaCliente).mockResolvedValue(undefined)
})

describe('ReglaActivaPopup', () => {
  it('muestra el nombre del cliente en el título', async () => {
    render(<ReglaActivaPopup {...defaultProps} />)
    expect(await screen.findByText(/constructora aconcagua/i)).toBeInTheDocument()
  })

  it('muestra la regla activa actual', async () => {
    render(<ReglaActivaPopup {...defaultProps} />)
    await screen.findByText(/r1/)
    expect(screen.getByText(/r1/)).toBeInTheDocument()
  })

  it('muestra "Sin regla" cuando reglaActual es null', async () => {
    render(<ReglaActivaPopup {...defaultProps} reglaActual={null} />)
    const elements = await screen.findAllByText(/sin regla/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('carga y muestra las reglas disponibles', async () => {
    render(<ReglaActivaPopup {...defaultProps} />)
    expect(await screen.findByText('Por OC')).toBeInTheDocument()
    expect(screen.getByText('Por Comuna')).toBeInTheDocument()
  })

  it('al cancelar llama onClose sin llamar al servicio', async () => {
    const user = userEvent.setup()
    render(<ReglaActivaPopup {...defaultProps} />)
    await screen.findByText('Por OC')
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(defaultProps.onClose).toHaveBeenCalled()
    expect(api.assignReglaCliente).not.toHaveBeenCalled()
  })

  // ── Primera activación (reglaActual === null) ─────────────────────────────

  it('primera activación: llama assignReglaCliente sin opciones y cierra', async () => {
    const user = userEvent.setup()
    render(<ReglaActivaPopup {...defaultProps} reglaActual={null} />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por oc/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    await waitFor(() => {
      expect(api.assignReglaCliente).toHaveBeenCalledWith('76.543.210-K', 'r1')
      expect(defaultProps.onSaved).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('primera activación: no abre diálogo de resincronización', async () => {
    const user = userEvent.setup()
    render(<ReglaActivaPopup {...defaultProps} reglaActual={null} />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por oc/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    await waitFor(() => expect(defaultProps.onSaved).toHaveBeenCalled())
    expect(screen.queryByText(/re-sincronizar/i)).not.toBeInTheDocument()
  })

  // ── Cambio de regla (reglaActual !== null) ────────────────────────────────

  it('cambio de regla: abre diálogo de resincronización', async () => {
    const user = userEvent.setup()
    render(<ReglaActivaPopup {...defaultProps} reglaActual="r1" />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por comuna/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    const elements = await screen.findAllByText(/re-sincronizar/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('cambio de regla: al confirmar resync llama assignReglaCliente con opciones', async () => {
    const user = userEvent.setup()
    render(<ReglaActivaPopup {...defaultProps} reglaActual="r1" />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por comuna/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    // el diálogo aparece
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await waitFor(() => {
      expect(api.assignReglaCliente).toHaveBeenCalledWith(
        '76.543.210-K', 'r2', { recomputar: true, periodo: '2026-05' },
      )
      expect(defaultProps.onSaved).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('cambio de regla: cancelar en diálogo de resync vuelve al popup original', async () => {
    const user = userEvent.setup()
    render(<ReglaActivaPopup {...defaultProps} reglaActual="r1" />)
    await screen.findByText('Por OC')
    await user.click(screen.getByLabelText(/por comuna/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    // debe volver al popup original
    expect(await screen.findByText(/regla de agrupación/i)).toBeInTheDocument()
    expect(api.assignReglaCliente).not.toHaveBeenCalled()
  })
})
````

## File: src/components/ReglaActivaPopup/ReglaActivaPopup.tsx
````typescript
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchReglasEmpresa, assignReglaCliente } from '@/services/api'
import type { ReglaDisponible } from '@/types'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToYYYYMM } from '@/utils/periodo'
import { ResincronizarReglaDialog } from '@/components/ResincronizarReglaDialog/ResincronizarReglaDialog'

interface ReglaActivaPopupProps {
  clienteNombre: string
  rut: string
  reglaActual: string | null
  onClose: () => void
  onSaved: () => void
}

export function ReglaActivaPopup({ clienteNombre, rut, reglaActual, onClose, onSaved }: ReglaActivaPopupProps) {
  const [reglas, setReglas] = useState<ReglaDisponible[]>([])
  const [selected, setSelected] = useState<string | null>(reglaActual)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState<'select' | 'confirm-resinc'>('select')
  const [pendingReglaIdl, setPendingReglaIdl] = useState<string | null>(null)

  const periodo = usePeriodoStore((s) => s.periodo)
  const periodoDefault = periodoToYYYYMM(periodo)

  useEffect(() => {
    fetchReglasEmpresa().then(setReglas).catch(() => setReglas([]))
  }, [])

  const handleGuardar = async () => {
    if (selected === reglaActual) { onClose(); return }

    // Primera activación: reglaActual era null → PUT directo
    if (reglaActual === null) {
      setSaving(true)
      try {
        if (selected) await assignReglaCliente(rut, selected)
        onSaved()
        onClose()
      } catch {
        // silencioso
      } finally {
        setSaving(false)
      }
      return
    }

    // Cambio de regla → mostrar diálogo de resincronización
    setPendingReglaIdl(selected)
    setStep('confirm-resinc')
  }

  const handleConfirmResinc = async (opciones: { recomputar: boolean; periodo?: string }) => {
    if (!pendingReglaIdl) return
    setSaving(true)
    try {
      await assignReglaCliente(rut, pendingReglaIdl, opciones)
      onSaved()
      onClose()
    } catch {
      // silencioso
    } finally {
      setSaving(false)
    }
  }

  const handleCancelResinc = () => {
    setStep('select')
    setPendingReglaIdl(null)
  }

  if (step === 'confirm-resinc') {
    const anteriorDesc = reglas.find((r) => r.reglaIdl === reglaActual)?.reglaDesc ?? reglaActual ?? ''
    const nuevaDesc = reglas.find((r) => r.reglaIdl === pendingReglaIdl)?.reglaDesc ?? pendingReglaIdl ?? ''
    return (
      <ResincronizarReglaDialog
        clienteNombre={clienteNombre}
        reglaAnteriorDesc={anteriorDesc}
        reglaNuevaDesc={nuevaDesc}
        periodoDefault={periodoDefault}
        onConfirm={handleConfirmResinc}
        onCancel={handleCancelResinc}
      />
    )
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Regla de agrupación — {clienteNombre}</h2>

        <p className="text-sm text-muted-foreground">
          Regla activa: <span className="font-medium text-foreground">{reglaActual ?? 'Sin regla'}</span>
        </p>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground mb-2">Cambiar a:</legend>
          {reglas.map((r) => (
            <label key={r.reglaIdl} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="regla"
                value={r.reglaIdl}
                checked={selected === r.reglaIdl}
                onChange={() => setSelected(r.reglaIdl)}
                aria-label={r.reglaDesc}
              />
              <span>{r.reglaDesc}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="regla"
              value=""
              checked={selected === null || selected === ''}
              onChange={() => setSelected(null)}
              aria-label="Sin regla"
            />
            <span>Sin regla</span>
          </label>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
````

## File: src/components/ReglasPorClienteModal/index.ts
````typescript
export { ReglasPorClienteModal } from './ReglasPorClienteModal'
````

## File: src/components/ReglasPorClienteModal/ReglasPorClienteModal.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReglasPorClienteModal } from './ReglasPorClienteModal'
import type { ReglaCliente } from '@/types'

vi.mock('@/store/periodoStore', () => ({
  usePeriodoStore: vi.fn((selector: (s: { periodo: string }) => unknown) =>
    selector({ periodo: 'actual' }),
  ),
}))

vi.mock('@/utils/periodo', () => ({
  periodoToYYYYMM: vi.fn(() => '2026-05'),
}))

const mockReglas: ReglaCliente[] = [
  {
    reglaidl: '977_campo_receptor_CmnaRecep',
    empkey: '977',
    gclirut: '76543210-K',
    activa: true,
    reglanombre: 'Por comuna',
    reglaconfig: { type: 'campo-receptor', field: 'CmnaRecep' },
  },
  {
    reglaidl: '977_campo_detalle_OBRA_Valor',
    empkey: '977',
    gclirut: '76543210-K',
    activa: false,
    reglanombre: null,
    reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
  },
]

const mockReglasSinActiva: ReglaCliente[] = mockReglas.map((r) => ({ ...r, activa: false }))

const defaultProps = {
  clienteNombre: 'Constructora Aconcagua S.A.',
  rut: '76543210-K',
  reglas: mockReglas,
  loading: false,
  activando: null as string | null,
  onActivar: vi.fn(),
  onClose: vi.fn(),
  onRenombrar: vi.fn(),
}

function renderModal(props = {}) {
  return render(<ReglasPorClienteModal {...defaultProps} {...props} />)
}

beforeEach(() => {
  defaultProps.onActivar = vi.fn()
  defaultProps.onClose = vi.fn()
  defaultProps.onRenombrar = vi.fn()
})

describe('ReglasPorClienteModal', () => {
  it('muestra el nombre del cliente en el título', () => {
    renderModal()
    expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Constructora Aconcagua S.A.')
  })

  it('muestra skeleton cuando loading=true', () => {
    renderModal({ loading: true })
    expect(screen.getByTestId('reglas-skeleton')).toBeInTheDocument()
  })

  it('lista todas las reglas', () => {
    renderModal()
    expect(screen.getByTestId('regla-row-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
    expect(screen.getByTestId('regla-row-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('muestra el reglanombre cuando existe', () => {
    renderModal()
    expect(screen.getByTestId('regla-row-977_campo_receptor_CmnaRecep')).toHaveTextContent('Por comuna')
  })

  it('muestra el reglaidl técnico cuando reglanombre es null', () => {
    renderModal()
    expect(screen.getByTestId('regla-row-977_campo_detalle_OBRA_Valor')).toHaveTextContent('OBRA · Valor')
  })

  it('marca badge Activa en la regla activa', () => {
    renderModal()
    expect(screen.getByTestId('badge-activa-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
  })

  it('no muestra badge Activa en regla inactiva', () => {
    renderModal()
    expect(screen.queryByTestId('badge-activa-977_campo_detalle_OBRA_Valor')).not.toBeInTheDocument()
  })

  it('no muestra botón Activar para la regla ya activa', () => {
    renderModal()
    expect(screen.queryByTestId('btn-activar-977_campo_receptor_CmnaRecep')).not.toBeInTheDocument()
  })

  it('muestra botón Activar para regla inactiva', () => {
    renderModal()
    expect(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('muestra spinner en el botón de la regla que está activando', () => {
    renderModal({ activando: '977_campo_detalle_OBRA_Valor' })
    expect(screen.getByTestId('btn-activando-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('llama onClose al click en el botón cerrar', () => {
    renderModal()
    fireEvent.click(screen.getByTestId('btn-cerrar'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('llama onClose al click en el overlay', () => {
    renderModal()
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('muestra mensaje cuando no hay reglas', () => {
    renderModal({ reglas: [] })
    expect(screen.getByTestId('empty-reglas')).toBeInTheDocument()
  })

  describe('inline edit reglanombre', () => {
    it('muestra botón editar por cada regla', () => {
      renderModal()
      expect(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
      expect(screen.getByTestId('btn-editar-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
    })

    it('al click en editar muestra input con valor actual', () => {
      renderModal()
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep'))
      const input = screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('Por comuna')
    })

    it('al click en editar regla sin nombre el input queda vacío', () => {
      renderModal()
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_detalle_OBRA_Valor'))
      expect(screen.getByTestId('input-nombre-977_campo_detalle_OBRA_Valor')).toHaveValue('')
    })

    it('al guardar llama onRenombrar con reglaidl y nuevo nombre', () => {
      const onRenombrar = vi.fn()
      renderModal({ onRenombrar })
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep'))
      fireEvent.change(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep'), {
        target: { value: 'Nueva región' },
      })
      fireEvent.click(screen.getByTestId('btn-guardar-977_campo_receptor_CmnaRecep'))
      expect(onRenombrar).toHaveBeenCalledWith('977_campo_receptor_CmnaRecep', 'Nueva región')
    })

    it('al cancelar oculta el input', () => {
      renderModal()
      fireEvent.click(screen.getByTestId('btn-editar-977_campo_receptor_CmnaRecep'))
      expect(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
      fireEvent.click(screen.getByTestId('btn-cancelar-editar-977_campo_receptor_CmnaRecep'))
      expect(screen.queryByTestId('input-nombre-977_campo_receptor_CmnaRecep')).not.toBeInTheDocument()
    })

    it('muestra spinner de guardando cuando renombrando coincide con reglaidl', () => {
      renderModal({ renombrando: '977_campo_receptor_CmnaRecep' })
      expect(screen.getByTestId('spinner-renombrando-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
    })
  })

  // ── Primera activación (sin regla activa) ─────────────────────────────────

  it('primera activación: llama onActivar sin opciones directamente', () => {
    renderModal({ reglas: mockReglasSinActiva })
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    expect(defaultProps.onActivar).toHaveBeenCalledWith('977_campo_detalle_OBRA_Valor')
  })

  it('primera activación: no abre diálogo de resincronización', () => {
    renderModal({ reglas: mockReglasSinActiva })
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    expect(screen.queryByText(/re-sincronizar/i)).not.toBeInTheDocument()
  })

  // ── Cambio de regla (hay regla activa) ────────────────────────────────────

  it('cambio de regla: abre diálogo de resincronización al activar', async () => {
    renderModal()
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    const elements = await screen.findAllByText(/re-sincronizar/i)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('cambio de regla: al confirmar llama onActivar con opciones', async () => {
    const user = userEvent.setup()
    renderModal()
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await waitFor(() => {
      expect(defaultProps.onActivar).toHaveBeenCalledWith(
        '977_campo_detalle_OBRA_Valor',
        { recomputar: true, periodo: '2026-05' },
      )
    })
  })

  it('cambio de regla: cancelar en diálogo de resync vuelve al modal original', async () => {
    const user = userEvent.setup()
    renderModal()
    fireEvent.click(screen.getByTestId('btn-activar-977_campo_detalle_OBRA_Valor'))
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(await screen.findByTestId('modal-titulo')).toBeInTheDocument()
    expect(defaultProps.onActivar).not.toHaveBeenCalled()
  })
})
````

## File: src/components/ReglasPorClienteModal/ReglasPorClienteModal.tsx
````typescript
import { useState } from 'react'
import { X, CheckCircle2, RefreshCw, Pencil, Check } from 'lucide-react'
import type { ReglaCliente } from '@/types'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToYYYYMM } from '@/utils/periodo'
import { ResincronizarReglaDialog } from '@/components/ResincronizarReglaDialog/ResincronizarReglaDialog'

function reglaLabel(r: ReglaCliente): string {
  if (r.reglanombre) return r.reglanombre
  if (!r.reglaconfig) return r.reglaidl
  return r.reglaconfig.type === 'campo-receptor'
    ? r.reglaconfig.field
    : `${r.reglaconfig.lineFilter} · ${r.reglaconfig.key}`
}

interface Props {
  clienteNombre: string
  rut: string
  reglas: ReglaCliente[]
  loading: boolean
  activando: string | null
  renombrando?: string | null
  onActivar: (reglaidl: string, opciones?: { recomputar: boolean; periodo?: string }) => void
  onRenombrar: (reglaidl: string, nombre: string) => void
  onClose: () => void
}

export function ReglasPorClienteModal({
  clienteNombre,
  reglas,
  loading,
  activando,
  renombrando,
  onActivar,
  onRenombrar,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [step, setStep] = useState<'select' | 'confirm-resinc'>('select')
  const [pendingReglaIdl, setPendingReglaIdl] = useState<string | null>(null)

  const periodo = usePeriodoStore((s) => s.periodo)
  const periodoDefault = periodoToYYYYMM(periodo)

  const reglaActiva = reglas.find((r) => r.activa)

  const handleActivar = (reglaidl: string) => {
    if (!reglaActiva) {
      onActivar(reglaidl)
      return
    }
    setPendingReglaIdl(reglaidl)
    setStep('confirm-resinc')
  }

  const handleConfirmResinc = (opciones: { recomputar: boolean; periodo?: string }) => {
    if (!pendingReglaIdl) return
    onActivar(pendingReglaIdl, opciones)
    setStep('select')
    setPendingReglaIdl(null)
  }

  const handleCancelResinc = () => {
    setStep('select')
    setPendingReglaIdl(null)
  }

  if (step === 'confirm-resinc') {
    const anteriorDesc = reglaActiva ? reglaLabel(reglaActiva) : ''
    const nuevaRegla = reglas.find((r) => r.reglaidl === pendingReglaIdl)
    const nuevaDesc = nuevaRegla ? reglaLabel(nuevaRegla) : (pendingReglaIdl ?? '')
    return (
      <ResincronizarReglaDialog
        clienteNombre={clienteNombre}
        reglaAnteriorDesc={anteriorDesc}
        reglaNuevaDesc={nuevaDesc}
        periodoDefault={periodoDefault}
        onConfirm={handleConfirmResinc}
        onCancel={handleCancelResinc}
      />
    )
  }

  const startEdit = (r: ReglaCliente) => {
    setEditingId(r.reglaidl)
    setEditValue(r.reglanombre ?? '')
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (reglaidl: string) => {
    onRenombrar(reglaidl, editValue)
    setEditingId(null)
  }

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-[900] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card rounded-xl shadow-2xl border border-border w-[520px] max-w-[94vw] p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2
              data-testid="modal-titulo"
              className="font-display text-[17px] font-bold text-foreground leading-tight"
            >
              {clienteNombre}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Reglas de agrupación configuradas</p>
          </div>
          <button
            data-testid="btn-cerrar"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div data-testid="reglas-skeleton" className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reglas.length === 0 ? (
          <div
            data-testid="empty-reglas"
            className="text-center py-10 text-sm text-muted-foreground"
          >
            No hay reglas configuradas para este cliente.
          </div>
        ) : (
          <div className="space-y-2">
            {reglas.map((r) => {
              const isEditing = editingId === r.reglaidl
              const isRenombrando = renombrando === r.reglaidl

              return (
                <div
                  key={r.reglaidl}
                  data-testid={`regla-row-${r.reglaidl}`}
                  className={[
                    'flex items-center justify-between gap-3 rounded-lg px-4 py-3 border transition-colors',
                    r.activa
                      ? 'border-success/40 bg-success/5'
                      : 'border-border bg-background',
                  ].join(' ')}
                >
                  {/* Label / input area */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {r.activa && (
                      <span
                        data-testid={`badge-activa-${r.reglaidl}`}
                        className="flex items-center gap-1 text-xs font-semibold shrink-0 text-success-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activa
                      </span>
                    )}
                    {isEditing ? (
                      <input
                        data-testid={`input-nombre-${r.reglaidl}`}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(r.reglaidl)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="flex-1 text-sm bg-background border border-border rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-foreground truncate">
                        {reglaLabel(r)}
                      </span>
                    )}
                  </div>

                  {/* Actions area */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          data-testid={`btn-guardar-${r.reglaidl}`}
                          onClick={() => saveEdit(r.reglaidl)}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Guardar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          data-testid={`btn-cancelar-editar-${r.reglaidl}`}
                          onClick={cancelEdit}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : isRenombrando ? (
                      <RefreshCw
                        data-testid={`spinner-renombrando-${r.reglaidl}`}
                        className="w-3.5 h-3.5 animate-spin text-muted-foreground"
                      />
                    ) : (
                      <button
                        data-testid={`btn-editar-${r.reglaidl}`}
                        onClick={() => startEdit(r)}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="Renombrar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isEditing && (
                      r.activa ? null : activando === r.reglaidl ? (
                        <button
                          data-testid={`btn-activando-${r.reglaidl}`}
                          disabled
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white opacity-60"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Activando…
                        </button>
                      ) : (
                        <button
                          data-testid={`btn-activar-${r.reglaidl}`}
                          onClick={() => handleActivar(r.reglaidl)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Activar
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
````

## File: src/components/ResincronizarReglaDialog/ResincronizarReglaDialog.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResincronizarReglaDialog } from './ResincronizarReglaDialog'

const defaultProps = {
  clienteNombre: 'Constructora Aconcagua S.A.',
  reglaAnteriorDesc: 'Por OC',
  reglaNuevaDesc: 'Por Comuna',
  periodoDefault: '2026-05',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  defaultProps.onConfirm = vi.fn()
  defaultProps.onCancel = vi.fn()
})

describe('ResincronizarReglaDialog', () => {
  it('muestra nombre del cliente y reglas en el encabezado', () => {
    render(<ResincronizarReglaDialog {...defaultProps} />)
    expect(screen.getByText(/constructora aconcagua/i)).toBeInTheDocument()
    expect(screen.getByText(/por oc/i)).toBeInTheDocument()
    expect(screen.getByText(/por comuna/i)).toBeInTheDocument()
  })

  it('default seleccionado es "Re-sincronizar"', () => {
    render(<ResincronizarReglaDialog {...defaultProps} />)
    const radioResinc = screen.getByLabelText(/re-sincronizar guías del período/i)
    expect(radioResinc).toBeChecked()
    expect(screen.getByLabelText(/solo guías nuevas/i)).not.toBeChecked()
  })

  it('el selector de mes tiene el valor periodoDefault', () => {
    render(<ResincronizarReglaDialog {...defaultProps} />)
    const selector = screen.getByLabelText(/selector de mes/i) as HTMLInputElement
    expect(selector.value).toBe('2026-05')
  })

  it('al confirmar con "Re-sincronizar" llama onConfirm con recomputar=true y periodo', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ recomputar: true, periodo: '2026-05' })
  })

  it('al confirmar con "Solo guías nuevas" llama onConfirm con recomputar=false', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    await user.click(screen.getByLabelText(/solo guías nuevas/i))
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ recomputar: false })
  })

  it('cambiar el selector de mes actualiza el periodo enviado', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    const selector = screen.getByLabelText(/selector de mes/i)
    await user.clear(selector)
    await user.type(selector, '2026-03')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ recomputar: true, periodo: '2026-03' })
  })

  it('cancelar llama onCancel sin llamar onConfirm', async () => {
    const user = userEvent.setup()
    render(<ResincronizarReglaDialog {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(defaultProps.onCancel).toHaveBeenCalled()
    expect(defaultProps.onConfirm).not.toHaveBeenCalled()
  })
})
````

## File: src/components/ResincronizarReglaDialog/ResincronizarReglaDialog.tsx
````typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ResincronizarReglaDialogProps {
  clienteNombre: string
  reglaAnteriorDesc: string
  reglaNuevaDesc: string
  periodoDefault: string // YYYY-MM
  onConfirm: (opciones: { recomputar: boolean; periodo?: string }) => void
  onCancel: () => void
}

export function ResincronizarReglaDialog({
  clienteNombre,
  reglaAnteriorDesc,
  reglaNuevaDesc,
  periodoDefault,
  onConfirm,
  onCancel,
}: ResincronizarReglaDialogProps) {
  const [mode, setMode] = useState<'resincronizar' | 'solo-nuevas'>('resincronizar')
  const [mes, setMes] = useState(periodoDefault)

  const handleConfirmar = () => {
    if (mode === 'resincronizar') {
      onConfirm({ recomputar: true, periodo: mes })
    } else {
      onConfirm({ recomputar: false })
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="font-semibold text-foreground">
          Cambio de regla — {clienteNombre}
        </h2>

        <p className="text-sm text-muted-foreground">
          La regla activa cambiará de{' '}
          <span className="font-medium text-foreground">{reglaAnteriorDesc}</span>
          {' '}a{' '}
          <span className="font-medium text-foreground">{reglaNuevaDesc}</span>.
        </p>

        <p className="text-sm font-medium text-foreground">¿Deseas re-sincronizar guías existentes?</p>

        <fieldset className="space-y-3">
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="modo-resync"
              value="resincronizar"
              checked={mode === 'resincronizar'}
              onChange={() => setMode('resincronizar')}
              className="mt-0.5"
              aria-label="Re-sincronizar guías del período"
            />
            <div className="space-y-1.5">
              <span className="font-medium">Re-sincronizar guías del período:</span>
              <input
                type="month"
                value={mes}
                onChange={(e) => {
                  setMes(e.target.value)
                  setMode('resincronizar')
                }}
                aria-label="Selector de mes"
                className="block border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
              />
            </div>
          </label>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="modo-resync"
              value="solo-nuevas"
              checked={mode === 'solo-nuevas'}
              onChange={() => setMode('solo-nuevas')}
              className="mt-0.5"
              aria-label="Solo guías nuevas"
            />
            <div>
              <span className="font-medium">Solo guías nuevas</span>
              <p className="text-muted-foreground text-xs mt-0.5">
                Las guías existentes conservan su clasificación anterior.
              </p>
            </div>
          </label>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleConfirmar}>Confirmar</Button>
        </div>
      </div>
    </div>
  )
}
````

## File: src/components/Sidebar/Sidebar.test.tsx
````typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from './Sidebar'

function renderSidebar(currentPath = '/clientes') {
  return render(
    <MemoryRouter initialEntries={[currentPath]}>
      <Sidebar />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('has dark background', () => {
    const { container } = renderSidebar()
    expect(container.firstChild).toHaveClass('bg-card')
  })

  it('shows version footer', () => {
    renderSidebar()
    expect(screen.getByText(/gde sistema/i, { selector: 'p' })).toBeInTheDocument()
  })

  it('Clientes link active when on /clientes', () => {
    renderSidebar('/clientes')
    const link = screen.getByRole('link', { name: /clientes/i })
    expect(link.className).toMatch(/bg-primary|bg-blue/)
  })

  it('Guías link NOT active when on /clientes', () => {
    renderSidebar('/clientes')
    const link = screen.getByRole('link', { name: /guías/i })
    expect(link.className).not.toMatch(/bg-primary|bg-blue/)
  })

  it('Guías link active when on /guias', () => {
    renderSidebar('/guias')
    const link = screen.getByRole('link', { name: /guías/i })
    expect(link.className).toMatch(/bg-primary|bg-blue/)
  })

  it('no renderiza link a AdminReglas', () => {
    renderSidebar()
    expect(screen.queryByRole('link', { name: /configuración/i })).not.toBeInTheDocument()
  })
})
````

## File: src/components/Sidebar/Sidebar.tsx
````typescript
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/guias', label: 'Guías', icon: FileText },
]

// AdminReglas kept in router but hidden from navigation (v3)
// const adminItems = [{ to: '/admin/reglas', label: 'Configuración', icon: Settings }]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative bg-card flex flex-col shrink-0 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand */}
      <div className="px-4 py-6 border-b border-border flex items-center">
        <div
          className={cn(
            'flex items-center gap-3',
            collapsed && 'justify-center w-full'
          )}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xl">G</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="text-foreground font-semibold text-base leading-tight block truncate">
                GDE Sistema
              </span>
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                Gestión de Guías
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 h-6 w-6 rounded-full border-border p-0 text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {!collapsed && (
          <p className="text-muted-foreground text-xs uppercase tracking-widest px-2 mb-2">
            Principal
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    collapsed && 'justify-center',
                    isActive
                      ? 'bg-primary/20 text-primary border-l-2 border-primary pl-[10px]'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-border">
          <p className="text-muted-foreground text-xs">GDE Sistema v2.4 · 2026</p>
        </div>
      )}
    </aside>
  )
}
````

## File: src/components/ui/badge.tsx
````typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        success: 'bg-success-100 text-success-600',
        primary: 'bg-primary/15 text-primary',
        danger: 'bg-danger-100 text-destructive',
        outline: 'border border-border text-foreground bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
````

## File: src/components/ui/button.tsx
````typescript
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-danger-700',
        outline: 'border border-border bg-card text-foreground hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-accent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
````

## File: src/components/ui/card.tsx
````typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-foreground leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
````

## File: src/components/ui/input.tsx
````typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-card px-4 py-2 text-base text-foreground ring-offset-background placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
````

## File: src/components/ui/select.tsx
````typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 rounded-lg border border-input bg-card px-3 py-2',
        'text-sm text-foreground',
        'focus:outline-none focus:ring-4 focus:ring-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'

export { Select }
````

## File: src/components/ui/skeleton.tsx
````typescript
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded bg-muted', className)}
      {...props}
    />
  )
}
````

## File: src/hooks/useGuiasFilters.test.ts
````typescript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGuiasFilters } from './useGuiasFilters'
import type { Guia } from '@/types'

const makeGuia = (overrides: Partial<Guia>): Guia => ({
  id: 'g1',
  numero: '1001',
  clienteId: 'c1',
  clienteNombre: 'Test Cliente',
  fecha: '2026-06-10',
  descripcion: 'Test',
  cantidad: 1,
  montoNeto: 1000,
  agrupadorId: 'a1',
  agrupadorCodigo: 'OC-001',
  agrupadorColor: '#dbeafe',
  agrupadorNombre: 'Orden 001',
  reglaIdl: null,
  estado: 'pendiente',
  ...overrides,
})

const guias: Guia[] = [
  makeGuia({ id: 'g1', numero: '1001', clienteId: 'c1', fecha: '2026-06-03', agrupadorId: 'a1', agrupadorCodigo: 'OC-001', montoNeto: 1000 }),
  makeGuia({ id: 'g2', numero: '1002', clienteId: 'c1', fecha: '2026-06-05', agrupadorId: 'a1', agrupadorCodigo: 'OC-001', montoNeto: 2000 }),
  makeGuia({ id: 'g3', numero: '1003', clienteId: 'c2', fecha: '2026-06-07', agrupadorId: 'a2', agrupadorCodigo: 'OC-002', montoNeto: 3000 }),
  makeGuia({ id: 'g4', numero: '1004', clienteId: 'c1', fecha: '2026-06-10', agrupadorId: 'a2', agrupadorCodigo: 'OC-002', montoNeto: 500, descripcion: 'Material especial' }),
]

describe('useGuiasFilters', () => {
  it('returns all guias when no filters active', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    expect(result.current.guiasPreFiltradas).toHaveLength(4)
    expect(result.current.guiasFiltradas).toHaveLength(4)
  })

  it('filters by busqueda on numero', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusqueda('1001'))
    expect(result.current.guiasPreFiltradas.map((g) => g.id)).toEqual(['g1'])
    expect(result.current.guiasFiltradas.map((g) => g.id)).toEqual(['g1'])
  })

  it('filters by busqueda on descripcion', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusqueda('especial'))
    expect(result.current.guiasPreFiltradas.map((g) => g.id)).toEqual(['g4'])
  })

  it('filters by dateRange', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setDateRange({ from: '2026-06-05', to: '2026-06-07' }))
    const ids = result.current.guiasPreFiltradas.map((g) => g.id)
    expect(ids).toContain('g2')
    expect(ids).toContain('g3')
    expect(ids).not.toContain('g1')
    expect(ids).not.toContain('g4')
  })

  it('filters by agrupador (guiasFiltradas only)', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    expect(result.current.guiasPreFiltradas).toHaveLength(4) // pre-filter ignores agrupador
    expect(result.current.guiasFiltradas.map((g) => g.id)).toEqual(['g1', 'g2'])
  })

  it('setFiltroCliente resets filtroAgrupador', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    expect(result.current.filtroAgrupador).toBe('a1')
    act(() => result.current.setFiltroCliente('c2'))
    expect(result.current.filtroAgrupador).toBe('')
  })

  it('derives unique agrupadores from guiasPreFiltradas', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    const ids = result.current.agrupadores.map((a) => a.id)
    expect(ids).toContain('a1')
    expect(ids).toContain('a2')
    expect(ids).toHaveLength(2)
  })

  it('agrupadoresFiltrados searches by codigo', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusquedaAgrupador('OC-001'))
    expect(result.current.agrupadoresFiltrados).toHaveLength(1)
    expect(result.current.agrupadoresFiltrados[0].id).toBe('a1')
  })

  it('computes montoTotal from guiasPreFiltradas', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    expect(result.current.montoTotal).toBe(1000 + 2000 + 3000 + 500)
  })

  it('computes montoFiltrado from guiasFiltradas', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    expect(result.current.montoFiltrado).toBe(1000 + 2000)
  })

  it('hasActiveFilter is false when no filters', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    expect(result.current.hasActiveFilter).toBe(false)
  })

  it('hasActiveFilter is true when filtroCliente set', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroCliente('c1'))
    expect(result.current.hasActiveFilter).toBe(true)
  })

  // ── filtroEsHomogeneo ─────────────────────────────────────────────────────

  it('filtroEsHomogeneo is false when guiasFiltradas mixes distintos clienteId', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    // sin filtro de cliente ni agrupador: guiasFiltradas === guias, que mezcla c1 y c2
    expect(result.current.filtroEsHomogeneo).toBe(false)
  })

  it('filtroEsHomogeneo is true when las guías ya vienen scoped a un solo cliente y mes (filtro por API)', () => {
    // filtroCliente se aplica server-side (fetchGuias con clienteId) — el array
    // de guías que llega al hook ya viene acotado a un solo cliente.
    const guiasDeUnCliente = guias.filter((g) => g.clienteId === 'c1')
    const { result } = renderHook(() => useGuiasFilters(guiasDeUnCliente))
    expect(result.current.filtroEsHomogeneo).toBe(true)
  })

  it('filtroEsHomogeneo is true when filtroAgrupador reduce a un solo cliente y mes', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    // g1 y g2: ambas c1, junio 2026
    expect(result.current.filtroEsHomogeneo).toBe(true)
  })

  it('filtroEsHomogeneo is false when guiasFiltradas mixes distintos meses del mismo cliente', () => {
    const guiasMismoClienteMesesDistintos: Guia[] = [
      makeGuia({ id: 'h1', clienteId: 'c1', fecha: '2026-06-01' }),
      makeGuia({ id: 'h2', clienteId: 'c1', fecha: '2026-07-01' }),
    ]
    const { result } = renderHook(() => useGuiasFilters(guiasMismoClienteMesesDistintos))
    expect(result.current.filtroEsHomogeneo).toBe(false)
  })

  it('filtroEsHomogeneo is false when guiasFiltradas is empty', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusqueda('no-existe-ninguna-guia'))
    expect(result.current.guiasFiltradas).toHaveLength(0)
    expect(result.current.filtroEsHomogeneo).toBe(false)
  })

  it('initialClienteId pre-fills filtroCliente', () => {
    const { result } = renderHook(() => useGuiasFilters(guias, 'c1'))
    expect(result.current.filtroCliente).toBe('c1')
  })

  it('reset clears all filters', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => {
      result.current.setBusqueda('xyz')
      result.current.setFiltroCliente('c1')
      result.current.setFiltroAgrupador('a1')
    })
    act(() => result.current.reset())
    expect(result.current.busqueda).toBe('')
    expect(result.current.filtroCliente).toBe('')
    expect(result.current.filtroAgrupador).toBe('')
    expect(result.current.hasActiveFilter).toBe(false)
  })
})
````

## File: src/hooks/useGuiasFilters.ts
````typescript
import { useState, useMemo, useCallback } from 'react'
import type { DateRange } from '@/components/DateFilter'
import { esLoteHomogeneo } from '@/utils/loteHomogeneo'
import type { Guia } from '@/types'

interface Agrupador {
  id: string
  codigo: string
  color: string
  nombre: string | null
}

export interface GuiasFiltersResult {
  busqueda: string
  setBusqueda: (v: string) => void
  filtroCliente: string
  setFiltroCliente: (id: string) => void
  filtroAgrupador: string
  setFiltroAgrupador: (id: string) => void
  busquedaAgrupador: string
  setBusquedaAgrupador: (v: string) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  guiasPreFiltradas: Guia[]
  guiasFiltradas: Guia[]
  agrupadores: Agrupador[]
  agrupadoresFiltrados: Agrupador[]
  montoTotal: number
  montoFiltrado: number
  hasActiveFilter: boolean
  filtroEsHomogeneo: boolean
  reset: () => void
}

export function useGuiasFilters(guias: Guia[], initialClienteId = ''): GuiasFiltersResult {
  const [busqueda, setBusqueda] = useState('')
  const [filtroCliente, setFiltroClienteRaw] = useState(initialClienteId)
  const [filtroAgrupador, setFiltroAgrupador] = useState('')
  const [busquedaAgrupador, setBusquedaAgrupador] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })

  const setFiltroCliente = useCallback((id: string) => {
    setFiltroClienteRaw(id)
    setFiltroAgrupador('')
  }, [])

  const reset = useCallback(() => {
    setBusqueda('')
    setFiltroClienteRaw('')
    setFiltroAgrupador('')
    setBusquedaAgrupador('')
    setDateRange({ from: null, to: null })
  }, [])

  const guiasPreFiltradas = useMemo(() => guias.filter((g) => {
    if (dateRange.from && g.fecha < dateRange.from) return false
    if (dateRange.to   && g.fecha > dateRange.to)   return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      if (
        !g.numero.toLowerCase().includes(q) &&
        !g.descripcion.toLowerCase().includes(q) &&
        !g.clienteNombre.toLowerCase().includes(q)
      )
        return false
    }
    return true
  }), [guias, dateRange, busqueda])

  const agrupadores = useMemo(() => {
    const seen = new Map<string, Agrupador>()
    for (const g of guiasPreFiltradas) {
      if (g.agrupadorId && !seen.has(g.agrupadorId)) {
        seen.set(g.agrupadorId, {
          id: g.agrupadorId,
          codigo: g.agrupadorCodigo,
          color: g.agrupadorColor,
          nombre: g.agrupadorNombre,
        })
      }
    }
    return Array.from(seen.values())
  }, [guiasPreFiltradas])

  const agrupadoresFiltrados = useMemo(() => {
    if (!busquedaAgrupador) return agrupadores
    const q = busquedaAgrupador.toLowerCase()
    return agrupadores.filter((ag) => ag.codigo.toLowerCase().includes(q))
  }, [agrupadores, busquedaAgrupador])

  const guiasFiltradas = useMemo(() => {
    if (!filtroAgrupador) return guiasPreFiltradas
    return guiasPreFiltradas.filter((g) => g.agrupadorId === filtroAgrupador)
  }, [guiasPreFiltradas, filtroAgrupador])

  const montoTotal = useMemo(
    () => guiasPreFiltradas.reduce((s, g) => s + g.montoNeto, 0),
    [guiasPreFiltradas],
  )

  const montoFiltrado = useMemo(
    () => guiasFiltradas.reduce((s, g) => s + g.montoNeto, 0),
    [guiasFiltradas],
  )

  const hasActiveFilter = !!(filtroCliente || filtroAgrupador || dateRange.from)

  const filtroEsHomogeneo = useMemo(() => esLoteHomogeneo(guiasFiltradas), [guiasFiltradas])

  return {
    busqueda, setBusqueda,
    filtroCliente, setFiltroCliente,
    filtroAgrupador, setFiltroAgrupador,
    busquedaAgrupador, setBusquedaAgrupador,
    dateRange, setDateRange,
    guiasPreFiltradas, guiasFiltradas,
    agrupadores, agrupadoresFiltrados,
    montoTotal, montoFiltrado,
    hasActiveFilter,
    filtroEsHomogeneo,
    reset,
  }
}
````

## File: src/lib/utils.ts
````typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: src/pages/AdminReglas.test.tsx
````typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminReglas from './AdminReglas'
import * as api from '@/services/api'
import type { DiscoverResult, ReglaEmp, ReglaCliente } from '@/types'
import { useTenantStore } from '@/store/tenantStore'
import { mockClientes } from '@/test/mocks/fixtures'

vi.mock('@/services/api')

const mockDiscover: DiscoverResult = {
  empkey: '977',
  muestraGuias: 20,
  candidatos: [
    {
      tipo: 'campo-receptor',
      field: 'CmnaRecep',
      ocurrencias: 15,
      ejemplos: ['RENCA', 'QUILICURA'],
    },
    {
      tipo: 'campo-detalle',
      lineFilter: 'OBRA',
      key: 'Valor',
      ocurrencias: 8,
      ejemplos: ['OBRA-001'],
    },
  ],
}

const mockReglasCliente: ReglaCliente[] = [
  {
    reglaidl: '977_campo_receptor_CmnaRecep',
    empkey: '977',
    gclirut: '76.543.210-K',
    activa: true,
    reglanombre: null,
    reglaconfig: { type: 'campo-receptor', field: 'CmnaRecep' },
  },
  {
    reglaidl: '977_campo_detalle_OBRA_Valor',
    empkey: '977',
    gclirut: '76.543.210-K',
    activa: false,
    reglanombre: 'Por Obra',
    reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
  },
]

const mockReglaEmp: ReglaEmp = {
  reglaidl: '977_campo_detalle_OBRA_Valor',
  empkey: '977',
  reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
}

const clienteConReglas = mockClientes[0] // rut: '76.543.210-K'
const clienteSinReglas = mockClientes[1] // rut: '96.123.456-2'

beforeEach(() => {
  vi.clearAllMocks()
  useTenantStore.setState({ tenantId: '977', tenantNombre: 'INTEGRAC' })
  vi.mocked(api.fetchDiscoverCandidatos).mockResolvedValue(mockDiscover)
  vi.mocked(api.fetchClientes).mockResolvedValue(mockClientes)
  vi.mocked(api.fetchReglasPorCliente).mockResolvedValue(mockReglasCliente)
  vi.mocked(api.activarRegla).mockResolvedValue(mockReglaEmp)
  vi.mocked(api.assignReglaCliente).mockResolvedValue(undefined)
  vi.mocked(api.activarReglaCliente).mockResolvedValue(undefined)
  vi.mocked(api.updateReglanombre).mockResolvedValue(undefined)
})

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminReglas />
    </MemoryRouter>,
  )
}

async function selectCliente(rut: string) {
  const select = await screen.findByTestId('select-cliente')
  fireEvent.change(select, { target: { value: rut } })
}

describe('AdminReglas', () => {
  // ─── Discover lifecycle (por cliente) ────────────────────────────────────

  it('sin cliente seleccionado no muestra sección de candidatos ni llama fetchDiscoverCandidatos', async () => {
    renderPage()
    // Wait for clientes to load (fetchClientes is called)
    await screen.findByTestId('select-cliente')
    expect(api.fetchDiscoverCandidatos).not.toHaveBeenCalled()
    expect(screen.queryByTestId('candidatos-skeleton')).not.toBeInTheDocument()
    expect(screen.queryByTestId('candidato-receptor_CmnaRecep')).not.toBeInTheDocument()
  })

  it('al seleccionar cliente llama fetchDiscoverCandidatos con el gclirut del cliente', async () => {
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await waitFor(() => {
      expect(api.fetchDiscoverCandidatos).toHaveBeenCalledWith(clienteSinReglas.rut)
    })
  })

  it('skeleton visible mientras carga después de seleccionar cliente', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockReturnValue(new Promise(() => {}))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    expect(screen.getByTestId('candidatos-skeleton')).toBeInTheDocument()
  })

  it('candidatos visibles después de seleccionar cliente y resolver', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')
    expect(screen.getByTestId('candidato-detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('al cambiar cliente los candidatos anteriores desaparecen de inmediato', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')

    // Block second discover so we can observe the intermediate state
    vi.mocked(api.fetchDiscoverCandidatos).mockReturnValue(new Promise(() => {}))
    await selectCliente(clienteConReglas.rut)

    expect(screen.queryByTestId('candidato-receptor_CmnaRecep')).not.toBeInTheDocument()
    expect(screen.getByTestId('candidatos-skeleton')).toBeInTheDocument()
  })

  it('estado vacío cuando el cliente no tiene candidatos', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockResolvedValue({ ...mockDiscover, candidatos: [] })
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('empty-candidatos')
  })

  it('error visible cuando discover falla al seleccionar cliente', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockRejectedValue(new Error('network'))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('error-discover')
  })

  // ─── Loading & initial state ──────────────────────────────────────────────

  it('shows skeleton while loading after client selected', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockReturnValue(new Promise(() => {}))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    expect(screen.getByTestId('candidatos-skeleton')).toBeInTheDocument()
  })

  it('shows candidates after selecting client and loading', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')
    expect(screen.getByTestId('candidato-detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('shows error when discover fails after client selected', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockRejectedValue(new Error('network'))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('error-discover')
  })

  it('shows empty state when no candidates after client selected', async () => {
    vi.mocked(api.fetchDiscoverCandidatos).mockResolvedValue({ ...mockDiscover, candidatos: [] })
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('empty-candidatos')
  })

  // ─── Client selector ──────────────────────────────────────────────────────

  it('renders client selector with clientes options', async () => {
    renderPage()
    const select = await screen.findByTestId('select-cliente')
    expect(select).toBeInTheDocument()
    expect(screen.getByText(`${mockClientes[0].nombre} (${mockClientes[0].rut})`)).toBeInTheDocument()
  })

  it('sin cliente seleccionado no hay botón Asignar visible', async () => {
    renderPage()
    await screen.findByTestId('select-cliente')
    expect(screen.queryByTestId('btn-activar-receptor_CmnaRecep')).not.toBeInTheDocument()
    expect(screen.queryByTestId('btn-activar-detalle_OBRA_Valor')).not.toBeInTheDocument()
  })

  // ─── Client rules panel ───────────────────────────────────────────────────

  it('selecting a client loads their rules', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('reglas-cliente-list')
    expect(api.fetchReglasPorCliente).toHaveBeenCalledWith(clienteConReglas.rut)
  })

  it('shows loading skeleton while loading client rules', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockReturnValue(new Promise(() => {}))
    renderPage()
    await selectCliente(clienteConReglas.rut)
    expect(screen.getByTestId('reglas-cliente-skeleton')).toBeInTheDocument()
  })

  it('shows empty state when client has no rules', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('reglas-cliente-empty')
  })

  it('shows active badge on active rule and Activar button on inactive', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('reglas-cliente-list')
    // Active rule has no Activar button
    expect(screen.queryByTestId('btn-activar-regla-977_campo_receptor_CmnaRecep')).not.toBeInTheDocument()
    // Inactive rule has Activar button
    expect(screen.getByTestId('btn-activar-regla-977_campo_detalle_OBRA_Valor')).toBeInTheDocument()
  })

  it('activar regla cliente calls activarReglaCliente and refreshes', async () => {
    const reglasActualizadas: ReglaCliente[] = [
      { ...mockReglasCliente[0], activa: false },
      { ...mockReglasCliente[1], activa: true },
    ]
    vi.mocked(api.fetchReglasPorCliente)
      .mockResolvedValueOnce(mockReglasCliente)
      .mockResolvedValueOnce(reglasActualizadas)
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('btn-activar-regla-977_campo_detalle_OBRA_Valor')
    fireEvent.click(screen.getByTestId('btn-activar-regla-977_campo_detalle_OBRA_Valor'))
    await waitFor(() => {
      expect(api.activarReglaCliente).toHaveBeenCalledWith(clienteConReglas.rut, '977_campo_detalle_OBRA_Valor')
    })
    expect(api.fetchReglasPorCliente).toHaveBeenCalledTimes(2)
  })

  // ─── Discovery → assign candidate ─────────────────────────────────────────

  it('activate button is enabled after client is selected', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    await screen.findByTestId('candidato-receptor_CmnaRecep')
    expect(screen.getByTestId('btn-activar-receptor_CmnaRecep')).not.toBeDisabled()
  })

  it('activate button opens confirm modal with client in description', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-receptor_CmnaRecep')
    fireEvent.click(btn)
    expect(screen.getByTestId('btn-confirmar-activar')).toBeInTheDocument()
    expect(screen.getByTestId('btn-confirmar-activar').closest('div[class*="rounded-xl"]')!.textContent)
      .toContain('CmnaRecep')
  })

  it('confirm modal has optional nombre display input', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-receptor_CmnaRecep')
    fireEvent.click(btn)
    expect(screen.getByTestId('input-nombre-candidato')).toBeInTheDocument()
  })

  it('canceling closes modal', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-receptor_CmnaRecep')
    fireEvent.click(btn)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByTestId('btn-confirmar-activar')).not.toBeInTheDocument()
  })

  it('confirming calls activarRegla + assignReglaCliente and shows success', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    vi.mocked(api.activarRegla).mockResolvedValue(mockReglaEmp)
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-detalle_OBRA_Valor')
    fireEvent.click(btn)
    fireEvent.click(screen.getByTestId('btn-confirmar-activar'))
    await screen.findByTestId('success-msg')
    expect(api.activarRegla).toHaveBeenCalledWith({ type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' })
    expect(api.assignReglaCliente).toHaveBeenCalledWith(clienteSinReglas.rut, mockReglaEmp.reglaidl)
    expect(api.updateReglanombre).not.toHaveBeenCalled()
  })

  it('confirming with nombre calls updateReglanombre', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    vi.mocked(api.activarRegla).mockResolvedValue(mockReglaEmp)
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-detalle_OBRA_Valor')
    fireEvent.click(btn)
    fireEvent.change(screen.getByTestId('input-nombre-candidato'), { target: { value: 'Por Obra' } })
    fireEvent.click(screen.getByTestId('btn-confirmar-activar'))
    await screen.findByTestId('success-msg')
    expect(api.updateReglanombre).toHaveBeenCalledWith(mockReglaEmp.reglaidl, 'Por Obra')
  })

  it('shows error in modal when assign fails', async () => {
    vi.mocked(api.fetchReglasPorCliente).mockResolvedValue([])
    vi.mocked(api.activarRegla).mockRejectedValue(new Error('fail'))
    renderPage()
    await selectCliente(clienteSinReglas.rut)
    const btn = await screen.findByTestId('btn-activar-detalle_OBRA_Valor')
    fireEvent.click(btn)
    fireEvent.click(screen.getByTestId('btn-confirmar-activar'))
    await screen.findByTestId('error-activar')
    expect(screen.getByTestId('btn-confirmar-activar')).toBeInTheDocument()
  })

  it('candidate active for client shows "Activa" badge and hides Asignar button', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('reglas-cliente-list')
    expect(screen.queryByTestId('btn-activar-receptor_CmnaRecep')).not.toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
  })

  // ─── Inline nombre edit ───────────────────────────────────────────────────

  it('edit nombre button opens inline editor', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep')
    fireEvent.click(screen.getByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep'))
    expect(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep')).toBeInTheDocument()
  })

  it('saving nombre calls updateReglanombre and updates display', async () => {
    renderPage()
    await selectCliente(clienteConReglas.rut)
    await screen.findByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep')
    fireEvent.click(screen.getByTestId('btn-editar-nombre-977_campo_receptor_CmnaRecep'))
    fireEvent.change(screen.getByTestId('input-nombre-977_campo_receptor_CmnaRecep'), {
      target: { value: 'Por Comuna' },
    })
    fireEvent.click(screen.getByTestId('btn-save-nombre-977_campo_receptor_CmnaRecep'))
    await waitFor(() => {
      expect(api.updateReglanombre).toHaveBeenCalledWith('977_campo_receptor_CmnaRecep', 'Por Comuna')
    })
  })
})
````

## File: src/pages/AdminReglas.tsx
````typescript
import { useState, useEffect } from 'react'
import { Settings, CheckCircle2, AlertTriangle, RefreshCw, Edit2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  fetchDiscoverCandidatos,
  activarRegla,
  fetchClientes,
  fetchReglasPorCliente,
  activarReglaCliente,
  assignReglaCliente,
  updateReglanombre,
} from '@/services/api'
import type { DiscoverCandidato, DiscoverResult, ReglaConfig, ReglaEmp, ReglaCliente, Cliente } from '@/types'
import { useTenantStore } from '@/store/tenantStore'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function candidatoKey(c: DiscoverCandidato): string {
  return c.tipo === 'campo-receptor'
    ? `receptor_${c.field}`
    : `detalle_${c.lineFilter}_${c.key}`
}

function candidatoLabel(c: DiscoverCandidato): string {
  return c.tipo === 'campo-receptor' ? c.field! : `${c.lineFilter} · ${c.key}`
}

function candidatoSubtitle(c: DiscoverCandidato): string {
  return c.tipo === 'campo-receptor' ? 'Campo de receptor' : 'Campo de detalle'
}

function toConfig(c: DiscoverCandidato): ReglaConfig {
  if (c.tipo === 'campo-receptor') return { type: 'campo-receptor', field: c.field! }
  return { type: 'campo-detalle', lineFilter: c.lineFilter!, key: c.key! }
}

function configLabel(config: ReglaConfig): string {
  if (config.type === 'campo-receptor') return config.field
  return `${config.lineFilter} · ${config.key}`
}

function isConfiguredForCliente(c: DiscoverCandidato, reglasCliente: ReglaCliente[]): boolean {
  return reglasCliente.some((r) => {
    if (!r.reglaconfig) return false
    if (c.tipo === 'campo-receptor' && r.reglaconfig.type === 'campo-receptor') return r.reglaconfig.field === c.field
    if (c.tipo === 'campo-detalle' && r.reglaconfig.type === 'campo-detalle') {
      return r.reglaconfig.lineFilter === c.lineFilter && r.reglaconfig.key === c.key
    }
    return false
  })
}

function isActiveForCliente(c: DiscoverCandidato, reglasCliente: ReglaCliente[]): boolean {
  return reglasCliente.some((r) => {
    if (!r.activa || !r.reglaconfig) return false
    if (c.tipo === 'campo-receptor' && r.reglaconfig.type === 'campo-receptor') return r.reglaconfig.field === c.field
    if (c.tipo === 'campo-detalle' && r.reglaconfig.type === 'campo-detalle') {
      return r.reglaconfig.lineFilter === c.lineFilter && r.reglaconfig.key === c.key
    }
    return false
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminReglas() {
  const tenantNombre = useTenantStore((s) => s.tenantNombre)

  // Discovery
  const [discover, setDiscover] = useState<DiscoverResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Client selector
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteRut, setClienteRut] = useState<string | null>(null)
  const [reglasCliente, setReglasCliente] = useState<ReglaCliente[]>([])
  const [reglasClienteLoading, setReglasClienteLoading] = useState(false)
  const [activandoReglaidl, setActivandoReglaidl] = useState<string | null>(null)

  // Confirm modal
  const [confirmCandidato, setConfirmCandidato] = useState<DiscoverCandidato | null>(null)
  const [nombreCandidato, setNombreCandidato] = useState('')
  const [activating, setActivating] = useState(false)
  const [activateError, setActivateError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Inline nombre edit
  const [editingReglaidl, setEditingReglaidl] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [savingNombre, setSavingNombre] = useState(false)

  useEffect(() => {
    fetchClientes().catch(() => [] as Cliente[]).then(setClientes)
  }, [])

  useEffect(() => {
    if (!clienteRut) {
      setDiscover(null)
      setReglasCliente([])
      return
    }
    setDiscover(null)
    setLoading(true)
    setError(null)
    fetchDiscoverCandidatos(clienteRut)
      .then(setDiscover)
      .catch(() => setError('No se pudieron cargar los candidatos.'))
      .finally(() => setLoading(false))

    setReglasClienteLoading(true)
    fetchReglasPorCliente(clienteRut)
      .then(setReglasCliente)
      .catch(() => setReglasCliente([]))
      .finally(() => setReglasClienteLoading(false))
  }, [clienteRut])

  function handleActivar(c: DiscoverCandidato) {
    setConfirmCandidato(c)
    setActivateError(null)
    setNombreCandidato('')
  }

  async function handleConfirmar() {
    if (!confirmCandidato || !clienteRut) return
    setActivating(true)
    setActivateError(null)
    try {
      const created: ReglaEmp = await activarRegla(toConfig(confirmCandidato))
      await assignReglaCliente(clienteRut, created.reglaidl)
      if (nombreCandidato.trim()) {
        await updateReglanombre(created.reglaidl, nombreCandidato.trim())
      }
      const updatedReglas = await fetchReglasPorCliente(clienteRut)
      setReglasCliente(updatedReglas)
      setConfirmCandidato(null)
      setNombreCandidato('')
      const clienteNombre = clientes.find((c) => c.rut === clienteRut)?.nombre ?? clienteRut
      setSuccessMsg(`Regla asignada a ${clienteNombre}: ${candidatoLabel(confirmCandidato)}`)
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch {
      setActivateError('No se pudo asignar la regla. Intentá nuevamente.')
    } finally {
      setActivating(false)
    }
  }

  async function handleActivarReglaCliente(reglaidl: string) {
    if (!clienteRut) return
    setActivandoReglaidl(reglaidl)
    try {
      await activarReglaCliente(clienteRut, reglaidl)
      const updated = await fetchReglasPorCliente(clienteRut)
      setReglasCliente(updated)
    } catch {
      // silent
    } finally {
      setActivandoReglaidl(null)
    }
  }

  async function handleSaveNombre(reglaidl: string) {
    setSavingNombre(true)
    try {
      await updateReglanombre(reglaidl, editNombre.trim())
      setReglasCliente((prev) =>
        prev.map((r) => r.reglaidl === reglaidl ? { ...r, reglanombre: editNombre.trim() || null } : r),
      )
      setEditingReglaidl(null)
    } catch {
      // silent
    } finally {
      setSavingNombre(false)
    }
  }

  const clienteSeleccionado = clientes.find((c) => c.rut === clienteRut)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Section header */}
      <div>
        <h2 className="font-display text-[22px] font-bold text-foreground leading-tight">
          Configuración de Agrupación
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {tenantNombre} · Seleccioná un cliente para gestionar sus reglas de agrupación
        </p>
      </div>

      {/* Client selector */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cliente</label>
        <select
          data-testid="select-cliente"
          value={clienteRut ?? ''}
          onChange={(e) => setClienteRut(e.target.value || null)}
          className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">— Seleccioná un cliente —</option>
          {clientes.map((c) => (
            <option key={c.rut} value={c.rut}>
              {c.nombre} ({c.rut})
            </option>
          ))}
        </select>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div
          data-testid="success-msg"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-success-50 border border-success-100 text-success-600"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error loading */}
      {error && (
        <div
          data-testid="error-discover"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm bg-danger-50 border border-danger-100 text-danger-600"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Client rules panel */}
      {clienteRut && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Reglas de {clienteSeleccionado?.nombre ?? clienteRut}
          </h3>
          {reglasClienteLoading ? (
            <div data-testid="reglas-cliente-skeleton" className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-10 bg-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : reglasCliente.length === 0 ? (
            <p data-testid="reglas-cliente-empty" className="text-xs text-muted-foreground italic">
              Sin reglas configuradas. Asigná una desde los candidatos abajo.
            </p>
          ) : (
            <ul data-testid="reglas-cliente-list" className="space-y-2">
              {reglasCliente.map((r) => {
                const label = r.reglaconfig ? configLabel(r.reglaconfig) : r.reglaidl
                const isEditing = editingReglaidl === r.reglaidl
                return (
                  <li
                    key={r.reglaidl}
                    data-testid={`regla-cliente-${r.reglaidl}`}
                    className={[
                      'flex items-center gap-3 rounded-lg px-3.5 py-2.5 border text-sm',
                      r.activa ? 'border-success/40 bg-success/5' : 'border-border',
                    ].join(' ')}
                  >
                    {r.activa && (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-success-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            data-testid={`input-nombre-${r.reglaidl}`}
                            autoFocus
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            placeholder={label}
                            className="flex-1 rounded border border-border bg-background text-foreground text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
                          />
                          <button
                            data-testid={`btn-save-nombre-${r.reglaidl}`}
                            onClick={() => handleSaveNombre(r.reglaidl)}
                            disabled={savingNombre}
                            className="p-1 rounded text-success hover:text-success-600 disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingReglaidl(null)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs truncate">
                            {r.reglanombre ?? label}
                          </span>
                          {r.reglanombre && (
                            <span className="text-xs text-muted-foreground">({label})</span>
                          )}
                          <button
                            data-testid={`btn-editar-nombre-${r.reglaidl}`}
                            onClick={() => { setEditingReglaidl(r.reglaidl); setEditNombre(r.reglanombre ?? '') }}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {!r.activa && (
                      <button
                        data-testid={`btn-activar-regla-${r.reglaidl}`}
                        onClick={() => handleActivarReglaCliente(r.reglaidl)}
                        disabled={activandoReglaidl === r.reglaidl}
                        className="shrink-0 px-3 py-1 rounded-md text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        {activandoReglaidl === r.reglaidl ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : 'Activar'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* Loading skeletons for discover */}
      {loading && (
        <div data-testid="candidatos-skeleton" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-border rounded w-24 mb-3" />
              <div className="h-6 bg-border rounded w-40 mb-2" />
              <div className="h-4 bg-border rounded w-16 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 bg-border rounded-full w-20" />
                <div className="h-6 bg-border rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidates */}
      {!loading && !error && discover && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {discover.candidatos.length} candidato{discover.candidatos.length !== 1 ? 's' : ''}{' '}
              encontrado{discover.candidatos.length !== 1 ? 's' : ''} · muestra de{' '}
              <strong>{discover.muestraGuias}</strong> guías
            </p>
            {!clienteRut && (
              <span className="text-xs text-muted-foreground italic">
                Seleccioná un cliente para asignar reglas
              </span>
            )}
          </div>

          {discover.candidatos.length === 0 ? (
            <div
              data-testid="empty-candidatos"
              className="text-center py-16 text-muted-foreground text-sm"
            >
              <Settings className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No se encontraron candidatos en las guías muestreadas.</p>
              <p className="text-xs mt-1">Sincronizá guías antes de configurar una regla.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discover.candidatos.map((c) => {
                const key = candidatoKey(c)
                const activoParaCliente = clienteRut ? isActiveForCliente(c, reglasCliente) : false
                const configuradoParaCliente = clienteRut ? isConfiguredForCliente(c, reglasCliente) : false
                return (
                  <div
                    key={key}
                    data-testid={`candidato-${key}`}
                    className={[
                      'bg-card border rounded-xl p-5 flex flex-col gap-3 transition-colors',
                      activoParaCliente ? 'border-success/40' : 'border-border hover:border-primary/30',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'text-xs font-semibold rounded-full px-3 py-1 border',
                          c.tipo === 'campo-receptor'
                            ? 'bg-category-receptor/20 border-category-receptor/40 text-category-receptor'
                            : 'bg-category-detalle/20 border-category-detalle/40 text-category-detalle'
                        )}
                      >
                        {c.tipo === 'campo-receptor' ? 'Receptor' : 'Detalle'}
                      </span>
                      {activoParaCliente && (
                        <span className="flex items-center gap-1 text-xs font-medium text-success-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Activa
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-lg font-bold text-foreground font-mono">
                        {candidatoLabel(c)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {candidatoSubtitle(c)} ·{' '}
                        <strong>{c.ocurrencias}</strong> guía{c.ocurrencias !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {c.ejemplos.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.ejemplos.map((ej) => (
                          <span
                            key={ej}
                            className="text-xs rounded-full px-2.5 py-1 border border-border text-muted-foreground bg-background"
                          >
                            {ej}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-2 flex justify-end">
                      {activoParaCliente ? (
                        <span className="text-xs text-muted-foreground italic">Activa para este cliente</span>
                      ) : configuradoParaCliente ? (
                        <span className="text-xs text-muted-foreground italic">Ya configurada</span>
                      ) : (
                        <button
                          data-testid={`btn-activar-${key}`}
                          onClick={() => { if (clienteRut) handleActivar(c) }}
                          disabled={!clienteRut}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Asignar
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Confirm modal */}
      {confirmCandidato && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmCandidato(null) }}
        >
          <div className="bg-card rounded-xl shadow-2xl border border-border w-[480px] max-w-[92vw] p-7">
            <h2 className="font-display text-[17px] font-bold text-foreground mb-1">
              Asignar regla de agrupación
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Las guías de{' '}
              <strong className="text-foreground">
                {clientes.find((c) => c.rut === clienteRut)?.nombre ?? clienteRut}
              </strong>{' '}
              se agruparán por{' '}
              <strong className="text-foreground font-mono">{candidatoLabel(confirmCandidato)}</strong>.
            </p>

            <div className="border border-border rounded-lg overflow-hidden mb-4">
              {[
                { label: 'Tipo', value: candidatoSubtitle(confirmCandidato) },
                { label: 'Campo', value: candidatoLabel(confirmCandidato) },
                { label: 'Ocurrencias', value: `${confirmCandidato.ocurrencias} guías` },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-3"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-mono font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Nombre de display <span className="opacity-60">(opcional)</span>
              </label>
              <input
                data-testid="input-nombre-candidato"
                value={nombreCandidato}
                onChange={(e) => setNombreCandidato(e.target.value)}
                placeholder={`ej: Por ${candidatoLabel(confirmCandidato)}`}
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {activateError && (
              <div
                data-testid="error-activar"
                className="flex items-center gap-2 rounded-lg px-3.5 py-3 mb-4 text-sm bg-danger-50 border border-danger-100 text-danger-600"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {activateError}
              </div>
            )}

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setConfirmCandidato(null)}
                disabled={activating}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                data-testid="btn-confirmar-activar"
                onClick={handleConfirmar}
                disabled={activating}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {activating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Asignando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
````

## File: src/pages/Clientes.test.tsx
````typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Clientes from './Clientes'
// ReglaActivaPopup es renderizado por Clientes internamente — fetchReglasEmpresa debe estar mockeado
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Cliente } from '@/types'

vi.mock('@/services/api', () => ({
  fetchClientes: vi.fn(),
  fetchReglasEmpresa: vi.fn(),
  assignReglaCliente: vi.fn(),
  fetchMetricas: vi.fn().mockResolvedValue({
    totalGuias: 10, clientesActivos: 2, factEst: 2, montoEstimado: 5000000,
    clientesConRezagadas: 0, tendenciaGuias: 0, tendenciaFactEst: 0, tendenciaClientes: 0,
  }),
}))

const mockClientes: Cliente[] = [
  { id: 'c1', nombre: 'Constructora Aconcagua S.A.', rut: '76543210-K', guiasPendientes: 14, factEst: 3, montoNeto: 10450000, reglaIdl: '977_campo_receptor_CmnaRecep' },
  { id: 'c2', nombre: 'Minera del Norte Ltda.', rut: '96123456-2', guiasPendientes: 9, factEst: 2, montoNeto: 7120000, reglaIdl: null },
]

const mockReglasEmpresa = [
  { reglaIdl: '977_campo_receptor_CmnaRecep', reglaDesc: 'Por comuna recep.' },
  { reglaIdl: '977_campo_detalle_OBRA', reglaDesc: 'Por obra' },
]

describe('Clientes page', () => {
  beforeEach(async () => {
    usePeriodoStore.setState({ periodo: 'actual' })
    useTenantStore.setState({ tenantId: 'test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockResolvedValue(mockClientes)
    vi.mocked(api.fetchReglasEmpresa).mockResolvedValue(mockReglasEmpresa)
    vi.mocked(api.assignReglaCliente).mockResolvedValue(undefined as never)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Clientes />
      </MemoryRouter>,
    )

  const renderPageWithNav = () =>
    render(
      <MemoryRouter initialEntries={['/clientes']}>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/guias" element={<div data-testid="guias-page">Guías</div>} />
        </Routes>
      </MemoryRouter>,
    )

  it('muestra skeleton inicialmente y luego carga clientes', async () => {
    renderPage()
    expect(screen.getByTestId('clientes-grid-skeleton')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument()
    })
  })

  it('muestra tabs tab-actual y tab-anterior', () => {
    renderPage()
    expect(screen.getByTestId('tab-actual')).toBeInTheDocument()
    expect(screen.getByTestId('tab-anterior')).toBeInTheDocument()
  })

  it('tab activo tiene clase border-primary cuando periodo=actual', () => {
    renderPage()
    expect(screen.getByTestId('tab-actual').className).toContain('border-primary')
  })

  it('tab inactivo NO tiene border-primary', () => {
    renderPage()
    const tabAnterior = screen.getByTestId('tab-anterior')
    expect(tabAnterior.className).not.toContain('border-primary')
    expect(tabAnterior.className).toContain('border-transparent')
  })

  it('click en tab-anterior cambia periodoStore a anterior', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('tab-anterior'))
    expect(usePeriodoStore.getState().periodo).toBe('anterior')
  })

  it('renderiza buscador con placeholder correcto', () => {
    renderPage()
    expect(screen.getByTestId('buscador')).toHaveAttribute('placeholder', 'Buscar por nombre o RUT...')
  })

  it('renderiza botón facturar-global-secundario', () => {
    renderPage()
    expect(screen.getByTestId('facturar-global-secundario')).toHaveTextContent('Facturar Global')
  })

  it('buscador dispara fetchClientes tras debounce al escribir', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockClear()

    await userEvent.type(screen.getByTestId('buscador'), 'a')

    await waitFor(
      () => { expect(api.fetchClientes).toHaveBeenCalled() },
      { timeout: 1000 },
    )
  })

  it('cambio de tab período dispara fetchClientes de nuevo', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockClear()

    await userEvent.click(screen.getByTestId('tab-anterior'))

    await waitFor(() => { expect(api.fetchClientes).toHaveBeenCalled() })
  })

  it('error en fetchClientes → clientes vacíos, sin crash', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchClientes).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.queryByTestId('clientes-grid-skeleton')).not.toBeInTheDocument()
    })
    expect(screen.getByText('No hay clientes para este período.')).toBeInTheDocument()
  })

  it('Ver Guías navega a /guias con clienteId del cliente', async () => {
    renderPageWithNav()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button', { name: 'Ver Guías' })
    await userEvent.click(buttons[0])
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  it('Facturar navega a /guias con clienteId del cliente', async () => {
    renderPageWithNav()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button', { name: 'Facturar' })
    await userEvent.click(buttons[0])
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  // ── ReglaActivaPopup (v3) ──────────────────────────────────────────────────

  it('click en ícono gestionar-regla abre popup con nombre del cliente', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByRole('dialog')).toHaveTextContent('Constructora Aconcagua S.A.')
  })

  it('el popup carga y muestra las reglas disponibles de la empresa', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))

    expect(await screen.findByText('Por comuna recep.')).toBeInTheDocument()
    expect(screen.getByText('Por obra')).toBeInTheDocument()
  })

  it('guardar en popup llama assignReglaCliente y re-fetch clientes', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))
    await screen.findByText('Por obra')

    // cliente c1 ya tiene regla → cambio dispara diálogo de resincronización
    await user.click(screen.getByLabelText(/por obra/i))
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    // confirmar en el diálogo de resincronización (default: re-sincronizar)
    await screen.findAllByText(/re-sincronizar/i)
    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    const api = await import('@/services/api')
    await waitFor(() => {
      expect(api.assignReglaCliente).toHaveBeenCalledWith(
        '76543210-K',
        '977_campo_detalle_OBRA',
        expect.objectContaining({ recomputar: true }),
      )
    })
    await waitFor(() => {
      expect(api.fetchClientes).toHaveBeenCalledTimes(2) // mount + after save
    })
  })

  it('cancelar popup cierra sin llamar al servicio', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(screen.getByText('Constructora Aconcagua S.A.')).toBeInTheDocument())

    await user.click(screen.getByTestId('gestionar-regla-76543210-K'))
    await screen.findByText('Por obra')

    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const api = await import('@/services/api')
    expect(api.assignReglaCliente).not.toHaveBeenCalled()
  })
})
````

## File: src/pages/Clientes.tsx
````typescript
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MetricsPanel } from '@/components/MetricsPanel'
import { ClientesGrid } from '@/components/ClientesGrid'
import { ReglaActivaPopup } from '@/components/ReglaActivaPopup/ReglaActivaPopup'
import { usePeriodoStore } from '@/store/periodoStore'
import { fetchClientes } from '@/services/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { periodoToRange } from '@/utils/periodo'
import type { Cliente, Periodo } from '@/types'

export default function Clientes() {
  const navigate = useNavigate()
  const periodo = usePeriodoStore((s) => s.periodo)
  const setPeriodo = usePeriodoStore((s) => s.setPeriodo)

  const [query, setQuery] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Popup state
  const [popupRut, setPopupRut] = useState<string | null>(null)

  const loadClientes = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const data = await fetchClientes(q || undefined)
      setClientes(data)
    } catch {
      setClientes([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch al cambiar período
  useEffect(() => {
    loadClientes(query)
  }, [periodo]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch con debounce al cambiar query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      loadClientes(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  const popupCliente = clientes.find((c) => c.rut === popupRut)

  const tabs: { key: Periodo; label: string; testId: string; mesLabel: string }[] = [
    { key: 'anterior', label: 'Mes Anterior', testId: 'tab-anterior', mesLabel: periodoToRange('anterior').label },
    { key: 'actual',   label: 'Mes Actual',   testId: 'tab-actual',   mesLabel: periodoToRange('actual').label  },
  ]

  return (
    <div className="space-y-6">
      <MetricsPanel />

      {/* Tabs de período con navegación ◄ ► */}
      <div className="flex items-center border-b border-border">
        <nav className="-mb-px flex flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              data-testid={tab.testId}
              onClick={() => setPeriodo(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors text-left ${
                periodo === tab.key
                  ? 'border-primary text-foreground bg-primary/10'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <span className="block">{tab.label}</span>
              <span className="block text-xs font-normal opacity-60">{tab.mesLabel}</span>
            </button>
          ))}
        </nav>

        {/* Flechas de navegación */}
        <div className="flex items-center gap-0.5 px-3 pb-px">
          <button
            type="button"
            aria-label="Ir a mes anterior"
            disabled={periodo === 'anterior'}
            onClick={() => setPeriodo('anterior')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Ir a mes actual"
            disabled={periodo === 'actual'}
            onClick={() => setPeriodo('actual')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Buscador + Facturar Global secundario */}
      <div className="flex items-center justify-between gap-4">
        <Input
          data-testid="buscador"
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 max-w-md"
        />
        <Button
          variant="default"
          data-testid="facturar-global-secundario"
          onClick={() => navigate('/guias')}
        >
          Facturar Global
        </Button>
      </div>

      {/* Grilla de clientes */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <ClientesGrid
          clientes={clientes}
          loading={loading}
          hasQuery={query.trim().length > 0}
          onVerGuias={(id) => navigate(`/guias?clienteId=${id}`)}
          onFacturar={(id) => navigate(`/guias?clienteId=${id}`)}
          onGestionarRegla={(rut) => setPopupRut(rut)}
        />
      </div>

      {/* Popup regla activa */}
      {popupRut && popupCliente && (
        <ReglaActivaPopup
          clienteNombre={popupCliente.nombre}
          rut={popupRut}
          reglaActual={popupCliente.reglaIdl}
          onClose={() => setPopupRut(null)}
          onSaved={() => loadClientes(query)}
        />
      )}
    </div>
  )
}
````

## File: src/pages/Guias.test.tsx
````typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GuiasPage from './Guias'
import { useSeleccionStore } from '@/store/seleccionStore'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Guia, Cliente } from '@/types'

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count, estimateSize }: { count: number; estimateSize: (i: number) => number }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        key: i,
        start: 0,
        end: estimateSize(i),
        size: estimateSize(i),
        lane: 0,
      })),
    getTotalSize: () => 0,
  }),
}))

vi.mock('@/services/api', () => ({
  fetchGuias:    vi.fn(),
  fetchClientes: vi.fn(),
}))

const mockClientes: Cliente[] = [
  { id: 'c1', nombre: 'Constructora Aconcagua S.A.', rut: '76.543.210-K', guiasPendientes: 14, factEst: 3, montoNeto: 10450000, reglaIdl: null },
  { id: 'c2', nombre: 'Minera del Norte Ltda.', rut: '96.123.456-2', guiasPendientes: 9, factEst: 2, montoNeto: 7120000, reglaIdl: null },
]

const mockGuias: Guia[] = [
  { id: 'g1', numero: '4401', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-06-03', descripcion: 'Hormigón premezclado', cantidad: 1, montoNeto: 1290000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g2', numero: '4402', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-06-05', descripcion: 'Fierro galvanizado', cantidad: 24, montoNeto: 480000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g3', numero: '4403', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-06-07', descripcion: 'Cemento Portland', cantidad: 50, montoNeto: 750000, agrupadorId: 'a2', agrupadorCodigo: 'OC 0002', agrupadorColor: '#dcfce7', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g4', numero: '4404', clienteId: 'c2', clienteNombre: 'Minera del Norte Ltda.', fecha: '2026-06-04', descripcion: 'Explosivos industriales', cantidad: 10, montoNeto: 2350000, agrupadorId: 'a3', agrupadorCodigo: 'DIR Santiago Centro', agrupadorColor: '#fef9c3', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
]

describe('Guias page', () => {
  beforeEach(async () => {
    // Las guías de prueba están fechadas en junio 2026: fijamos el reloj ahí para
    // que "Mes Actual" (calculado con Date real en DateFilter) siempre las incluya,
    // sin importar en qué fecha real corra la suite.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-06-15T12:00:00'))

    useSeleccionStore.setState({ seleccionActiva: [] })
    usePeriodoStore.setState({ periodo: 'actual' })
    useTenantStore.setState({ tenantId: 'tenant-test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(mockGuias)
    vi.mocked(api.fetchClientes).mockResolvedValue(mockClientes)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderPage = (initialEntries = ['/guias']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/guias" element={<GuiasPage />} />
          <Route path="/preview" element={<div>Preview Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

  // ── Layout inicial ────────────────────────────────────────────────────────

  it('does NOT render breadcrumb when no client is selected', () => {
    renderPage()
    expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
  })

  it('shows search input always visible; date-filter and filtro-cliente after expanding filtros', async () => {
    const user = userEvent.setup()
    renderPage()
    expect(screen.getByPlaceholderText(/buscar por n° guía/i)).toBeInTheDocument()
    expect(screen.queryByTestId('date-filter')).not.toBeInTheDocument()
    expect(screen.queryByTestId('filtro-cliente')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('toggle-filtros'))

    expect(screen.getByTestId('date-filter')).toBeInTheDocument()
    expect(screen.getByTestId('filtro-cliente')).toBeInTheDocument()
  })

  it('does NOT render legacy "Guía DTE" badge', () => {
    renderPage()
    expect(screen.queryByText('Guía DTE')).not.toBeInTheDocument()
  })

  it('does NOT render legacy "Ver solo sin agrupador" checkbox', () => {
    renderPage()
    expect(screen.queryByText(/sin agrupador/i)).not.toBeInTheDocument()
  })

  it('no cascading filtro-agrupador select present', () => {
    renderPage()
    expect(screen.queryByTestId('filtro-agrupador')).not.toBeInTheDocument()
  })

  // ── Carga de guías ────────────────────────────────────────────────────────

  it('loads guías on mount and renders rows', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
    })
    expect(screen.getByTestId('guia-row-g2')).toBeInTheDocument()
  })

  it('pre-fills filtroCliente from URL ?clienteId param', async () => {
    const user = userEvent.setup()
    renderPage(['/guias?clienteId=c1'])
    await user.click(screen.getByTestId('toggle-filtros'))
    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).value).toBe('c1')
    })
  })

  // ── Metric cards ──────────────────────────────────────────────────────────

  it('renders metric cards after guías load', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('guias-metricas')).toBeInTheDocument()
    })
    expect(screen.getByText('pendientes de facturar')).toBeInTheDocument()
    expect(screen.getByText(/facturas? a emitir/i)).toBeInTheDocument()
  })

  it('metric card reflects total guías count', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('guias-metricas')).toBeInTheDocument()
    })
    expect(screen.getByTestId('guias-metricas')).toHaveTextContent(String(mockGuias.length))
  })

  // ── Agrupador chips ────────────────────────────────────────────────────────

  it('renders agrupador chips after guías load', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))
    await waitFor(() => {
      expect(screen.getByTestId('agrupador-chips')).toBeInTheDocument()
    })
    expect(screen.getByTestId('chip-agrupador-a1')).toBeInTheDocument()
    expect(screen.getByTestId('chip-agrupador-a2')).toBeInTheDocument()
    expect(screen.getByTestId('chip-agrupador-a3')).toBeInTheDocument()
  })

  it('clicking agrupador chip filters grid to only that agrupador', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect(screen.getByTestId('chip-agrupador-a1')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('chip-agrupador-a1'))

    await waitFor(() => {
      expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
      expect(screen.getByTestId('guia-row-g2')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('guia-row-g3')).not.toBeInTheDocument()
    expect(screen.queryByTestId('guia-row-g4')).not.toBeInTheDocument()
  })

  it('clicking active chip again deselects it and shows all guías', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect(screen.getByTestId('chip-agrupador-a1')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('chip-agrupador-a1'))
    await user.click(screen.getByTestId('chip-agrupador-a1'))

    await waitFor(() => {
      expect(screen.getByTestId('guia-row-g1')).toBeInTheDocument()
      expect(screen.getByTestId('guia-row-g3')).toBeInTheDocument()
      expect(screen.getByTestId('guia-row-g4')).toBeInTheDocument()
    })
  })

  // ── Breadcrumb ─────────────────────────────────────────────────────────────

  it('shows breadcrumb with client name and RUT when client is selected', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    })
    const breadcrumb = screen.getByTestId('breadcrumb')
    expect(within(breadcrumb).getByText('Constructora Aconcagua S.A.')).toBeInTheDocument()
    expect(within(breadcrumb).getByText('76.543.210-K')).toBeInTheDocument()
  })

  it('clicking breadcrumb "Clientes" resets client filter and removes breadcrumb', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /clientes/i }))

    await waitFor(() => {
      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
    })
    expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).value).toBe('')
  })

  // ── Filtro cliente ────────────────────────────────────────────────────────

  it('selecting cliente updates dropdown value', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')
    expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).value).toBe('c1')
  })

  it('clearing cliente dropdown removes breadcrumb', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')
    await user.selectOptions(screen.getByTestId('filtro-cliente'), '')

    await waitFor(() => {
      expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument()
    })
  })

  it('changing filtro-cliente clears an active selection (no cross-cliente selección fantasma)', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    useSeleccionStore.getState().agregar(mockGuias[0])

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).not.toBeDisabled()
    })

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c2')

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).toBeDisabled()
    })
    expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(0)
  })

  // ── Facturar Selección ────────────────────────────────────────────────────

  it('"Facturar Selección" button is disabled when nothing is selected', () => {
    renderPage()
    expect(screen.getByTestId('btn-facturar-seleccion')).toBeDisabled()
  })

  it('"Facturar Selección" button is enabled after adding a guía to the store', async () => {
    renderPage()
    useSeleccionStore.getState().agregar(mockGuias[0])

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).not.toBeDisabled()
    })
  })

  it('clicking "Facturar Selección" opens ConfirmDialog', async () => {
    const user = userEvent.setup()
    renderPage()

    useSeleccionStore.getState().agregar(mockGuias[0])

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-seleccion')).not.toBeDisabled()
    })

    await user.click(screen.getByTestId('btn-facturar-seleccion'))

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    })
  })

  it('"Facturar Selección" shows count of selected guías', async () => {
    renderPage()
    useSeleccionStore.getState().agregar(mockGuias[0])
    useSeleccionStore.getState().agregar(mockGuias[1])

    await waitFor(() => {
      expect(screen.getByTestId('facturar-seleccion-count')).toHaveTextContent('2')
    })
  })

  // ── Agrupador combobox (>= 8 agrupadores) ─────────────────────────────────

  it('shows combobox instead of chips when there are 8 or more agrupadores', async () => {
    const guiasWith8Agrupadores: Guia[] = Array.from({ length: 8 }, (_, i) => ({
      id: `gx${i}`,
      numero: `500${i}`,
      clienteId: 'c1',
      clienteNombre: 'Test',
      fecha: '2026-06-01',
      descripcion: 'Test',
      cantidad: 1,
      montoNeto: 1000,
      agrupadorId: `ax${i}`,
      agrupadorCodigo: `ZONA-${i}`,
      agrupadorColor: '#dbeafe',
      agrupadorNombre: null,
      reglaIdl: null,
      estado: 'pendiente' as const,
    }))
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(guiasWith8Agrupadores)
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))
    await waitFor(() => expect(screen.getByTestId('agrupador-combobox')).toBeInTheDocument())
    expect(screen.queryByTestId('chip-agrupador-ax0')).not.toBeInTheDocument()
  })

  it('combobox search input filters options', async () => {
    const guiasWith8Agrupadores: Guia[] = Array.from({ length: 8 }, (_, i) => ({
      id: `gx${i}`,
      numero: `500${i}`,
      clienteId: 'c1',
      clienteNombre: 'Test',
      fecha: '2026-06-01',
      descripcion: 'Test',
      cantidad: 1,
      montoNeto: 1000,
      agrupadorId: `ax${i}`,
      agrupadorCodigo: i < 4 ? `NORTE-${i}` : `SUR-${i}`,
      agrupadorColor: '#dbeafe',
      agrupadorNombre: null,
      reglaIdl: null,
      estado: 'pendiente' as const,
    }))
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(guiasWith8Agrupadores)
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))
    await waitFor(() => expect(screen.getByTestId('combobox-agrupador-busqueda')).toBeInTheDocument())
    await user.type(screen.getByTestId('combobox-agrupador-busqueda'), 'NORTE')
    const select = screen.getByTestId('combobox-agrupador-select') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.text)
    expect(options.filter((t) => t.startsWith('NORTE'))).toHaveLength(4)
    expect(options.filter((t) => t.startsWith('SUR'))).toHaveLength(0)
  })

  it('shows chips when there are exactly 7 agrupadores', async () => {
    const guiasWith7: Guia[] = Array.from({ length: 7 }, (_, i) => ({
      id: `gy${i}`,
      numero: `600${i}`,
      clienteId: 'c1',
      clienteNombre: 'Test',
      fecha: '2026-06-01',
      descripcion: 'Test',
      cantidad: 1,
      montoNeto: 1000,
      agrupadorId: `ay${i}`,
      agrupadorCodigo: `GRP-${i}`,
      agrupadorColor: '#dbeafe',
      agrupadorNombre: null,
      reglaIdl: null,
      estado: 'pendiente' as const,
    }))
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockResolvedValue(guiasWith7)
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))
    await waitFor(() => expect(screen.getByTestId('chip-agrupador-ay0')).toBeInTheDocument())
    expect(screen.queryByTestId('agrupador-combobox')).not.toBeInTheDocument()
  })

  // ── Banner de filtro activo (issue #3) ────────────────────────────────────

  it('shows the compact filter banner once filtros están abiertos (rango de mes activo por defecto)', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))
    await waitFor(() => {
      expect(screen.getByTestId('filtro-accion-banner')).toBeInTheDocument()
    })
  })

  it('does NOT render a clickable "Facturar filtro" button when el filtro mezcla distintos clientes (evita el no-op silencioso)', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect(screen.getByTestId('filtro-accion-banner')).toBeInTheDocument()
    })

    // mockGuias mezcla c1 y c2 — el filtro por defecto (solo rango de mes) es heterogéneo
    expect(screen.queryByTestId('btn-facturar-filtro')).not.toBeInTheDocument()
    expect(screen.getByTestId('filtro-heterogeneo-hint')).toBeInTheDocument()
  })

  it('shows an enabled "Facturar filtro" button once el filtro queda acotado a un solo cliente', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockImplementation((params?: Record<string, string>) =>
      Promise.resolve(
        params?.clienteId ? mockGuias.filter((g) => g.clienteId === params.clienteId) : mockGuias,
      ),
    )
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-filtro')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('filtro-heterogeneo-hint')).not.toBeInTheDocument()
  })

  it('clicking "Facturar filtro" agrega el lote a la selección y abre ConfirmDialog', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchGuias).mockImplementation((params?: Record<string, string>) =>
      Promise.resolve(
        params?.clienteId ? mockGuias.filter((g) => g.clienteId === params.clienteId) : mockGuias,
      ),
    )
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('toggle-filtros'))

    await waitFor(() => {
      expect((screen.getByTestId('filtro-cliente') as HTMLSelectElement).options.length).toBeGreaterThan(1)
    })

    await user.selectOptions(screen.getByTestId('filtro-cliente'), 'c1')

    await waitFor(() => {
      expect(screen.getByTestId('btn-facturar-filtro')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('btn-facturar-filtro'))

    await waitFor(() => {
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
    })
    expect(useSeleccionStore.getState().seleccionActiva.length).toBeGreaterThan(0)
  })
})
````

## File: src/pages/Guias.tsx
````typescript
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, FileText, Tag, Receipt, ArrowLeft, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { GuiasGrid } from '@/components/GuiasGrid'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ErrorBanner } from '@/components/ErrorBanner/ErrorBanner'
import { MetricCard } from '@/components/MetricCard'
import type { SummaryRow } from '@/components/ConfirmDialog/ConfirmDialog'
import { DateFilter } from '@/components/DateFilter'
import { useSeleccionStore } from '@/store/seleccionStore'
import { fetchGuias, fetchClientes } from '@/services/api'
import { getChipTextColor } from '@/utils/agrupadorColors'
import { useGuiasFilters } from '@/hooks/useGuiasFilters'
import type { Guia, Cliente } from '@/types'

const clpFmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

function fmtMonto(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return clpFmt.format(n)
}

export default function GuiasPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const seleccionActiva = useSeleccionStore((s) => s.seleccionActiva)
  const agregar = useSeleccionStore((s) => s.agregar)
  const quitar = useSeleccionStore((s) => s.quitar)

  const [guias, setGuias] = useState<Guia[]>([])
  const [loading, setLoading] = useState(true)
  const [guiasError, setGuiasError] = useState<Error | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const {
    busqueda, setBusqueda,
    filtroCliente, setFiltroCliente,
    filtroAgrupador, setFiltroAgrupador,
    busquedaAgrupador, setBusquedaAgrupador,
    dateRange, setDateRange,
    guiasPreFiltradas, guiasFiltradas,
    agrupadores, agrupadoresFiltrados,
    montoTotal, montoFiltrado,
    hasActiveFilter, filtroEsHomogeneo,
  } = useGuiasFilters(guias, searchParams.get('clienteId') ?? '')

  useEffect(() => {
    fetchClientes().then(setClientes).catch(() => setClientes([]))
  }, [])

  const loadGuias = useCallback(async () => {
    setLoading(true)
    setGuiasError(null)
    try {
      const params: Record<string, string> = {}
      if (filtroCliente)  params.clienteId = filtroCliente
      if (dateRange.from) params.from = dateRange.from
      if (dateRange.to)   params.to   = dateRange.to
      const data = await fetchGuias(params)
      setGuias(data)
    } catch (err) {
      setGuiasError(err instanceof Error ? err : new Error('Error al cargar guías'))
      setGuias([])
    } finally {
      setLoading(false)
    }
  }, [filtroCliente, dateRange])

  useEffect(() => {
    loadGuias()
  }, [loadGuias])

  useEffect(() => {
    useSeleccionStore.getState().limpiar()
  }, [filtroCliente])

  const selectedIds = useMemo(
    () => new Set(seleccionActiva.map((g) => g.id)),
    [seleccionActiva],
  )

  const handleSeleccionChange = useCallback((guia: Guia, checked: boolean) => {
    if (checked) agregar(guia)
    else quitar(guia.id)
  }, [agregar, quitar])

  const montoSeleccion = useMemo(
    () => seleccionActiva.reduce((s, g) => s + g.montoNeto, 0),
    [seleccionActiva]
  )

  const clienteActivo: Cliente | undefined = clientes.find((c) => c.id === filtroCliente)

  const handleFacturarAgrupador = (_agrupadorId: string, agrupadorGuias: Guia[]) => {
    useSeleccionStore.getState().agregarLote(agrupadorGuias)
    setDialogOpen(true)
  }

  const handleFacturarFiltro = () => {
    useSeleccionStore.getState().agregarLote(guiasFiltradas)
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    setDialogOpen(false)
    navigate('/preview')
  }

  const handleCancel = () => {
    useSeleccionStore.getState().limpiar()
    setDialogOpen(false)
  }

  // Build summary rows for the confirm dialog
  const dialogSummary: SummaryRow[] = useMemo(() => {
    const iva = Math.round(montoSeleccion * 0.19)
    return [
      { label: 'Guías seleccionadas', value: String(seleccionActiva.length) },
      { label: 'Monto Neto', value: clpFmt.format(montoSeleccion) },
      { label: 'IVA (19%)', value: clpFmt.format(iva) },
      { label: 'Total con IVA', value: clpFmt.format(montoSeleccion + iva), highlight: true },
    ]
  }, [seleccionActiva.length, montoSeleccion])

  return (
    <div data-testid="guias-page" className="space-y-4">

      {/* Breadcrumb cuando hay cliente activo */}
      {clienteActivo && (
        <div data-testid="breadcrumb" className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setFiltroCliente('')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Clientes
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{clienteActivo.nombre}</span>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono border"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--primary)',
              borderColor: 'var(--primary)' + '44',
            }}
          >
            {clienteActivo.rut}
          </span>
        </div>
      )}

      <ErrorBanner error={guiasError} />

      {/* Metric cards */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3" data-testid="guias-metricas">
          <MetricCard
            icon={<FileText className="w-3.5 h-3.5" aria-hidden="true" />}
            label="Guías de despacho"
            value={guiasPreFiltradas.length}
            subtitle="pendientes de facturar"
          />

          <MetricCard
            icon={<Tag className="w-3.5 h-3.5" aria-hidden="true" />}
            label="Agrupadores detectados"
            value={agrupadores.length}
            subtitle={agrupadores.length > 0 ? agrupadores.map((a) => a.codigo).join(' · ') : '—'}
            accentColor="var(--muted-foreground)"
          />

          <MetricCard
            icon={<Receipt className="w-3.5 h-3.5" aria-hidden="true" />}
            label="Monto total"
            value={fmtMonto(montoTotal)}
            subtitle={`~${agrupadores.length || 1} factura${agrupadores.length !== 1 ? 's' : ''} a emitir`}
          />
        </div>
      )}

      {/* Filter action banner — barra compacta de una línea, visible cuando hay filtro activo */}
      {hasActiveFilter && !loading && (
        <div
          data-testid="filtro-accion-banner"
          className="rounded-lg px-3.5 py-2 flex items-center justify-between gap-3 bg-gradient-to-br from-primary to-lucien-700 text-sm"
        >
          <div className="text-white font-medium truncate">
            <span className="font-mono text-blue-200">{guiasFiltradas.length}</span>
            {' '}guía{guiasFiltradas.length !== 1 ? 's' : ''} en el filtro
            {' · '}
            <span className="font-mono text-blue-200">{fmtMonto(montoFiltrado)}</span>
          </div>
          {filtroEsHomogeneo ? (
            <button
              data-testid="btn-facturar-filtro"
              onClick={handleFacturarFiltro}
              className="bg-white font-semibold text-xs px-3 py-1 rounded-md transition-colors hover:opacity-90 whitespace-nowrap shrink-0"
              style={{ color: 'var(--primary)' }}
            >
              Facturar filtro
            </button>
          ) : (
            <span data-testid="filtro-heterogeneo-hint" className="text-xs text-blue-100/80 italic whitespace-nowrap shrink-0">
              Acota a un cliente para facturar en lote
            </span>
          )}
        </div>
      )}

      {/* Panel de filtros unificado */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border">

        {/* Búsqueda — siempre visible */}
        <div className="px-4 py-3 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por N° guía, descripción o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Toggle Filtros */}
        <div className="px-4 py-2">
          <button
            type="button"
            data-testid="toggle-filtros"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filtros
            {filtrosAbiertos ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {filtrosAbiertos && (
          <>
            {/* Fecha */}
            <div className="px-4 py-3">
              <DateFilter onChange={setDateRange} />
            </div>

            {/* Cliente → Agrupador */}
            <div className="px-4 py-3 flex flex-col gap-3">
              {/* Fila cliente */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20 shrink-0">
                  Cliente
                </span>
                <select
                  data-testid="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fila agrupador — chips (< 8) o combobox (>= 8) */}
              {agrupadores.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap" data-testid="agrupador-chips">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20 shrink-0">
                    Agrupador
                  </span>

                  {agrupadores.length < 8 ? (
                    <>
                      {/* Chip "Todos" */}
                      <button
                        onClick={() => setFiltroAgrupador('')}
                        className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                          filtroAgrupador === ''
                            ? 'font-semibold'
                            : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                        }`}
                        style={
                          filtroAgrupador === ''
                            ? { backgroundColor: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }
                            : undefined
                        }
                      >
                        Todos
                      </button>

                      {/* Chips por agrupador */}
                      {agrupadores.map((ag) => {
                        const isActive = filtroAgrupador === ag.id
                        const chipText = getChipTextColor(ag.color)
                        return (
                          <button
                            key={ag.id}
                            data-testid={`chip-agrupador-${ag.id}`}
                            onClick={() => setFiltroAgrupador(isActive ? '' : ag.id)}
                            className="text-xs px-3 py-1 rounded-full border font-medium transition-all font-mono tracking-wide"
                            style={
                              isActive
                                ? {
                                    backgroundColor: ag.color,
                                    color: chipText,
                                    borderColor: ag.color,
                                    boxShadow: `0 0 0 2px ${ag.color}55`,
                                  }
                                : {
                                    backgroundColor: ag.color + '22',
                                    color: ag.color,
                                    borderColor: ag.color + '66',
                                  }
                            }
                          >
                            {ag.nombre || ag.codigo}
                          </button>
                        )
                      })}
                    </>
                  ) : (
                    /* Combobox con búsqueda para >= 8 agrupadores */
                    <div className="flex items-center gap-2 flex-1" data-testid="agrupador-combobox">
                      <input
                        data-testid="combobox-agrupador-busqueda"
                        type="text"
                        value={busquedaAgrupador}
                        onChange={(e) => setBusquedaAgrupador(e.target.value)}
                        placeholder="Buscar agrupador..."
                        className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground w-40 focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <select
                        data-testid="combobox-agrupador-select"
                        value={filtroAgrupador}
                        onChange={(e) => { setFiltroAgrupador(e.target.value); setBusquedaAgrupador('') }}
                        className="border border-input rounded-lg px-3 py-1.5 text-sm bg-background text-foreground flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Todos los agrupadores</option>
                        {agrupadoresFiltrados.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.nombre || ag.codigo}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {filtroAgrupador && (
                    <span className="text-xs text-muted-foreground">
                      · {guiasFiltradas.length} guía{guiasFiltradas.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Grilla de guías */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <GuiasGrid
          guias={guiasFiltradas}
          loading={loading}
          onFacturarAgrupador={handleFacturarAgrupador}
          selectedIds={selectedIds}
          onSeleccionChange={handleSeleccionChange}
        />
      </div>

      {seleccionActiva.length > 0 && <div data-testid="bulk-bar-spacer" style={{ height: 96 }} />}

      {/* Bulk bar — flotante centrado cuando hay selección, estilo mockup */}
      <div
        className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all duration-300"
        style={{
          backgroundColor: 'var(--popover)',
          boxShadow: '0 8px 40px rgba(29,34,66,.40)',
          transform: `translateX(-50%) translateY(${seleccionActiva.length > 0 ? '0' : '90px'})`,
          opacity: seleccionActiva.length > 0 ? 1 : 0,
          pointerEvents: seleccionActiva.length > 0 ? 'auto' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="text-sm font-semibold text-white">
          <span className="text-blue-300 font-mono">{seleccionActiva.length}</span> guía{seleccionActiva.length !== 1 ? 's' : ''} seleccionada{seleccionActiva.length !== 1 ? 's' : ''}
        </span>
        <span className="text-blue-300 font-mono text-sm">{fmtMonto(montoSeleccion)}</span>
        <div className="w-px h-5 bg-white/20" />
        <button
          data-testid="btn-facturar-seleccion"
          onClick={() => setDialogOpen(true)}
          disabled={seleccionActiva.length === 0}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Facturar Selección
          <span
            data-testid="facturar-seleccion-count"
            className="ml-1.5 bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
          >
            {seleccionActiva.length}
          </span>
        </button>
        <button
          onClick={() => useSeleccionStore.getState().limpiar()}
          className="text-white/40 hover:text-white text-sm transition-colors"
          aria-label="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        titulo="Confirmar facturación"
        subtitulo={`Se procesarán ${seleccionActiva.length} guía${seleccionActiva.length !== 1 ? 's' : ''} seleccionada${seleccionActiva.length !== 1 ? 's' : ''} para facturación.`}
        warning="Se generará una proforma en memoria para revisar antes de confirmar el envío a facturación. Nada se emite al SII en este paso."
        summary={dialogSummary}
        confirmLabel="Confirmar emisión"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
````

## File: src/pages/Historial.test.tsx
````typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HistorialPage from './Historial'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Factura } from '@/types'

vi.mock('@/services/api', () => ({
  fetchFacturas: vi.fn(),
}))

const mockFacturas: Factura[] = [
  {
    id: 'f1',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC 0001',
    folio: '1001',
    periodo: '2026-05',
    montoNeto: 1770000,
    iva: 336300,
    total: 2106300,
    fechaEmision: '2026-05-10',
    estado: 'emitida',
    guias: [],
  },
  {
    id: 'f2',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    agrupadorId: 'a2',
    agrupadorCodigo: 'OC 0002',
    folio: '1002',
    periodo: '2026-05',
    montoNeto: 750000,
    iva: 142500,
    total: 892500,
    fechaEmision: undefined,
    estado: 'borrador',
    guias: [],
  },
  {
    id: 'f3',
    clienteId: 'c2',
    clienteNombre: 'Minera del Norte Ltda.',
    agrupadorId: 'a3',
    agrupadorCodigo: 'DIR Santiago',
    folio: '1003',
    periodo: '2026-05',
    montoNeto: 2350000,
    iva: 446500,
    total: 2796500,
    fechaEmision: '2026-05-12',
    estado: 'aprobada',
    guias: [],
  },
]

describe('Historial page', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    usePeriodoStore.setState({ periodo: 'actual' })
    useTenantStore.setState({ tenantId: 'tenant-test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.fetchFacturas).mockResolvedValue(mockFacturas)
  })

  const renderPage = () =>
    render(
      <MemoryRouter>
        <HistorialPage />
      </MemoryRouter>,
    )

  // ── Layout ─────────────────────────────────────────────────────────────────

  it('muestra título "Historial de Facturación"', () => {
    renderPage()
    expect(screen.getByText('Historial de Facturación')).toBeInTheDocument()
  })

  // ── Carga de facturas ───────────────────────────────────────────────────────

  it('renderiza filas de facturas después de cargar', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toBeInTheDocument()
    })
    expect(screen.getByTestId('fila-factura-f2')).toBeInTheDocument()
    expect(screen.getByTestId('fila-factura-f3')).toBeInTheDocument()
  })

  it('muestra el nombre del cliente en la fila', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('Constructora Aconcagua S.A.')
    })
  })

  it('muestra el folio en la fila', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('1001')
    })
  })

  it('muestra el agrupador en la fila', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('OC 0001')
    })
  })

  // ── Estado vacío ────────────────────────────────────────────────────────────

  it('muestra empty state cuando no hay facturas', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchFacturas).mockResolvedValue([])
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('empty-historial')).toBeInTheDocument()
    })
    expect(screen.getByTestId('empty-historial')).toHaveTextContent('No hay facturas emitidas en este período')
  })

  // ── Badges de estado ────────────────────────────────────────────────────────

  it('badge "Emitida" para factura con estado emitida', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('Emitida')
    })
  })

  it('badge "Borrador" para factura con estado borrador', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f2')).toHaveTextContent('Borrador')
    })
  })

  it('badge "Aprobada" para factura con estado aprobada', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f3')).toHaveTextContent('Aprobada')
    })
  })

  // ── Formato de fecha ────────────────────────────────────────────────────────

  it('formatea fecha de emisión como DD-MM-YYYY', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('10-05-2026')
    })
  })

  it('muestra "—" para fecha de emisión ausente', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f2')).toHaveTextContent('—')
    })
  })

  // ── Métricas en header ──────────────────────────────────────────────────────

  it('muestra count de facturas en header', async () => {
    renderPage()
    await waitFor(() => {
      // El número está en <strong> y "facturas" en un text node — usar función matcher
      const match = screen.queryAllByText((_, el) =>
        el?.tagName === 'SPAN' && /^\s*3\s+facturas\s*$/.test(el.textContent ?? ''),
      )
      expect(match.length).toBeGreaterThan(0)
    })
  })

  it('muestra count de emitidas en header', async () => {
    renderPage()
    await waitFor(() => {
      // "1 emitidas" — solo f1 tiene estado 'emitida'
      expect(screen.getByText(/emitidas/)).toBeInTheDocument()
    })
  })

  // ── Error ────────────────────────────────────────────────────────────────────

  it('muestra error-historial cuando fetchFacturas falla', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchFacturas).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('error-historial')).toBeInTheDocument()
    })
    expect(screen.getByTestId('error-historial')).toHaveTextContent('Error al cargar el historial')
  })

  // ── Re-fetch en cambio de período ──────────────────────────────────────────

  it('re-fetcha fetchFacturas cuando cambia el período', async () => {
    const api = await import('@/services/api')
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toBeInTheDocument()
    })
    usePeriodoStore.setState({ periodo: 'anterior' })
    await waitFor(() => {
      expect(vi.mocked(api.fetchFacturas)).toHaveBeenCalledTimes(2)
    })
  })
})
````

## File: src/pages/Historial.tsx
````typescript
import { useEffect, useState } from 'react'
import { fetchFacturas } from '@/services/api'
import { usePeriodoStore } from '@/store/periodoStore'
import { Badge } from '@/components/ui/badge'
import type { Factura } from '@/types'

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

type BadgeVariant = 'success' | 'primary' | 'danger' | 'default'

const ESTADO_BADGE: Record<
  Factura['estado'],
  { label: string; variant: BadgeVariant }
> = {
  emitida:   { label: 'Emitida',   variant: 'success'  },
  aprobada:  { label: 'Aprobada',  variant: 'primary'  },
  rechazada: { label: 'Rechazada', variant: 'danger'   },
  fallida:   { label: 'Fallida',   variant: 'danger'   },
  borrador:  { label: 'Borrador',  variant: 'default'  },
}

function formatFecha(iso?: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: i === 1 ? '60%' : '80%' }} />
        </td>
      ))}
    </tr>
  )
}

export default function HistorialPage() {
  const periodo = usePeriodoStore((s) => s.periodo)

  const [facturas, setFacturas] = useState<Factura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchFacturas()
      .then(setFacturas)
      .catch(() => setError('Error al cargar el historial.'))
      .finally(() => setLoading(false))
  }, [periodo])

  const totalEmitidas = facturas.filter((f) => f.estado === 'emitida').length
  const montoTotal = facturas.reduce((sum, f) => sum + f.total, 0)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Historial de Facturación</h1>
          {!loading && facturas.length > 0 && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{facturas.length}</strong>{' '}
                {facturas.length === 1 ? 'factura' : 'facturas'}
              </span>
              <span className="text-border">|</span>
              <span>
                <strong className="text-foreground">{totalEmitidas}</strong> emitidas
              </span>
              <span className="text-border">|</span>
              <span>
                Total: <strong className="text-foreground">{clp.format(montoTotal)}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-danger-50 border border-destructive rounded-lg text-sm text-destructive" data-testid="error-historial">
            {error}
          </div>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Agrupador</th>
                  <th className="px-4 py-3">Período</th>
                  <th className="px-4 py-3">Fecha Emisión</th>
                  <th className="px-4 py-3 text-right">Monto Neto</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

                {!loading && facturas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground" data-testid="empty-historial">
                      No hay facturas emitidas en este período
                    </td>
                  </tr>
                )}

                {!loading &&
                  facturas.map((f) => {
                    const badge = ESTADO_BADGE[f.estado] ?? ESTADO_BADGE.borrador
                    return (
                      <tr
                        key={f.id}
                        data-testid={`fila-factura-${f.id}`}
                        className="border-b border-border hover:bg-accent transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-foreground">{f.folio}</td>
                        <td className="px-4 py-3 text-foreground">{f.clienteNombre ?? f.clienteId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.agrupadorCodigo ?? f.agrupadorId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.periodo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatFecha(f.fechaEmision)}</td>
                        <td className="px-4 py-3 text-right text-foreground">{clp.format(f.montoNeto)}</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">{clp.format(f.total)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
````

## File: src/pages/Preview.test.tsx
````typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PreviewPage from './Preview'
import { useSeleccionStore } from '@/store/seleccionStore'
import { useTenantStore } from '@/store/tenantStore'
import type { Guia } from '@/types'

vi.mock('@/services/api', () => ({
  emitirFacturas: vi.fn(),
}))

const mockGuias: Guia[] = [
  { id: 'g1', numero: '4401', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-05-03', descripcion: 'Hormigón premezclado', cantidad: 1, montoNeto: 1290000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g2', numero: '4402', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-05-05', descripcion: 'Fierro galvanizado', cantidad: 24, montoNeto: 480000, agrupadorId: 'a1', agrupadorCodigo: 'OC 0001', agrupadorColor: '#dbeafe', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
  { id: 'g3', numero: '4403', clienteId: 'c1', clienteNombre: 'Constructora Aconcagua S.A.', fecha: '2026-05-07', descripcion: 'Cemento Portland', cantidad: 50, montoNeto: 750000, agrupadorId: 'a2', agrupadorCodigo: 'OC 0002', agrupadorColor: '#dcfce7', agrupadorNombre: null, reglaIdl: null, estado: 'pendiente' },
]

describe('Preview page', () => {
  beforeEach(async () => {
    useSeleccionStore.setState({ seleccionActiva: mockGuias })
    useTenantStore.setState({ tenantId: 'tenant-test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.emitirFacturas).mockResolvedValue(undefined as never)
  })

  const renderPage = (initialEntries = ['/preview']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/guias" element={<div data-testid="guias-page">Guías Page</div>} />
          <Route path="/historial" element={<div data-testid="historial-page">Historial Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

  // ── Redirect ────────────────────────────────────────────────────────────────

  it('redirige a /guias si seleccionActiva está vacía', () => {
    useSeleccionStore.setState({ seleccionActiva: [] })
    renderPage()
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  // ── Renderizado inicial ────────────────────────────────────────────────────

  it('muestra título y nombre del cliente', () => {
    renderPage()
    expect(screen.getByText('Previsualización de Facturas')).toBeInTheDocument()
    expect(screen.getByText(/Constructora Aconcagua S\.A\./)).toBeInTheDocument()
  })

  it('renderiza una proforma por agrupadorId', () => {
    renderPage()
    expect(screen.getByTestId('proforma-a1')).toBeInTheDocument()
    expect(screen.getByTestId('proforma-a2')).toBeInTheDocument()
  })

  it('muestra el código de agrupador en cada proforma', () => {
    renderPage()
    expect(screen.getByText('OC 0001')).toBeInTheDocument()
    expect(screen.getByText('OC 0002')).toBeInTheDocument()
  })

  it('muestra singular "guía" para proforma con 1 guía', () => {
    renderPage()
    expect(screen.getByTestId('proforma-a2')).toHaveTextContent('1 guía')
  })

  it('muestra plural "guías" para proforma con varias guías', () => {
    renderPage()
    expect(screen.getByTestId('proforma-a1')).toHaveTextContent('2 guías')
  })

  it('botón "Enviar a facturación" está deshabilitado con 0 aprobadas', () => {
    renderPage()
    expect(screen.getByTestId('btn-emitir')).toBeDisabled()
  })

  // ── Aprobar / Rechazar ─────────────────────────────────────────────────────

  it('aprobar una proforma habilita el botón emitir', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('btn-emitir')).not.toBeDisabled()
  })

  it('aprobar muestra badge "Aprobada" en la proforma', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('proforma-a1')).toHaveTextContent('Aprobada')
  })

  it('click en aprobar dos veces vuelve a pendiente y deshabilita emitir', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('btn-emitir')).toBeDisabled()
  })

  it('rechazar muestra badge "Rechazada" en la proforma', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-rechazar-a1'))
    expect(screen.getByTestId('proforma-a1')).toHaveTextContent('Rechazada')
  })

  it('click en rechazar dos veces vuelve a pendiente', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-rechazar-a1'))
    await user.click(screen.getByTestId('btn-rechazar-a1'))
    expect(screen.getByTestId('proforma-a1')).not.toHaveTextContent('Rechazada')
    expect(screen.getByTestId('btn-emitir')).toBeDisabled()
  })

  it('botón emitir muestra count de aprobadas cuando hay más de una', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-aprobar-a2'))
    expect(screen.getByTestId('btn-emitir')).toHaveTextContent('Enviar a facturación (2)')
  })

  it('botón emitir muestra "(1)" al aprobar una sola proforma', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    expect(screen.getByTestId('btn-emitir')).toHaveTextContent('Enviar a facturación (1)')
  })

  // ── Emisión ────────────────────────────────────────────────────────────────

  it('emitir llama emitirFacturas y navega a /historial', async () => {
    const user = userEvent.setup()
    const api = await import('@/services/api')
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-emitir'))
    await waitFor(() => {
      expect(vi.mocked(api.emitirFacturas)).toHaveBeenCalledOnce()
    })
    await waitFor(() => {
      expect(screen.getByTestId('historial-page')).toBeInTheDocument()
    })
  })

  it('muestra "Emitiendo..." mientras se procesa', async () => {
    const user = userEvent.setup()
    const api = await import('@/services/api')
    vi.mocked(api.emitirFacturas).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500)),
    )
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-emitir'))
    expect(screen.getByTestId('btn-emitir')).toHaveTextContent('Enviando...')
  })

  it('error en emitirFacturas muestra mensaje de error', async () => {
    const user = userEvent.setup()
    const api = await import('@/services/api')
    vi.mocked(api.emitirFacturas).mockRejectedValue(new Error('fail'))
    renderPage()
    await user.click(screen.getByTestId('btn-aprobar-a1'))
    await user.click(screen.getByTestId('btn-emitir'))
    await waitFor(() => {
      expect(screen.getByTestId('error-emision')).toBeInTheDocument()
    })
    expect(screen.getByTestId('error-emision')).toHaveTextContent('Error al emitir')
  })

  // ── Cancelar ───────────────────────────────────────────────────────────────

  it('cancelar navega a /guias', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByTestId('btn-cancelar'))
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })
})
````

## File: src/pages/Preview.tsx
````typescript
import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSeleccionStore } from '@/store/seleccionStore'
import { emitirFacturas } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Guia } from '@/types'

type EstadoProforma = 'pendiente' | 'aprobada' | 'rechazada'

interface Proforma {
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  guias: Guia[]
  montoNeto: number
  iva: number
  total: number
}

const IVA_RATE = 0.19

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

function buildProformas(guias: Guia[]): Proforma[] {
  const map = new Map<string, Proforma>()
  for (const g of guias) {
    if (!map.has(g.agrupadorId)) {
      map.set(g.agrupadorId, {
        agrupadorId: g.agrupadorId,
        agrupadorCodigo: g.agrupadorCodigo,
        agrupadorColor: g.agrupadorColor,
        guias: [],
        montoNeto: 0,
        iva: 0,
        total: 0,
      })
    }
    const p = map.get(g.agrupadorId)!
    p.guias.push(g)
    p.montoNeto += g.montoNeto
    p.iva = Math.round(p.montoNeto * IVA_RATE)
    p.total = p.montoNeto + p.iva
  }
  return Array.from(map.values())
}

export default function PreviewPage() {
  const navigate = useNavigate()
  const seleccionActiva = useSeleccionStore((s) => s.seleccionActiva)
  const limpiar = useSeleccionStore((s) => s.limpiar)

  const proformas = useMemo(() => buildProformas(seleccionActiva), [seleccionActiva])

  const [estados, setEstados] = useState<Record<string, EstadoProforma>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (seleccionActiva.length === 0) {
      navigate('/guias', { replace: true })
    }
  }, [seleccionActiva, navigate])

  useEffect(() => {
    const initial: Record<string, EstadoProforma> = {}
    for (const p of proformas) {
      initial[p.agrupadorId] = 'pendiente'
    }
    setEstados(initial)
  }, [proformas])

  function toggleEstado(agrupadorId: string, accion: 'aprobada' | 'rechazada') {
    setEstados((prev) => ({
      ...prev,
      [agrupadorId]: prev[agrupadorId] === accion ? 'pendiente' : accion,
    }))
  }

  const aprobadas = proformas.filter((p) => estados[p.agrupadorId] === 'aprobada')
  const montoTotalAprobado = aprobadas.reduce((sum, p) => sum + p.total, 0)

  const clienteNombre = seleccionActiva[0]?.clienteNombre ?? ''
  const periodo = seleccionActiva[0]?.fecha.slice(0, 7) ?? ''

  async function handleEmitir() {
    if (aprobadas.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const agrupadoresAprobados = aprobadas.map((p) => p.agrupadorId)
      const agrupadoresAnulados = proformas
        .filter((p) => estados[p.agrupadorId] === 'rechazada')
        .map((p) => p.agrupadorId)
      await emitirFacturas({ aprobadas: agrupadoresAprobados, anuladas: agrupadoresAnulados })
      limpiar()
      navigate('/historial', { replace: true })
    } catch {
      setError('Error al emitir los DTE. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (seleccionActiva.length === 0) return null

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Previsualización de Facturas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {clienteNombre} &middot; Período {periodo}
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <span className="font-medium text-foreground">{proformas.length}</span>{' '}
            {proformas.length === 1 ? 'factura proforma' : 'facturas proforma'}
            {aprobadas.length > 0 && (
              <span className="ml-3 text-success font-medium">
                {aprobadas.length} aprobada{aprobadas.length > 1 ? 's' : ''} &middot; {clp.format(montoTotalAprobado)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Proformas */}
      <div className="flex-1 p-6 space-y-4">
        {proformas.map((p) => {
          const estado = estados[p.agrupadorId] ?? 'pendiente'
          return (
            <div
              key={p.agrupadorId}
              data-testid={`proforma-${p.agrupadorId}`}
              className={`bg-card rounded-lg border-2 transition-colors ${
                estado === 'aprobada'
                  ? 'border-success-600'
                  : estado === 'rechazada'
                    ? 'border-danger-600'
                    : 'border-border'
              }`}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-lg"
                style={{ backgroundColor: p.agrupadorColor }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{p.agrupadorCodigo}</span>
                  <span className="text-muted-foreground text-sm">&middot; {p.guias.length} guía{p.guias.length !== 1 ? 's' : ''}</span>
                </div>
                {estado !== 'pendiente' && (
                  <Badge variant={estado === 'aprobada' ? 'success' : 'danger'}>
                    {estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                  </Badge>
                )}
              </div>

              {/* Tabla de guías */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wide">
                      <th className="px-4 py-2">N° Guía</th>
                      <th className="px-4 py-2">Fecha</th>
                      <th className="px-4 py-2">Descripción</th>
                      <th className="px-4 py-2 text-right">Monto Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.guias.map((g) => (
                      <tr key={g.id} className="border-b border-border">
                        <td className="px-4 py-2 font-mono text-foreground">{g.numero}</td>
                        <td className="px-4 py-2 text-foreground">{g.fecha}</td>
                        <td className="px-4 py-2 text-foreground">{g.descripcion}</td>
                        <td className="px-4 py-2 text-right text-foreground">{clp.format(g.montoNeto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer totales + acciones */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-b-lg">
                <div className="text-sm text-muted-foreground space-x-4">
                  <span>Neto: <strong className="text-foreground font-semibold">{clp.format(p.montoNeto)}</strong></span>
                  <span>IVA 19%: <strong className="text-foreground font-semibold">{clp.format(p.iva)}</strong></span>
                  <span>Total: <strong className="text-foreground font-semibold">{clp.format(p.total)}</strong></span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`btn-rechazar-${p.agrupadorId}`}
                    onClick={() => toggleEstado(p.agrupadorId, 'rechazada')}
                    className={
                      estado === 'rechazada'
                        ? 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive'
                        : 'text-muted-foreground hover:border-destructive hover:text-destructive'
                    }
                  >
                    Rechazar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`btn-aprobar-${p.agrupadorId}`}
                    onClick={() => toggleEstado(p.agrupadorId, 'aprobada')}
                    className={
                      estado === 'aprobada'
                        ? 'bg-success text-white border-success hover:bg-success'
                        : 'text-muted-foreground hover:border-success hover:text-success'
                    }
                  >
                    Aprobar
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-2 px-4 py-3 bg-danger-50 border border-destructive rounded-lg text-sm text-destructive" data-testid="error-emision">
          {error}
        </div>
      )}

      {/* Footer acciones */}
      <div className="bg-card border-t border-border px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          data-testid="btn-cancelar"
          onClick={() => navigate('/guias')}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="default"
          data-testid="btn-emitir"
          onClick={handleEmitir}
          disabled={aprobadas.length === 0 || loading}
        >
          {loading
            ? 'Enviando...'
            : `Enviar a facturación${aprobadas.length > 0 ? ` (${aprobadas.length})` : ''}`}
        </Button>
      </div>
    </div>
  )
}
````

## File: src/services/api.ts
````typescript
/**
 * Barrel de servicios — re-exporta todo el surface público de la capa de servicios.
 * Los imports existentes (pages, components, tests) siguen funcionando sin cambios.
 *
 * Para imports nuevos, preferir los módulos específicos:
 *   import { fetchGuias }    from '@/services/guiasService'
 *   import { fetchFacturas } from '@/services/facturasService'
 *   import { fetchClientes } from '@/services/clientesService'
 *   import { activarRegla }  from '@/services/reglasService'
 */
export { fetchClientes, fetchMetricas, assignReglaCliente, fetchReglasPorCliente, activarReglaCliente } from './clientesService'
export { fetchGuias }                                       from './guiasService'
export { fetchFacturas, emitirFacturas }                    from './facturasService'
export { fetchDiscoverCandidatos, fetchReglaActiva, activarRegla, updateReglanombre, fetchReglasEmpresa } from './reglasService'
````

## File: src/services/clientesService.test.ts
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReglaCliente } from '@/types'

vi.mock('./http', () => ({
  backendFetch: vi.fn(),
  getContext: vi.fn(() => ({ empkey: '977', periodo: '2026-05' })),
}))

import * as http from './http'
import { fetchReglasPorCliente, activarReglaCliente, assignReglaCliente } from './clientesService'

const mockReglas: ReglaCliente[] = [
  {
    reglaidl: '977_campo_receptor_CmnaRecep',
    empkey: '977',
    gclirut: '76543210-K',
    activa: true,
    reglanombre: 'Por comuna',
    reglaconfig: { type: 'campo-receptor', field: 'CmnaRecep' },
  },
  {
    reglaidl: '977_campo_detalle_OBRA_Valor',
    empkey: '977',
    gclirut: '76543210-K',
    activa: false,
    reglanombre: null,
    reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(http.getContext).mockReturnValue({ empkey: '977', periodo: '2026-05' })
})

describe('fetchReglasPorCliente', () => {
  it('llama GET /empresas/:empkey/clientes/:rut/reglas', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(mockReglas)
    const result = await fetchReglasPorCliente('76543210-K')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/reglas',
    )
    expect(result).toEqual(mockReglas)
  })
})

describe('assignReglaCliente', () => {
  it('llama PUT /regla sin opciones', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await assignReglaCliente('76543210-K', 'regla_A')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/regla',
      { method: 'PUT', body: { reglaIdl: 'regla_A' } },
    )
  })

  it('llama PUT /regla con recomputar=true y periodo', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await assignReglaCliente('76543210-K', 'regla_B', { recomputar: true, periodo: '2026-05' })
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/regla',
      { method: 'PUT', body: { reglaIdl: 'regla_B', recomputar: true, periodo: '2026-05' } },
    )
  })

  it('llama PUT /regla con recomputar=false (sin periodo)', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await assignReglaCliente('76543210-K', 'regla_B', { recomputar: false })
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/regla',
      { method: 'PUT', body: { reglaIdl: 'regla_B', recomputar: false } },
    )
  })
})

describe('activarReglaCliente', () => {
  it('llama PUT /empresas/:empkey/clientes/:rut/reglas/:reglaidl/activar', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await activarReglaCliente('76543210-K', '977_campo_receptor_CmnaRecep')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/reglas/977_campo_receptor_CmnaRecep/activar',
      { method: 'PUT' },
    )
  })
})
````

## File: src/services/clientesService.ts
````typescript
import type { Cliente, MetricasResumen, ReglaCliente } from '@/types'
import { backendFetch, getContext, periodoToYYYYMM } from './http'
import { usePeriodoStore } from '@/store/periodoStore'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

interface ClienteConGuiasDto {
  rut: string
  nombre: string
  cantidadGuias: number
  montoTotal: string
  reglaIdl: string | null
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function fetchClientes(q?: string): Promise<Cliente[]> {
  const { empkey, periodo } = getContext()
  return backendFetch<ClienteConGuiasDto[]>(`/empresas/${empkey}/clientes`, { params: { periodo } })
    .then((dtos) => {
      let items = dtos
      if (q) {
        const lq = q.toLowerCase()
        items = dtos.filter((d) => d.nombre.toLowerCase().includes(lq) || d.rut.includes(lq))
      }
      return items.map((d) => ({
        id: d.rut,
        nombre: d.nombre,
        rut: d.rut,
        guiasPendientes: d.cantidadGuias,
        factEst: 1,
        montoNeto: Number(d.montoTotal),
        reglaIdl: d.reglaIdl ?? null,
      }))
    })
}

export function fetchMetricas(): Promise<MetricasResumen> {
  const { empkey, periodo } = getContext()
  const periodoActual = usePeriodoStore.getState().periodo

  const mainFetch = backendFetch<ClienteConGuiasDto[]>(`/empresas/${empkey}/clientes`, { params: { periodo } })

  if (periodoActual === 'anterior') {
    // Estamos viendo el período de rezagadas — todos los clientes listados son rezagadas
    return mainFetch.then((clientes) => ({
      totalGuias:           clientes.reduce((s, c) => s + c.cantidadGuias, 0),
      clientesActivos:      clientes.length,
      factEst:              clientes.length,
      montoEstimado:        clientes.reduce((s, c) => s + Number(c.montoTotal), 0),
      clientesConRezagadas: clientes.length,
      tendenciaGuias:       0,
      tendenciaFactEst:     0,
      tendenciaClientes:    0,
    }))
  }

  // Período actual — buscar rezagadas del mes anterior en paralelo
  const anteriorPeriodo = periodoToYYYYMM('anterior')
  const anteriorFetch = backendFetch<ClienteConGuiasDto[]>(`/empresas/${empkey}/clientes`, {
    params: { periodo: anteriorPeriodo },
  }).catch(() => [] as ClienteConGuiasDto[])

  return Promise.all([mainFetch, anteriorFetch]).then(([clientes, clientesAnterior]) => ({
    totalGuias:           clientes.reduce((s, c) => s + c.cantidadGuias, 0),
    clientesActivos:      clientes.length,
    factEst:              clientes.length,
    montoEstimado:        clientes.reduce((s, c) => s + Number(c.montoTotal), 0),
    clientesConRezagadas: clientesAnterior.filter((c) => c.cantidadGuias > 0).length,
    tendenciaGuias:       0,
    tendenciaFactEst:     0,
    tendenciaClientes:    0,
  }))
}

export function assignReglaCliente(
  rut: string,
  reglaidl: string,
  opciones?: { recomputar: boolean; periodo?: string },
): Promise<void> {
  const { empkey } = getContext()
  return backendFetch(`/empresas/${empkey}/clientes/${rut}/regla`, {
    method: 'PUT',
    body: { reglaIdl: reglaidl, ...opciones },
  })
}

export function fetchReglasPorCliente(rut: string): Promise<ReglaCliente[]> {
  const { empkey } = getContext()
  return backendFetch<ReglaCliente[]>(`/empresas/${empkey}/clientes/${rut}/reglas`)
}

export function activarReglaCliente(rut: string, reglaidl: string): Promise<void> {
  const { empkey } = getContext()
  return backendFetch(`/empresas/${empkey}/clientes/${rut}/reglas/${reglaidl}/activar`, {
    method: 'PUT',
  })
}
````

## File: src/services/facturasService.ts
````typescript
import type { Factura } from '@/types'
import { backendFetch, getContext } from './http'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

interface ProformaDto {
  id: string
  folio: string
  cliente: { rut: string; nombre: string }
  regla: { id: string; descripcion: string }
  cantidadGuias: number
  montoTotal: string
  estado: string
  fecha: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESTADO_MAP: Record<string, Factura['estado']> = {
  BORRADOR: 'borrador',
  APROBADA: 'aprobada',
  ANULADA:  'rechazada',
  EMITIDA:  'emitida',
  FALLIDA:  'fallida',
}

function mapEstado(raw: string): Factura['estado'] {
  return ESTADO_MAP[raw.toUpperCase()] ?? 'borrador'
}

function mapProformaToFactura(d: ProformaDto, periodo: string): Factura {
  const neto = Number(d.montoTotal)
  const iva  = Math.round(neto * 0.19)
  return {
    id:              d.id,
    clienteId:       d.cliente.rut,
    clienteNombre:   d.cliente.nombre,
    agrupadorId:     d.regla.id,
    agrupadorCodigo: d.regla.descripcion,
    folio:           d.folio,
    periodo,
    montoNeto:       neto,
    iva,
    total:           neto + iva,
    fechaEmision:    d.fecha,
    estado:          mapEstado(d.estado),
    guias:           [],
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function fetchFacturas(params?: Record<string, string>): Promise<Factura[]> {
  const { empkey, periodo } = getContext()
  return backendFetch<ProformaDto[]>(`/empresas/${empkey}/facturas/proforma`, {
    params: { periodo, ...params },
  }).then((dtos) => dtos.map((d) => mapProformaToFactura(d, periodo)))
}

export async function emitirFacturas({
  aprobadas,
  anuladas,
}: {
  aprobadas: string[]
  anuladas: string[]
}): Promise<Factura[]> {
  const { empkey, periodo } = getContext()

  // 1. Crear/regenerar proformas BORRADOR (idempotente)
  await backendFetch(`/empresas/${empkey}/facturas/proforma/generar`, {
    method: 'POST',
    params: { periodo },
  })

  // 2. Obtener proformas con ids
  const dtos = await backendFetch<ProformaDto[]>(`/empresas/${empkey}/facturas/proforma`, {
    params: { periodo },
  })

  // 3. Aprobar / anular en paralelo
  const findDto = (reglaId: string) => dtos.find((d) => d.regla.id === reglaId)

  await Promise.all([
    ...aprobadas
      .map(findDto)
      .filter((d): d is ProformaDto => d !== undefined)
      .map((d) =>
        backendFetch(`/empresas/${empkey}/facturas/proforma/${d.id}/aprobar`, { method: 'PATCH' }),
      ),
    ...anuladas
      .map(findDto)
      .filter((d): d is ProformaDto => d !== undefined)
      .map((d) =>
        backendFetch(`/empresas/${empkey}/facturas/proforma/${d.id}/anular`, { method: 'PATCH' }),
      ),
  ])

  return fetchFacturas()
}
````

## File: src/services/guiasService.test.ts
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./http', () => ({
  backendFetch: vi.fn(),
  getContext: vi.fn(() => ({ empkey: '977', periodo: '2026-05' })),
}))

import * as http from './http'
import { fetchGuias } from './guiasService'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(http.getContext).mockReturnValue({ empkey: '977', periodo: '2026-05' })
})

describe('fetchGuias', () => {
  it('propaga grupo.reglaIdl a cada guía del grupo', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue([
      {
        cliente: { rut: '76.543.210-K', nombre: 'Constructora Aconcagua S.A.' },
        grupos: [
          {
            valorAgrupador: 'OC 0001',
            reglaIdl: '977_campo_receptor_CmnaRecep',
            cantidadGuias: 1,
            montoTotal: '100000',
            folios: [{ folio: '4401', fecha: '2026-05-03' }],
          },
        ],
      },
    ])

    const guias = await fetchGuias()

    expect(guias).toHaveLength(1)
    expect(guias[0].reglaIdl).toBe('977_campo_receptor_CmnaRecep')
  })

  it('mapea reglaIdl null cuando el grupo no tiene regla asignada', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue([
      {
        cliente: { rut: '76.543.210-K', nombre: 'Constructora Aconcagua S.A.' },
        grupos: [
          {
            valorAgrupador: 'OC 0002',
            reglaIdl: null,
            cantidadGuias: 1,
            montoTotal: '50000',
            folios: [{ folio: '4402', fecha: '2026-05-04' }],
          },
        ],
      },
    ])

    const guias = await fetchGuias()

    expect(guias[0].reglaIdl).toBeNull()
  })
})
````

## File: src/services/guiasService.ts
````typescript
import type { Guia } from '@/types'
import { backendFetch, getContext } from './http'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

interface GrupoDto {
  valorAgrupador: string
  reglaIdl: string | null
  cantidadGuias: number
  montoTotal: string
  folios: Array<{ folio: string; fecha: string }>
}

interface GuiasAgrupadasItemDto {
  cliente: { rut: string; nombre: string }
  grupos: GrupoDto[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AGRUPADOR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function colorForRegla(regla: string): string {
  let h = 0
  for (let i = 0; i < regla.length; i++) h = (h * 31 + regla.charCodeAt(i)) & 0xffff
  return AGRUPADOR_COLORS[h % AGRUPADOR_COLORS.length]
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function fetchGuias(params?: Record<string, string>): Promise<Guia[]> {
  const { empkey, periodo } = getContext()
  const qp: Record<string, string> = { periodo }
  if (params?.clienteId) qp.rut = params.clienteId

  return backendFetch<GuiasAgrupadasItemDto[]>(`/empresas/${empkey}/guias/agrupadas`, { params: qp })
    .then((items) => {
      const guias: Guia[] = []
      for (const item of items) {
        for (const grupo of item.grupos) {
          const color = colorForRegla(grupo.valorAgrupador)
          const count = grupo.folios.length
          const montoByFolio = count > 0 ? Math.round(Number(grupo.montoTotal) / count) : 0
          for (const { folio, fecha } of grupo.folios) {
            guias.push({
              id:              `${item.cliente.rut}-${folio}`,
              numero:          folio,
              clienteId:       item.cliente.rut,
              clienteNombre:   item.cliente.nombre,
              fecha,
              descripcion:     grupo.valorAgrupador,
              cantidad:        1,
              montoNeto:       montoByFolio,
              agrupadorId:     grupo.valorAgrupador,
              agrupadorCodigo: grupo.valorAgrupador,
              agrupadorColor:  color,
              agrupadorNombre: null,
              reglaIdl:        grupo.reglaIdl,
              estado:          'pendiente',
            })
          }
        }
      }
      return guias
    })
}
````

## File: src/services/http.ts
````typescript
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
````

## File: src/services/reglasService.test.ts
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./http', () => ({
  backendFetch: vi.fn(),
  getContext: vi.fn(() => ({ empkey: '977', periodo: '2026-05' })),
}))

import * as http from './http'
import { fetchDiscoverCandidatos, updateReglanombre, fetchReglasEmpresa } from './reglasService'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(http.getContext).mockReturnValue({ empkey: '977', periodo: '2026-05' })
})

describe('fetchDiscoverCandidatos', () => {
  it('sin gclirut llama /reglas/discover solo con empkey', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue({ empkey: '977', muestraGuias: 0, candidatos: [] })
    await fetchDiscoverCandidatos()
    expect(http.backendFetch).toHaveBeenCalledWith('/reglas/discover', { params: { empkey: '977' } })
  })

  it('con gclirut agrega param gclirut a la llamada', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue({ empkey: '977', muestraGuias: 0, candidatos: [] })
    await fetchDiscoverCandidatos('77004250-K')
    expect(http.backendFetch).toHaveBeenCalledWith('/reglas/discover', {
      params: { empkey: '977', gclirut: '77004250-K' },
    })
  })
})

describe('fetchReglasEmpresa', () => {
  it('llama GET /empresas/:empkey/reglas y retorna lista de reglas', async () => {
    const mockReglas = [{ reglaIdl: 'r1', reglaDesc: 'Por OC' }]
    vi.mocked(http.backendFetch).mockResolvedValue(mockReglas)
    const result = await fetchReglasEmpresa()
    expect(http.backendFetch).toHaveBeenCalledWith('/empresas/977/reglas')
    expect(result).toEqual(mockReglas)
  })
})

describe('updateReglanombre', () => {
  it('llama PATCH /empresas/:empkey/reglas/:reglaidl con reglanombre', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await updateReglanombre('977_campo_receptor_CmnaRecep', 'Por comuna')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/reglas/977_campo_receptor_CmnaRecep',
      { method: 'PATCH', body: { reglanombre: 'Por comuna' } },
    )
  })
})
````

## File: src/services/reglasService.ts
````typescript
import type { DiscoverResult, ReglaConfig, ReglaEmp, ReglaDisponible } from '@/types'
import { backendFetch, getContext } from './http'

export function fetchDiscoverCandidatos(gclirut?: string): Promise<DiscoverResult> {
  const { empkey } = getContext()
  const params: Record<string, string> = { empkey }
  if (gclirut) params.gclirut = gclirut
  return backendFetch<DiscoverResult>(`/reglas/discover`, { params })
}

export function fetchReglaActiva(): Promise<ReglaEmp[]> {
  const { empkey } = getContext()
  return backendFetch<ReglaEmp[]>(`/reglas/empresa/${empkey}`)
}

export function activarRegla(config: ReglaConfig): Promise<ReglaEmp> {
  const { empkey } = getContext()
  return backendFetch<ReglaEmp>(`/reglas/activar`, {
    method: 'POST',
    body: { empkey, config },
  })
}

export function fetchReglasEmpresa(): Promise<ReglaDisponible[]> {
  const { empkey } = getContext()
  return backendFetch<ReglaDisponible[]>(`/empresas/${empkey}/reglas`)
}

export function updateReglanombre(reglaidl: string, reglanombre: string): Promise<void> {
  const { empkey } = getContext()
  return backendFetch(`/empresas/${empkey}/reglas/${reglaidl}`, {
    method: 'PATCH',
    body: { reglanombre },
  })
}
````

## File: src/store/periodoStore.test.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { usePeriodoStore } from './periodoStore'

describe('periodoStore', () => {
  beforeEach(() => {
    usePeriodoStore.setState({ periodo: 'actual' })
  })

  describe('estado inicial', () => {
    it('periodo empieza en "actual"', () => {
      const { periodo } = usePeriodoStore.getState()
      expect(periodo).toBe('actual')
    })
  })

  describe('setPeriodo', () => {
    it('cambia periodo a "anterior"', () => {
      usePeriodoStore.getState().setPeriodo('anterior')
      expect(usePeriodoStore.getState().periodo).toBe('anterior')
    })

    it('cambia periodo a "actual"', () => {
      usePeriodoStore.setState({ periodo: 'anterior' })
      usePeriodoStore.getState().setPeriodo('actual')
      expect(usePeriodoStore.getState().periodo).toBe('actual')
    })
  })

  describe('initPeriodo', () => {
    it('si tieneRezagadas es true, periodo queda en "anterior"', () => {
      usePeriodoStore.getState().initPeriodo(true)
      expect(usePeriodoStore.getState().periodo).toBe('anterior')
    })

    it('si tieneRezagadas es false, periodo queda en "actual"', () => {
      usePeriodoStore.setState({ periodo: 'anterior' })
      usePeriodoStore.getState().initPeriodo(false)
      expect(usePeriodoStore.getState().periodo).toBe('actual')
    })
  })
})
````

## File: src/store/periodoStore.ts
````typescript
import { create } from 'zustand'
import type { Periodo } from '@/types'

interface PeriodoState {
  periodo: Periodo
  setPeriodo: (p: Periodo) => void
  initPeriodo: (tieneRezagadas: boolean) => void
}

export const usePeriodoStore = create<PeriodoState>((set) => ({
  periodo: 'actual',
  setPeriodo: (p) => set({ periodo: p }),
  initPeriodo: (tieneRezagadas) =>
    set({ periodo: tieneRezagadas ? 'anterior' : 'actual' }),
}))
````

## File: src/store/seleccionStore.test.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useSeleccionStore } from './seleccionStore'
import type { Guia } from '@/types'

// Helper factory para crear guías de test
function crearGuia(overrides: Partial<Guia> = {}): Guia {
  return {
    id: 'g1',
    numero: '001',
    clienteId: 'c1',
    clienteNombre: 'Cliente Uno',
    fecha: '2026-04-15',
    descripcion: 'Despacho materiales',
    cantidad: 10,
    montoNeto: 50000,
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC-100',
    agrupadorColor: '#3b82f6',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
    ...overrides,
  }
}

describe('seleccionStore', () => {
  beforeEach(() => {
    useSeleccionStore.getState().limpiar()
  })

  // ─── Estado inicial ───────────────────────────────────
  describe('estado inicial', () => {
    it('seleccionActiva empieza vacío', () => {
      const { seleccionActiva } = useSeleccionStore.getState()
      expect(seleccionActiva).toEqual([])
    })
  })

  // ─── agregar(guia) ────────────────────────────────────
  describe('agregar', () => {
    it('agrega una guía al array', () => {
      const guia = crearGuia()
      useSeleccionStore.getState().agregar(guia)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0]).toEqual(guia)
    })

    it('primer elemento siempre se agrega sin restricción', () => {
      const guia = crearGuia({ id: 'first', clienteId: 'cx', fecha: '2025-12-01' })
      useSeleccionStore.getState().agregar(guia)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })

    it('no duplica si ya existe el mismo id', () => {
      const guia = crearGuia({ id: 'g1' })
      useSeleccionStore.getState().agregar(guia)
      useSeleccionStore.getState().agregar(guia)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })

    it('rechaza si la guía tiene clienteId diferente al de las ya seleccionadas', () => {
      const guia1 = crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' })
      const guia2 = crearGuia({ id: 'g2', clienteId: 'c2', fecha: '2026-04-12' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g1')
    })

    it('rechaza si la guía tiene un mes diferente al de las ya seleccionadas', () => {
      const guia1 = crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-15' })
      const guia2 = crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-05-10' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g1')
    })

    it('agrega correctamente si mismo cliente y mismo mes', () => {
      const guia1 = crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' })
      const guia2 = crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-25' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(2)
    })
  })

  // ─── quitar(guiaId) ───────────────────────────────────
  describe('quitar', () => {
    it('elimina la guía con ese id del array', () => {
      const guia1 = crearGuia({ id: 'g1' })
      const guia2 = crearGuia({ id: 'g2', fecha: '2026-04-20' })
      useSeleccionStore.getState().agregar(guia1)
      useSeleccionStore.getState().agregar(guia2)
      useSeleccionStore.getState().quitar('g1')
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g2')
    })

    it('si el id no existe, no falla', () => {
      const guia = crearGuia({ id: 'g1' })
      useSeleccionStore.getState().agregar(guia)
      useSeleccionStore.getState().quitar('inexistente')
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })
  })

  // ─── limpiar() ────────────────────────────────────────
  describe('limpiar', () => {
    it('vacía seleccionActiva', () => {
      useSeleccionStore.getState().agregar(crearGuia({ id: 'g1' }))
      useSeleccionStore.getState().agregar(crearGuia({ id: 'g2', fecha: '2026-04-20' }))
      useSeleccionStore.getState().limpiar()
      expect(useSeleccionStore.getState().seleccionActiva).toEqual([])
    })
  })

  // ─── agregarLote(guias) ───────────────────────────────
  describe('agregarLote', () => {
    it('agrega todas las guías del lote si pasan validación (selección vacía, lote homogéneo)', () => {
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-20' }),
        crearGuia({ id: 'g3', clienteId: 'c1', fecha: '2026-04-25' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(3)
    })

    it('agrega lote compatible con selección existente (mismo cliente y mes)', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g0', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-20' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(3)
    })

    it('NO agrega nada si el lote es heterogéneo en clienteId', () => {
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c2', fecha: '2026-04-20' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toEqual([])
    })

    it('NO agrega nada si el lote es heterogéneo en mes', () => {
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-10' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-05-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toEqual([])
    })

    it('NO agrega nada si mezcla con selección existente de diferente cliente', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g0', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c2', fecha: '2026-04-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g0')
    })

    it('NO agrega nada si mezcla con selección existente de diferente mes', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g0', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-05-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
      expect(useSeleccionStore.getState().seleccionActiva[0].id).toBe('g0')
    })

    it('no duplica guías que ya están en la selección', () => {
      useSeleccionStore.getState().agregar(
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-05' })
      )
      const lote = [
        crearGuia({ id: 'g1', clienteId: 'c1', fecha: '2026-04-05' }),
        crearGuia({ id: 'g2', clienteId: 'c1', fecha: '2026-04-10' }),
      ]
      useSeleccionStore.getState().agregarLote(lote)
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(2)
    })

    it('lote vacío no modifica el estado', () => {
      useSeleccionStore.getState().agregar(crearGuia({ id: 'g0' }))
      useSeleccionStore.getState().agregarLote([])
      expect(useSeleccionStore.getState().seleccionActiva).toHaveLength(1)
    })
  })

  // ─── Selectors derivados ──────────────────────────────
  describe('selectors derivados', () => {
    describe('clienteActivoId', () => {
      it('retorna null si seleccionActiva está vacío', () => {
        expect(useSeleccionStore.getState().clienteActivoId()).toBeNull()
      })

      it('retorna el clienteId de las guías seleccionadas', () => {
        useSeleccionStore.getState().agregar(crearGuia({ clienteId: 'c99' }))
        expect(useSeleccionStore.getState().clienteActivoId()).toBe('c99')
      })
    })

    describe('mesActivo', () => {
      it('retorna null si seleccionActiva está vacío', () => {
        expect(useSeleccionStore.getState().mesActivo()).toBeNull()
      })

      it('retorna YYYY-MM del mes de las guías seleccionadas', () => {
        useSeleccionStore.getState().agregar(crearGuia({ fecha: '2026-04-15' }))
        expect(useSeleccionStore.getState().mesActivo()).toBe('2026-04')
      })
    })
  })
})
````

## File: src/store/seleccionStore.ts
````typescript
import { create } from 'zustand'
import { getMes, esLoteHomogeneo } from '@/utils/loteHomogeneo'
import type { Guia } from '@/types'

interface SeleccionState {
  seleccionActiva: Guia[]
  agregar: (guia: Guia) => void
  quitar: (guiaId: string) => void
  limpiar: () => void
  agregarLote: (guias: Guia[]) => void
  clienteActivoId: () => string | null
  mesActivo: () => string | null
}

export const useSeleccionStore = create<SeleccionState>((set, get) => ({
  seleccionActiva: [],

  agregar: (guia) => {
    set((state) => {
      if (state.seleccionActiva.some((g) => g.id === guia.id)) {
        return state
      }
      if (state.seleccionActiva.length > 0) {
        const clienteExistente = state.seleccionActiva[0].clienteId
        const mesExistente = getMes(state.seleccionActiva[0].fecha)
        if (guia.clienteId !== clienteExistente || getMes(guia.fecha) !== mesExistente) {
          return state
        }
      }
      return { seleccionActiva: [...state.seleccionActiva, guia] }
    })
  },

  quitar: (guiaId) => {
    set((state) => ({
      seleccionActiva: state.seleccionActiva.filter((g) => g.id !== guiaId),
    }))
  },

  limpiar: () => {
    set({ seleccionActiva: [] })
  },

  agregarLote: (guias) => {
    set((state) => {
      if (guias.length === 0) return state

      const clienteLote = guias[0].clienteId
      const mesLote = getMes(guias[0].fecha)

      if (!esLoteHomogeneo(guias)) return state

      if (state.seleccionActiva.length > 0) {
        const clienteExistente = state.seleccionActiva[0].clienteId
        const mesExistente = getMes(state.seleccionActiva[0].fecha)
        if (clienteLote !== clienteExistente || mesLote !== mesExistente) return state
      }

      const idsExistentes = new Set(state.seleccionActiva.map((g) => g.id))
      const nuevas = guias.filter((g) => !idsExistentes.has(g.id))

      return { seleccionActiva: [...state.seleccionActiva, ...nuevas] }
    })
  },

  clienteActivoId: () => {
    const { seleccionActiva } = get()
    return seleccionActiva.length === 0 ? null : seleccionActiva[0].clienteId
  },

  mesActivo: () => {
    const { seleccionActiva } = get()
    return seleccionActiva.length === 0 ? null : getMes(seleccionActiva[0].fecha)
  },
}))
````

## File: src/store/tenantStore.test.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useTenantStore } from './tenantStore'

describe('tenantStore', () => {
  beforeEach(() => {
    useTenantStore.setState({ tenantId: '', tenantNombre: '' })
  })

  describe('estado inicial', () => {
    it('tenantId empieza en string vacío', () => {
      expect(useTenantStore.getState().tenantId).toBe('')
    })

    it('tenantNombre empieza en string vacío', () => {
      expect(useTenantStore.getState().tenantNombre).toBe('')
    })
  })

  describe('setTenant', () => {
    it('actualiza tenantId y tenantNombre', () => {
      useTenantStore.getState().setTenant('t-001', 'Empresa ABC')
      const state = useTenantStore.getState()
      expect(state.tenantId).toBe('t-001')
      expect(state.tenantNombre).toBe('Empresa ABC')
    })
  })

  describe('isTenantSet', () => {
    it('retorna false si tenantId es string vacío', () => {
      expect(useTenantStore.getState().isTenantSet()).toBe(false)
    })

    it('retorna true si tenantId no es string vacío', () => {
      useTenantStore.getState().setTenant('t-001', 'Empresa ABC')
      expect(useTenantStore.getState().isTenantSet()).toBe(true)
    })
  })
})
````

## File: src/store/tenantStore.ts
````typescript
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
````

## File: src/test/mocks/fixtures.ts
````typescript
import type { Cliente, Guia, MetricasResumen, Agrupador, Factura } from '@/types'

export const mockClientes: Cliente[] = [
  {
    id: 'c1',
    nombre: 'Constructora Aconcagua S.A.',
    rut: '76.543.210-K',
    guiasPendientes: 14,
    factEst: 3,
    montoNeto: 10450000,
    reglaIdl: '977_campo_receptor_CmnaRecep',
  },
  {
    id: 'c2',
    nombre: 'Minera del Norte Ltda.',
    rut: '96.123.456-2',
    guiasPendientes: 9,
    factEst: 2,
    montoNeto: 7120000,
    reglaIdl: null,
  },
  {
    id: 'c3',
    nombre: 'Agrícola Los Álamos SpA',
    rut: '77.890.321-5',
    guiasPendientes: 7,
    factEst: 1,
    montoNeto: 3240000,
    reglaIdl: null,
  },
  {
    id: 'c4',
    nombre: 'Retail Sur S.A.',
    rut: '82.111.555-3',
    guiasPendientes: 11,
    factEst: 2,
    montoNeto: 6780000,
    reglaIdl: null,
  },
  {
    id: 'c5',
    nombre: 'Logística Express Ltda.',
    rut: '88.432.100-7',
    guiasPendientes: 6,
    factEst: 1,
    montoNeto: 1890000,
    reglaIdl: null,
  },
]

export const mockMetricas: MetricasResumen = {
  totalGuias: 98,
  clientesActivos: 6,
  factEst: 14,
  montoEstimado: 76000000,
  clientesConRezagadas: 4,
  tendenciaGuias: 12,
  tendenciaFactEst: 8,
  tendenciaClientes: 1,
}

export const mockAgrupadores: Agrupador[] = [
  {
    id: 'a1',
    clienteId: 'c1',
    codigo: 'OC 0001',
    etiqueta: 'Orden de Compra 0001',
    tipo: 'OC',
    color: '#dbeafe',
  },
  {
    id: 'a2',
    clienteId: 'c1',
    codigo: 'OC 0002',
    etiqueta: 'Orden de Compra 0002',
    tipo: 'OC',
    color: '#dcfce7',
  },
  {
    id: 'a3',
    clienteId: 'c2',
    codigo: 'DIR Santiago Centro',
    etiqueta: 'Dirección Santiago Centro',
    tipo: 'direccion',
    color: '#fef9c3',
  },
]

export const mockFacturasEmitidas: Factura[] = [
  {
    id: 'f1',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC 0001',
    folio: '001234',
    periodo: '2026-05',
    montoNeto: 1770000,
    iva: 336300,
    total: 2106300,
    fechaEmision: '2026-05-08',
    estado: 'emitida',
    guias: [],
  },
  {
    id: 'f2',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    agrupadorId: 'a2',
    agrupadorCodigo: 'OC 0002',
    folio: '001235',
    periodo: '2026-05',
    montoNeto: 750000,
    iva: 142500,
    total: 892500,
    fechaEmision: '2026-05-08',
    estado: 'emitida',
    guias: [],
  },
  {
    id: 'f3',
    clienteId: 'c2',
    clienteNombre: 'Minera del Norte Ltda.',
    agrupadorId: 'a3',
    agrupadorCodigo: 'DIR Santiago Centro',
    folio: '001230',
    periodo: '2026-04',
    montoNeto: 2350000,
    iva: 446500,
    total: 2796500,
    fechaEmision: '2026-04-30',
    estado: 'emitida',
    guias: [],
  },
]

export const mockGuias: Guia[] = [
  {
    id: 'g1',
    numero: '4401',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    fecha: '2026-05-03',
    descripcion: 'Hormigón premezclado — 200T',
    cantidad: 1,
    montoNeto: 1290000,
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC 0001',
    agrupadorColor: '#dbeafe',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
  {
    id: 'g2',
    numero: '4402',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    fecha: '2026-05-05',
    descripcion: 'Fierro galvanizado AISI-201',
    cantidad: 24,
    montoNeto: 480000,
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC 0001',
    agrupadorColor: '#dbeafe',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
  {
    id: 'g3',
    numero: '4403',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    fecha: '2026-05-07',
    descripcion: 'Cemento Portland 400kg',
    cantidad: 50,
    montoNeto: 750000,
    agrupadorId: 'a2',
    agrupadorCodigo: 'OC 0002',
    agrupadorColor: '#dcfce7',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
  {
    id: 'g4',
    numero: '4404',
    clienteId: 'c2',
    clienteNombre: 'Minera del Norte Ltda.',
    fecha: '2026-05-04',
    descripcion: 'Explosivos industriales Lote B',
    cantidad: 10,
    montoNeto: 2350000,
    agrupadorId: 'a3',
    agrupadorCodigo: 'DIR Santiago Centro',
    agrupadorColor: '#fef9c3',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
  // ── Abril 2026 (rezagadas) ─────────────────────────────────────────────────
  {
    id: 'g5',
    numero: '4380',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    fecha: '2026-04-15',
    descripcion: 'Arena fina — 50m³',
    cantidad: 3,
    montoNeto: 620000,
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC 0001',
    agrupadorColor: '#dbeafe',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
  {
    id: 'g6',
    numero: '4381',
    clienteId: 'c2',
    clienteNombre: 'Minera del Norte Ltda.',
    fecha: '2026-04-22',
    descripcion: 'Detonadores eléctricos x200',
    cantidad: 200,
    montoNeto: 1840000,
    agrupadorId: 'a3',
    agrupadorCodigo: 'DIR Santiago Centro',
    agrupadorColor: '#fef9c3',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
  {
    id: 'g7',
    numero: '4382',
    clienteId: 'c4',
    clienteNombre: 'Retail Sur S.A.',
    fecha: '2026-04-28',
    descripcion: 'Estanterías metálicas x40',
    cantidad: 40,
    montoNeto: 960000,
    agrupadorId: '',
    agrupadorCodigo: '',
    agrupadorColor: '#e2e8f0',
    agrupadorNombre: null,
    reglaIdl: null,
    estado: 'pendiente',
  },
]
````

## File: src/test/setup.ts
````typescript
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
````

## File: src/types/index.ts
````typescript
export type Periodo = 'actual' | 'anterior'

export interface Cliente {
  id: string
  nombre: string
  rut: string
  guiasPendientes: number
  factEst: number
  montoNeto: number
  reglaIdl: string | null
}

export interface Agrupador {
  id: string
  clienteId: string
  codigo: string
  etiqueta: string
  tipo: 'OC' | 'direccion' | 'contacto' | string
  color: string
}

export interface Guia {
  id: string
  numero: string
  clienteId: string
  clienteNombre: string
  fecha: string
  descripcion: string
  cantidad: number
  montoNeto: number
  agrupadorId: string
  agrupadorCodigo: string
  agrupadorColor: string
  agrupadorNombre: string | null
  reglaIdl: string | null
  estado: 'pendiente' | 'facturada'
}

export interface Factura {
  id: string
  clienteId: string
  clienteNombre?: string
  agrupadorId: string
  agrupadorCodigo?: string
  folio: string
  periodo: string
  montoNeto: number
  iva: number
  total: number
  fechaEmision?: string
  estado: 'borrador' | 'aprobada' | 'rechazada' | 'emitida' | 'fallida'
  guias: Guia[]
}

export type ReglaConfig =
  | { type: 'campo-receptor'; field: string }
  | { type: 'campo-detalle'; lineFilter: string; key: string }

export interface DiscoverCandidato {
  tipo: 'campo-receptor' | 'campo-detalle'
  field?: string
  lineFilter?: string
  key?: string
  ocurrencias: number
  ejemplos: string[]
}

export interface DiscoverResult {
  empkey: string
  muestraGuias: number
  candidatos: DiscoverCandidato[]
}

export interface ReglaEmp {
  reglaidl: string
  empkey: string
  reglaconfig: ReglaConfig | null
  reglanombre?: string | null
}

export interface ReglaCliente {
  reglaidl: string
  empkey: string
  gclirut: string
  activa: boolean
  reglanombre: string | null
  reglaconfig: ReglaConfig | null
}

export interface ReglaDisponible {
  reglaIdl: string
  reglaDesc: string
}

export interface MetricasResumen {
  totalGuias: number
  clientesActivos: number
  factEst: number
  montoEstimado: number
  clientesConRezagadas: number
  tendenciaGuias: number
  tendenciaFactEst: number
  tendenciaClientes: number
}
````

## File: src/utils/agrupadorColors.test.ts
````typescript
import { describe, it, expect } from 'vitest'
import { getChipTextColor, getAgrupadorTextColor } from './agrupadorColors'

describe('getChipTextColor', () => {
  it('elige negro para cyan #06b6d4 (blanco solo da ~2.4:1, no cumple WCAG)', () => {
    // Caso reportado en el issue: la fórmula sin gamma elegía blanco por error.
    expect(getChipTextColor('#06b6d4')).toBe('#1a1a1a')
  })

  it('elige blanco para un azul oscuro saturado', () => {
    expect(getChipTextColor('#1e3a8a')).toBe('#ffffff')
  })

  it('elige negro para amarillo claro', () => {
    expect(getChipTextColor('#fef9c3')).toBe('#1a1a1a')
  })

  it('elige blanco para negro puro', () => {
    expect(getChipTextColor('#000000')).toBe('#ffffff')
  })

  it('elige negro para blanco puro', () => {
    expect(getChipTextColor('#ffffff')).toBe('#1a1a1a')
  })

  it('retorna blanco por defecto si el hex es inválido', () => {
    expect(getChipTextColor('#fff')).toBe('#ffffff')
  })
})

describe('getAgrupadorTextColor (alias deprecado)', () => {
  it('delega en getChipTextColor', () => {
    expect(getAgrupadorTextColor('#06b6d4')).toBe(getChipTextColor('#06b6d4'))
  })
})
````

## File: src/utils/agrupadorColors.ts
````typescript
function srgbChannelToLinear(channel8bit: number): number {
  const c = channel8bit / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance (0=black, 1=white), with per-channel gamma correction */
function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  )
}

/** Returns '#ffffff' or '#1a1a1a', whichever yields the higher WCAG contrast ratio against bg */
export function getChipTextColor(hex: string): string {
  const c = hex.replace('#', '')
  if (c.length !== 6) return '#ffffff'
  const luminance = relativeLuminance(hex)
  const contrastWhite = 1.05 / (luminance + 0.05)
  const contrastBlack = (luminance + 0.05) / 0.05
  return contrastBlack > contrastWhite ? '#1a1a1a' : '#ffffff'
}

/** @deprecated use getChipTextColor */
export function getAgrupadorTextColor(hex: string): string {
  return getChipTextColor(hex)
}
````

## File: src/utils/loteHomogeneo.ts
````typescript
import type { Guia } from '@/types'

export const getMes = (fecha: string): string => fecha.slice(0, 7) // 'YYYY-MM'

// Regla de no-mezcla (CLAUDE.md § Reglas de Negocio, no negociable): una
// factura nunca puede mezclar guías de distintos clientes ni de distintos
// meses. Fuente única de este chequeo — usado tanto por seleccionStore
// (para no descartar lotes en silencio) como por useGuiasFilters (para
// habilitar/ocultar la acción de facturación masiva por filtro).
export function esLoteHomogeneo(guias: Guia[]): boolean {
  if (guias.length === 0) return false
  const clienteId = guias[0].clienteId
  const mes = getMes(guias[0].fecha)
  return guias.every((g) => g.clienteId === clienteId && getMes(g.fecha) === mes)
}
````

## File: src/utils/periodo.ts
````typescript
/**
 * Utilidades compartidas para cálculo de períodos.
 *
 * Centraliza la lógica que antes estaba duplicada en:
 *  - src/services/http.ts          (periodoToYYYYMM)
 *  - src/pages/Clientes.tsx        (getMesLabel / MESES)
 *  - src/components/DateFilter/DateFilter.tsx  (getMonthBounds)
 */

export type Periodo = 'actual' | 'anterior'

const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Devuelve el objeto Date correspondiente al primer día del período. */
function periodoToDate(periodo: Periodo): Date {
  const now = new Date()
  const offset = periodo === 'anterior' ? -1 : 0
  return new Date(now.getFullYear(), now.getMonth() + offset, 1)
}

/**
 * Convierte un período en su representación 'YYYY-MM'.
 *
 * Ejemplos (ejecutado en mayo 2026):
 *   periodoToYYYYMM('actual')   → '2026-05'
 *   periodoToYYYYMM('anterior') → '2026-04'
 */
export function periodoToYYYYMM(periodo: Periodo): string {
  const d = periodoToDate(periodo)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

/**
 * Devuelve el rango completo de fechas y la etiqueta legible del período.
 *
 * Retorna:
 *   from  - primer día del mes en formato 'YYYY-MM-DD'
 *   to    - último día del mes en formato 'YYYY-MM-DD'
 *   label - nombre del mes y año, e.g. 'Mayo 2026'
 *
 * Ejemplos (ejecutado en mayo 2026):
 *   periodoToRange('actual')   → { from: '2026-05-01', to: '2026-05-31', label: 'Mayo 2026' }
 *   periodoToRange('anterior') → { from: '2026-04-01', to: '2026-04-30', label: 'Abril 2026' }
 */
export function periodoToRange(periodo: Periodo): { from: string; to: string; label: string } {
  const first = periodoToDate(periodo)
  const year  = first.getFullYear()
  const month = first.getMonth() // 0-indexed

  const from  = `${year}-${pad(month + 1)}-01`
  // new Date(year, month + 1, 0) → last day of `month`
  const last  = new Date(year, month + 1, 0)
  const to    = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`
  const label = `${MESES_ES[month]} ${year}`

  return { from, to, label }
}
````

## File: src/App.tsx
````typescript
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
````

## File: src/index.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── DARK MODE (default) — Paleta Lucien ─────────────────────────── */
:root {
  --background:             #080d2c;
  --foreground:             #ffffff;
  --card:                   #13183a;
  --card-foreground:        #ffffff;
  --popover:                #1d2242;
  --popover-foreground:     #ffffff;
  --primary:                #505daa;
  --primary-foreground:     #ffffff;
  --secondary:              #1d2242;
  --secondary-foreground:   #c8d0f0;
  --muted:                  #0c133d;
  --muted-foreground:       #9aa4d4;  /* era #8a94c4 — ratio 7.3:1 sobre bg */
  --accent:                 #1d2242;
  --accent-foreground:      #c8d0f0;  /* era #505daa — usa foreground claro */
  --destructive:            #DC2626;
  --destructive-foreground: #ffffff;
  --border:                 #303d78;  /* era #1d2242 — más visible */
  --input:                  #191f4d;  /* era #0c133d — fondo de inputs */
  --ring:                   #6e7dd4;
  /* Topbar-specific tokens */
  --topbar-bg:              #0d1440;
  --topbar-border:          #303d78;  /* consistente con --border */
  --topbar-pill-bg:         #1d2754;
  --topbar-pill-border:     #303d78;
  --topbar-pill-text:       #ffffff;
  --topbar-icon-color:      #8b9ae8;  /* más claro para contraste sobre topbar */
  --topbar-btn-bg:          #505daa;
  --topbar-btn-hover:       #6b79c7;
}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}

@layer utilities {
  .sku-column {
    font-family: 'Roboto Mono', monospace;
  }
  .barcode-data {
    font-family: 'Roboto Mono', monospace;
  }
}

/* Ocultar spinners en inputs numéricos */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Date input calendar icon theming */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  opacity: 0.6;
  cursor: pointer;
}
````

## File: src/main.tsx
````typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/syne/400.css'
import '@fontsource/syne/700.css'
import '@fontsource/roboto-mono/400.css'
import '@fontsource/roboto-mono/500.css'
import '@fontsource/roboto-mono/600.css'
import '@fontsource/roboto-mono/700.css'
import './index.css'
import App from './App.tsx'

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
      <App />
    </StrictMode>,
  )
})
````

## File: src/router.test.tsx
````typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRouter from './router'

vi.mock('@/services/api', () => ({
  fetchClientes:       vi.fn().mockResolvedValue([]),
  fetchReglaActiva:    vi.fn().mockResolvedValue([]),
  assignReglaCliente:  vi.fn().mockResolvedValue(undefined),
  fetchMetricas:       vi.fn().mockResolvedValue({ totalGuias: 0, clientesActivos: 0, factEst: 0, montoEstimado: 0, clientesConRezagadas: 0, tendenciaGuias: 0, tendenciaFactEst: 0, tendenciaClientes: 0 }),
  fetchGuias:          vi.fn().mockResolvedValue([]),
  fetchFacturas:       vi.fn().mockResolvedValue([]),
  emitirFacturas:      vi.fn().mockResolvedValue([]),
}))

function renderRouter(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>,
  )
}

describe('AppRouter', () => {
  it('renders Clientes page at /clientes', () => {
    renderRouter('/clientes')
    expect(screen.getByTestId('tab-actual')).toBeInTheDocument()
  })

  it('renders Guías page at /guias', () => {
    renderRouter('/guias')
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  it('redirects / to /clientes', () => {
    renderRouter('/')
    expect(screen.getByTestId('tab-actual')).toBeInTheDocument()
  })

  it('renders Historial at /historial', () => {
    renderRouter('/historial')
    expect(screen.getByRole('heading', { name: /historial/i })).toBeInTheDocument()
  })
})
````

## File: src/router.tsx
````typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout/AppLayout'
import ClientesPage from './pages/Clientes'
import GuiasPage from './pages/Guias'
import HistorialPage from './pages/Historial'
import PreviewPage from './pages/Preview'
import AdminReglasPage from './pages/AdminReglas'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/guias" element={<GuiasPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/admin/reglas" element={<AdminReglasPage />} />
      </Route>
    </Routes>
  )
}
````

## File: src/vite-env.d.ts
````typescript
/// <reference types="vite/client" />
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Build
dist
dist-ssr
*.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Test coverage
coverage
````

## File: CLAUDE.md
````markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Proyecto

**Sistema de Facturación Automatizada** — aplicación web multi-tenant que automatiza la conversión de guías de despacho en facturas electrónicas DTE. Ver PRD completo en `PRD_Sistema_Facturacion_Automatizada.md`.

### Resumen de Requerimientos

- **Vista Clientes (principal post-login):** grilla de clientes filtrada por tenant activa con tabs Mes Actual / Mes Anterior. Carga por defecto el Mes Anterior si hay guías rezagadas. Buscador type-ahead por nombre o RUT. Columnas: Cliente/RUT, Guías Pendientes, Fact. Est., Acciones (Ver Guías / Facturar). Botón "Facturar Global" dual: en header y entre los tabs de período.
- **Vista Guías:** filtros en cascada — Fecha (mes + datepicker restringido al mes activo) → Cliente → Agrupador. Filas coloreadas por agrupador. Selección 1a1 por checkbox o batch por "Facturar Agrupador". Al cancelar el modal de confirmación, se deselecciona todo automáticamente.
- **Panel de métricas superior:** total guías pendientes, clientes involucrados, Fact. Est. total.
- **Flujo de facturación:** Facturar Global → diálogo advertencia → pantalla revisión (Aprobar / Rechazar por factura) → emisión DTE → redirect automático a Historial.
- **pipeline-audit.html:** archivo standalone independiente con vistas archivadas (Pipeline GDE, Auditoría). Sin dependencias del sistema principal.

---

## Stack Técnico

| Capa | Tecnología |
|------|------------|
| Framework | React + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| State | Zustand |
| UI | Tailwind CSS (+ componentes a definir) |

---

## Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run lint      # Lint
npm run test      # Tests
npm run preview   # Preview del build
```

> El proyecto aún no está scaffoldeado. Al inicializar: `npm create vite@latest . -- --template react-ts`

---

## Arquitectura y Estructura de Fuentes

```
src/
  pages/
    Clientes.tsx      # Vista principal post-login
    Guias.tsx         # Vista de guías de despacho
    Preview.tsx       # Previsualización y aprobación de facturas
    Historial.tsx     # Auditoría post-emisión
  components/
    MetricsPanel/     # Panel superior de métricas
    ClientesGrid/     # Grilla con tabs de período
    GuiasGrid/        # Grilla con coloreado por agrupador
    Filters/          # Dropdowns en cascada Cliente→Agrupador
    ConfirmDialog/    # Modal de confirmación (con auto-deselect al cancelar)
  services/
    api.ts            # Cliente HTTP; toda llamada incluye tenantId
    guiasService.ts
    facturasService.ts
  store/
    seleccionStore.ts # Estado de guías seleccionadas (Zustand)
    tenantStore.ts    # Tenant activa y contexto de sesión
    periodoStore.ts   # Mes activo (Actual / Anterior)
  types/
    index.ts          # Interfaces: Guia, Cliente, Agrupador, Factura, DTE
  router.tsx          # Rutas principales
pipeline-audit.html   # Standalone — NO importar desde el sistema principal
```

### Rutas

| Ruta | Vista |
|------|-------|
| `/clientes` | Default post-login |
| `/guias` | Gestión de guías |
| `/preview` | Previsualización (oculta si `seleccionActiva.length === 0`) |
| `/historial` | Auditoría (redirect automático post-emisión) |

---

## Decisiones de Implementación Críticas

1. **Multi-tenant:** toda consulta al backend incluye `tenantId` como filtro primario. No existe ruta sin tenant.

2. **Segmentación por período:** la capa de datos garantiza que nunca se retornen guías de meses distintos al seleccionado. El frontend refuerza esto bloqueando el datepicker fuera del mes activo (`min`/`max` = primer y último día del mes).

3. **Algoritmo Agrupador reside en el backend.** El frontend solo consume el tag/color asignado. No replicar lógica de agrupación en cliente.

4. **Dropdown Agrupador en cascada:** se monta solo después de seleccionar un cliente. Al limpiar la selección de cliente, el dropdown de Agrupador se destruye (no se oculta, se desmonta).

5. **Auto-deselect al cancelar modal:** el componente `ConfirmDialog` emite un evento `onCancel` que el store de selección escucha para limpiar `seleccionActiva`.

6. **Previsualización condicional:** el ítem de menú lateral y la ruta `/preview` se ocultan/desactivan cuando `seleccionActiva.length === 0`.

7. **"Facturar Global" dual:** dos instancias del mismo botón — una en el header (siempre visible) y otra entre los tabs de período en Vista Clientes. Misma acción, distinta posición.

8. **Restricción de mezcla:** validar en el store que todas las guías seleccionadas pertenecen al mismo cliente Y al mismo mes antes de habilitar "Facturar Selección".

---

## Reglas de Negocio (No Negociables)

- **Nunca mezclar guías de distintos meses en una factura.**
- **Nunca mezclar guías de distintos clientes en una factura.**
- El tab activo por defecto es Mes Anterior si la tenant tiene guías rezagadas sin procesar; si no, Mes Actual.
- Al aprobar el lote, solo las facturas aprobadas individualmente se envían al backoffice como DTE.

---

## Fuera de Alcance (v1)

- Manejo de lotes que superen el límite de ítems por factura.
- Flujo para documentos rechazados en previsualización.
- Pantalla de Inicio/Inbox.
- Pipeline GDE y Auditoría como vistas activas del menú (solo en `pipeline-audit.html`).
````

## File: CONTEXT.md
````markdown
# CONTEXT — facturaGdes

## Glosario

**Enviar a facturación**
Acción del operador que confirma el lote de Proformas aprobadas en la vista Preview y las envía al backend.
Transiciona las Facturas Proforma de `BORRADOR` a `APROBADA`. No emite al SII — eso lo maneja el backoffice Genexus en una fase posterior fuera del scope de este sistema.
Etiqueta del botón principal de Preview. Distinto de "Aprobar" (acción por proforma individual).

**Nombre de Regla**
Etiqueta legible que el operador asigna a una Regla al activarla (ej: "Por comuna", "Por OC", "Por obra").
Es lo que aparece en chips de agrupador, combobox, vista Admin, y Preview — nunca el field name técnico del XML.
Si el operador no define un nombre, el sistema usa el label técnico como fallback (`CmnaRecep`, `OBSERVACIONES · ORDENCOMPRA`).

**Administración de Reglas**
Vista (`AdminReglas`) donde el operador gestiona qué reglas tiene configuradas cada Cliente y cuál está activa.
Incluye un selector de Cliente: el operador elige el cliente, ve sus reglas disponibles (descubiertas del XML), y activa una.
Es el único lugar donde se cambia la regla activa de un cliente — no desde la vista de Guias.
````

## File: eslint.config.js
````javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'public'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
````

## File: facturaGdes.postman_collection.json
````json
{
  "info": {
    "name": "facturaGdes API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "base_url", "value": "http://localhost:3334" },
    { "key": "empkey",   "value": "977" },
    { "key": "periodo",  "value": "2026-05" },
    { "key": "rut",      "value": "" },
    { "key": "gfackey",  "value": "" }
  ],
  "item": [
    {
      "name": "Clientes",
      "item": [
        {
          "name": "GET clientes del período",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/clientes?periodo={{periodo}}",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "clientes"],
              "query": [{ "key": "periodo", "value": "{{periodo}}" }]
            }
          }
        },
        {
          "name": "PUT asignar regla a cliente",
          "request": {
            "method": "PUT",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/clientes/{{rut}}/regla",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "clientes", "{{rut}}", "regla"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"reglaidl\": \"<id_regla>\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Guías",
      "item": [
        {
          "name": "GET guías agrupadas (todas)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/guias/agrupadas?periodo={{periodo}}",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "guias", "agrupadas"],
              "query": [{ "key": "periodo", "value": "{{periodo}}" }]
            }
          }
        },
        {
          "name": "GET guías agrupadas (por cliente)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/guias/agrupadas?periodo={{periodo}}&rut={{rut}}",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "guias", "agrupadas"],
              "query": [
                { "key": "periodo", "value": "{{periodo}}" },
                { "key": "rut",     "value": "{{rut}}" }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Facturas / Proformas",
      "item": [
        {
          "name": "GET proformas del período",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/facturas/proforma?periodo={{periodo}}",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "facturas", "proforma"],
              "query": [{ "key": "periodo", "value": "{{periodo}}" }]
            }
          }
        },
        {
          "name": "POST generar proformas BORRADOR",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/facturas/proforma/generar?periodo={{periodo}}",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "facturas", "proforma", "generar"],
              "query": [{ "key": "periodo", "value": "{{periodo}}" }]
            }
          }
        },
        {
          "name": "PATCH aprobar proforma",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/facturas/proforma/{{gfackey}}/aprobar",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "facturas", "proforma", "{{gfackey}}", "aprobar"]
            }
          }
        },
        {
          "name": "PATCH anular proforma",
          "request": {
            "method": "PATCH",
            "url": {
              "raw": "{{base_url}}/empresas/{{empkey}}/facturas/proforma/{{gfackey}}/anular",
              "host": ["{{base_url}}"],
              "path": ["empresas", "{{empkey}}", "facturas", "proforma", "{{gfackey}}", "anular"]
            }
          }
        }
      ]
    },
    {
      "name": "Reglas",
      "item": [
        {
          "name": "GET discover candidatos",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/reglas/discover?empkey={{empkey}}",
              "host": ["{{base_url}}"],
              "path": ["reglas", "discover"],
              "query": [{ "key": "empkey", "value": "{{empkey}}" }]
            }
          }
        },
        {
          "name": "GET reglas activas de empresa",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/reglas/empresa/{{empkey}}",
              "host": ["{{base_url}}"],
              "path": ["reglas", "empresa", "{{empkey}}"]
            }
          }
        },
        {
          "name": "POST activar regla",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": {
              "raw": "{{base_url}}/reglas/activar",
              "host": ["{{base_url}}"],
              "path": ["reglas", "activar"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"empkey\": \"{{empkey}}\",\n  \"config\": {}\n}"
            }
          }
        }
      ]
    }
  ]
}
````

## File: index.html
````html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GDE Sistema</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

## File: package.json
````json
{
  "name": "factura-gdes",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@fontsource/roboto-mono": "^5.3.0",
    "@fontsource/syne": "^5.3.0",
    "@tanstack/react-virtual": "^3.13.26",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.14.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "tailwind-merge": "^3.5.0",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^10.7.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "~5.6.2",
    "typescript-eslint": "^8.64.0",
    "vite": "^5.4.10",
    "vitest": "^2.1.5"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild",
      "msw"
    ]
  },
  "msw": {
    "workerDirectory": [
      "public"
    ]
  }
}
````

## File: pnpm-workspace.yaml
````yaml
allowBuilds:
  esbuild: true
  msw: true
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

## File: tailwind.config.ts
````typescript
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', ...defaultTheme.fontFamily.sans],
        mono: ['"Roboto Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        lucien: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          500: '#505daa',
          700: '#3d4a8a',
          900: '#2a3570',
        },
        danger: {
          50: '#3A1010',
          100: '#4A1515',
          600: '#DC2626',
          700: '#B91C1C',
        },
        warning: {
          50: '#332510',
          100: '#4A3517',
          600: '#F59E0B',
          700: '#B45309',
        },
        success: {
          DEFAULT: '#16A34A',
          50: '#10281B',
          100: '#1A3D28',
          600: '#22C55E',
        },
        category: {
          receptor: '#60A5FA',
          detalle: '#A78BFA',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
````

## File: tsconfig.app.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/empresas': {
        target: 'http://localhost:3334/facturador-guias-backend/api',
        changeOrigin: true,
      },
      '/reglas': {
        target: 'http://localhost:3334/facturador-guias-backend/api',
        changeOrigin: true,
      },
    },
  },
})
````

## File: vitest.config.ts
````typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
````
