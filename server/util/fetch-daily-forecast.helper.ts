import {
  convertCmToNumber,
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
}

export async function fetchDailyForecast(
  resortId: string,
): Promise<{ dailyForecasts: Forecast[]; resortDetails: ResortDetails }> {
  const html = await fetchPage(
    `https://www.bergfex.at/${resortId}/wetter/berg/`,
  );
  const $ = cheerio.load(html);

  const dailyForecasts: Forecast[] = [];

  const geoPosition = $("meta[name='geoposition']").attr("content");
  const lat = geoPosition ? parseFloat(geoPosition.split(",")[0]) : 0;
  const long = geoPosition ? parseFloat(geoPosition.split(",")[1]) : 0;

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
      const freshSnow = convertCmToNumber(
        $(element).find(".nschnee").text().trim(),
      );
      const rainRisc = convertPercentageToNumber(
        $(element).find(".rrp").text().trim(),
      );
      const sun = convertHoursToNumber($(element).find(".sonne").text().trim());
      const wind = $(element).find(".ff").text().trim();

        dailyForecasts.push({
        date,
        img, // vcdn.bergfex.at/images/wetter/bergfex-shaded/b3s2.png
        tmax,
        tmin,
        freshSnow,
        rainRisc,
        sun,
        wind,
      });
    },
  );

  return { dailyForecasts, resortDetails: { lat, long } };
}
