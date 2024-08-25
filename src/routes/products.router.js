import express from "express";
const router = express.Router();
import ProductManager from "../dao/db/product-manager-db.js";
const productManager = new ProductManager();

// Get products with pagination, sorting, and filtering
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

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
            nextLink: products.nextLink,
        });

    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

// Get a single product by id
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("Error getting product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// Add a new product
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Product added successfully"
        });
    } catch (error) {
        console.error("Error adding product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// Update a product by id
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(id, updatedProduct);
        res.json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// Delete a product by id
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

// Endpoint para obtener productos con orden
router.get('/api/products', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const products = await productManager.getProducts(query, sort);

        const sortedProducts = products.sort((a, b) => {
            if (sort === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });

        const paginatedProducts = sortedProducts.slice((page - 1) * limit, page * limit);
        res.json(paginatedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

export default router;
