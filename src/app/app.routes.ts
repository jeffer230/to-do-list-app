import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo-list',
    pathMatch: 'full',
  },

  {
    path: 'todo-list',
    loadComponent: () => import('./features/todo-list/todo-list.page').then( m => m.TodoListPage)
  },

];
