import { effect, signal } from "@preact/signals-react";

type Storable = number | string | boolean | object;

function saveToLocalStorage<T extends Storable>(key: string, value: T): void {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
}

function getFromLocalStorage<T extends Storable>(key: string): T | null {
  try {
    const stringValue = localStorage.getItem(key);
    if (stringValue !== null) {
      return JSON.parse(stringValue) as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage with key "${key}":`, error);
  }
  return null;
}

export function useLocalStorageSignal<T extends Storable>(
  key: string,
  defaultValue: T,
) {
  const storedValue = getFromLocalStorage<T>(key);
  const signalValue = signal<T>(
    storedValue !== null ? storedValue : defaultValue,
  );

  effect(() => {
    saveToLocalStorage(key, signalValue.value);
  });

  return signalValue;
}
