// context/GastosContexto.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { Gasto } from "../types/gasto";
import { cargarGastos, guardarGastos } from "../librerias/almacenamiento";

type Ctx = {
  gastos: Gasto[];
  agregarGasto: (g: Gasto) => Promise<void>;
  eliminarGasto: (id: string) => Promise<void>;
};

const CtxGastos = createContext<Ctx | null>(null);

export function GastosProvider({ children }: { children: React.ReactNode }) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  useEffect(() => { (async () => setGastos(await cargarGastos()))(); }, []);
  useEffect(() => { guardarGastos(gastos); }, [gastos]);
  const agregarGasto = async (g: Gasto) => setGastos((prev) => [g, ...prev]);
  const eliminarGasto = async (id: string) => setGastos((prev) => prev.filter((x) => x.id !== id));
  return <CtxGastos.Provider value={{ gastos, agregarGasto, eliminarGasto }}>{children}</CtxGastos.Provider>;
}

export function useGastos() {
  const ctx = useContext(CtxGastos);
  if (!ctx) throw new Error("useGastos debe usarse dentro de GastosProvider");
  return ctx;
}
