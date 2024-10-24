"use client";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
}

interface UserType {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
}

const useUserStore = create<UserType>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  getUser: () => get().user,
}));

export default useUserStore;
