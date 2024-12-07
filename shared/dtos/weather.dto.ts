export interface ForecastDto {
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
}

export interface ResortDto {
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
  dailyForecasts: ForecastDto[];
  hourlyForecasts: ForecastDto[];
}
