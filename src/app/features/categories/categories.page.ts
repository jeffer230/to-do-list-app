import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonFab, IonFabButton,
  IonItemSliding, IonItemOptions, IonItemOption, ModalController, IonIcon, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, addCircleOutline } from 'ionicons/icons';
import { CategoryService } from 'src/app/core/services/category.service';
import { CategoryFormComponent } from 'src/app/shared/components/category-form/category-form.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonText,
    IonIcon,
    AsyncPipe,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ]
})
export class CategoriesPage implements OnInit {
  private categoryService = inject(CategoryService);
  private modalCtrl = inject(ModalController);

  // Observable conectado directamente al HTML
  categories$ = this.categoryService.categories$;

  constructor() {
    addIcons({ addOutline, addCircleOutline });
  }

  ngOnInit() {}

  async openCategoryForm() {
    const modal = await this.modalCtrl.create({
      component: CategoryFormComponent,
      breakpoints: [0, 0.5, 0.8, 0.9],
      initialBreakpoint: 0.8
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      await this.categoryService.addCategory(data);
    }
  }

  deleteCategory(categoryId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    setTimeout(() => {
      this.categoryService.deleteCategory(categoryId);
    }, 150);
  }
}
