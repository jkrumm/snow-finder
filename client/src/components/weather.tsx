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

  const fetchResorts = async () => {
    if (resorts.value.length > 0) return;
    const response = await fetch("http://localhost:8000/api/resorts");
    resorts.value = await response.json();
  };

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
                  Remove
                </Button>
                <Button
                  icon="arrow-right"
                  onClick={() => {
                    window.location.href = `/resort/${resort.id}`;
                  }}
                  disabled
                >
                  Details
                </Button>
              </ButtonGroup>
              <H3
                className={`bp5-heading !m-3 !mb-1 truncate`}
              >
                {resort.name}
              </H3>
              <div className="flex">
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
              <div className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-5 w-full muted-bg mt-2">
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
                {/*<Statistic*/}
                {/*  label="Temperatur"*/}
                {/*  value={`${resort.dailyForecasts![0].tmax}° / ${*/}
                {/*    resort.dailyForecasts![0].tmin*/}
                {/*  }°`}*/}
                {/*/>*/}
                {/*<Statistic*/}
                {/*  label="Sonne"*/}
                {/*  value={resort.dailyForecasts![0].sun}*/}
                {/*  append=" h"*/}
                {/*/>*/}
                {/*<Statistic*/}
                {/*  label="Wind"*/}
                {/*  value={resort.dailyForecasts![0].wind}*/}
                {/*/>*/}
                {/*<Statistic*/}
                {/*  label="Regenrisiko"*/}
                {/*  value={(resort.dailyForecasts![0].rainRisc) * 100}*/}
                {/*  append=" %"*/}
                {/*/>*/}
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
