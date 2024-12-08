import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Callout, Card, Elevation, H3, Tooltip } from "@blueprintjs/core";
import { ForecastTable } from "./forecast-table.tsx";
import { getStatuses, Status } from "../helpers/status.helper.ts";
import { Pqi } from "./pqi.tsx";
import { favoriteResorts } from "../state/resorts.state.ts";

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

export function Weather() {
  useSignals();

  return (
    <div className="w-[1600px] max-w-screen p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {favoriteResorts.value.map((resort) => {
          const statuses = getStatuses(resort);
          return (
            <Card
              key={resort.id}
              elevation={Elevation.THREE}
              className="!p-0"
            >
              {/*<ButtonGroup fill>*/}
              {/*  <Button*/}
              {/*    icon="star"*/}
              {/*    onClick={() => {*/}
              {/*      favorites.value = favorites.value.filter(*/}
              {/*        (id) => id !== resort.id,*/}
              {/*      );*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    Entfernen*/}
              {/*  </Button>*/}
              {/*  <Button*/}
              {/*    icon="arrow-right"*/}
              {/*    onClick={() => {*/}
              {/*      window.location.href = `/resort/${resort.id}`;*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    Details*/}
              {/*  </Button>*/}
              {/*</ButtonGroup>*/}
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

              <Pqi
                resort={resort}
                index={new Date().getHours() >= 12 ? 1 : 0}
              />

              <div className="flex h-[56px]">
                {statuses.map((status: Status) => (
                  <Tooltip
                    key={status.title}
                    content={status.tooltip}
                    position="bottom"
                    className="flex-1 m-2 overflow-hidden"
                  >
                    <Callout
                      icon={false}
                      className={`truncate text-center`}
                      intent={status.intend}
                      title={status.title}
                      compact
                    />
                  </Tooltip>
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
