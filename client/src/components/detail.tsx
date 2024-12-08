import { getStatuses, Status } from "../helpers/status.helper.ts";
import { Pqi } from "./pqi.tsx";
import { ForecastTable } from "./forecast-table.tsx";
import { Callout, Card, Elevation, H3, Tooltip } from "@blueprintjs/core";
import { ResortDto } from "../../../shared/dtos/weather.dto.ts";
import {
  showCurrentConditions,
  showForecasts,
  showQi,
  showStatuses,
  weatherDayRange,
} from "../state/settings.state.ts";

function Statistic({ label, value, prepend, append, className }: {
  label: string;
  value: string | number;
  prepend?: string;
  append?: string;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <span className="block pb-1 text-[#abb3bf] uppercase">{label}</span>
      <span className="text-lg font-bold">{prepend}{value}{append}</span>
    </div>
  );
}

export function Detail({ resort }: { resort: ResortDto }) {
  const statuses = getStatuses(resort);
  return (
    <Card
      key={resort.id}
      elevation={Elevation.THREE}
      className="!p-0"
    >
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

      {showCurrentConditions.value && (
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
      )}

      {showQi.value && (
        <Pqi
          resort={resort}
          index={new Date().getHours() >= 12 ? 1 : 0}
        />
      )}

      {showStatuses.value && (
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

      {showForecasts.value && (
        <ForecastTable
          resortId={resort.id}
          dailyForecasts={resort.dailyForecasts!}
          hourlyForecasts={resort.hourlyForecasts!}
          days={weatherDayRange.value}
        />
      )}
    </Card>
  );
}
