import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from 'src/app/shared/models/task.model';
import { StorageService } from 'src/app/core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks_data';

  // El estado interno privado
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // El observable público de solo lectura para los componentes
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadInitialData();
  }

  // Cargar datos iniciales
  private async loadInitialData() {
    const storedTasks = await this.storageService.get(this.TASKS_KEY);
    if (storedTasks) {
      this.tasksSubject.next(storedTasks);
    }
  }

  // Agregar Tarea
  public async addTask(newTask: Task): Promise<void> {
    const currentTasks = this.tasksSubject.getValue();
    // Agregamos al inicio para que la más nueva salga arriba
    const updatedTasks = [newTask, ...currentTasks];

    this.updateStateAndStorage(updatedTasks);
  }

  // Actualizar Tarea editar texto, cambiar categoría o marcar como completada
  public async updateTask(updatedTask: Task): Promise<void> {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    this.updateStateAndStorage(updatedTasks);
  }

  // Eliminar Tarea
  public async deleteTask(taskId: string): Promise<void> {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);

    this.updateStateAndStorage(updatedTasks);
  }

  // Método auxiliar para no repetir código
  private updateStateAndStorage(tasks: Task[]): void {
    this.tasksSubject.next(tasks); // Actualiza la UI instantáneamente
    this.storageService.set(this.TASKS_KEY, tasks); // Guarda en background
  }
}

