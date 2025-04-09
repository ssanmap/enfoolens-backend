import { Router } from "express";
import {
  createProduct,
  bulkCreateProducts,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { upload } from "../utils/cloudinary";
import { checkCloudinaryQuota } from "../middlewares/cloudinaryLimiter";


const router = Router();

router.post("/", checkCloudinaryQuota ,upload.single("image"), createProduct);
router.post("/bulk", checkCloudinaryQuota, upload.single("excel"), bulkCreateProducts);
router.get("/", getProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;