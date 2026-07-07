import { Category } from './category.model';

export interface Task {
  id: string;
  title: string;
  description?: string; // Opcional
  isCompleted: boolean;
  categoryId: string | null; // null si es una tarea sin categoría asignada
  createdAt: number; // Timestamp (Date.now())
  category?: Category; // Relación con la categoría
}
