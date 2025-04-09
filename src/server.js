"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // <-- Esto debe ser LO PRIMERO
const app_1 = __importDefault(require("./app"));
const database_1 = require("./utils/database");
const PORT = process.env.PORT || 3000;
// Conexión a DB y luego inicia el server
(0, database_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ DB connection failed:", error);
    process.exit(1); // Termina el proceso con error
});
