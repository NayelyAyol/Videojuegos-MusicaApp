<h1 align="center"> 🎵 MusicApp - Catálogo de Música con Ionic y Supabase 🎶 </h1>

## Descripción

Aplicación móvil desarrollada con Ionic y Angular que permite gestionar un catálogo de canciones mediante operaciones CRUD conectadas a Supabase.

La aplicación permite:

* Registrar canciones
* Editar canciones
* Eliminar canciones
* Visualizar canciones en tarjetas modernas
* Subir imágenes y audios a Supabase Storage
* Reproducir audios dentro de la aplicación
* Mostrar videos de YouTube embebidos dentro de la aplicación

---

## Autora

* Nayely Ayol

---

## Tecnologías utilizadas

* Ionic
* Angular
* TypeScript
* SCSS
* Capacitor
* Supabase
* Supabase Storage
* YouTube Embed
* HTML5 Audio

---

## Funcionalidades

* CRUD completo de canciones
* Diseño moderno y responsivo
* Subida de imágenes a Supabase Storage
* Subida de audios a Supabase Storage
* Reproducción de audio sin salir de la aplicación
* Inserción de videos de YouTube
* Toast personalizados
* Alertas personalizadas
* Validaciones de formularios
* Ícono personalizado
* Splash Screen personalizado

---

# Base de datos utilizada

Se utilizó Supabase como Backend as a Service (BaaS).

## Tabla: canciones

Campos utilizados:

| Campo      | Tipo    |
| ---------- | ------- |
| id         | bigint  |
| titulo     | text    |
| artista    | text    |
| ranking    | integer |
| anio       | integer |
| categorias | text    |
| imagen_url | text    |
| video_url  | text    |
| audio_url  | text    |


<img width="1328" height="410" alt="image" src="https://github.com/user-attachments/assets/fbe7fa90-5f76-456c-a3e7-a4b87e64e531" />


---

# Supabase Storage

Se crearon los buckets:

* imagenes
* audios

En Storage

<img width="1331" height="566" alt="image" src="https://github.com/user-attachments/assets/358ef276-b343-48f6-b71a-9a7d00a03966" />

| Imágenes en Supabase      | Audios en Supabase    |
| ---------- | ------- |
| <img width="958" height="874" alt="image" src="https://github.com/user-attachments/assets/d4a967bb-3806-4eb1-a3a1-b38da75563bd" />| <img width="929" height="899" alt="image" src="https://github.com/user-attachments/assets/eb6995af-f017-40ff-b643-97a8976d5eb5" />|

---

# Proceso de desarrollo

1. Creación del proyecto Ionic

```bash
ionic start MusicApp blank --type=angular
```

2. Instalación de Supabase

```bash
npm install @supabase/supabase-js
```

3. Configuración de environments

Archivo:

```bash
src/environments/environment.ts
```

```ts
export const environment = {
  production: false,

  supabaseUrl: 'TU_URL_SUPABASE',

  supabaseKey: 'TU_API_KEY'
};
```
4. Creación del servicio de canciones

Archivo:

```bash
services/videojuegos.ts
```

```ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Cancion {
  id?: number;
  titulo: string;
  artista: string;
  ranking: number;
  anio: number;
  categorias: string;
  imagen_url?: string;
  video_url?: string;
  audio_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CancionService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          lockType: 'custom',
          acquireTimeout: 3000,
        } as any
      }
    );
  }

  async listar() {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .order('id', { ascending: false }); 

    if (error) throw error;
    return data;
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async crear(cancion: Cancion) {
    const { data, error } = await this.supabase
      .from('canciones')
      .insert(cancion);

    if (error) throw error;
    return data;
  }

  async actualizar(id: number, cancion: Cancion) {
    const { data, error } = await this.supabase
      .from('canciones')
      .update(cancion)
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  async eliminar(id: number) {
    const { error } = await this.supabase
      .from('canciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async subirArchivo(bucket: string, fileName: string, file: File) {
    const filePath = `uploads/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: { publicUrl: urlData.publicUrl },
      error: null
    };
  }
}
```

---

# Implementación del catálogo de canciones

## Interfaz principal

Se desarrolló una interfaz moderna utilizando:

* ion-card
* ion-grid
* ion-button
* ion-fab
* ion-toolbar

Características:

* Tarjetas responsivas
* Imagen de portada
* Categoría
* Año
* Ranking
* Reproductor de audio
* Video embebido de YouTube

---

## Implementación del video de YouTube

Se agregó soporte para videos de YouTube usando iframe embebido.

```html
<iframe
  width="100%"
  height="200"
  [src]="obtenerVideoEmbed(juego.video_url)"
  frameborder="0"
  allowfullscreen>
