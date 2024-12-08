import { useLocalStorageSignal } from "../helpers/state.helper.ts";

export const Sortings = {
  freshSnow: "Neuschnee",
  mountainHeight: "Schnee Berg",
  tmax: "Temperatur",
  sun: "Sonne",
};

/** WEATHER SETTINGS */

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

/** LIST SETTINGS */

export const sortingList = useLocalStorageSignal<
    (typeof Sortings)[keyof typeof Sortings]
>("sortingList", Sortings.freshSnow);

export const showCurrentConditionsList = useLocalStorageSignal<boolean>(
    "showCurrentConditionsList",
    true,
);

export const showQiList = useLocalStorageSignal<boolean>("showQiList", false);
export const showStatusesList = useLocalStorageSignal<boolean>(
    "showStatusesList",
    false,
);

export const showForecastsList = useLocalStorageSignal<boolean>(
    "showForecastsList",
    true,
);

export const weatherDayRangeList = useLocalStorageSignal<[number, number]>(
    "weatherDayRangeList",
    [0, 1],
);