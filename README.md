# Tramiteapp - Frontend

Frontend de la aplicación Tramiteapp, diseñada para la gestión y seguimiento de trámites documentales. La interfaz está construida para ser moderna, responsiva y eficiente, facilitando la interacción del usuario con el sistema.

![Captura de pantalla de Tramiteapp](ruta/a/la/imagen.png)

## Características Principales

* **Gestión de Expedientes:** Creación, edición y consulta de expedientes digitales.
* **Seguimiento de Trámites:** Visualización del estado y el historial de movimientos de cada trámite.
* **Autenticación y Roles:** Sistema de inicio de sesión seguro con gestión de permisos basada en roles de usuario.
* **Dashboard Analítico:** Panel de control con métricas y estadísticas clave sobre los trámites.
* **Notificaciones:** Alertas en tiempo real sobre actualizaciones importantes en los expedientes.
* **Diseño Responsivo:** Interfaz adaptable a diferentes dispositivos (escritorio, tabletas y móviles).
* **Modo Claro/Oscuro:** Soporte para temas visuales que mejoran la experiencia de usuario.

## Stack Tecnológico

| Componente           | Tecnología                                                                 |
| :------------------- | :------------------------------------------------------------------------- |
| **Framework Frontend** | [Angular](https://angular.io/) v20+                                      |
| **Librería de Componentes UI** | [PrimeNG](https://primeng.org/) v20+                                     |
| **Enrutamiento** | [Angular Router](https://angular.io/guide/routing-overview)                |
| **Gestión de Estado** | [Angular Signals](https://angular.io/guide/signals) / [RxJS](https://rxjs.dev/) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/)                              |
| **Linter / Formateador** | [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)           |
| **Iconografía** | [PrimeIcons](https://primeng.org/icons)                                    |
| **Build Tool** | [Angular CLI](https://angular.io/cli)                                      |

## Instalación y Ejecución Local

Siga estos pasos para configurar y ejecutar el proyecto en su entorno de desarrollo local.

### Requisitos Previos

* Node.js (versión 20.x o superior)
* NPM (versión 10.x o superior)
* Angular CLI instalado globalmente (`npm install -g @angular/cli`)

### Instalación

1.  Clone el repositorio en su máquina local:
    ```bash
    git clone [https://github.com/tu-usuario/tramiteapp-frontend.git](https://github.com/tu-usuario/tramiteapp-frontend.git)
    ```

2.  Navegue al directorio del proyecto:
    ```bash
    cd tramiteapp-frontend
    ```

3.  Instale las dependencias del proyecto:
    ```bash
    npm install
    ```

### Servidor de Desarrollo

Ejecute el siguiente comando para iniciar el servidor de desarrollo. La aplicación se recargará automáticamente si realiza cambios en los archivos fuente.

```bash
ng serve -o