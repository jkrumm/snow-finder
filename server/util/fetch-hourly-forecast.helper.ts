import {
  convertCmToNumber,
  convertHoursToNumber,
  convertPercentageToNumber,
  convertTemperatureToNumber,
  fetchPage,
} from "./parser.helper.ts";
import * as cheerio from "cheerio";
import { Forecast } from "../data/weather.ts";
import { DateTime } from "luxon";

export const fetchHourlyForecast = async (
  skiAreaUrl: string,
): Promise<Forecast[]> => {
  const forecastHourly: Forecast[] = [];

  for (let day = 0; day <= 5; day++) {
    const html = await fetchPage(
      `https://www.bergfex.at/${skiAreaUrl}/wetter/prognose/#day${day}`,
    );
    const $ = cheerio.load(html);

    $(".interval.fields").each((hour, element) => {
      // const date = $(element).find(".time.offset").text().trim();
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
      const freshSnow = convertCmToNumber(
        $(element).find(".group .nschnee").first().text().trim(),
      );
      const rainRisc = convertPercentageToNumber(
        $(element).find(".rrp").text().trim(),
      );
      const sun = convertHoursToNumber($(element).find(".sonne").text().trim());
      const wind = $(element).find(".group .ff").first().text().trim();

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
        freshSnow,
        rainRisc,
        sun,
        wind,
      });
    });
  }

  return forecastHourly;
};
