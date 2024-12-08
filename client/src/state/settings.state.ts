import { useLocalStorageSignal } from "../helpers/state.helper.ts";

export const Sortings = {
  freshSnow: "Neuschnee",
  mountainHeight: "Berg",
  tmax: "Tmax",
  sun: "Sonne",
};

export const sorting = useLocalStorageSignal<
  (typeof Sortings)[keyof typeof Sortings]
>("sorting", Sortings.freshSnow);

export const showCurrentConditions = useLocalStorageSignal<boolean>(
  "showCurrentConditions",
  true,
);
export const showQi = useLocalStorageSignal<boolean>("showQi", true);
export const showStatuses = useLocalStorageSignal<boolean>(
  "showStatuses",
  true,
);
export const showForecasts = useLocalStorageSignal<boolean>(
  "showForecasts",
  true,
);

export const weatherDayRange = useLocalStorageSignal<[number, number]>(
  "weatherDayRange",
  [0, 8],
);
