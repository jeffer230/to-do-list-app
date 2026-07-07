export interface Task {
  id: string;
  title: string;
  description?: string; // Opcional
  isCompleted: boolean;
  categoryId: string | null; // null si es una tarea sin categoría asignada
  createdAt: number; // Timestamp (Date.now())
}
