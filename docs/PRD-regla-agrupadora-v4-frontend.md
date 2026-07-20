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
