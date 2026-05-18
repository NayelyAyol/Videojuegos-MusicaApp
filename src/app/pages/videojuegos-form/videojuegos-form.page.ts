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

      this.previewImagen =
        this.videojuego.imagen_url || 'assets/icon/image.png';

      this.audioSubido = !!this.videojuego.audio_url;
    }
  }

  async subirImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `img_${Date.now()}`;

    const { data } = await this.cancionService.subirArchivo(
      'imagenes',
      fileName,
      file,
    );

    if (data?.publicUrl) {
      this.videojuego.imagen_url = data.publicUrl;
      this.previewImagen = data.publicUrl;
    }
  }

  async subirAudio(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `audio_${Date.now()}`;

    const { data } = await this.cancionService.subirArchivo(
      'audios',
      fileName,
      file,
    );

    if (data?.publicUrl) {
      this.videojuego.audio_url = data.publicUrl;
      this.audioSubido = true;
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
    if (this.id) {
      await this.cancionService.actualizar(this.id, this.videojuego);
    } else {
      await this.cancionService.crear(this.videojuego);
    }

    await this.mostrarToast('Guardado correctamente', 'success');

    this.router.navigate(['/videojuegos']);
  }
}