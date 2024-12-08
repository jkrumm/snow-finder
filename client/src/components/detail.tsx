import { getStatuses, Status } from "../helpers/status.helper.ts";
import { Pqi } from "./pqi.tsx";
import { ForecastTable } from "./forecast-table.tsx";
import { Callout, Card, Elevation, H3, H4, Tooltip } from "@blueprintjs/core";
import { ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { currentView, Views } from "../state/navigation.state.ts";
import { useEffect, useState } from "react";

function Statistic({ label, value, prepend, append, className }: {
  label: string;
  value: string | number;
  prepend?: string;
  append?: string;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <span
        className={`${
          currentView.value === Views.LIST && "text-xs"
        } block text-[#abb3bf] uppercase`}
      >
        {label}
      </span>
      <span
        className={`${
          currentView.value === Views.WEATHER && "text-lg pt-1"
        } font-bold`}
      >
        {prepend}
        {value}
        {append}
      </span>
    </div>
  );
}

export function Detail(
  { resort, showCurrentConditions, showForecasts, showStatuses, showQi, days }:
    {
      resort: ResortDto;
      showCurrentConditions: boolean;
      showForecasts: boolean;
      showStatuses: boolean;
      showQi: boolean;
      days: [number, number];
    },
) {
  const [selectedView, setSelectedView] = useState<"daily" | number>("daily");
  const [resortIndex, setResortIndex] = useState<number>(
    selectedView === "daily"
      ? new Date().getHours() >= 12 ? 1 : 0
      : selectedView,
  );

  const [statuses, setStatuses] = useState<Status[]>(
    getStatuses(resort, resortIndex),
  );

  useEffect(() => {
    setResortIndex(
      selectedView === "daily"
        ? new Date().getHours() >= 12 ? 1 : 0
        : selectedView,
    );
    setStatuses(getStatuses(resort, resortIndex));
  }, [selectedView]);

  return (
    <Card
      key={resort.id}
      elevation={Elevation.THREE}
      className="!p-0"
      id={resort.id}
    >
      {currentView.value === Views.LIST
        ? (
          <div
            onClick={() => {
              currentView.value = Views.WEATHER;
              window.location.hash = resort.id;
            }}
          >
            <H4
              className={`bp5-heading !m-3 !mt-1 !mb-1 flex-1 truncate`}
            >
              {resort.name}
            </H4>
          </div>
        )
        : (
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
        )}

      {showCurrentConditions && (
        <div
          className={`grid grid-cols-4 gap-x-2 w-full muted-bg ${
            currentView.value === Views.LIST ? "!py-1 mt-1" : "pt-2 mt-2"
          }`}
        >
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
      )}

      {showQi && (
        <Pqi
          resort={resort}
          index={resortIndex}
        />
      )}

      {showStatuses && (
        <div className="flex h-[56px]">
          {statuses.map((status: Status) => (
            <Tooltip
              key={status.title}
              content={status.tooltip}
              position="bottom"
              className="flex-1 m-2 mb-1 overflow-hidden"
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
      )}

      {showForecasts && (
        <ForecastTable
          resortId={resort.id}
          dailyForecasts={resort.dailyForecasts!}
          hourlyForecasts={resort.hourlyForecasts!}
          days={days}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      )}
    </Card>
  );
}
