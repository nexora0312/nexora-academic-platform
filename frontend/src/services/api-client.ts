export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const url = `${apiBaseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  const response = await fetch(url, {
    ...init,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}
