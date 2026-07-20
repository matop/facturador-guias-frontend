# Sistema de Diseño — facturaGdes (Sistema de Facturación Automatizada)

> **Versión:** 3.0.0 | **Última actualización:** Mayo 2026
>
> Este documento es la **fuente única de verdad** para toda decisión visual y de componentes del sistema de facturación.
> Cualquier agente o desarrollador que trabaje en la UI **DEBE** leer y respetar este archivo antes de escribir código.

---

## 0. Reglas Inquebrantables

Estas reglas tienen prioridad absoluta. Si entran en conflicto con cualquier otra sección, ganan.

1. **NO tocar lógica de negocio.** Hooks, servicios, llamadas a API, cálculos de precios y cualquier código que no sea puramente de presentación son intocables. Solo se modifica lo relacionado al frontend visual: JSX, clases de Tailwind, estructura de componentes UI y estilos CSS.
2. **Coherencia visual total.** Cada pantalla del sistema debe verse como parte de la misma aplicación. Si un patrón visual existe en una pantalla, debe replicarse idénticamente en las demás.
3. **PROHIBIDO hardcodear colores.** Usar exclusivamente las variables semánticas definidas en `index.css` y mapeadas en la sección de tokens de este documento (ej. `bg-primary`, `text-foreground`, `border-border`). Nunca usar valores arbitrarios como `bg-[#1E40AF]` cuando existe un token equivalente.
4. **Componentes UI base obligatorios.** Antes de crear un `<button>`, `<input>`, `<select>` o `<table>` HTML crudo, verificar si existe un componente en `src/components/ui/`. Si existe, usarlo. Si no existe, crearlo siguiendo el patrón de los existentes (CVA + Radix + forwardRef).
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
| Componentes UI | shadcn/ui (Radix UI) | — |
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
│   ├── Sidebar/          # Sidebar con NavLink activo (bg-slate-900)
│   ├── MetricsPanel/     # Panel superior de métricas (3 cards)
│   ├── ClientesGrid/     # Grilla con skeleton + empty state
│   ├── GuiasGrid/        # Grilla agrupada por agrupador, checkboxes
│   ├── DateFilter/       # Tabs mes + flechas ◄► + datepicker
│   ├── ConfirmDialog/    # Modal de confirmación (auto-deselect onCancel)
│   └── ui/               # Primitivos shadcn/ui (button, input, card, dialog…)
├── store/
│   ├── seleccionStore.ts # Guías seleccionadas (Zustand)
│   ├── periodoStore.ts   # Mes activo (Actual / Anterior)
│   ├── tenantStore.ts    # Tenant activa
│   └── themeStore.ts     # dark/light toggle (persiste en localStorage)
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
└── index.css             # CSS custom properties dark/light (NO modificar sin aprobación)
```

---

## 4. Sistema de Tokens de Diseño

Todos los tokens están definidos como CSS custom properties en `src/index.css` y mapeados a clases de Tailwind en `tailwind.config.ts`. **Siempre usar la clase de Tailwind**, nunca el valor hex directo.

El sistema usa **dos temas**: Dark Mode (Paleta Lucien, default) y Light Mode (Paleta Gdes navy/blue). El toggle está en el header (`data-testid="theme-toggle"`); el estado persiste en localStorage via `themeStore`.

---

### 4.1. Colores — Modo Oscuro / Dark (`:root`, **default**)

> **Paleta Lucien** — azul/violeta profundo. Aplicado por defecto sin clase adicional.

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

### 4.2. Colores — Modo Claro / Light (`html.light`)

> **Paleta Gdes navy/blue** — azul institucional, fondo claro. Activado con clase `html.light`.

#### Fondos y Superficies

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--background` | `bg-background` | `#f4f7fb` | Fondo general |
| `--card` | `bg-card` | `#ffffff` | Tarjetas, paneles |
| `--popover` | `bg-popover` | `#ffffff` | Popovers, dropdowns |
| `--muted` | `bg-muted` | `#e8f1fb` | Fondos secundarios |
| `--accent` | `bg-accent` | `#e8f1fb` | Hover general |
| `--secondary` | `bg-secondary` | `#e8f1fb` | Botones secundarios |

#### Texto

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--foreground` | `text-foreground` | `#1a2e45` | Texto principal (navy oscuro) |
| `--card-foreground` | `text-card-foreground` | `#1a2e45` | Texto en tarjetas |
| `--muted-foreground` | `text-muted-foreground` | `#4a6785` | Labels, placeholders (ratio WCAG AA ✓) |

#### Acción Principal

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--primary` | `bg-primary` | `#1971c2` | Botones primarios, sidebar activo |
| `--primary-foreground` | `text-primary-foreground` | `#ffffff` | Texto sobre primary |
| `--ring` | `ring-ring` | `#1971c2` | Anillo de focus |

#### Bordes e Inputs

| Token CSS | Clase Tailwind | Valor Hex | Uso |
|---|---|---|---|
| `--border` | `border-border` | `#d6e4f5` | Bordes estándar |
| `--input` | `border-input` | `#d6e4f5` | Bordes de inputs |

#### Topbar (light)

