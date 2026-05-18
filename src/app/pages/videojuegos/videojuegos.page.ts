import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonFab, IonFabButton,
IonGrid,
IonRow,
IonCol,
IonCard,
IonCardContent,
IonIcon} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CancionService, Cancion } from '../../services/videojuegos';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

addIcons({
  add
});

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.page.html',
  styleUrls: ['./videojuegos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonFab, IonFabButton,
IonGrid,
IonRow,
IonCol,
IonCard,
IonCardContent,
IonIcon
  ]
})


export class VideojuegosPage implements OnInit {

  videojuegos: Cancion[] = [];

  constructor(
    private cancionService: CancionService, 
    private alertController: AlertController,
    private sanitizer: DomSanitizer
) {}

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  obtenerVideoEmbed(url: string): SafeResourceUrl {
    let videoId = '';

    if (url.includes('watch?v=')) {

      videoId = url.split('watch?v=')[1];

      if (videoId.includes('&')) {
        videoId = videoId.split('&')[0];
      }

    }
    else if (url.includes('youtu.be/')) {

      videoId = url.split('youtu.be/')[1];

      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }

    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );

  }

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.videojuegos = await this.cancionService.listar();
  }

  async eliminar(id: number) {
    await this.cancionService.eliminar(id);
    await this.cargar();
  }

  async confirmarEliminar(id: number) {

  const alert = await this.alertController.create({
    message: '¿Deseas eliminar esta canción?',

    cssClass: 'custom-alert',

    buttons: [

      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'alert-button-cancel'
      },

      {
        text: 'Aceptar',
        cssClass: 'alert-button-confirm',

        handler: async () => {
          await this.eliminar(id);
        }

      }

    ]

  });

  await alert.present();

}
}