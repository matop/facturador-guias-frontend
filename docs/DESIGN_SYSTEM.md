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
        <span className="text-foreground font-semibold text-base leading-tight block truncate">Facturador de Guías</span>
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
