import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { addIcons } from 'ionicons';
import { addOutline, addCircleOutline, checkboxOutline } from 'ionicons/icons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonIcon, IonFabButton, ModalController, IonButtons, IonButton, IonText } from '@ionic/angular/standalone';
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
  imports: [IonText,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    CommonModule,
    FormsModule,
    ScrollingModule,
    TaskItemComponent,
    RouterLink,
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

  // Combinamos ambos flujos de datos
  vm$ = combineLatest({
    tasks: this.taskService.tasks$,
    categories: this.categoryService.categories$
  }).pipe(
    map(({ tasks, categories }) => {
      // Por cada tarea, buscamos si tiene una categoría asignada y se la adjuntamos
      const enrichedTasks = tasks.map(task => ({
        ...task,
        category: categories.find(c => c.id === task.categoryId)
      }));

      // Retornamos un objeto con la propiedad 'tasks'
      return { tasks: enrichedTasks };
    })
  );

  constructor() {
    addIcons({ addOutline, addCircleOutline, checkboxOutline });
   }

  ngOnInit() {
  }

  async openTaskForm() {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      // Hace que el modal sea deslizable tipo "bottom sheet"
      breakpoints: [0, 0.5, 0.8, 0.9],
      // iniciará ocupando el 80% de la pantalla
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

}
