import { DateTime } from "luxon";
import { isElapsed } from "../util/date.helper.ts";
import { ResortDto } from "../../shared/dtos/weather.dto.ts";
import { getRecentResorts } from "../util/fetch.helper.ts";

export class Forecast {
  date: DateTime;
  img: string;
  tmax: number;
  tmin: number;
  snowline: number;
  freshSnow: number;
  rainRisc: number;
  rainAmount: number;
  sun: number;
  windBft: number;
  windDirection: string;
  windSpeed: number;

  constructor(
    data: {
      date: string;
      img: string;
      tmax: number;
      tmin: number;
      snowline: number;
      freshSnow: number;
      rainRisc: number;
      rainAmount: number;
      sun: number;
      windBft: number;
      windDirection: string;
      windSpeed: number;
    },
  ) {
    this.date = data.date;
    this.img = data.img;
    this.tmax = data.tmax;
    this.tmin = data.tmin;
    this.snowline = data.snowline;
    this.freshSnow = data.freshSnow;
    this.rainAmount = data.rainAmount;
    this.rainRisc = data.rainRisc;
    this.sun = data.sun;
    this.windBft = data.windBft;
    this.windDirection = data.windDirection;
    this.windSpeed = data.windSpeed;
  }
}

export class Resort {
  id: string;
  name: string;
  long: number;
  lat: number;
  resortValleyHeight: number;
  resortMountainHeight: number;
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: number;
  liftsTotal: number;
  date: DateTime;
  lastUpdated: DateTime;
  dailyForecasts: Forecast[];
  hourlyForecasts: Forecast[];

  constructor(
    data: {
      id: string;
      name: string;
      long: number;
      lat: number;
      resortValleyHeight: number;
      resortMountainHeight: number;
      valleyHeight: number;
      mountainHeight: number;
      freshSnow: number;
      liftsOpen: number;
      liftsTotal: number;
      date: DateTime;
      dailyForecasts: Forecast[];
      hourlyForecasts: Forecast[];
    },
  ) {
    this.id = data.id;
    this.name = data.name;
    this.long = data.long;
    this.lat = data.lat;
    this.resortValleyHeight = data.resortValleyHeight;
    this.resortMountainHeight = data.resortMountainHeight;
    this.valleyHeight = data.valleyHeight;
    this.mountainHeight = data.mountainHeight;
    this.freshSnow = data.freshSnow;
    this.liftsOpen = data.liftsOpen;
    this.liftsTotal = data.liftsTotal;
    this.date = data.date;
    this.lastUpdated = DateTime.now();
    this.dailyForecasts = data.dailyForecasts;
    this.hourlyForecasts = data.hourlyForecasts;
  }

  toResortDto(): ResortDto {
    return {
      id: this.id,
      name: this.name,
      long: this.long,
      lat: this.lat,
      resortValleyHeight: this.resortValleyHeight,
      resortMountainHeight: this.resortMountainHeight,
      valleyHeight: this.valleyHeight,
      mountainHeight: this.mountainHeight,
      freshSnow: this.freshSnow,
      liftsOpen: this.liftsOpen,
      liftsTotal: this.liftsTotal,
      dailyForecasts: this.dailyForecasts,
      hourlyForecasts: this.hourlyForecasts,
    };
  }
}

export class Weather {
  resorts: Resort[];
  lastUpdated: DateTime;

  private constructor(resorts: Resort[]) {
    this.resorts = resorts;
    this.lastUpdated = DateTime.now();
  }

  static async init(): Promise<Weather> {
    const resorts = await getRecentResorts();
    return new Weather(resorts);
  }

  async updateResorts(): Promise<void> {
    // if (isElapsed(this.lastUpdated, 10)) {
    this.lastUpdated = DateTime.now();
    this.resorts = await getRecentResorts();
    // }
  }

  getResortDtos = async (): Promise<ResortDto[]> => {
    await this.updateResorts();
    const resortDtos: ResortDto[] = [];
    for (const resort of this.resorts) {
      resortDtos.push(resort.toResortDto());
    }
    return resortDtos;
  };

  getResort = async (id: string): Promise<ResortDto> => {
    const resort = this.resorts.find((resort) => resort.id === id);

    if (!resort) {
      await this.updateResorts();
    }

    if (!resort) {
      throw new Error("Resort not found after update");
    }

    return resort.toResortDto();
  };
}
