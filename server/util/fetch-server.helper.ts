import { fetchResorts } from "./fetch-resorts.helper.ts";
import { Resort } from "../data/weather.ts";
import { fetchDailyForecast } from "./fetch-daily-forecast.helper.ts";
import { fetchHourlyForecast } from "./fetch-hourly-forecast.helper.ts";

export async function getRecentResorts(): Promise<Resort[]> {
  const fetchedResorts = await fetchResorts();

  const resorts: Resort[] = [];

  for (const fetchedResort of fetchedResorts) {
    const { dailyForecasts, resortDetails } = await fetchDailyForecast(
      fetchedResort.id,
    );

    const hourlyForecasts = await fetchHourlyForecast(fetchedResort.id);

    // Calculate average windSpeed and snowline for each day
    for (const dailyForecast of dailyForecasts) {
      const hourlyForecastsForDay = hourlyForecasts.filter((hourlyForecast) =>
        hourlyForecast.date.hasSame(dailyForecast.date, "day")
      );

      const windSpeeds = hourlyForecastsForDay.map((hourlyForecast) =>
        hourlyForecast.windSpeed
      );
      dailyForecast.windSpeed = Math.round(
        windSpeeds.reduce((a, b) => a + b, 0) /
          windSpeeds.length,
      ) || 0;

      const snowlines = hourlyForecastsForDay.map((hourlyForecast) =>
        hourlyForecast.snowline
      );
      dailyForecast.snowline = Math.round(
        snowlines.reduce((a, b) => a + b, 0) /
          snowlines.length,
      ) || 0;
    }

    resorts.push(
      new Resort({
        ...fetchedResort,
        ...resortDetails,
        dailyForecasts,
        hourlyForecasts,
      }),
    );
  }

  return resorts;
}
