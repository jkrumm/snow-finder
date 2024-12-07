import { useEffect, useState } from "react";
import { Forecast } from "../../../server/data/weather.ts";
import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";

import { DateTime } from "luxon";

const formatDate = (date: number, today: number): string => {
  const formattedDate = new Intl.DateTimeFormat("de-DE", { weekday: "long" })
    .format(date);
  const dayDifference = Math.floor((date - today) / (1000 * 60 * 60 * 24));

  if (dayDifference === -1) return "Heute";
  if (dayDifference === 0) return "Morgen";

  return formattedDate;
};

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
  },
) => {
  const [selectedView, setSelectedView] = useState<"daily" | number>("daily");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>(props.dailyForecasts);

  const today = new Date();
  const todayDate = DateTime.fromJSDate(today).startOf("day");

  useEffect(() => {
    if (selectedView === "daily") {
      setForecasts(props.dailyForecasts);
      return;
    }

    setForecasts([...props.hourlyForecasts].filter((forecast) => {
      const date = DateTime.fromISO(forecast.date).startOf("day");
      const selectedDate = todayDate.plus({ days: selectedView });
      return date.equals(selectedDate);
    }));
  }, [selectedView]);

  useEffect(() => {
    setSelectedDate(
      new Date(forecasts[0].date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      }),
    );
  }, [forecasts]);

  return (
    <>
      {selectedView !== "daily" && (
        <ButtonGroup className="mt-4" fill>
          <Button
            onClick={() => {
              setSelectedView("daily");
            }}
          >
            Zurück zu Täglich
          </Button>
          <Button
            onClick={() => {
              setSelectedView(selectedView - 1);
            }}
            disabled={selectedView === 0}
          >
            Vorheriger Tag
          </Button>
          <Button
            onClick={() => {
              setSelectedView(selectedView + 1);
            }}
            disabled={selectedView === 5}
          >
            Nächster Tag
          </Button>
        </ButtonGroup>
      )}
      <div className="flex flex-col mt-4 mb-[1px] mr-[1px]">
        <div className="grid grid-cols-[1fr_70px_50px_60px_50px] border-b pb-2 border-[#404854] text-center font-bold">
          <div className="text-left pl-2">
            {selectedView === "daily"
              ? "9 Tage Vorhersage"
              : `${selectedDate} Vorhersage`}
          </div>
          <div>Temp</div>
          <div>Wind</div>
          <div>Schnee</div>
          <div>Sonne</div>
        </div>
        {forecasts.map((forecast: Forecast, index: number) => {
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
          if (forecast.sun > 2) {
            sunBgColor = `bg-yellow-low`;
          }
          if (forecast.sun > 4) {
            sunBgColor = `bg-yellow-medium`;
          }
          if (forecast.sun > 6) {
            sunBgColor = `bg-yellow-high`;
          }
          if (forecast.sun > 9) {
            sunBgColor = `bg-yellow-extreme`;
          }

          const windSpeed = parseInt(forecast.wind.split(" ")[1]);
          const windDirection = forecast.wind.split(" ")[0];

          let windBgColor = `bg-[#252a31]`;
          let windDescription = "< 1km/h";
          if (windSpeed > 0) {
            windDescription = "1-5km/h";
          }
          if (windSpeed > 1) {
            windDescription = "6-11km/h";
          }
          if (windSpeed > 2) {
            windBgColor = `bg-red-low`;
            windDescription = "12-19km/h";
          }
          if (windSpeed > 3) {
            windBgColor = `bg-red-medium`;
            windDescription = "20-28km/h";
          }
          if (windSpeed > 4) {
            windBgColor = `bg-red-high`;
            windDescription = "29-38km/h";
          }
          if (windSpeed > 5) {
            windBgColor = `bg-red-extreme`;
            windDescription = "> 39km/h";
          }

          return (
            <div
              key={forecast.date}
              className={`grid grid-cols-[1fr_40px_70px_50px_60px_50px] ${
                index + 1 !== forecasts.length && "border-b"
              } border-[#404854] ${index < 6 && "cursor-pointer"}`}
              onClick={() => {
                if (index > 5) return;
                setSelectedView(index);
              }}
            >
              <div className="flex flex-col justify-center py-2 pl-2">
                <span className="truncate">{dateLabel}</span>
                <span className="text-sm muted">
                  {new Date(forecast.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-center items-center py-2">
                <img
                  src={`https://vcdn.bergfex.at/images/wetter/bergfex-shaded/${forecast.img}`}
                  alt={`weather-img-${forecast.date}`}
                  width="40"
                />
              </div>
              <div className="flex justify-center items-center py-2">
                <span>{`${forecast.tmax}°/${forecast.tmin}°`}</span>
              </div>
              <Tooltip content={windDescription} position="top">
                <div
                  className={`flex justify-center flex-col items-center py-2 bg-opacity-20 ${windBgColor}`}
                >
                  <span>{windSpeed}</span>
                  <span className="text-sm muted truncate">{windDirection}</span>
                </div>
              </Tooltip>
              <div
                className={`flex justify-center flex-col items-center py-2 bg-opacity-20 ${snowColor}`}
              >
                <span>{`${forecast.freshSnow ?? 0} cm`}</span>
                <span className="text-sm muted">
                  {`${(forecast.rainRisc * 100).toFixed(0)} %`}
                </span>
              </div>
              <div
                className={`flex justify-center items-center py-2  bg-opacity-20 ${sunBgColor}`}
              >
                <span>{`${forecast.sun} h`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
