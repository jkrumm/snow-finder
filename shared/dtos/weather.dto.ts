import { PowderQualityIndex } from "../../server/util/ai-powder-quality.helper.ts";

// export const RegionsAustria = {
//     TIROL: "tirol",
//     SALZBURG: "salzburg",
//     VORARLBERG: "vorarlberg",
//     KAERNTEN: "kaernten",
//     STEIERMARK: "steiermark",
// };

// export const RegionsItaly = {
//     TRENTINO: "trentino",
//     SUEDTIROL: "suedtirol",
//     LOMBARDEI: "lombardei",
//     PIEMONT: "piemont",
//     AOSTATAL: "aostatal",
//     VENETIEN: "venetien",
// };

export const Regions = {
  TIROL: "tirol",
  SALZBURG: "salzburg",
  VORARLBERG: "vorarlberg",
} as const;

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
  // Powder Quality Index
  pqi?: number;
  pqiDescription?: string;
}

export interface ResortDto {
  id: string;
  name: string;
  region: (typeof Regions)[keyof typeof Regions];
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

export interface PqiDto {
  id: string;
  date: string;
  powderQualityIndex: PowderQualityIndex[];
}
