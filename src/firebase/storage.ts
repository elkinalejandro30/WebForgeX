import { 
  ref, 
  uploadString, 
  getDownloadURL 
} from "firebase/storage";
import { storage } from "./config";

/**
 * Sube una imagen en formato DataURL (base64) a Firebase Storage
 * @param dataUrl Imagen en base64
 * @param userId ID del usuario para organizar carpetas
 * @param fileName Nombre del archivo (opcional)
 */
export const uploadImage = async (dataUrl: string, userId: string, fileName?: string) => {
  try {
    const name = fileName || `img_${Date.now()}.webp`;
    const storageRef = ref(storage, `users/${userId}/images/${name}`);
    
    // Subir el string base64 (quitando el prefijo data:image/...)
    await uploadString(storageRef, dataUrl, 'data_url');
    
    // Obtener URL pública
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading image to Storage:", error);
    throw error;
  }
};
