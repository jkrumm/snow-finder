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
