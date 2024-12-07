export interface ForecastDto {
  date: string;
  img: string;
  tmax: number;
  tmin: number;
  freshSnow: number;
  rainRisc: number;
  sun: number;
  wind: string;
}

export interface ResortListDto {
  id: string;
  name: string;
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: number;
  liftsTotal: number;
  date: string;
  lastUpdated: string;
  firstDailyForecast: ForecastDto;
}

export interface ResortDto extends ResortListDto {
  dailyForecastUpdated: string | null;
  dailyForecasts: ForecastDto[] | null;
  hourlyForecastUpdated: string | null;
  hourlyForecasts: ForecastDto[] | null;
}
