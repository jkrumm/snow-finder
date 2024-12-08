import { effect, signal } from "@preact/signals-react";

type Storable = number | string | object;

function saveToLocalStorage<T extends Storable>(key: string, value: T): void {
  let stringValue: string;
  if (typeof value === "object") {
    stringValue = JSON.stringify(value);
  } else {
    stringValue = value.toString();
  }
  localStorage.setItem(key, stringValue);
}

function getFromLocalStorage<T extends Storable>(key: string): T | null {
  const stringValue = localStorage.getItem(key);
  if (stringValue === null) {
    return null;
  }
  try {
    const parsedValue = JSON.parse(stringValue);
    if (typeof parsedValue === "object") {
      return parsedValue as T;
    }
  } catch {
    return null;
  }
  if (!isNaN(Number(stringValue))) {
    return Number(stringValue) as T;
  }
  return stringValue as T;
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
