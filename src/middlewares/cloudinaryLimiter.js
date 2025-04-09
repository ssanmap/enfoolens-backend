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
exports.checkCloudinaryQuota = void 0;
// middlewares/cloudinaryLimiter.ts
const cloudinary_1 = __importDefault(require("cloudinary"));
const checkCloudinaryQuota = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usage = yield cloudinary_1.default.v2.api.usage();
        const usedPercent = (usage.used_quota / usage.plan_quota) * 100;
        if (usedPercent > 85) {
            return res.status(429).json({
                error: "Límite de almacenamiento cercano. Contacta al administrador."
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkCloudinaryQuota = checkCloudinaryQuota;
