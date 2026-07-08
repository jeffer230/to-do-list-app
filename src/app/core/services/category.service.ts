import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly CATEGORIES_KEY = 'categories_data';
  private storageService = inject(StorageService);

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor() {
    this.loadCategories();
  }

  private async loadCategories() {
    const categories = await this.storageService.get(this.CATEGORIES_KEY);
    if (categories) {
      this.categoriesSubject.next(categories);
    }
  }

  public async addCategory(categoryData: Partial<Category>): Promise<void> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: categoryData.name!,
      color: categoryData.color || '#3880ff' // Azul nativo de Ionic por defecto
    };

    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategories = [newCategory, ...currentCategories];

    this.updateStateAndStorage(updatedCategories);
  }

  public async deleteCategory(categoryId: string): Promise<void> {
    const currentCategories = this.categoriesSubject.getValue();
    const updatedCategories = currentCategories.filter(c => c.id !== categoryId);

    this.updateStateAndStorage(updatedCategories);

  }

  private updateStateAndStorage(categories: Category[]): void {
    this.categoriesSubject.next(categories);
    this.storageService.set(this.CATEGORIES_KEY, categories);
  }

  public async updateCategory(updatedCategory: Category): Promise<void> {
    const currentCategories = this.categoriesSubject.getValue();

    // Buscamos el índice y reemplazamos el objeto completo manteniendo el orden
    const index = currentCategories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      currentCategories[index] = updatedCategory;
      this.updateStateAndStorage([...currentCategories]);
    }
  }

}
