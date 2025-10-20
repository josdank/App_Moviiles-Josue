import { Gasto, Persona } from "../types/gasto";

export type ResultadoBalance = {
  totalPorPersona: Record<Persona, number>;
  promedio: number;
  deudas: { de: Persona; a: Persona; monto: number }[];
};

export function calcularBalances(gastos: Gasto[]): ResultadoBalance {
  const personas: Persona[] = ["Juan", "María", "Pedro"];
  const totalPorPersona: Record<Persona, number> = { Juan:0, María:0, Pedro:0 };

  for (const g of gastos) totalPorPersona[g.pagoPor] += g.monto;

  const total = Object.values(totalPorPersona).reduce((a,b)=>a+b,0);
  const promedio = personas.length ? total / personas.length : 0;

  const deltas = personas.map(p => ({ p, v: Number((totalPorPersona[p] - promedio).toFixed(2)) }));
  const deudores = deltas.filter(d=>d.v<0).map(d=>({p:d.p, v:-d.v}));
  const acreedores = deltas.filter(d=>d.v>0).map(d=>({p:d.p, v:d.v}));
  const deudas: ResultadoBalance["deudas"] = [];

  let i=0, j=0;
  while (i<deudores.length && j<acreedores.length) {
    const pagar = Math.min(deudores[i].v, acreedores[j].v);
    deudas.push({ de: deudores[i].p, a: acreedores[j].p, monto: Number(pagar.toFixed(2)) });
    deudores[i].v = Number((deudores[i].v - pagar).toFixed(2));
    acreedores[j].v = Number((acreedores[j].v - pagar).toFixed(2));
    if (deudores[i].v === 0) i++;
    if (acreedores[j].v === 0) j++;
  }

  return { totalPorPersona, promedio: Number(promedio.toFixed(2)), deudas };
}
