# To-Do List App - Ionic & Angular

Aplicación móvil híbrida de gestión de tareas desarrollada con **Ionic** y **Angular**, diseñada con un enfoque estricto en rendimiento, escalabilidad, integraciones en la nube y buenas prácticas de ingeniería de software. 

Este proyecto muestra la implementación de arquitecturas modernas para el desarrollo móvil, priorizando la fluidez de la interfaz y el manejo de estado reactivo.

---

## Características Principales

* **CRUD Completo:** Creación, lectura, actualización y eliminación de Tareas y Categorías.
* **Filtros en Tiempo Real:** Búsqueda por texto (con `debounce` para optimización) y segmentación por estado (Pendientes/Completadas) procesados en memoria.
* **Persistencia Local:** Almacenamiento asíncrono e integrado usando `@ionic/storage`.
* **UX Nativa:** 
  * Gestos de deslizamiento (Swipe to delete).
  * Componente `Ion-Refresher` (Pull-to-refresh) preparado para futuras conexiones a backend.
  * Modales tipo *Bottom Sheet* para formularios amigables con el teclado del sistema operativo.
  * *Empty States* diseñados para guiar al usuario.

---

## Stack Tecnológico

* **Framework:** Angular 
* **UI toolkit:** Ionic Framework 
* **Móvil Nativo:** Capacitor (Android Ready)
* **Estado & Reactividad:** RxJS
* **Utilidades:** Angular CDK (Scrolling)
* **BaaS:** Firebase (Remote Config)

---

## Arquitectura y Decisiones Técnicas

El código base ha sido estructurado siguiendo principios **SOLID** y lineamientos de **Clean Code**, separando claramente las responsabilidades entre la capa de presentación (UI) y la lógica de negocio (Servicios).

### 1. Gestión de Estado Reactiva (RxJS)
En lugar de mutar arreglos y forzar renderizados manuales, la aplicación utiliza un flujo de datos unidireccional puramente reactivo.
* Se implementaron `BehaviorSubject` como única fuente de la verdad (Single Source of Truth) en los servicios.
* Se utilizó el operador `combineLatest` para cruzar entidades en memoria (Tareas + Categorías + Filtros) y generar un *ViewModel* unificado, evitando consultas N+1 y manteniendo la UI perfectamente sincronizada en tiempo real.

### 2. Optimización de Rendimiento
* **ChangeDetectionStrategy.OnPush:** Implementado globalmente en vistas y componentes pesados (formularios, modales) para aislar el árbol de componentes y evitar evaluaciones innecesarias de *Zone.js*.
* **Angular CDK Virtual Scroll:** Renderizado inteligente de listas. En lugar de saturar el DOM con miles de nodos HTML, se reciclan los elementos en pantalla, garantizando 60 FPS estables sin importar el tamaño de la lista de tareas.
* **Control Flow (@if, @for, @empty):** Uso del nuevo motor de plantillas de Angular para reducir el peso del bundle y simplificar la lógica de vistas (Empty States nativos).
* **TrackBy nativo:** Rastreo eficiente de IDs en listas para evitar el redibujado destructivo del DOM durante las actualizaciones de estado.

### 3. Feature Toggles (Remote Config)
* Se integró **Firebase Remote Config** para controlar características de la aplicación en tiempo real sin requerir actualizaciones en las tiendas de aplicaciones (App Store / Google Play). 
* Específicamente, el módulo completo de "Categorías" funciona bajo una bandera condicional (`enable_categories`), demostrando capacidad para despliegues progresivos (Canary Releases) y pruebas A/B.

---

## Instalación y Ejecución

### Prerrequisitos del Sistema
Antes de comenzar, asegúrate de tener instalado el entorno básico en tu máquina según las plataformas en las que vayas a desplegar:

