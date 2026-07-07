import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline, addCircleOutline, checkboxOutline } from 'ionicons/icons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonIcon, IonFabButton, ModalController, IonButtons, IonButton, IonText } from '@ionic/angular/standalone';
import { TaskFormComponent } from 'src/app/shared/components/task-form/task-form.component';
import { TaskItemComponent } from 'src/app/shared/components/task-item/task-item.component';
import { TaskService } from 'src/app/core/services/task.service';
import { RemoteConfigService } from 'src/app/core/services/remote-config.service';


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

  tasks$ = this.taskService.tasks$;

  // Observable directo para leer el flag en el HTML
  enableCategories$ = this.remoteConfigService.enableCategories$;

  constructor() {
    addIcons({ addOutline, addCircleOutline, checkboxOutline });
   }

  ngOnInit() {
  }

  async openTaskForm() {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      breakpoints: [0, 0.5, 0.8], // Hace que el modal sea deslizable tipo "bottom sheet"
      initialBreakpoint: 0.5
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
