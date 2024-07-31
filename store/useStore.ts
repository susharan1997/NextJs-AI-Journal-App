'use client';
import {create} from 'zustand';

interface User {
    id: string;
    name: string;
  }

interface UserType {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};

const useUserStore = create<UserType>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    clearUser: () => set({user: null}),
}));

export default useUserStore;
