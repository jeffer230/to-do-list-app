import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonButtons } from '@ionic/angular/standalone';

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
  categoryForm!: FormGroup;
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }],
      color: ['#3880ff', { updateOn: 'blur' }] // Puedes usar un input type="color" nativo
    });
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    if (this.categoryForm.valid) {
      this.modalCtrl.dismiss(this.categoryForm.value, 'confirm');
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
