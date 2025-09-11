// src/core/models/Contacto.ts
export interface Contacto {
  id: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: string;
  area: string;
  cargo: string;
  operador?: string;
}
