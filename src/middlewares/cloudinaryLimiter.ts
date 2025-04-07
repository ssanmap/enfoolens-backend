// middlewares/cloudinaryLimiter.ts
import cloudinary from 'cloudinary';


export const checkCloudinaryQuota = async (req:any, res:any, next:any) => {
  try {
    const usage = await cloudinary.v2.api.usage();
    const usedPercent = (usage.used_quota / usage.plan_quota) * 100;

    if (usedPercent > 85) {
      return res.status(429).json({ 
        error: "Límite de almacenamiento cercano. Contacta al administrador." 
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};