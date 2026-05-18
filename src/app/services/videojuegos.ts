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
      environment.supabaseKey
    );
  }

  async listar() {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Cancion[];
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Cancion;
  }

  async crear(cancion: Cancion) {
    const { data, error } = await this.supabase
      .from('canciones')
      .insert(cancion)
      .select();

    if (error) {
      throw error;
    }

    return data;
  }

  async actualizar(id: number, cancion: Cancion) {
    const { id: _, ...dataSinId } = cancion;

    const { data, error } = await this.supabase
      .from('canciones')
      .update(dataSinId)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  }

  async eliminar(id: number) {
    const { error } = await this.supabase
      .from('canciones')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  async subirArchivo(bucket: string, fileName: string, file: File) {
    const filePath = `uploads/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: {
        publicUrl: urlData.publicUrl,
      },
      error: null,
    };
  }
}
