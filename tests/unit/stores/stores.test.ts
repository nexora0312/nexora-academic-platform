import { afterEach, describe, expect, it } from "vitest";
import {
  useAuthStore,
  useNotificationStore,
  useSidebarStore,
  useThemeStore,
  useUserStore,
} from "../../../frontend/src/stores";

afterEach(() => {
  useAuthStore.setState({
    currentUser: null,
    isSignInOpen: false,
    isSigningOut: false,
  });
  useNotificationStore.setState({ notifications: [], nextId: 1 });
  useSidebarStore.setState({ isOpen: false });
  useThemeStore.setState({ preference: "system" });
  useUserStore.setState({ selectedUserId: null });
});

describe("frontend stores", () => {
  it("keeps authentication display and UI state separate from credentials", () => {
    const user = {
      id: "user-1",
      email: "person@example.com",
      name: null,
      role: "ADMIN" as const,
    };
    const authStore = useAuthStore.getState();

    authStore.setCurrentUser(user);
    authStore.setSignInOpen(true);
    authStore.setSigningOut(true);

    expect(useAuthStore.getState()).toMatchObject({
      currentUser: user,
      isSignInOpen: true,
      isSigningOut: true,
    });
  });

  it("stores user selection and toggles the sidebar", () => {
    useUserStore.getState().selectUser("user-1");
    useSidebarStore.getState().toggle();

    expect(useUserStore.getState().selectedUserId).toBe("user-1");
    expect(useSidebarStore.getState().isOpen).toBe(true);
  });

  it("supports system-based theme preference and changing it", () => {
    expect(useThemeStore.getState().preference).toBe("system");
    useThemeStore.getState().setPreference("dark");

    expect(useThemeStore.getState().preference).toBe("dark");
  });

  it("adds and dismisses UI notifications", () => {
    const notificationStore = useNotificationStore.getState();
    notificationStore.addNotification({ message: "Saved", kind: "success" });
    notificationStore.addNotification({ message: "Failed", kind: "error" });

    expect(useNotificationStore.getState().notifications).toEqual([
      { id: 1, message: "Saved", kind: "success" },
      { id: 2, message: "Failed", kind: "error" },
    ]);

    useNotificationStore.getState().dismissNotification(1);
    expect(useNotificationStore.getState().notifications).toEqual([
      { id: 2, message: "Failed", kind: "error" },
    ]);
  });
});
