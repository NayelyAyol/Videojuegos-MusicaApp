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
  providedIn: 'root'
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

    if (error) throw error;
    return data as Cancion[];
  }

  async obtenerPorId(id: number) {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Cancion;
  }

  async crear(cancion: Cancion) {
    const { data, error } = await this.supabase
      .from('canciones')
      .insert(cancion)
      .select();

    if (error) throw error;
    return data;
  }

  async actualizar(id: number, cancion: Cancion) {
    const { data, error } = await this.supabase
      .from('canciones')
      .update(cancion)
      .eq('id', id)
      .select();

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
}