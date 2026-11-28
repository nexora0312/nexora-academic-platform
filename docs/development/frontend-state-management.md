# Frontend state management

The frontend uses small Zustand stores for UI state that needs to be shared across
components. Stores live in `frontend/src/stores/` and are re-exported from its
`index.ts`.

## What stores are

A store is a client-side source of truth for shared state. These stores contain UI
state only; they do not call APIs, validate server sessions, or replace server-side
data fetching.

## When to use global state

Use a store when unrelated components need to read or update the same transient UI
state, such as the open state of a shared sidebar or a selected user ID. Keep API
responses in their existing service and feature-hook flow unless there is a specific
need for a shared client cache.

Authentication display data in `auth.store.ts` is a UI convenience, not proof that a
session is valid. The server remains authoritative. Never put passwords, access
tokens, session secrets, or other credentials in a store.

## When to use local React state

Use `useState` for state owned by one component or a small component subtree:
form fields, validation errors, a local loading indicator, and an edit-in-progress
record are examples. Do not globalize state simply because it is used in a component.

## Creating a store

1. Confirm the state is shared and not already managed by React, a feature hook, or
   server/API fetching.
2. Add a focused `<name>.store.ts` module in `frontend/src/stores/`.
3. Define the state and action types explicitly and keep actions synchronous. Put
   HTTP requests in feature services.
4. Export the store (and any public types) from `frontend/src/stores/index.ts`.
5. Add focused tests for the new state transitions.

For example:

```ts
import { create } from "zustand";

type ExampleStore = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useExampleStore = create<ExampleStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
```

## Using a store in components

Zustand stores are hooks. Read only the state a component needs, and use the store's
actions to update it:

```tsx
"use client";

import { useSidebarStore } from "@/stores";

export function SidebarButton() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);

  return <button onClick={toggle}>{isOpen ? "Close" : "Open"} sidebar</button>;
}
```

Use a Client Component when consuming a store hook; keep surrounding static and
server-rendered components as Server Components where possible.

## Conventions

- Keep stores small, typed, and scoped to one responsibility.
- Store identifiers or UI selections instead of copies of API entities.
- Do not duplicate state already owned by component state or feature hooks.
- Keep requests, response parsing, and server data in services and feature hooks.
- Do not persist state by default; persistence requires a deliberate UX and security
  decision.
- The theme preference defaults to `system`, matching the current CSS
  `prefers-color-scheme` behavior. A theme control should apply explicit preferences
  through the existing CSS theme variables.
- Keep authentication UI state distinct from server-side authentication and session
  validation.
