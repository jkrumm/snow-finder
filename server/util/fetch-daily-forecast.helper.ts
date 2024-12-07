import {
  convertCmOrMToNumber,
  convertHoursToNumber,
  convertPercentageToNumber,
  convertTemperatureToNumber,
  fetchPage,
} from "./parser.helper.ts";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";
import { Forecast } from "../data/weather.ts";

export interface ResortDetails {
  lat: number;
  long: number;
  resortValleyHeight: number;
  resortMountainHeight: number;
}

export async function fetchDailyForecast(
  resortId: string,
): Promise<{ dailyForecasts: Forecast[]; resortDetails: ResortDetails }> {
  const html: string = await fetchPage(
    `https://www.bergfex.at/${resortId}/wetter/berg/`,
  );
  const $ = cheerio.load(html);

  const dailyForecasts: Forecast[] = [];

  const geoPosition = $("meta[name='geoposition']").attr("content");
  const lat = geoPosition ? parseFloat(geoPosition.split(",")[0]) : 0;
  const long = geoPosition ? parseFloat(geoPosition.split(",")[1]) : 0;
  const resortValleyHeight = convertCmOrMToNumber(
    $(".tabpanel a").first().find("span").text().trim().replace(/[^\d.]/g, ""),
  );
  const resortMountainHeight = convertCmOrMToNumber(
    $(".tabpanel a.selected span").text().trim().replace(/[^\d.]/g, ""),
  );

  $(".day.clickable.selectable.fields, .day.clickable.trend.fields").each(
    (index, element) => {
      const date = DateTime.now().startOf("day").plus({ days: index });

      const img =
        ($(element).find(".icon img").attr("src") || "").split("/").pop() ||
        null;
      if (!img) {
        throw new Error("Image not found");
      }

      const tmax = convertTemperatureToNumber(
        $(element).find(".tmax").text().trim(),
      );
      const tmin = convertTemperatureToNumber(
        $(element).find(".tmin").text().trim(),
      );
      const snowline = 0; // NOTE: gets calculated when fetching hourly forecast
      const freshSnow = convertCmOrMToNumber(
        $(element).find(".nschnee").text().trim(),
      );
      const rainRisc = convertPercentageToNumber(
        $(element).find(".rrp").text().trim(),
      );
      const rainAmount = parseFloat(
        $(element).find(".rrr").text().trim().replace("l", ""),
      ) || 0;
      const sun = convertHoursToNumber($(element).find(".sonne").text().trim());
      let wind = $(element).find(".ff").text().trim();
        if (!wind.split(" ")[1]) {
        wind = "- 0";
      }
      const windBft = parseInt(wind.split(" ")[1]);
      const windDirection = wind.split(" ")[0];
      const windSpeed = 0; // NOTE: gets calculated when fetching hourly forecast

      dailyForecasts.push({
        date,
        img, // vcdn.bergfex.at/images/wetter/bergfex-shaded/b3s2.png
        tmax,
        tmin,
        snowline,
        freshSnow,
        rainRisc,
        rainAmount,
        sun,
        windBft,
        windDirection,
        windSpeed,
      });
    },
  );

  return {
    dailyForecasts,
    resortDetails: { lat, long, resortValleyHeight, resortMountainHeight },
  };
}