* **Node.js:** Versión v18.x o v20.x (https://nodejs.org/) (Versión LTS recomendada)
* **Gestor de paquetes:** `npm` (incluido con Node) o `yarn`.
* **Ionic CLI:** (https://ionicframework.com/docs/cli) Instalado de forma global para gestionar el ciclo de vida de la app:
```bash
  npm install -g @ionic/cli
```
* Android Studio (Para Android) / Xcode y macOS (Para iOS).

### Despliegue Local (Entorno Web)
1. Clonar el repositorio en tu eqipo local y ubicate en la raíz del proyecto.
2. Instalar dependencias del proyecto:
```bash
  npm install
```

3. Configurar variables de entorno (Firebase):
- Crea/Edita los archivos `src/environments/environment.ts` y `src/environments/environment.prod.ts` copiando la estructura de `src/environments/environment.example.ts` y reemplazando la información por las credenciales correspondientes de Firebase:

```typescript

  export const environment = {
    production: false,
    firebase: {
      apiKey: "TU_API_KEY",
      authDomain: "TU_AUTH_DOMAIN",
      projectId: "TU_PROJECT_ID",
      storageBucket: "TU_STORAGE_BUCKET",
      messagingSenderId: "TU_MESSAGING_SENDER_ID",
      appId: "TU_APP_ID"
    }
  };

```

4. Ejecutar el servidor de desarrollo:
```bash
  ionic serve
```
- La aplicación se abrirá automáticamente en tu navegador en http://localhost:8100

### Para Despliegue en Android
* **Java Development Kit (JDK):** Versión 21 (requerida por las versiones modernas de Gradle en Android).
* **Android Studio Incluyendo:**
  * Android SDK (API 34 o superior recomendada).
  * Android SDK Platform-Tools.
* Un emulador configurado (AVD) o un dispositivo físico con Depuración USB activada.

### Para Despliegue en iOS (Requiere macOS)
* **Xcode:** Versión estable más reciente desde la Mac App Store.
* **Xcode Command Line Tools:** Instaladas ejecutando xcode-select --install en la terminal.
* **CocoaPods:** Necesario para gestionar las dependencias nativas de iOS (plugins de Capacitor):
```bash
sudo gem install cocoapods
```

---

### Compilación y Ejecución en Android
- Para generar la versión nativa utilizando Capacitor, ejecuta los siguientes comandos en tu terminal:

1. Compilar el proyecto de Angular:
```bash
  ionic build
```

2. Sincronizar el código compilado con la plataforma nativa:
```bash
  npx cap sync android
```

3. Abrir el proyecto en Android Studio:
```bash
  npx cap open android
```

4. Generar el archivo APK:
- Una vez abierto Android Studio y finalizada la indexación de Gradle, dirígete al menú superior.
- Selecciona: Build > Build Bundle(s) / APK(s) > Build APK(s).
- El IDE te notificará cuando el archivo .apk esté listo para instalarse en cualquier emulador o dispositivo físico.

### Compilación y Ejecución en iOS (Requiere macOS)
- Para generar la versión nativa de iOS utilizando Capacitor, ejecuta los siguientes comandos desde tu terminal en un entorno macOS:

1. Compilar el proyecto de Angular:
```bash
  ionic build
```

2. Sincronizar el código compilado con la plataforma nativa:
```bash
  npx cap sync ios
```

3. Abrir el proyecto en el IDE nativo Xcode:
```bash
  npx cap open ios
```

4. Configurar firmas y credenciales de Apple:
- Una vez abierto Xcode, selecciona el proyecto raíz en la barra lateral izquierda (App).
- Dirígete a la pestaña Signing & Capabilities.
- Marca la casilla Automatically manage signing y selecciona un equipo de desarrollo de Apple (Team) válido.

5. Desplegar o generar el archivo ejecutable (.ipa):
- Para probar en emulador/dispositivo: Selecciona tu destino en la barra superior y presiona el botón Play (Run) o usa el atajo Cmd + R.
- Para distribución: Cambia el destino de ejecución a Any iOS Device (arm64) y dirígete al menú superior en Product > Archive para iniciar el proceso de empaquetado del archivo .ipa.
