import { useEffect, useState } from "react";
import { Forecast } from "../../../server/data/weather.ts";
import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";

import { DateTime } from "luxon";
import { ForecastDto } from "../../../shared/dtos/weather.dto.ts";
import { translateWeekday } from "../constants/translations.ts";
import { currentView, Views } from "../state/navigation.state.ts";
import { resortSelectedView } from "../state/resorts.state.ts";

function formatDate(date: number, today: number): string {
  const formattedDate = new Intl.DateTimeFormat("de-DE", { weekday: "long" })
    .format(date);
  const dayDifference = Math.floor((date - today) / (1000 * 60 * 60 * 24));

  if (dayDifference === -1) return "Heute";
  if (dayDifference === 0) return "Morgen";

  return formattedDate;
}

const formatTime = (date: number): string => {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const ForecastTable = (
  props: {
    resortId: string;
    dailyForecasts: Forecast[];
    hourlyForecasts: Forecast[];
    days: [number, number];
    selectedView: number | "daily";
  },
) => {
  const selectedView = props.selectedView;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateWeekday, setSelectedDateWeekday] = useState<string | null>(
    null,
  );
  const [forecasts, setForecasts] = useState<Forecast[]>(props.dailyForecasts);

  const today = new Date();
  const todayDate = DateTime.fromJSDate(today).startOf("day");

  useEffect(() => {
    if (selectedView === "daily") {
      setForecasts([...props.dailyForecasts]);
      return;
    }

    setForecasts([...props.hourlyForecasts].filter((forecast) => {
      const date = DateTime.fromISO(forecast.date).startOf("day");
      const selectedDate = todayDate.plus({ days: selectedView });
      setSelectedDateWeekday(selectedDate.toFormat("cccc"));
      return date.equals(selectedDate);
    }));
  }, [selectedView, props.days]);

  useEffect(() => {
    setSelectedDate(
      new Date(forecasts[0].date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      }),
    );
  }, [forecasts]);

  let gridConfigLegend =
    "grid-cols-[1fr_60px_45px_60px_45px_30px] sm:grid-cols-[1fr_70px_70px_60px_50px_50px]";
  let gridConfigContent =
    "grid-cols-[1fr_35px_60px_45px_60px_45px_30px] sm:grid-cols-[1fr_40px_70px_70px_60px_50px_50px]";

  if (selectedView !== "daily") {
    gridConfigLegend =
      "grid-cols-[1fr_60px_45px_60px_45px] sm:grid-cols-[1fr_70px_70px_60px_50px]";
    gridConfigContent =
      "grid-cols-[1fr_35px_60px_45px_60px_45px] sm:grid-cols-[1fr_40px_70px_70px_60px_50px]";
  }

  return (
    <>
      {selectedView !== "daily" && (
        <ButtonGroup className="mb-3 mt-1" fill>
          <Button
            onClick={() => {
              resortSelectedView.value = resortSelectedView.value.map(
                (view) => {
                  if (view.id === props.resortId) {
                    return { id: props.resortId, view: "daily" };
                  }
                  return view;
                },
              );
            }}
          >
            Zurück zu Täglich
          </Button>
          <Button
            onClick={() => {
              resortSelectedView.value = resortSelectedView.value.map(
                (view) => {
                  if (view.id === props.resortId) {
                    return {
                      id: props.resortId,
                      view: selectedView as number - 1,
                    };
                  }
                  return view;
                },
              );
            }}
            className={selectedView === 0
              ? "!border-t-1 !border-b-1 !border-[#404854] !shadow-none"
              : ""}
            disabled={selectedView === 0}
          >
            Vorheriger Tag
          </Button>
          <Button
            onClick={() => {
              resortSelectedView.value = resortSelectedView.value.map(
                (view) => {
                  if (view.id === props.resortId) {
                    return {
                      id: props.resortId,
                      view: selectedView as number + 1,
                    };
                  }
                  return view;
                },
              );
            }}
            className={selectedView >= 4
              ? "border-t-1 border-b-1 !border-[#404854] !shadow-none"
              : ""}
            disabled={selectedView >= 4}
          >
            Nächster Tag
          </Button>
        </ButtonGroup>
      )}
      <div className="flex flex-col mb-[1px] mr-[1px]">
        {currentView.value === Views.WEATHER && (
          <div
            className={`grid border-b pb-2 border-[#404854] text-center font-bold ${gridConfigLegend}`}
          >
            <div className="text-left pl-2">
              {selectedView === "daily"
                ? "9 Tage"
                : `${selectedDate} ${translateWeekday(selectedDateWeekday)}`}
              <span className="hidden sm:inline">{" "}Vorhersage</span>
            </div>
            <div>Temp</div>
            <div>Wind</div>
            <div>Schnee</div>
            <div>Sonne</div>
            {selectedView === "daily" && <div>QI</div>}
          </div>
        )}
        {forecasts.map((forecast: ForecastDto, index: number) => {
          if (
            selectedView === "daily" &&
            (index < props.days[0] || index > props.days[1])
          ) {
            return null;
          }

          const dateObj = new Date(forecast.date);
          const dateLabel = selectedView === "daily"
            ? formatDate(dateObj.getTime(), today.getTime())
            : formatTime(dateObj.getTime());

          const snowSensitivity = selectedView === "daily" ? 1 : 0.3;
          let snowColor: string = "bg-[#252a31]";
          if (forecast.freshSnow > (4 * snowSensitivity)) {
            snowColor = "bg-blue-low";
          }
          if (forecast.freshSnow > (9 * snowSensitivity)) {
            snowColor = "bg-blue-medium";
          }
          if (forecast.freshSnow > (14 * snowSensitivity)) {
            snowColor = "bg-blue-high";
          }
          if (forecast.freshSnow > (19 * snowSensitivity)) {
            snowColor = "bg-blue-extreme";
          }

          let sunBgColor = `bg-[#252a31]`;
          if (forecast.sun >= 3) {
            sunBgColor = `bg-yellow-low`;
          }
          if (forecast.sun >= 4) {
            sunBgColor = `bg-yellow-medium`;
          }
          if (forecast.sun >= 6) {
            sunBgColor = `bg-yellow-high`;
          }
          if (forecast.sun >= 8) {
            sunBgColor = `bg-yellow-extreme`;
          }

          let windBgColor = `bg-[#252a31]`;
          let windDescription = "< 1km/h";
          if (forecast.windBft > 0) {
            windDescription = "1-5km/h";
          }
          if (forecast.windBft > 1) {
            windDescription = "6-11km/h";
          }
          if (forecast.windBft > 2) {
            windBgColor = `bg-red-low`;
            windDescription = "12-19km/h";
          }
          if (forecast.windBft > 3) {
            windBgColor = `bg-red-medium`;
            windDescription = "20-28km/h";
          }
          if (forecast.windBft > 4) {
            windBgColor = `bg-red-high`;
            windDescription = "29-38km/h";
          }
          if (forecast.windBft > 5) {
            windBgColor = `bg-red-extreme`;
            windDescription = "> 39km/h";
          }

          let pqiBgColor = `bg-[#252a31]`;
          if (forecast.pqi && forecast.pqi >= 3) {
            pqiBgColor = `bg-green-low`;
          }
          if (forecast.pqi && forecast.pqi >= 5) {
            pqiBgColor = `bg-green-medium`;
          }
          if (forecast.pqi && forecast.pqi >= 7) {
            pqiBgColor = `bg-green-high`;
          }
          if (forecast.pqi && forecast.pqi >= 9) {
            pqiBgColor = `bg-green-extreme`;
          }

          return (
            <div
              key={forecast.date}
              className={`grid ${gridConfigContent} ${
                index + 1 !== forecasts.length && "border-b"
              } border-[#404854] ${
                (index < 5 && selectedView === "daily") &&
                "cursor-pointer"
              }`}
              onClick={() => {
                if (currentView.value === Views.LIST) {
                  currentView.value = Views.WEATHER;
                  window.location.hash = props.resortId;
                }
                if (index > 5 || selectedView !== "daily") return;
                resortSelectedView.value = resortSelectedView.value.map(
                  (view) => {
                    if (view.id === props.resortId) {
                      return { id: props.resortId, view: index };
                    }
                    return view;
                  },
                );
              }}
            >
              <div className="flex flex-col h-[45px] sm:h-[56px] justify-center py-0 sm:py-2 pl-2">
                <span className="truncate">{dateLabel}</span>
                <span className="text-sm muted">
                  {new Date(forecast.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-center h-[45px] sm:h-[56px] items-center py-0 sm:py-2">
                <img
                  src={`https://vcdn.bergfex.at/images/wetter/bergfex-shaded/${forecast.img}`}
                  alt={`weather-img-${forecast.date}`}
                  width="40"
                />
              </div>
              <div className="flex justify-center h-[45px] sm:h-[56px] flex-col items-center py-0 sm:py-2">
                <span>{`${forecast.tmax}°/${forecast.tmin}°`}</span>
                {!!forecast.snowline &&
                  (!!forecast.freshSnow || !!forecast.rainAmount) &&
                  (
                    <span className="text-sm muted">
                      {`${(forecast.snowline)}m`}
                    </span>
                  )}
              </div>
              <Tooltip
                content={windDescription}
                className={windBgColor}
              >
                <div
                  className={`flex justify-center h-[45px] sm:h-[56px] flex-col items-center py-0 sm:py-2`}
                >
                  <span>
                    {forecast.windBft}
                  </span>
                  <span className="text-sm muted truncate">
                    {forecast.windDirection}
                  </span>
                </div>
              </Tooltip>
              <div
                className={`flex justify-center h-[45px] sm:h-[56px] flex-col items-center py-0 sm:py-2 ${snowColor}`}
              >
                {(!!forecast.freshSnow || !!forecast.rainAmount) && (
                  <>
                    <span>{`${forecast.freshSnow ?? 0}cm`}</span>
                    <span className="text-sm muted">
                      {`${(forecast.rainRisc * 100).toFixed(0)}%`}
                      {!!forecast.rainAmount && (
                        <span className="hidden sm:inline">
                          {forecast.rainAmount}l
                        </span>
                      )}
                    </span>
                  </>
                )}
              </div>
              <div
                className={`flex justify-center h-[45px] sm:h-[56px] items-center py-0 sm:py-2 ${sunBgColor}`}
              >
                <span>{`${forecast.sun} h`}</span>
              </div>
              {selectedView === "daily" && (
                <Tooltip
                  content={forecast.pqiDescription}
                  className={pqiBgColor}
                  popoverClassName="w-[360px] text-center"
                >
                  <div
                    className={`flex flex-col h-[45px] sm:h-[45px] sm:h-[56px] justify-center items-center py-0 sm:py-2`}
                  >
                    <span>{forecast.pqi ?? 0}</span>
                  </div>
                </Tooltip>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
