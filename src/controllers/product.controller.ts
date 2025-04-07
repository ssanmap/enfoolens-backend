import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { uploadImage } from "../utils/cloudinary";

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