import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { UserInfo } from "../../../shared/api/types/auth";

interface UserState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  isAuth: boolean;

  setAuthData: (user: UserInfo, token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuth: false,

        setAuthData: (user, token, refreshToken) =>
          set({ user, token, refreshToken, isAuth: true }),

        logout: () =>
          set({ user: null, token: null, refreshToken: null, isAuth: false }),
      }),
      {
        name: "user-storage",
        partialize: (state) => ({
          token: state.token,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuth: state.isAuth,
        }),
      }
    )
  )
);

