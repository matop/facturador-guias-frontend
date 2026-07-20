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
