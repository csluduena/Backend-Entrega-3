//products.router.js no renderiza, solo recibe data de los productos y los muestra con un response.

import express from 'express';
import ProductManagerDB from '../dao/db/product-manager-db.js'; // Cambiado a import
import ProductModel from '../dao/models/product.models.js';

const productsRouter = express.Router();
const productManagerDB = new ProductManagerDB();

// Ruta para obtener y renderizar la vista de productos FUNCIONAL
productsRouter.get('/', async (req, res) => {
    try {
        const products = await productManagerDB.getProducts(); // Obtiene los productos desde la base de datos
        //res.render('products', { products: products }); // Renderiza la vista 'products.handlebars' y pasa los productos como contexto
        res.json({ products });
    } catch (error) {
        res.status(500).send('Error al obtener productos: ' + error.message);
    }
});

// Endpoint para agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = await productManagerDB.addProduct(req.body);        
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = 'asc' } = req.query;
        const products = await ProductManagerDB.getProducts({ limit, page, query, sort });

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const productFound = await productManagerDB.getProductById(pid);
        if (!productFound) {
            res.status(404).json({ error: "No se encontró el producto." });
        }
        await productManagerDB.deleteProduct(pid);
            res.json({ message: "El producto fue eliminado."});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default productsRouter;




// import { Router } from "express";
// import { productManager } from "../app.js";
// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from 'uuid';

// const productsRouter = Router();

// productsRouter.get("/", async (req, res) => {
//     try {
//         const { limit } = req.query;
//         const products = await productManager.getProducts();

//         if (limit) {
//             const limitedProducts = products.slice(0, limit);
//             return res.json(limitedProducts);
//         } else {
//             return res.json(products);
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al intentar recibir los productos");
//     }
// });

// productsRouter.get("/:pid", async (req, res) => {
//     try {
//         const { pid } = req.params;
//         const product = await productManager.getProductById(pid);
//         res.json(product);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(`Error al intentar recibir el producto con el id: ${pid}`);
//     }
// });

// productsRouter.post("/", async (req, res) => {
//     try {
//         const { nombre, precio, descripcion, categoria } = req.body;
//         if (!nombre || !precio || !descripcion || !categoria) {
//             return res.status(400).send("Faltan datos en la solicitud");
//         }

//         const newProduct = {
//             nombre,
//             precio,
//             descripcion,
//             categoria,
//             imagen: "/img/carpiLoco.gif" // Imagen por defecto solo al agregar manualmente
//         };

//         const response = await productManager.addProduct(newProduct);
//         res.status(201).json(response);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al intentar agregar producto");
//     }
// });

// productsRouter.put("/:pid", async (req, res) => {
//     const { pid } = req.params;
//     try {
//         const { nombre, descripcion, precio, categoria } = req.body;
//         if (!nombre || !descripcion || !precio || !categoria) {
//             return res.status(400).send("Faltan datos en la solicitud");
//         }

//         const response = await productManager.updateProduct(pid, { nombre, descripcion, precio, categoria });
//         res.json(response);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(`Error al intentar editar producto con id ${pid}`);
//     }
// });

// productsRouter.delete("/:pid", async (req, res) => {
//     const { pid } = req.params;
//     try {
//         await productManager.deleteProduct(pid);
//         res.send("Product Deleted");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(`Error al intentar eliminar el producto con id: ${pid}`);
//     }
// });

// // Nueva ruta para importar productos desde stock.json
// productsRouter.post("/import-stock", async (req, res) => {
//     try {
//         const stockData = await fs.readFile('./src/data/stock.json', 'utf8');
//         const stockProducts = JSON.parse(stockData);

//         for (const product of stockProducts) {
//             // Solo asignar un ID si no está presente en stock.json
//             if (!product.id) {
//                 product.id = uuidv4();
//             }
//             // No asignar una imagen por defecto si ya hay una imagen
//             await productManager.addProduct(product);
//         }

//         const products = await productManager.getProducts();
//         res.status(200).json(products);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al intentar importar el stock");
//     }
// });

// export { productsRouter };
