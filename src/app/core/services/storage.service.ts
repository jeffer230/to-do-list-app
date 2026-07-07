import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa la base de datos local
  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Métodos CRUD genéricos para abstraer el motor de base de datos
  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // Obtiene un valor por su clave
  public async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  // Elimina un valor por su clave
  public async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }
}
