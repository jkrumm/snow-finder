import { computed, signal } from "@preact/signals-react";
import { ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { useLocalStorageSignal } from "../helpers/state.helper.ts";
import { sorting, sortingList, Sortings } from "./settings.state.ts";
import { currentView, Views } from "./navigation.state.ts";

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
        if (currentView.value === Views.WEATHER) {
          if (sorting.value === Sortings.freshSnow) {
            return b.freshSnow - a.freshSnow;
          }
          if (sorting.value === Sortings.mountainHeight) {
            return b.mountainHeight - a.mountainHeight;
          }
          if (sorting.value === Sortings.tmax) {
            return b.dailyForecasts![0].tmax - a.dailyForecasts![0].tmax;
          }
          if (sorting.value === Sortings.sun) {
            return b.dailyForecasts![0].sun - a.dailyForecasts![0].sun;
          }
        }
        if (currentView.value === Views.LIST) {
          if (sortingList.value === Sortings.freshSnow) {
            return b.freshSnow - a.freshSnow;
          }
          if (sortingList.value === Sortings.mountainHeight) {
            return b.mountainHeight - a.mountainHeight;
          }
          if (sortingList.value === Sortings.tmax) {
            return b.dailyForecasts![0].tmax - a.dailyForecasts![0].tmax;
          }
          if (sortingList.value === Sortings.sun) {
            return b.dailyForecasts![0].sun - a.dailyForecasts![0].sun;
          }
        }
        return 0;
      },
    );
});
