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

export interface ResortDto {
  id: string;
  name: string;
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: number;
  liftsTotal: number;
  dailyForecasts: ForecastDto[] | null;
  hourlyForecasts: ForecastDto[] | null;
}
