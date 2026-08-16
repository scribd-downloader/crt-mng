import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InputLanguage = "en" | "ur";

interface AppState {
  inputLanguage: InputLanguage;
  showUrduKeyboard: boolean;
  setInputLanguage: (lang: InputLanguage) => void;
  toggleUrduKeyboard: () => void;
  setShowUrduKeyboard: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      inputLanguage: "en",
      showUrduKeyboard: false,
      setInputLanguage: (lang) => set({ inputLanguage: lang }),
      toggleUrduKeyboard: () =>
        set((s) => ({ showUrduKeyboard: !s.showUrduKeyboard })),
      setShowUrduKeyboard: (show) => set({ showUrduKeyboard: show }),
    }),
    { name: "cm_app_state" }
  )
);

interface LicenseState {
  status: {
    active: boolean;
    plan: string;
    expiresAt: string;
    daysRemaining: number;
    status: string;
  } | null;
  isLoading: boolean;
  setStatus: (status: LicenseState["status"]) => void;
  setLoading: (loading: boolean) => void;
}

export const useLicenseStore = create<LicenseState>((set) => ({
  status: null,
  isLoading: true,
  setStatus: (status) => set({ status, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
