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
exports.simpleBackup = void 0;
// utils/backup.ts
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const product_model_1 = require("../models/product.model");
const simpleBackup = () => __awaiter(void 0, void 0, void 0, function* () {
    const backupDir = path_1.default.join(__dirname, '../../backups');
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    try {
        yield (0, promises_1.mkdir)(backupDir, { recursive: true });
        const products = yield product_model_1.Product.find();
        yield (0, promises_1.writeFile)(path_1.default.join(backupDir, `backup-${timestamp}.json`), JSON.stringify(products, null, 2));
        console.log(`✅ Backup guardado en /backups/backup-${timestamp}.json`);
    }
    catch (error) {
        console.error('❌ Error en backup:', error);
    }
});
exports.simpleBackup = simpleBackup;
