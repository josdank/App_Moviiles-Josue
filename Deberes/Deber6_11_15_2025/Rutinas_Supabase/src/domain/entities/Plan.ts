export type Plan = {
  id: string;
  rutina_id: string;
  usuario_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  objetivo?: string;
  created_at: string;
};
