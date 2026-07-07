import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IonItem, IonLabel, IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { Task } from 'src/app/shared/models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItem,
    IonLabel,
    IonCheckbox,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  ]
})
export class TaskItemComponent {
  // Recibe la tarea desde el padre
  @Input({ required: true }) task!: Task;

  // Emite eventos hacia el padre
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  onToggle() {
    this.toggleComplete.emit(this.task);
  }

  onDelete(slidingItem: IonItemSliding) {
    slidingItem.close(); // Cerramos la animación visual

    // Le damos un milisegundo a la UI para procesar el cierre antes de borrar el dato
    setTimeout(() => {
      this.deleteTask.emit(this.task.id);
    }, 150);
  }
}
