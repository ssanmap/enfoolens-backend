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
exports.uploadImage = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
// 1. Verificación de variables de entorno
// Agrega esto temporalmente en tu server.ts
console.log("Cloudinary Key:", process.env.CLOUDINARY_KEY);
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
    throw new Error("❌ Cloudinary credentials missing in .env file");
}
// 2. Configuración más robusta
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true // Siempre usar HTTPS
});
// 3. Multer config (perfecto como está)
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
// 4. Función mejorada con manejo de errores
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
            folder: "enfoolens",
            resource_type: "auto", // Detecta automáticamente imágenes/videos
            allowed_formats: ["jpg", "png", "jpeg", "webp"], // Formatos permitidos
            transformation: [{ width: 800, crop: "limit" }] // Optimización automática
        });
        return result.secure_url;
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
});
exports.uploadImage = uploadImage;
