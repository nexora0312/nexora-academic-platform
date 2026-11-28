import { create } from "zustand";

type UserStore = {
  selectedUserId: string | null;
  selectUser: (userId: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  selectedUserId: null,
  selectUser: (selectedUserId) => set({ selectedUserId }),
}));
