import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { upload } from "../utils/cloudinary";
import { checkCloudinaryQuota } from "../middlewares/cloudinaryLimiter";

const router = Router();

router.post("/", checkCloudinaryQuota ,upload.single("image"), createProduct);
router.get("/", getProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;