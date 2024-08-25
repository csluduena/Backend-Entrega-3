import express from "express";
import exphbs from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import http from "http";
import { Server } from "socket.io";
import "./database.js";
import ProductManager from "./dao/db/product-manager-db.js";

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Handlebars view engine setup
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Mount API routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Mount view routes
app.use("/", viewsRouter);

// WebSocket handling for real-time updates
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("sortProducts", async (data) => {
        const { sort } = data;
        try {
            const products = await ProductManager.getProducts(); // Adjust if ProductManager is imported differently
            const sortedProducts = products.sort((a, b) => {
                if (sort === "asc") {
                    return a.price - b.price;
                } else if (sort === "desc") {
                    return b.price - a.price;
                } else {
                    return 0; // Default case if sort is not asc or desc
                }
            });
            socket.emit("updateProducts", sortedProducts);
        } catch (error) {
            console.error("Error sorting products:", error);
            socket.emit("updateProducts", { error: "Error al obtener productos" });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Default route for unmatched requests
app.get("*", (req, res) => {
    res.status(400).send("Route not found");
});