</iframe>
```

### Resultado

El video se reproduce dentro de la aplicación sin abrir el navegador.

---

# Implementación de audio dentro de la aplicación

Se utilizó el componente HTML5 Audio:

```html
<audio controls *ngIf="juego.audio_url">

  <source
    [src]="juego.audio_url"
    type="audio/mp3">

</audio>
```

### Resultado

* El audio se reproduce sin salir de la aplicación.
* Compatible con archivos MP3 almacenados en Supabase Storage.

---

# Validaciones implementadas

* Título obligatorio
* Artista obligatorio
* Categoría obligatoria
* Ranking mayor a 0
* Ranking máximo 100
* Año válido
* Año entre 1950 y año actual
* Imagen obligatoria

---

# Toast personalizados

Se implementaron Toast personalizados usando:

```ts
ToastController
```

Tipos:

* Success
* Error

Con estilos modernos usando SCSS.

---

# Alertas personalizadas

Se utilizaron AlertController personalizados para confirmar eliminaciones.

```ts
const alert = await this.alertController.create({
  message: '¿Deseas eliminar esta canción?'
});
```

---

# Diseño de la aplicación

Se utilizó una interfaz moderna basada en:

* Colores morados
* Sombras suaves
* Bordes redondeados
* Tipografía Nunito
* Cards estilizadas
* Botones personalizados

---

# Implementación de ícono y splash screen

## Ícono

1. Crear carpeta resources

```bash
resources/
```

2. Agregar icono

Archivo:

```bash
resources/icon.png
```

Características:

* 1024x1024 px
* PNG

3. Instalar capacitor assets

```bash
npm install @capacitor/assets
```
 4. Generar Android

```bash
ionic build
ionic cap add android
npx cap sync android
```
 5. Generar íconos

```bash
npx capacitor-assets generate
```

---

# Splash Screen

1. Dentro de:

```bash
android/app/src/main/res/values/styles.xml
```

Y en caso de que se use un splash personalizado y el 'splash.png' se encuentre en la carpeta de drawable usar:
```xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/splash_background</item>
        <item name="colorPrimaryDark">@color/splash_background</item>
        <item name="colorAccent">@color/splash_background</item>
    </style>

    <style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:windowBackground">@drawable/splash</item>
        <item name="android:windowFullscreen">true</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
    </style>
</resources>
```

De lo contrario si se generó a partir del comando 'npx capacitor-assets generate', usar:

```xml
<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">

    <item name="windowSplashScreenBackground">@color/splash_background</item>

    <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>

    <item name="windowSplashScreenIconBackgroundColor">@color/splash_background</item>

    <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>

</style>
```

---

2. Crear un archivo denominado 'colors.xml' en:

```bash
android/app/src/main/res/values/colors.xml
```
con el siguiente contenido en caso de que sea un splash personalizado:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#7c3aed</color>
    <color name="colorPrimaryDark">#7c3aed</color>
    <color name="splash_background">#7c3aed</color> 
</resources>
```

Caso contrario usar:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>

    <color name="splash_background">#FFFFFF</color>

    <color name="ic_launcher_background">#FFFFFF</color>

