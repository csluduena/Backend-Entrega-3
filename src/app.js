import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManagerDB from './dao/db/product-manager-db.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import '../database.js';  // Importa tu configuración de MongoDB existente
//import { initializeSync, syncProductToDB, syncProductToJSON } from './dao/fs/syncService.js';  // Importa la función de sincronización

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configura Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.use('/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// Configura Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar productos al conectar
    socket.on('getProducts', async () => {
        try {
            const products = await ProductManagerDB.getProducts(); // Asegúrate de importar y usar ProductManagerDB correctamente
            socket.emit('productos', products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    });

    // Evento para agregar producto (y sincronizar)
    socket.on('agregarProducto', async (product) => {
        try {
            await ProductManagerDB.addProduct(product);
            //await syncProductToJSON();  // Sincroniza el archivo JSON después de agregar un producto a la DB
            const products = await ProductManagerDB.getProducts();
            io.emit('productos', products);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Evento para eliminar producto (y sincronizar)
    socket.on('eliminarProducto', async (id) => {
        try {
            await ProductManagerDB.deleteProduct(id);
            await syncProductToJSON();  // Sincroniza el archivo JSON después de eliminar un producto de la DB
            const products = await ProductManagerDB.getProducts();
            io.emit('productos', products);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});

// Inicia la sincronización después de que la conexión a MongoDB esté establecida
//initializeSync();  // Inicia la sincronización entre MongoDB y products.json

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});




// import express from "express";
// import exphbs from 'express-handlebars';
// import { Server } from "socket.io";
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Importar las rutas
// import { productsRouter } from "./routes/products.router.js";
// import { cartsRouter } from "./routes/carts.router.js";
// import { viewsRouter } from "./routes/views.router.js";

// // Importar la clase ProductManager y CartManager
// import { ProductManager } from "./managers/productManager.js";
// import { CartManager } from "./managers/cartManager.js";

// // Crear instancias de ProductManager y CartManager
// const productManager = new ProductManager();
// const cartManager = new CartManager();

// // Obtener la ruta del directorio actual
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuración de handlebars
// const app = express();
// app.engine("handlebars", exphbs.engine());
// app.set("view engine", "handlebars");
// app.set("views", path.join(__dirname, "views"));

// // Middleware
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

// // Rutas
// app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter);
// app.use("/", viewsRouter);

// // Configuración del puerto
// const PORT = process.env.PORT || 8080;

// // Iniciar el servidor
// const httpServer = app.listen(PORT, () => {
//     console.log(`Escuchando en el puerto: ${PORT}`);
// });

// // Configuración de socket.io
// const io = new Server(httpServer);

// io.on("connection", async (socket) => {
//     console.log("Un cliente se conectó");

//     // Envía los productos al conectar
//     const products = await productManager.getProducts();
//     socket.emit("productos", products);

//     socket.on("eliminarProducto", async (id) => {
//         await productManager.deleteProduct(id);
//         io.emit("productos", await productManager.getProducts());
//     });
// });

// export { productManager, cartManager };