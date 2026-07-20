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
