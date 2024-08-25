// import { Router } from 'express';
// import ProductManagerDB from '../dao/db/product-manager-db.js';

// const router = Router();
// const productManager = new ProductManagerDB();

// // router.get('/', (req, res) => {
// //     res.render('index'); // Asegúrate de que la vista 'home' exista en el directorio views
// // });

// // router.post('/', async (req, res) => {
// //     try {
// //         const newProduct = await productManager.addProduct(req.body);
// //         res.status(201).json(newProduct);
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// router.get('/products', async (req, res) => {
//     try {
//         const { limit = 3, page = 1, sort, query } = req.query;
//         const productData = await productManager.getProducts({
//             limit: parseInt(limit),
//             page: parseInt(page),
//             sort,
//             query
//         });

//         let products = productData.docs; // Obtener el array de productos
//         console.log(products);

//         // Aplicar ordenamiento si se proporciona el parámetro 'sort'
//         if (sort) {
//             const sortOrder = sort === 'desc' ? -1 : 1;
//             products = products.sort((a, b) => {
//                 if (a.precio < b.precio) return -sortOrder;
//                 if (a.precio > b.precio) return sortOrder;
//                 return 0;
//             });
//         }

//         // Paginación
//         const totalProducts = products.length;
//         const startIndex = (page - 1) * limit;
//         const paginatedProducts = products.slice(startIndex, startIndex + limit);

//         const totalPages = productData.totalPages;

//         res.render('products', {
//             productos: paginatedProducts,
//             prevPage: productData.prevPage,
//             nextPage: productData.nextPage,
//             currentPage: productData.page,
//             totalPages
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al intentar recibir los productos");
//     }
// });

// router.get('/', (req, res) => {
//     res.render('index', {
//         title: 'Guitar Store',
//         buttons: [
//             { name: 'Products', link: '/products' },
//             { name: 'RTP (RealTimeProducts)', link: '/realtimeproducts' },
//             { name: 'Add Products', link: '/products/add' }
//         ]
//     });
// });

// // router.get('/realtimeproducts', (req, res) => {
// //     res.render('realtimeproducts'); // Asegúrate de que la vista 'realtimeproducts' exista en el directorio views
// // });

// // Agregar más rutas según sea necesario

// export default router;


import { Router } from 'express';
import ProductManagerDB from '../dao/db/product-manager-db.js';

const router = Router();
const productManagerDB = new ProductManagerDB();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', { title: 'Real Time Products' });
});

router.get('/addproduct', (req, res) => {
    res.render('addProduct', { title: 'Add Product' });
});

router.get('/products', async (req, res) => {
    const products = await productManagerDB.getProducts();
    console.log(products);
    res.render('products', { title: 'Products', products });
});

export default router;