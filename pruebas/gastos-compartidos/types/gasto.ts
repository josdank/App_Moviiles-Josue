export type Persona = "Juan" | "María" | "Pedro";

export type Gasto = {
  id: string;
  titulo: string;
  monto: number;
  pagoPor: Persona;
  participantes: Persona[];
  fotoReciboUri: string;
  creadoEn: string; // ISO
};

export const PERSONAS: Persona[] = ["Juan", "María", "Pedro"];
