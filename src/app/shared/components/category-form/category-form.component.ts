import { Component, OnInit, ChangeDetectionStrategy, inject, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonButtons } from '@ionic/angular/standalone';
import { Category } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonButtons
  ]
})
export class CategoryFormComponent implements OnInit {
  // Recibimos la categoría por parámetro - undefined si estamos creando
  @Input() categoryToEdit?: Category;

  categoryForm!: FormGroup;
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  ngOnInit() {
    // si existe categoryToEdit, usamos sus valores. Si no, usamos valores vacíos.
    const initialName = this.categoryToEdit ? this.categoryToEdit.name : '';
    const initialColor = this.categoryToEdit ? this.categoryToEdit.color : '#3880ff';

    this.categoryForm = this.fb.group({
      name: [initialName, {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }],
      color: [initialColor, { updateOn: 'blur' }]
    });
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    if (this.categoryForm.valid) {

      // Adjuntamos el ID si estábamos editando
      const resultData = {
        ...this.categoryForm.value,
        id: this.categoryToEdit ? this.categoryToEdit.id : undefined
      };

      this.modalCtrl.dismiss(resultData, 'confirm');
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
