import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'videojuegos',
    pathMatch: 'full',
  },
  {
    path: 'musica',
    loadComponent: () => import('./pages/musica/musica.page').then( m => m.MusicaPage)
  },
  {
    path: 'videojuegos',
    loadComponent: () => import('./pages/videojuegos/videojuegos.page').then( m => m.VideojuegosPage)
  },
  {
    path: 'videojuegos-form',
    loadComponent: () => import('./pages/videojuegos-form/videojuegos-form.page').then( m => m.VideojuegosFormPage)
  },
    {
    path: 'videojuegos-form/:id',
    loadComponent: () => import('./pages/videojuegos-form/videojuegos-form.page').then( m => m.VideojuegosFormPage)
  },
];
