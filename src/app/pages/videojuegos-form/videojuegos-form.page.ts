import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonFabButton,
  IonFab,
  IonIcon,
} from '@ionic/angular/standalone';
import { arrowBack } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CancionService, Cancion } from '../../services/videojuegos';
import { ToastController } from '@ionic/angular';

addIcons({ arrowBack });

@Component({
  selector: 'app-videojuegos-form',
  styleUrls: ['./videojuegos-form.page.scss'],
  templateUrl: './videojuegos-form.page.html',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonFabButton,
    IonFab,
    RouterLink,
  ],
})
export class VideojuegosFormPage implements OnInit {
  id?: number;

  videojuego: Cancion = {
    titulo: '',
    artista: '',
    ranking: 0,
    anio: 0,
    categorias: '',
    imagen_url: '',
    video_url: '',
    audio_url: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cancionService: CancionService,
    private toastController: ToastController,
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.videojuego = await this.cancionService.obtenerPorId(this.id);
    }
  }

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  async mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'error') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'top',
      cssClass: tipo === 'success' ? 'toast-success' : 'toast-error',
    });

    await toast.present();
  }

  async guardar() {
    if (this.videojuego.anio < 0) {
      await this.mostrarToast('El año no puede ser negativo.', 'error');
      return;
    }

    if (this.videojuego.ranking < 0) {
      await this.mostrarToast('El ranking no puede ser negativo.', 'error');
      return;
    }

    if (
      !this.videojuego.titulo.trim() ||
      !this.videojuego.artista.trim() ||
      !this.videojuego.categorias?.trim() ||
      !this.videojuego.imagen_url?.trim() ||
      !this.videojuego.video_url?.trim() ||
      !this.videojuego.audio_url?.trim()
    ) {
      await this.mostrarToast('Por favor, completa todos los campos.', 'error');

      return;
    }

    if (this.videojuego.ranking === 0 || this.videojuego.anio === 0) {
      await this.mostrarToast(
        'El ranking y el año deben ser mayores que cero.',
        'error',
      );

      return;
    }

    if (this.id) {
      await this.cancionService.actualizar(this.id, this.videojuego);
    } else {
      await this.cancionService.crear(this.videojuego);
    }

    await this.mostrarToast(
      this.id
        ? 'Canción actualizada correctamente'
        : 'Canción creada correctamente',
      'success',
    );

    this.router.navigate(['/videojuegos']);
  }
}
