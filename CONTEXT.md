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
