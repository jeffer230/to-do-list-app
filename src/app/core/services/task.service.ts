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
    // Cargamos las tareas desde la base de datos local al iniciar el servicio
    this.loadTasks();
  }

  // Cargar datos iniciales
  private async loadTasks() {
    const tasks = await this.storageService.get(this.TASKS_KEY);
    if (tasks) {
      this.tasksSubject.next(tasks);
    }
  }

  // Agregar Tarea
  public async addTask(newTask: Partial<Task>): Promise<void> {
    // Generamos los datos automáticos que no vienen del formulario
    const taskData: Task = {
      id: crypto.randomUUID(), // ID único nativo del navegador
      title: newTask.title!,
      description: newTask.description || '',
      isCompleted: false,
      categoryId: newTask.categoryId || null,
      createdAt: Date.now()
    };

    // Obtenemos el estado actual de las tareas
    const currentTasks = this.tasksSubject.getValue();

    // Agregamos al inicio para que la más nueva salga arriba
    const updatedTasks = [taskData, ...currentTasks];

    // Actualizamos el estado y la base de datos
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
    // Actualizamos el estado y la base de datos
    this.updateStateAndStorage(updatedTasks);
  }

  // Método privado para actualizar el estado y la base de datos
  private updateStateAndStorage(tasks: Task[]): void {
    this.tasksSubject.next(tasks); // Actualiza la UI instantáneamente
    this.storageService.set(this.TASKS_KEY, tasks); // Guarda en background
  }
}

