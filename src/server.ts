import 'dotenv/config'; // <-- Esto debe ser LO PRIMERO
import app from "./app";
import { connectDB } from "./utils/database";

const PORT = process.env.PORT || 3000;

// Conexión a DB y luego inicia el server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error);
    process.exit(1); // Termina el proceso con error
  });