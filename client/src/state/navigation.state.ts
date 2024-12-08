import { useLocalStorageSignal } from "../helpers/state.helper.ts";

export const Views = {
  LIST: "Liste",
  WEATHER: "Wetter",
  MAP: "Karte",
  FAVORITES: "Favoriten",
} as const;

export const currentView = useLocalStorageSignal<
  (typeof Views)[keyof typeof Views]
>("currentView", Views.WEATHER);
