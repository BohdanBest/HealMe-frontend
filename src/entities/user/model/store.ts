import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { UserInfo } from "../../../shared/api/types/auth";

interface UserState {
  user: UserInfo | null;
  token: string | null;
  isAuth: boolean;

  setAuthData: (user: UserInfo, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuth: false,

        setAuthData: (user, token) => set({ user, token, isAuth: true }),

        logout: () => set({ user: null, token: null, isAuth: false }),
      }),
      {
        name: "user-storage",
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuth: state.isAuth,
        }),
      }
    )
  )
);
