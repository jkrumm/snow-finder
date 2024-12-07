import { DateTime } from "luxon";
import { fetchResorts } from "../util/fetch-resorts.helper.ts";
import { isElapsed } from "../util/date.helper.ts";
import { fetchDailyForecast } from "../util/fetch-daily-forecast.helper.ts";
import { fetchHourlyForecast } from "../util/fetch-hourly-forecast.helper.ts";
import { ResortDto, ResortListDto } from "../../shared/dtos/weather.dto.ts";

export class Forecast {
  date: DateTime;
  img: string;
  tmax: number;
  tmin: number;
  freshSnow: number;
  rainRisc: number;
  sun: number;
  wind: string;

  constructor(
    data: {
      date: string;
      img: string;
      tmax: number;
      tmin: number;
      freshSnow: number;
      rainRisc: number;
      sun: number;
      wind: string;
    },
  ) {
    this.date = data.date;
    this.img = data.img;
    this.tmax = data.tmax;
    this.tmin = data.tmin;
    this.freshSnow = data.freshSnow;
    this.rainRisc = data.rainRisc;
    this.sun = data.sun;
    this.wind = data.wind;
  }
}

export class Resort {
  readonly id: string;
  readonly name: string;
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: number;
  liftsTotal: number;
  date: DateTime;
  lastUpdated: DateTime;

  dailyForecastUpdated: DateTime | null;
  dailyForecasts: Forecast[] | null;

  hourlyForecastUpdated: DateTime | null;
  hourlyForecasts: Forecast[] | null;

  constructor(
    data: {
      id: string;
      name: string;
      valleyHeight: number;
      mountainHeight: number;
      freshSnow: number;
      liftsOpen: number;
      liftsTotal: number;
      date: DateTime;
    },
  ) {
    this.id = data.id;
    this.name = data.name;
    this.valleyHeight = data.valleyHeight;
    this.mountainHeight = data.mountainHeight;
    this.freshSnow = data.freshSnow;
    this.liftsOpen = data.liftsOpen;
    this.liftsTotal = data.liftsTotal;
    this.date = data.date;
    this.lastUpdated = DateTime.now();
    this.dailyForecastUpdated = null;
    this.dailyForecasts = null;
    this.hourlyForecastUpdated = null;
    this.hourlyForecasts = null;
  }

  update = (resort: {
    valleyHeight: number;
    mountainHeight: number;
    freshSnow: number;
    liftsOpen: number;
    liftsTotal: number;
    date: DateTime;
  }): this => {
    this.valleyHeight = resort.valleyHeight;
    this.mountainHeight = resort.mountainHeight;
    this.freshSnow = resort.freshSnow;
    this.liftsOpen = resort.liftsOpen;
    this.liftsTotal = resort.liftsTotal;
    this.date = resort.date;
    this.lastUpdated = DateTime.now();
    return this;
  };

  updateDailyForecast = async (): Promise<this> => {
    if (
      this.dailyForecastUpdated && !isElapsed(this.dailyForecastUpdated, 30)
    ) {
      return this;
    }
    this.dailyForecasts = await fetchDailyForecast(this.id);
    this.dailyForecastUpdated = DateTime.now();
    return this;
  };

  updateHourlyForecast = async (): Promise<this> => {
    if (
      this.hourlyForecastUpdated && !isElapsed(this.hourlyForecastUpdated, 10)
    ) {
      return this;
    }
    this.hourlyForecasts = await fetchHourlyForecast(this.id);
    this.hourlyForecastUpdated = DateTime.now();
    return this;
  };

  toResortListDto = async (): Promise<ResortListDto> => {
    await this.updateDailyForecast();
    return {
      id: this.id,
      name: this.name,
      valleyHeight: this.valleyHeight,
      mountainHeight: this.mountainHeight,
      freshSnow: this.freshSnow,
      liftsOpen: this.liftsOpen,
      liftsTotal: this.liftsTotal,
      dailyForecasts: this.dailyForecasts,
    };
  };

  toResortDto = async (): Promise<ResortDto> => {
    await this.updateDailyForecast();
    await this.updateHourlyForecast();
    return {
      id: this.id,
      name: this.name,
      valleyHeight: this.valleyHeight,
      mountainHeight: this.mountainHeight,
      freshSnow: this.freshSnow,
      liftsOpen: this.liftsOpen,
      liftsTotal: this.liftsTotal,
      dailyForecasts: this.dailyForecasts,
      hourlyForecasts: this.hourlyForecasts,
    };
  };
}

export class Weather {
  resorts: Resort[];
  lastUpdated: DateTime;

  private constructor(resorts: Resort[]) {
    this.resorts = resorts;
    this.lastUpdated = DateTime.now();
  }

  static async init(): Promise<Weather> {
    const resorts = await fetchResorts();
    return new Weather(resorts);
  }

  updateResorts = async (): Promise<this> => {
    if (isElapsed(this.lastUpdated, 10)) {
      return this;
    }

    const resorts = await fetchResorts();
    resorts.forEach((resort: Resort) => {
      const existingResort = this.resorts.find((r) => r.id === resort.id);
      if (existingResort) {
        existingResort.update(resort);
      } else {
        this.resorts.push(resort);
      }
    });

    // NOTE: Remove resorts that are no longer in the list
    this.resorts = this.resorts.filter((resort) =>
      resorts.find((r: { id: string }) => r.id === resort.id)
    );

    this.lastUpdated = DateTime.now();
    return this;
  };

  getResortListDtos = async (): Promise<ResortListDto[]> => {
    await this.updateResorts();
    const resortListDtos: ResortListDto[] = [];
    for (const resort of this.resorts) {
      resortListDtos.push(await resort.toResortListDto());
    }
    return resortListDtos;
  };

  getResort = async (id: string): Promise<ResortDto> => {
    let resort = this.resorts.find((resort) => resort.id === id);

    if (!resort) {
      await this.updateResorts();
    }

    if (!resort) {
      throw new Error("Resort not found after update");
    }

    if (isElapsed(resort.lastUpdated, 5)) {
      await this.updateResorts();
    }

    resort = this.resorts.find((resort) => resort.id === id);

    if (!resort) {
      throw new Error("Resort not found after elapsed");
    }

    await resort.updateDailyForecast();
    await resort.updateHourlyForecast();

    return resort.toResortDto();
  };
}
