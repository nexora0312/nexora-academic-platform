import { create } from "zustand";

export type UiNotification = {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
};

type NotificationStore = {
  notifications: UiNotification[];
  nextId: number;
  addNotification: (
    notification: Omit<UiNotification, "id">,
  ) => void;
  dismissNotification: (id: number) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  nextId: 1,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: state.nextId },
      ],
      nextId: state.nextId + 1,
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