</resources>
```

---

# AndroidManifest.xml

## ¿Qué es?

Es uno de los archivos más importantes de una aplicación Android, necesario para que el teléfono conozca el tipo de aplicación que se ejecutará y que acciones tiene permitido ejecutar.

---

## ¿Para qué sirve?

Permite configurar:

* Nombre de la aplicación
* Permisos, es decir, le hace saber al celular que recursos va a usar
* Splash Screen
* Configuración general
* Acceso a internet
* Configuración del paquete Android

---

## Ubicación

```bash
android/app/src/main/AndroidManifest.xml
```

---

## Ejemplo utilizado

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Este permiso permite:

* Consumir Supabase
* Mostrar imágenes
* Reproducir videos
* Cargar audios

---

# Ejecución del proyecto

## Instalar dependencias

```bash
npm install
```

---

## Ejecutar proyecto

```bash
ionic serve
```

---

# Generar APK Android

1. Construcción del proyecto

```bash
ionic build
```

2. Sincronización con el Capacitor

```bash
npx cap sync android
```

3. Abrir Android Studio

```bash
npx cap open android
```

---

## Capturas de la funcionalidad

| Catálogo de canciones                      | Formulario de registro                     |
| ------------------------------------------ | ------------------------------------------ |
| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 49 21 PM" src="https://github.com/user-attachments/assets/8f121181-4eeb-43eb-a076-c84da81c25a8" />| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 41 45 PM" src="https://github.com/user-attachments/assets/f11d1417-012b-4706-9031-a72f35e2e81d" />  <img width="200" alt="WhatsApp Image 2026-05-18 at 10 41 45 PM (1)" src="https://github.com/user-attachments/assets/288463b5-7eb6-4c7e-8ca9-b9c4ee1e26b4" />|

| Reproductor de audio                       | Video de YouTube                           |
| ------------------------------------------ | ------------------------------------------ |
| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 53 45 PM" src="https://github.com/user-attachments/assets/c6257f1a-a278-47ca-aa83-a8ce1ab68aa7" />| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 55 57 PM" src="https://github.com/user-attachments/assets/0fc9bacb-b2bd-468b-b8d7-b1b127808b98" />|

| Toast personalizado                        | Alert de eliminación                       |
| ------------------------------------------ | ------------------------------------------ |
| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 57 22 PM" src="https://github.com/user-attachments/assets/052f72b7-67da-400d-a2e0-170ff530a9f1" />| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 58 06 PM" src="https://github.com/user-attachments/assets/dd3bf9df-0218-4a01-bf9c-3187eb23620e" />|

| Splash Screen                              | Ícono                                      |
| ------------------------------------------ | ------------------------------------------ |
| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 41 45 PM (2)" src="https://github.com/user-attachments/assets/30daa069-1d5d-43df-be10-91273d09fa36" />| <img width="200" alt="WhatsApp Image 2026-05-18 at 10 42 33 PM" src="https://github.com/user-attachments/assets/3e573ee5-f97d-49f5-8ff4-76d36c02d9b9" />|

---

## Capturas del sitio web funcionando

| Catálogo de canciones                      | Formulario de registro                     |
| ------------------------------------------ | ------------------------------------------ |
| <img width="600" alt="image" src="https://github.com/user-attachments/assets/19b1622a-0629-40a9-84ab-37c62798f58b" /> | <img width="600"  alt="image" src="https://github.com/user-attachments/assets/8e92bcba-37bd-433f-8d9d-5f15fbdb2d36" />|

| Editar Canción                       | Video de YouTube                           |
| ------------------------------------------ | ------------------------------------------ |
| <img width="600" alt="image" src="https://github.com/user-attachments/assets/c20a34d4-c185-4223-80e3-a85d07dc2a82" /> | <img width="600" alt="image" src="https://github.com/user-attachments/assets/4d8ed8a6-a5ec-4c33-aee0-665a935d4cef" />|

| Toast personalizado                        | Alert de eliminación                       |
| ------------------------------------------ | ------------------------------------------ |
| <img width="600" lt="image" src="https://github.com/user-attachments/assets/3fb4a85d-3133-4c90-a78d-4a4a6395e463" /> | <img width="600" alt="image" src="https://github.com/user-attachments/assets/9f3eab63-92d1-4596-bbdd-dd2d76208e9f" />|

### Link del sitio
- https://appmusic-8359f.web.app/videojuegos

---
### App en ejecución en celular

https://github.com/user-attachments/assets/aaffad43-f9a4-4403-92cc-1ddd3e52d952

---

# Resultados obtenidos

* CRUD completamente funcional
* Integración correcta con Supabase
* Integración correcta con Supabase Storage
* Reproducción de audio funcional
* Videos embebidos funcionales
* Diseño moderno y responsivo
* APK funcional para Android
* Validaciones implementadas correctamente
* Ícono y Splash Screen personalizados
* Interfaz amigable y moderna
