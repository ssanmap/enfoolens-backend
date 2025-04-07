import mongoose from 'mongoose';
import 'dotenv/config'; // Asegúrate de que esto esté aquí

export const connectDB = async () => {
  try {
    console.log("Valor de MONGODB_URL:", process.env.MONGODB_URL); // Debug
    if (!process.env.MONGODB_URL) {
      throw new Error("❌ MONGODB_URL no está definida en .env");
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};