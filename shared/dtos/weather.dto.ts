export interface ForecastDto {
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
  dailyForecasts: ForecastDto[] | null;
}

export interface ResortDto extends ResortListDto {
  hourlyForecasts: ForecastDto[] | null;
}
