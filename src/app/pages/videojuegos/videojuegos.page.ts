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
import { VideojuegosService, Videojuego } from '../../services/videojuegos';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

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

  videojuegos: Videojuego[] = [];

  constructor(private videojuegosService: VideojuegosService, private alertController: AlertController) {}

  imagenError(event: any) {
    event.target.src = 'assets/icon/image.png';
  }

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.videojuegos = await this.videojuegosService.listar();
  }

  async eliminar(id: number) {
    await this.videojuegosService.eliminar(id);
    await this.cargar();
  }

  async confirmarEliminar(id: number) {

  const alert = await this.alertController.create({
    message: '¿Deseas eliminar este videojuego?',

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