import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/products", productRoutes);

export default app; // Exporta solo la instancia de Express