import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { addIcons } from 'ionicons';
import { addOutline, addCircleOutline, checkboxOutline } from 'ionicons/icons';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
  IonFab, IonFabButton, IonIcon, IonButtons, IonButton, IonText,  ModalController,
  IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonSearchbar,
} from '@ionic/angular/standalone';
import { TaskFormComponent } from 'src/app/shared/components/task-form/task-form.component';
import { TaskItemComponent } from 'src/app/shared/components/task-item/task-item.component';
import { TaskService } from 'src/app/core/services/task.service';
import { RemoteConfigService } from 'src/app/core/services/remote-config.service';
import { CategoryService } from 'src/app/core/services/category.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
    IonButtons,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    ScrollingModule,
    TaskItemComponent,
    RouterLink,
    AsyncPipe,
    IonSearchbar,
  ]
})
export class TodoListPage implements OnInit {
  private modalCtrl = inject(ModalController);
  private taskService = inject(TaskService);
  private remoteConfigService = inject(RemoteConfigService);
  private categoryService = inject(CategoryService);

  tasks$ = this.taskService.tasks$;

  // Observable directo para leer el flag en el HTML
  enableCategories$ = this.remoteConfigService.enableCategories$;

  // Estado reactivo de filtros
  filterSubject = new BehaviorSubject<{ status: 'all' | 'pending' | 'completed', categoryId: string | null, searchQuery: string }>({
    status: 'all',
    categoryId: null,
    searchQuery: '',
  });

  // Combinamos ambos flujos de datos
  vm$ = combineLatest({
    tasks: this.taskService.tasks$,
    categories: this.categoryService.categories$,
    filters: this.filterSubject,
    enableCategories: this.enableCategories$
  }).pipe(
    map(({ tasks, categories, filters, enableCategories }) => {

      // Aplicamos filtro
      let filteredTasks = tasks;

      // Filtro de Búsqueda por Texto se aplica primero por eficiencia
      if (filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        filteredTasks = filteredTasks.filter(t =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
        );
      }

      // Filtro de estado
      if (filters.status === 'pending') {
        filteredTasks = filteredTasks.filter(t => !t.isCompleted);
      } else if (filters.status === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.isCompleted);
      }

      // Aplicamos filtro de categoría condicional utilizando Remote Config firebase
      if (enableCategories && filters.categoryId !== null) {
        filteredTasks = filteredTasks.filter(t => t.categoryId === filters.categoryId);
      }

      // Por cada tarea, buscamos si tiene una categoría asignada y se la adjuntamos
      const enrichedTasks = filteredTasks.map(task => ({
        ...task,
        category: categories.find(c => c.id === task.categoryId)
      }));

      // Retornamos las tareas ya filtradas y las categorías
      return {
        tasks: enrichedTasks,
        categories: categories
      };

    })
  );

  constructor() {
    // Registro de iconos
    addIcons({ addOutline, addCircleOutline, checkboxOutline });
  }

  ngOnInit() {
  }

  // Método para capturar el texto del buscador
  updateSearchFilter(event: any) {
    const currentFilters = this.filterSubject.getValue();
    // El searchbar emite el valor o undefined si lo limpian
    const query = event.detail.value || '';
    this.filterSubject.next({ ...currentFilters, searchQuery: query });
  }

  // Actualizamos los filtros reactivos según la interacción del usuario
  updateStatusFilter(event: any) {
    const currentFilters = this.filterSubject.getValue();
    this.filterSubject.next({ ...currentFilters, status: event.detail.value });
  }

  // Actualizamos el filtro de categoría según la selección del usuario
  updateCategoryFilter(event: any) {
    const currentFilters = this.filterSubject.getValue();
    this.filterSubject.next({ ...currentFilters, categoryId: event.detail.value });
  }

  // Abrir el modal para crear una nueva tarea
  async openTaskForm() {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      // Hace que el modal sea deslizable tipo "bottom sheet"
      breakpoints: [0, 0.5, 0.8, 0.9],
      // inicia ocupando el 80% de la pantalla
      initialBreakpoint: 0.8
    });

    await modal.present();

    // Esperamos a que el modal se cierre y capturamos los datos
    const { data, role } = await modal.onWillDismiss();

    // Si el usuario guardó, le pasamos la data al servicio
    if (role === 'confirm' && data) {
      console.log('Nueva tarea a guardar:', data);
      // TaskService para guardar en la base de datos
      await this.taskService.addTask(data);
    }
  }

  // Cambiar el estado de la tarea (Completada / Pendiente)
  async toggleComplete(task: any) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    await this.taskService.updateTask(updatedTask);
  }

  // Eliminar la tarea
  async deleteTask(taskId: string) {
    await this.taskService.deleteTask(taskId);
  }

  // Función para que el Virtual Scroll identifique cada elemento de forma única
  trackById(index: number, task: any): string {
    return task.id;
  }



}
