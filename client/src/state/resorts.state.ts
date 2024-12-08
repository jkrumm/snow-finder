import { computed, signal } from "@preact/signals-react";
import { ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { useLocalStorageSignal } from "../helpers/state.helper.ts";
import {sorting} from "../containers/weather.tsx";

export const resorts = signal<ResortDto[]>([]);

export const favorites = useLocalStorageSignal("favorites", [
  "fieberbrunn",
  "kitzbuehel-kirchberg",
  "axamer-lizum",
  "hochfuegen",
  "westendorf",
  "stanton-stchristoph",
]);

export const favoriteResorts = computed<ResortDto[]>(() => {
  return resorts.value.filter((resort) => favorites.value.includes(resort.id))
    .sort(
      (a: ResortDto, b: ResortDto) => {
        if (sorting.value === "freshSnow") {
          return b.freshSnow - a.freshSnow;
        }
        if (sorting.value === "mountainHeight") {
          return b.mountainHeight - a.mountainHeight;
        }
        if (sorting.value === "tmax") {
          return b.dailyForecasts![0].tmax - a.dailyForecasts![0].tmax;
        }
        if (sorting.value === "sun") {
          return b.dailyForecasts![0].sun - a.dailyForecasts![0].sun;
        }
        return 0;
      },
    );
});
