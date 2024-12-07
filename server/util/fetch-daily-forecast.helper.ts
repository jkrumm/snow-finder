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

export const fetchDailyForecast = async (
  resortId: string,
): Promise<Forecast[]> => {
  const html = await fetchPage(
    `https://www.bergfex.at/${resortId}/wetter/berg/`,
  );
  const $ = cheerio.load(html);

  const forecasts: Forecast[] = [];

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

      forecasts.push({
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
  return forecasts;
};
