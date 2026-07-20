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
