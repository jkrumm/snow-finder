import { useEffect } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

export const Paths = {
  HOME: "/",
  WEATHER: "/weather",
  MAP: "/map",
  FAVORITES: "/favorites",
  SETTINGS: "/settings",
} as const;

type PathType = typeof Paths[keyof typeof Paths];

const pathToTitle: Record<PathType, string> = {
  [Paths.HOME]: "Home",
  [Paths.WEATHER]: "Wetter",
  [Paths.MAP]: "Karte",
  [Paths.FAVORITES]: "Favoriten",
  [Paths.SETTINGS]: "Einstellungen",
} as const;

export const getPathTitle = (path: PathType) => {
  return pathToTitle[path];
};

export const path = signal<(typeof Paths)[keyof typeof Paths]>(
  window.location.pathname as (typeof Paths)[keyof typeof Paths],
);

export const usePath = () => {
  useSignals();

  useEffect(() => {
    const handlePopState = () => {
      path.value = window.location
        .pathname as (typeof Paths)[keyof typeof Paths];
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (newPath: (typeof Paths)[keyof typeof Paths]) => {
    window.history.pushState({}, "", newPath);
    path.value = newPath;
  };

  return { navigate };
};
