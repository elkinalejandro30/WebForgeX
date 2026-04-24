import { create } from 'zustand';
import { PlanId } from '../config/plans';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  plan: PlanId;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateUserPlan: (plan: PlanId) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  updateUserPlan: (plan) => set((state) => ({
    user: state.user ? { ...state.user, plan } : null
  })),
}));
