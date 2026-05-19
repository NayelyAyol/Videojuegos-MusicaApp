import { Component, OnInit, NgZone, inject } from '@angular/core';
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
  ToastController
} from '@ionic/angular/standalone';
import { arrowBack } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CancionService, Cancion } from '../../services/videojuegos';
import { CommonModule } from '@angular/common';

addIcons({ arrowBack });

@Component({
  selector: 'app-videojuegos-form',
  styleUrls: ['./videojuegos-form.page.scss'],
  templateUrl: './videojuegos-form.page.html',
  standalone: true,
  imports: [
    CommonModule,
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

  previewImagen: string = 'assets/icon/image.png';
  audioSubido: boolean = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cancionService = inject(CancionService);
  private toastController = inject(ToastController);
  private ngZone = inject(NgZone);

  constructor() {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.videojuego = await this.cancionService.obtenerPorId(this.id);
      this.previewImagen = this.videojuego.imagen_url || 'assets/icon/image.png';
      this.audioSubido = !!this.videojuego.audio_url;
    }
  }

  async subirImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `img_${Date.now()}`;
    const { data } = await this.cancionService.subirArchivo('imagenes', fileName, file);

    if (data?.publicUrl) {
      this.videojuego.imagen_url = data.publicUrl;
      this.previewImagen = data.publicUrl;
    }
  }

  async subirAudio(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `audio_${Date.now()}`;
    const { data } = await this.cancionService.subirArchivo('audios', fileName, file);

    if (data?.publicUrl) {
      this.videojuego.audio_url = data.publicUrl;
      this.audioSubido = true;
    }
  }

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  async mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'error') {
    try {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2200,
        position: 'top',
        cssClass: tipo === 'success' ? 'toast-success' : 'toast-error',
      });
      await toast.present();
    } catch (e) {
      console.error('El Toast de Ionic falló, usando nativo:', e);
      alert(mensaje);
    }
  }

  async guardar() {
    if (!this.videojuego.titulo.trim()) {
      await this.mostrarToast('El título del la canción es obligatorio', 'error');
      return;
    }

    if (!this.videojuego.artista.trim()) {
      await this.mostrarToast('El nombre del artista es obligatorio', 'error');
      return;
    }

    if (!this.videojuego.categorias.trim()) {
      await this.mostrarToast('Debes ingresar la categoría', 'error');
      return;
    }

    if (this.videojuego.ranking === null || this.videojuego.ranking === undefined || this.videojuego.ranking <= 0) {
      await this.mostrarToast('El ranking debe ser un número mayor a 0', 'error');
      return;
    }

    if (this.videojuego.ranking > 100) {
      await this.mostrarToast('El ranking máximo permitido es 100', 'error');
      return;
    }

    const anioActual = new Date().getFullYear();
    if (this.videojuego.anio === null || this.videojuego.anio === undefined || this.videojuego.anio <= 0) {
      await this.mostrarToast('Por favor, ingresa un año válido', 'error');
      return;
    }

    if (this.videojuego.anio < 1950 || this.videojuego.anio > anioActual) {
      await this.mostrarToast(`El año debe estar entre 1950 y ${anioActual}`, 'error');
      return;
    }

    if (!this.videojuego.imagen_url) {
      await this.mostrarToast('Debes subir una imagen de portada antes de guardar', 'error');
      return;
    }

    const data = { ...this.videojuego };
    delete (data as any).id;

    try {
      if (this.id) {
        await this.cancionService.actualizar(this.id, data);
      } else {
        await this.cancionService.crear(data);
      }

      this.ngZone.run(async () => {
        await this.mostrarToast('Guardado correctamente', 'success');
        
        setTimeout(async () => {
          await this.router.navigate(['/videojuegos'], { replaceUrl: true });
        }, 150);
      });

    } catch (error) {
      console.error('Error capturado al guardar:', error);
      this.ngZone.run(async () => {
        await this.mostrarToast('Error de red o base de datos al guardar', 'error');
      });
    }
  }
}