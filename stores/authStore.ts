// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  isAdmin: boolean;
  email: string | null;
  name: string | null;
  isLoggedIn: boolean;
  setAuth: (data: { isAdmin: boolean; email: string; name: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      email: null,
      name: null,
      isLoggedIn: false,
      setAuth: ({ isAdmin, email, name }) =>
        set({ isAdmin, email, name, isLoggedIn: true }),
      logout: () => set({ isAdmin: false, email: null, name: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage'
    }
  )
);
