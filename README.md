# API-Tesis

## Descripción

Este proyecto es una API construida con Node.js y Express, diseñada para gestionar un sistema de almacenes.

## Estructura del Proyecto

-   `controllers/`: Contiene los controladores para manejar la lógica de negocio.
-   `middlewares/`: Middlewares personalizados para manejar errores y validaciones.
-   `repositories/`: Repositorios para interactuar con la base de datos.
-   `routes/`: Define todas las rutas de la API.
-   `services/`: Servicios que contienen la lógica de negocio.
-   `utilities/`: Funciones de utilidad y scripts adicionales.
-   `validationSchemas/`: Esquemas de validación para los datos entrantes.

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3.

### Configuración de la Base de Datos

Es necesario crear un archivo `db.js` en la carpeta config encontrada en la raíz del proyecto con el siguiente contenido para establecer la conexión con la base de datos:

<pre>
```
const { Pool } = require('pg');

const pool = new Pool({
    user: '',
    host: '0.0.0.0',
    database: '',
    password: '',
    port: 0000,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};

const { Pool } = require('pg');
```
</pre>

4. Ejecuta `npm start` para iniciar el servidor.

## Características

-   Gestión de usuarios
-   Gestión de productos
-   Gestión de almacenes
-   Gestión de ubicaciones

## Licencia

Este proyecto está bajo la Licencia MIT.
