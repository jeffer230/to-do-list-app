import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo-list',
    pathMatch: 'full',
  },

  {
    path: 'todo-list',
    loadComponent: () => import('src/app/features/todo-list/todo-list.page').then( m => m.TodoListPage)
  },

  {
    path: 'categories',
    loadComponent: () => import('src/app/features/categories/categories.page').then( m => m.CategoriesPage)
  },

];
