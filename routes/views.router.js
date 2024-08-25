import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta principal
router.get("/", (req, res) => {
    res.render("home");
});

// Ruta para obtener productos con paginación y ordenamiento
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 5, sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
            sort: validSort,
        });

        const nuevoArray = productos.docs.map((producto) => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
        });
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({
            status: "error",
            error: "Internal Server Error",
        });
    }
});

// Ruta para obtener productos ordenados en tiempo real
router.get("/realtimeproducts", async (req, res) => {
    try {
        const { sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const products = await productManager.getProducts(query);

        const sortedProducts = products.sort((a, b) => {
            return validSort === 'asc' ? a.precio - b.precio : b.precio - a.precio;
        });

        res.render('realtimeproducts', { products: sortedProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Render add product page
router.get("/products/add", (req, res) => {
    res.render("addProduct");
});

router.get('/', async (req, res) => {
    try {
        // Obtén la información de todos los carritos
        const cartInfo = await cartManager.getAllCarts();

        // Renderiza la vista "carts" con la información de los carritos
        res.render('carts', { cartInfo });
    } catch (error) {
        console.error('Error retrieving carts:', error);
        res.status(500).render('error', { message: 'Internal server error' });
    }
});

// Render cart page (this is just a placeholder, adjust as needed)
router.get("/cart/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).send("Cart not found");
        }
        res.render("cart", { cart });
    } catch (error) {
        console.error("Error rendering cart page", error);
        res.status(500).send("Internal server error");
    }
});

// // Ruta para obtener carrito por ID
// router.get("/carts/:cid", async (req, res) => {
//     const cartId = req.params.cid;

//     try {
//         const carrito = await cartManager.getCarritoById(cartId);

//         if (!carrito) {
//             console.log("Cart with ID", cartId, "does not exist");
//             return res.status(404).json({ error: "Cart not found" });
//         }

//         const productosEnCarrito = carrito.products.map((item) => ({
//             product: item.product.toObject(),
//             quantity: item.quantity,
//         }));

//         res.render("carts", { productos: productosEnCarrito });
//     } catch (error) {
//         console.error("Error getting cart:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

export default router;
