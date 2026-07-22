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
