// utils/backup.ts
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { Product } from '../models/product.model';

export const simpleBackup = async () => {
  const backupDir = path.join(__dirname, '../../backups');
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  
  try {
    await mkdir(backupDir, { recursive: true });
    
    const products = await Product.find();
    await writeFile(
      path.join(backupDir, `backup-${timestamp}.json`),
      JSON.stringify(products, null, 2)
    );
    
    console.log(`✅ Backup guardado en /backups/backup-${timestamp}.json`);
  } catch (error) {
    console.error('❌ Error en backup:', error);
  }
};