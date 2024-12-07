import { useEffect } from "react";
import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  Button,
  ButtonGroup,
  Callout,
  Card,
  Elevation,
  H3,
} from "@blueprintjs/core";
import { ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { ForecastTable } from "./forecast-table.tsx";
import { getStatuses, Status } from "../helpers/status.helper.ts";
import { fetchResorts } from "../helpers/fetch-client.helper.ts";
import { Pqi } from "./pqi.tsx";

export const resorts = signal<ResortDto[]>([]);

export const favorites = signal<string[]>([
  "fieberbrunn",
  "kitzbuehel-kirchberg",
  "axamer-lizum",
  "hochfuegen",
  "westendorf",
  "stanton-stchristoph",
]);

export const showForecasts = signal<boolean>(true);

export const sorting = signal<"freshSnow" | "mountainHeight" | "tmax" | "sun">(
  "freshSnow",
);

const Statistic = ({ label, value, prepend, append, className }: {
  label: string;
  value: string | number;
  prepend?: string;
  append?: string;
  className?: string;
}) => (
  <div className={`text-center ${className}`}>
    <span className="block pb-1 text-[#abb3bf] uppercase">{label}</span>
    <span className="text-lg font-bold">{prepend}{value}{append}</span>
  </div>
);

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

export function Weather() {
  useSignals();

  useEffect(() => {
    fetchResorts().then();
  }, [favorites.value]);

  return (
    <div className="w-[1600px] max-w-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {favoriteResorts.value.map((resort) => {
          const statuses = getStatuses(resort);
          return (
            <Card
              key={resort.id}
              elevation={Elevation.THREE}
              className="!p-0"
            >
              <ButtonGroup fill>
                <Button
                  icon="star"
                  onClick={() => {
                    favorites.value = favorites.value.filter(
                      (id) => id !== resort.id,
                    );
                  }}
                >
                  Entfernen
                </Button>
                <Button
                  icon="arrow-right"
                  onClick={() => {
                    window.location.href = `/resort/${resort.id}`;
                  }}
                >
                  Details
                </Button>
              </ButtonGroup>
              <div className="flex justify-between">
                <H3
                  className={`bp5-heading !m-3 !mt-3 !mb-1 flex-1 truncate`}
                >
                  {resort.name}
                </H3>
                <div className="grid grid-cols-2 grid-rows-2 mt-2 mr-3">
                  <span className="muted">TAL</span>
                  <span className="text-right">
                    {resort.resortValleyHeight}m
                  </span>
                  <span className="muted pr-1">BERG</span>
                  <span className="text-right">
                    {resort.resortMountainHeight}m
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-5 w-full muted-bg mt-2 pt-2">
                <Statistic
                  label="Tal"
                  value={resort.valleyHeight}
                  append=" cm"
                />
                <Statistic
                  label="Berg"
                  value={resort.mountainHeight}
                  append=" cm"
                />
                <Statistic
                  label="Neuschnee"
                  value={resort.freshSnow}
                  append=" cm"
                />
                <Statistic
                  label="Lifte"
                  value={`${resort.liftsOpen}/${resort.liftsTotal}`}
                />
              </div>

              <Pqi resort={resort} index={new Date().getHours() >= 12 ? 1 : 0} />

              <div className="flex h-[56px]">
                {statuses.map((status: Status) => (
                  <Callout
                    key={status.title}
                    icon={false}
                    className={`m-2 truncate text-center`}
                    intent={status.intend}
                    title={status.title}
                    compact
                  />
                ))}
              </div>

              {showForecasts.value && (
                <ForecastTable
                  resortId={resort.id}
                  dailyForecasts={resort.dailyForecasts!}
                  hourlyForecasts={resort.hourlyForecasts!}
                />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
