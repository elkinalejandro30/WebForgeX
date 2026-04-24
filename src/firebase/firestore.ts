import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  serverTimestamp,
  updateDoc,
  addDoc
} from "firebase/firestore";
import { db } from "./config";
import { Site } from "../store/useStore";

const PROJECTS_COLLECTION = "projects";

/**
 * Limpia un objeto de valores 'undefined' ya que Firestore no los permite.
 */
const cleanData = (data: any) => {
  const clean: any = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      clean[key] = data[key];
    }
  });
  return clean;
};

/**
 * Crea un nuevo proyecto en Firestore (Versión Ligera)
 */
export const createProject = async (siteData: Partial<Site>, userId: string) => {
  try {
    // Solo guardamos datos básicos inicialmente para performance y ahorro
    const lightData = {
      name: siteData.name,
      type: siteData.type,
      templateId: siteData.templateId,
      userId,
      objective: siteData.objective || '',
      contactEmail: siteData.contactEmail || '',
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Guardamos solo los tipos de secciones, no los datos pesados
      sectionTypes: siteData.sections?.map(s => s.type) || [],
    };

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), lightData);
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Guarda el proyecto en Firestore. 
 * Si isPublish es true, guarda todo. Si es false, solo datos básicos.
 */
export const saveProject = async (site: Site, userId: string, isPublish = false) => {
  try {
    let dataToSave: any;
    
    if (isPublish) {
      // Versión completa para producción
      dataToSave = cleanData({
        ...site,
        userId,
        updatedAt: serverTimestamp(),
        published: true,
      });
    } else {
      // Versión ligera para ahorro de recursos
      dataToSave = cleanData({
        id: site.id,
        name: site.name,
        type: site.type,
        templateId: site.templateId,
        userId,
        objective: site.objective || '',
        contactEmail: site.contactEmail || '',
        published: site.published,
        updatedAt: serverTimestamp(),
        sectionTypes: site.sections?.map(s => s.type) || [],
      });
    }

    const projectRef = doc(db, PROJECTS_COLLECTION, site.id);
    await setDoc(projectRef, dataToSave, { merge: true });
    return true;
  } catch (error: any) {
    console.error("Error saving project:", error);
    throw error;
  }
};

/**
 * Actualización parcial de un proyecto (updateDoc)
 */
export const updateProjectPartial = async (projectId: string, data: Partial<Site>) => {
  try {
    const dataToUpdate = cleanData({
      ...data,
      updatedAt: serverTimestamp(),
    });

    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, dataToUpdate);
    return true;
  } catch (error: any) {
    console.error("Error updating project partial:", error);
    throw error;
  }
};

export const getProjectsByUser = async (userId: string) => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const projects: Site[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({ 
        ...data, 
        id: doc.id,
        // Asegurar que sections siempre sea un array si no existe en la versión ligera
        sections: data.sections || [],
        // Inicializar stats si no existen
        stats: data.stats || { views: 0, clicks: 0, conversions: 0 }
      } as Site);
    });
    return projects;
  } catch (error: any) {
    console.error("Error getting projects:", error);
    throw error;
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Site;
    }
    return null;
  } catch (error: any) {
    console.error("Error getting project by ID:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    return true;
  } catch (error: any) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
