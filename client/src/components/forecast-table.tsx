// Utility function to format dates
import { Forecast } from "../../../server/data/weather.ts";

const formatDate = (date: number, today: number): string => {
  const formattedDate = new Intl.DateTimeFormat("de-DE", { weekday: "long" })
    .format(date);
  const dayDifference = Math.floor((date - today) / (1000 * 60 * 60 * 24));

  if (dayDifference === -1) return "Heute";
  if (dayDifference === 0) return "Morgen";

  return formattedDate;
};

export const ForecastTable = ({ forecasts }: { forecasts: Forecast[] }) => {
  const today = new Date();

  return (
    <div className="flex flex-col mt-4 mb-[1px] mr-[1px]">
      <div className="grid grid-cols-[1fr_40px_60px_50px_60px_50px] border-b pb-2 border-[#404854] text-center font-bold">
        <div></div>
        <div></div>
        <div>Temp</div>
        <div>Wind</div>
        <div>Schnee</div>
        <div>Sonne</div>
      </div>
      {forecasts.map((forecast, index) => {
        const dateObj = new Date(forecast.date);
        const dateLabel = formatDate(dateObj.getTime(), today.getTime());
        const dateDisplay = dateObj.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
        });

        let snowColor: string = "bg-[#252a31]";
        if (forecast.freshSnow > 4) {
          snowColor = "bg-blue-low";
        }
        if (forecast.freshSnow > 9) {
          snowColor = "bg-blue-medium";
        }
        if (forecast.freshSnow > 14) {
          snowColor = "bg-blue-high";
        }
        if (forecast.freshSnow > 19) {
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

        const windBgColor = `bg-[#252a31]`;

        return (
          <div
            key={forecast.date}
            className={`grid grid-cols-[1fr_40px_60px_50px_60px_50px] ${
              index + 1 !== forecasts.length && "border-b"
            } border-[#404854]`}
          >
            <div className="flex flex-col justify-center py-2 pl-2">
              <span className="truncate">{dateLabel}</span>
              <span className="text-sm muted">{dateDisplay}</span>
            </div>
            <div className="flex justify-center items-center py-2">
              <img
                src={`https://vcdn.bergfex.at/images/wetter/bergfex-shaded/${forecast.img}`}
                alt={`weather-img-${forecast.date}`}
                width="30"
              />
            </div>
            <div className="flex justify-center items-center py-2">
              <span>{`${forecast.tmax}°/${forecast.tmin}°`}</span>
            </div>
            <div
              className={`flex justify-center items-center py-2 bg-opacity-20 ${windBgColor}`}
            >
              <span>{forecast.wind}</span>
            </div>
            <div
              className={`flex justify-center flex-col items-center py-2  bg-opacity-20 ${snowColor}`}
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
  );
};
