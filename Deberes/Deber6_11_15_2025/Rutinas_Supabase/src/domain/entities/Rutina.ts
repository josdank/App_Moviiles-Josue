export type Rutina = {
  id: string;
  entrenador_id: string;
  titulo: string;
  descripcion?: string;
  dificultad?: 'principiante' | 'intermedio' | 'avanzado';
  created_at: string;
};
