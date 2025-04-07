import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Request } from "express";

// 1. Verificación de variables de entorno

// Agrega esto temporalmente en tu server.ts
console.log("Cloudinary Key:", process.env.CLOUDINARY_KEY);
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  throw new Error("❌ Cloudinary credentials missing in .env file");
}

// 2. Configuración más robusta
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true // Siempre usar HTTPS
});

// 3. Multer config (perfecto como está)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// 4. Función mejorada con manejo de errores
export const uploadImage = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: "enfoolens",
        resource_type: "auto", // Detecta automáticamente imágenes/videos
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Formatos permitidos
        transformation: [{ width: 800, crop: "limit" }] // Optimización automática
      }
    );
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};