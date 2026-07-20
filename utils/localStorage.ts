export function loadFromLocalStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = localStorage.getItem(key);

    return storedValue
      ? (JSON.parse(storedValue) as T)
      : fallback;
  } catch {
    return fallback;
  }
}

export function saveToLocalStorage<T>(
  key: string,
  value: T
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to Local Storage:", error);
  }
}