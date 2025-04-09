"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
