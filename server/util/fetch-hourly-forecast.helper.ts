import {
  convertCmOrMToNumber,
  convertHoursToNumber,
  convertPercentageToNumber,
  convertTemperatureToNumber,
  fetchPage,
} from "./parser.helper.ts";
import * as cheerio from "cheerio";
import { Forecast } from "../data/weather.ts";
import { DateTime } from "luxon";

export async function fetchHourlyForecast(
  skiAreaUrl: string,
): Promise<Forecast[]> {
  const forecastHourly: Forecast[] = [];

  const html = await fetchPage(
    `https://www.bergfex.at/${skiAreaUrl}/wetter/prognose/#day0`,
  );
  const $ = cheerio.load(html);

  $(".forecast-day-detail").each((day, dayElement) => {
    $(dayElement).find(".interval.fields").each((hour, element) => {
      const date = DateTime.now().startOf("day").plus({
        days: day,
        hours: hour * 3 + 1,
      });

      const img =
        ($(element).find(".icon img").attr("src") || "").split("/").pop() ||
        null;
      const tmax = convertTemperatureToNumber(
        $(element).find(".group.offset .tmax").first().text().trim(),
      );
      const tmin = convertTemperatureToNumber(
        $(element).find(".group.offset .tmax").last().text().trim(),
      );
      const snowline = convertCmOrMToNumber(
        $(element).find(".sgrenze").text().trim(),
      );
      const freshSnow = convertCmOrMToNumber(
        $(element).find(".group .nschnee").first().text().trim(),
      );
      const rainRisc = convertPercentageToNumber(
        $(element).find(".rrp").text().trim(),
      );
      const rainAmount = parseFloat(
        $(element).find(".rrr").text().trim().replace("l", ""),
      ) || 0;
      const sun = convertHoursToNumber($(element).find(".sonne").text().trim());
      const wind = $(element).find(".group .ff").first().text().trim();
      const windBft = parseInt(wind.split(" ")[1]);
      const windDirection = wind.split(" ")[0];
      const windSpeed = parseInt(
        $(element).find(".group .ff.ff-kmh").first().text().trim().replace(
          " km/h",
          "",
        ),
      );

      if (hour > 7) {
        return;
      }

      if (!img) {
        throw new Error("Image not found");
      }

      forecastHourly.push({
        date,
        img,
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
    });
  });

  return forecastHourly;
}
