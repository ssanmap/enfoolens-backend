import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { uploadImage } from "../utils/cloudinary";
import xlsx from 'xlsx';
import fs from 'fs';

export const createProduct = async (req: Request, res: Response) => {
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
    const imageUrl = await uploadImage(req.file); // Usa la función que creamos
    
    const product = new Product({ 
      name, 
      price: Number(price), // Asegura que sea número
      imageUrl 
    });
    
    await product.save();

    res.status(201).json(product);
  } catch (error:any) {
    console.error("Error completo:", error);
    res.status(500).json({ 
      error: "Error creating product",
      details: error.message 
    });
  }
};

export const bulkCreateProducts = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    // 1. Leer el archivo Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rawData: Array<{ name: string; price: number; imageUrl?: string }> =
      xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 2. Validaciones
    if (!rawData.every((item) => item.name && item.price)) {
      return res.status(400).json({
        error: 'El archivo debe contener las columnas "name" y "price"',
      });
    }

    // 3. Validar URLs de imágenes (si existen)
    const invalidUrls = rawData.filter(
      (item) => item.imageUrl && !isValidUrl(item.imageUrl)
    );
    if (invalidUrls.length > 0) {
      return res.status(400).json({
        error: `URLs inválidas en los productos: ${invalidUrls.map(item => item.name).join(", ")}`,
      });
    }

    // 4. Transformar datos (ej. convertir price a número)
    const productsToInsert = rawData.map((item) => ({
      name: item.name.trim(),
      price: Number(item.price),
      imageUrl: item.imageUrl?.trim(), // Opcional
      createdAt: new Date(),
    }));

    // 5. Insertar en la base de datos
    const result = await Product.insertMany(productsToInsert);

    // 6. Limpieza: eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      insertedCount: result.length,
      products: result,
    });
  } catch (error: any) {
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
};

// Función auxiliar para validar URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    let imageUrl;

    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, ...(imageUrl && { imageUrl }) },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};