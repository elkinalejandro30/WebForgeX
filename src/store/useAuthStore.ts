import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlanId } from '../config/plans';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  plan: PlanId;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile | null, token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateUserPlan: (plan: PlanId) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 1,
        name: 'Invitado',
        email: 'invitado@webforgex.local',
        plan: 'free'
      },
      token: 'guest-token',
      isAuthenticated: true,
      isLoading: false,
      
      setAuth: (user, token) => set({ 
        user, 
        token,
        isAuthenticated: !!user && !!token,
        isLoading: false
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      updateUserPlan: (plan) => set((state) => ({
        user: state.user ? { ...state.user, plan } : null
      })),

      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'webforgex-auth',
    }
  )
);
