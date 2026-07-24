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

---

## Agent skills

### Issue tracker

Issues y specs viven como GitHub Issues en `matop/facturador-guias-frontend` (vía `gh`). Ver `docs/agents/issue-tracker.md`.

### Domain docs

Repo single-context: `CONTEXT.md` en la raíz (sin `docs/adr/` todavía). Ver `docs/agents/domain.md`.
