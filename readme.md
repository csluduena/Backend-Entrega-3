# Proyecto de Backend para la Academia Coderhouse

Este proyecto es una continuación de las entregas anteriores para el curso de Backend en la academia Coderhouse. Puedes consultar las entregas previas en los siguientes enlaces:

- [Primer Entrega](https://github.com/csluduena/Coderhouse-DesarrolloFullStack-Backend-Trabajo-1)
- [Segunda Entrega](https://github.com/csluduena/Coderhouse-DesarrolloFullStack-Backend-Trabajo-2)

En esta tercera entrega, el proyecto ha sido ampliado significativamente para incluir la gestión de carritos de compra en el backend y mejorar aún más la funcionalidad de la interfaz de usuario en el frontend.

## Características del Proyecto

### Backend

- **Gestión de Productos:**
  - **Operaciones CRUD:** Se pueden realizar operaciones de Crear, Leer, Actualizar y Eliminar productos mediante una API RESTful.
  - **Endpoints Disponibles:**
    - `GET /api/products`: Lista todos los productos.
    - `GET /api/products/:pid`: Obtiene un producto por su ID.
    - `POST /api/products`: Crea un nuevo producto.
    - `PUT /api/products/:pid`: Actualiza un producto existente.
    - `DELETE /api/products/:pid`: Elimina un producto por su ID.

- **Gestión de Carritos:**
  - **Operaciones CRUD para Carritos:** Los usuarios pueden crear carritos, agregar productos a ellos, y gestionar el contenido del carrito.
  - **Endpoints Disponibles:**
    - `POST /api/carts`: Crea un nuevo carrito.
    - `GET /api/carts/:cid`: Obtiene un carrito por su ID, incluyendo los productos en él.
    - `POST /api/carts/:cid/products/:pid`: Agrega un producto al carrito.
    - `PUT /api/carts/:cid/products/:pid`: Actualiza la cantidad de un producto en el carrito.
    - `DELETE /api/carts/:cid/products/:pid`: Elimina un producto del carrito.
    - `DELETE /api/carts/:cid`: Vacía el carrito.
    - `GET /api/carts`: Obtiene todos los carritos disponibles.

- **Manejo de Rutas:**
  - **Configuración de Rutas:** Las rutas están configuradas para manejar tanto la gestión de productos como de carritos, integrando la lógica de la base de datos para ambos.

### Frontend

- **Interactividad en Tiempo Real:**
  - **Socket.io:** Se utiliza para actualizar la lista de productos y la gestión de carritos en tiempo real en la interfaz de usuario sin necesidad de refrescar la página.
  - **Configuración de Eventos:** Emisión de eventos de websocket dentro de las peticiones POST para la creación, eliminación de productos y la actualización de carritos.

- **Plantilla Web y Vistas:**
  - **Handlebars:** Motor de plantillas utilizado para renderizar vistas en el frontend.
  - **Vistas Implementadas:**
    - **Página de Inicio:** `http://localhost:8080` - Contiene botones para acceder a las vistas de productos, productos en tiempo real, agregar productos y gestionar carritos.
    - **Página de Productos:** `http://localhost:8080/products` - Muestra una lista de productos con opción para comprar.
    - **Página de Productos en Tiempo Real:** `http://localhost:8080/realtimeproducts` - Actualización en tiempo real de los productos.
    - **Formulario de Agregar Productos:** `http://localhost:8080/products/add` - Permite añadir nuevos productos manualmente o importando un backup de stock.
    - **Página de Carritos:** `http://localhost:8080/carts` - Permite ver y gestionar los carritos creados.

- **Estilos Personalizados:**
  - **CSS:** Estilización de la interfaz con un diseño responsivo y un footer estilizado.
  - **Fuente Personalizada:** Inclusión de una fuente personalizada llamada `Dienasty`.

## Tecnologías Utilizadas

- **Node.js:** Plataforma de desarrollo backend.
- **Express:** Framework de Node.js para construir aplicaciones web y APIs.
- **Mongoose:** ODM para manejar la base de datos MongoDB.
- **Handlebars:** Motor de plantillas para el frontend.
- **Socket.io:** Biblioteca para comunicación en tiempo real.
- **CSS:** Estilización personalizada para el diseño del proyecto.
- **Postman:** Herramienta para probar y documentar APIs.

## Ejecución del Proyecto

1. Clonar el repositorio.
2. Instalar las dependencias con `npm install`.
3. Configurar las variables de entorno para conectar a la base de datos MongoDB.
4. Ejecutar el servidor con `npm start` o `node app.js`.
5. Acceder a la interfaz web en `http://localhost:8080`.
6. Utilizar Postman u otro cliente API para probar los diferentes endpoints.

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes alguna sugerencia, no dudes en abrir un issue en el repositorio.

## Autor

Sebastián Ludueña - [LinkedIn](https://www.linkedin.com/in/csluduena/) - [GitHub](https://github.com/csluduena) - [Web](https://csluduena.com.ar)
