import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  // Inicializamos en 'false'
  private enableCategoriesSubject = new BehaviorSubject<boolean>(false);
  public enableCategories$: Observable<boolean> = this.enableCategoriesSubject.asObservable();

  constructor() {
    this.initRemoteConfig();
  }

  private async initRemoteConfig() {
    try {
      const app = initializeApp(environment.firebase);
      const remoteConfig = getRemoteConfig(app);

      // Valores por defecto si no hay internet o falla la carga
      remoteConfig.defaultConfig = {
        'enable_categories': false
      };

      // caché a 0 para ver el cambio inmediato.
      remoteConfig.settings.minimumFetchIntervalMillis = 0;

      // Descargar valores de la nube y activarlos
      await fetchAndActivate(remoteConfig);

      // Leer el valor y actualizar nuestro estado reactivo
      const isEnabled = getValue(remoteConfig, 'enable_categories').asBoolean();
      this.enableCategoriesSubject.next(isEnabled);

    } catch (error) {
      // La app sigue funcionando con el valor por defecto (false)
      console.error('Error al inicializar Firebase Remote Config', error);
    }
  }
}
