import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonFabButton, IonFab, IonIcon
} from '@ionic/angular/standalone';
import { arrowBack } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideojuegosService, Videojuego } from '../../services/videojuegos';
import { ToastController } from '@ionic/angular';

addIcons({ arrowBack });

@Component({
  selector: 'app-videojuegos-form',
  styleUrls: ['./videojuegos-form.page.scss'],
  templateUrl: './videojuegos-form.page.html',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonItem, IonLabel, IonInput, IonButton, IonFabButton, IonFab,
    RouterLink
  ]
})
export class VideojuegosFormPage implements OnInit {

  id?: number;

  videojuego: Videojuego = {
    titulo: '',
    plataforma: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagen_url: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videojuegosService: VideojuegosService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.videojuego = await this.videojuegosService.obtenerPorId(this.id);
    }
  }

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  async mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error' = 'error'
  ) {

    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'top',
      cssClass: tipo === 'success'
        ? 'toast-success'
        : 'toast-error'
    });

    await toast.present();
  }

  async guardar() {
    if (this.videojuego.precio < 0) {
      await this.mostrarToast('El precio no puede ser negativo.', 'error');
      return;
    }

    if (this.videojuego.stock < 0) {
      await this.mostrarToast('El stock no puede ser negativo.', 'error');
      return;
    }

    if (!this.videojuego.titulo.trim() || !this.videojuego.plataforma.trim() || !this.videojuego.categoria?.trim() || !this.videojuego.imagen_url?.trim()
    || this.videojuego.precio === null || this.videojuego.stock === null) {
      await this.mostrarToast('Por favor, completa todos los campos.', 'error');
      return;
    }

    if (this.videojuego.precio === 0 || this.videojuego.stock === 0) {
      await this.mostrarToast('El precio y el stock deben ser mayores que cero.', 'error');
      return;
    }

    if (this.id) {
      await this.videojuegosService.actualizar(this.id, this.videojuego);
    } else {
      await this.videojuegosService.crear(this.videojuego);
    }

    await this.mostrarToast(
      this.id
        ? 'Videojuego actualizado correctamente'
        : 'Videojuego creado correctamente',
      'success'
    );

    this.router.navigate(['/videojuegos']);
  }
}