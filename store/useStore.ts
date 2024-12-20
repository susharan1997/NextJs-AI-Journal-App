"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
}

interface UserType {
  user: User | null;
  journalId: string | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
  setJournalId: (id: string) => void;
  getJournalId: () => string | null;
}

const useUserStore = create<UserType>()(
  persist(
    (set, get) => ({
      user: null,
      journalId: null,
      setUser: (user) => set({ user }),
      getUser: () => get().user,
      setJournalId: (id) => set({ journalId: id }),
      getJournalId: () => get().journalId,
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
