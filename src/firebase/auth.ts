import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./config";
import { useAuthStore, UserProfile } from "../store/useAuthStore";

// Listener para cambios de estado de autenticación
export const initAuthListener = () => {
  const setUser = useAuthStore.getState().setUser;
  const setLoading = useAuthStore.getState().setLoading;

  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (user) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        plan: 'free' // Por defecto, se puede expandir para cargar desde Firestore
      };
      setUser(userProfile);
    } else {
      setUser(null);
    }
    setLoading(false);
  });
};

export const registerUser = async (email: string, pass: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
