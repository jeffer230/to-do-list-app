import { Component, OnInit, inject,ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonTextarea, IonButton,
  IonButtons, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
  ]
})
export class TaskFormComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  taskForm!: FormGroup;

  // Exponemos las categorías
  categories$ = this.categoryService.categories$;

  constructor() {}

  ngOnInit() {
    // Inicializamos el formulario con validaciones estrictas
    this.taskForm = this.fb.group({
      title: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }],
      description: ['', { updateOn: 'blur' }],
      categoryId: [null] // Inicia nulo por defecto
    });
  }

  // Método para cerrar el modal sin guardar
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Método para enviar la información
  submit() {
    if (this.taskForm.valid) {
      // Retornamos el valor del formulario al componente padre
      this.modalCtrl.dismiss(this.taskForm.value, 'confirm');
    } else {
      // Muestra los errores visuales si el usuario intenta guardar vacío
      this.taskForm.markAllAsTouched();
    }
  }
}