| Token CSS | Uso |
|---|---|
| `--topbar-bg: #ffffff` | Fondo del header |
| `--topbar-border: #d6e4f5` | Línea inferior del header |
| `--topbar-pill-bg: #f4f7fb` | Fondo de pills |
| `--topbar-pill-border: #d6e4f5` | Borde de pills |
| `--topbar-pill-text: #1a2e45` | Texto en pills |
| `--topbar-icon-color: #1971c2` | Color de iconos |
| `--topbar-btn-bg: #1971c2` | Fondo del botón Facturar Global |
| `--topbar-btn-hover: #145ea8` | Hover del botón Facturar Global |

---

### 4.2b. Estados Semánticos (ambos temas)

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

---

### 4.3. Tipografía

#### Familias tipográficas

| Tipo | Familia | Clase Tailwind | Uso |
|---|---|---|---|
| Sans-serif | `Inter, sans-serif` | `font-sans` | Todo el texto de interfaz |
| Monospace | `Roboto Mono, monospace` | `font-mono` | Códigos de barra, SKU, datos numéricos críticos |

**Regla:** Las columnas de código de barra/SKU **deben** usar `font-mono`. Existen las clases utilitarias `.sku-column` y `.barcode-data` en `index.css` para esto.

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

| Nivel | Clase | Uso |
|---|---|---|
| Sutil | `shadow-sm` | Cards, sidebar |
| Estándar | `shadow-md` | Botones principales, header |
| Elevado | `shadow-lg` | Modales, drawers |
| Extra | `shadow-xl` | Overlays |

---

## 5. Arquitectura de Componentes

### 5.1. Componentes Base (`src/components/ui/`)

Estos son los primitivos del sistema. Se construyen con el patrón shadcn/ui: **Radix UI + CVA + forwardRef + cn()**.

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

Basado en Radix UI Select con sub-componentes: `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`.

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

El sidebar **no es colapsable** en esta aplicación. Ancho fijo `w-56` (`224px`).

```tsx
<aside className="w-56 bg-slate-900 flex flex-col h-screen">

  {/* Logo/brand */}
  <div className="px-4 py-5 border-b border-slate-700">
    <span className="text-white font-bold text-lg">facturaGdes</span>
  </div>

  {/* Navegación con NavLink */}
  <nav className="flex-1 px-2 py-4 space-y-1">
    <NavLink
      to="/clientes"
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive
          ? 'bg-primary/20 text-white'         // activo: tinte primary
          : 'text-slate-400 hover:text-white hover:bg-slate-800'  // inactivo
        }`
      }
    >
      <Users className="w-4 h-4" />
      Clientes
    </NavLink>
    {/* … más NavLinks … */}
  </nav>
</aside>
```

**Reglas:**
- Sidebar: `bg-slate-900` fijo — no cambia entre temas dark/light.
- Link activo: `bg-primary/20 text-white`.
- Link inactivo: `text-slate-400 hover:text-white hover:bg-slate-800`.
- Ítem `/preview` solo visible cuando `seleccionActiva.length > 0`.

### 6.3. Header / Topbar

El header usa CSS custom properties de topbar para adaptarse al tema activo.

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

  {/* Toggle dark/light */}
  <button data-testid="theme-toggle" onClick={toggleTheme}>
    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </button>
</header>
```

**Reglas:**
- Usar `var(--topbar-*)` para que el header se adapte a dark/light sin clases extra.
- El título de vista viene del mapa `PAGE_META` en `AppLayout.tsx` (no usar `<h1>`).
- **Facturar Global** dual: una instancia en el header (siempre visible) + otra entre tabs de período en Vista Clientes.

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
- [ ] Si usas el tema institucional: la paleta azul primary se respeta
- [ ] Si usas el tema Carbón & Cobre: los tokens de `.theme-carbon` se respetan y no hay colores hardcodeados
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

## 18. Sistema Dual de Temas (Dark Lucien ↔ Light Gdes)

> **Estado:** Implementado y estable — Mayo 2026

El toggle está en el header (`data-testid="theme-toggle"`). El estado persiste en `localStorage` via `themeStore` (Zustand). La clase `html.light` activa la paleta Gdes; sin ella, rige la paleta Lucien (dark).

### Implementación del toggle

```tsx
// src/store/themeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.toggle('light', next === 'light')
        set({ theme: next })
      },
    }),
    { name: 'facturaGdes-theme' }
  )
)
```

### Contraste validado (WCAG AA)

| Par | Dark (Lucien) | Light (Gdes) | Ratio |
|---|---|---|---|
| foreground / background | `#fff` / `#080d2c` | `#1a2e45` / `#f4f7fb` | ≥ 7:1 ✓ |
| muted-foreground / card | `#8a94c4` / `#13183a` | `#4a6785` / `#ffffff` | ≥ 4.5:1 ✓ |
| primary / background | `#505daa` / `#080d2c` | `#1971c2` / `#f4f7fb` | ≥ 4.5:1 ✓ |

> **Ajuste de contraste aplicado (2026-05-11):**
> `--muted-foreground` dark era `#8A8480` (ratio bajo) → corregido a `#A09C98`.
> `--muted-foreground` light era `#6b87a8` (ratio bajo) → corregido a `#4a6785`.

### Checklist del sistema de temas

- [ ] Usar `bg-background`, `text-foreground` — nunca hex hardcodeados
- [ ] Usar `var(--topbar-*)` en header para que adapte en ambos temas
- [ ] Sidebar usa `bg-slate-900` (fijo, no cambia entre temas)
- [ ] El toggle Sun/Moon funciona y persiste al recargar
- [ ] Contraste cumple WCAG AA en ambos temas
