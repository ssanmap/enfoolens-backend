"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.bulkCreateProducts = exports.createProduct = void 0;
const product_model_1 = require("../models/product.model");
const cloudinary_1 = require("../utils/cloudinary");
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }
        console.log("Datos recibidos:", {
            name,
            price,
            file: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
        // Cambia esta línea (la clave del error)
        const imageUrl = yield (0, cloudinary_1.uploadImage)(req.file); // Usa la función que creamos
        const product = new product_model_1.Product({
            name,
            price: Number(price), // Asegura que sea número
            imageUrl
        });
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({
            error: "Error creating product",
            details: error.message
        });
    }
});
exports.createProduct = createProduct;
const bulkCreateProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }
        // 1. Leer el archivo Excel
        const workbook = xlsx_1.default.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const rawData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // 2. Validaciones
        if (!rawData.every((item) => item.name && item.price)) {
            return res.status(400).json({
                error: 'El archivo debe contener las columnas "name" y "price"',
            });
        }
        // 3. Validar URLs de imágenes (si existen)
        const invalidUrls = rawData.filter((item) => item.imageUrl && !isValidUrl(item.imageUrl));
        if (invalidUrls.length > 0) {
            return res.status(400).json({
                error: `URLs inválidas en los productos: ${invalidUrls.map(item => item.name).join(", ")}`,
            });
        }
        // 4. Transformar datos (ej. convertir price a número)
        const productsToInsert = rawData.map((item) => {
            var _a;
            return ({
                name: item.name.trim(),
                price: Number(item.price),
                imageUrl: (_a = item.imageUrl) === null || _a === void 0 ? void 0 : _a.trim(), // Opcional
                createdAt: new Date(),
            });
        });
        // 5. Insertar en la base de datos
        const result = yield product_model_1.Product.insertMany(productsToInsert);
        // 6. Limpieza: eliminar archivo temporal
        fs_1.default.unlinkSync(req.file.path);
        res.status(201).json({
            success: true,
            insertedCount: result.length,
            products: result,
        });
    }
    catch (error) {
        // 7. Manejo de errores específicos
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Algunos productos ya existen (nombre duplicado)",
            });
        }
        res.status(500).json({
            error: "Error en la carga masiva",
            details: error.message,
        });
    }
});
exports.bulkCreateProducts = bulkCreateProducts;
// Función auxiliar para validar URLs
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (_a) {
        return false;
    }
};
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find().sort({ createdAt: -1 });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
});
exports.getProducts = getProducts;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price } = req.body;
        let imageUrl;
        if (req.file) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file);
        }
        const product = yield product_model_1.Product.findByIdAndUpdate(id, Object.assign({ name, price }, (imageUrl && { imageUrl })), { new: true });
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.Product.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
