import { ResortDto } from "../../../shared/dtos/weather.dto.ts";

export interface Status {
    intend: "primary" | "success" | "warning" | "danger";
    title: string;
}

export const getStatuses = (resort: ResortDto): Status[] => {
  const statuses: Status[] = [];

  const isAfter12 = new Date().getHours() >= 12;

  const day = resort.dailyForecasts![isAfter12 ? 1 : 0] || null;
  const wind = day!.wind.split(" ")[1]
    ? parseInt(day!.wind.split(" ")[1])
    : null;
  const freshSnow = isAfter12
    ? resort.dailyForecasts![0].freshSnow
    : day!.freshSnow;

  if (!day || !wind || freshSnow === undefined) {
    statuses.push({
      intend: "danger",
      title: "Keine Daten",
    });
    return statuses;
  }

  // LIFTS
  if (!isAfter12) {
    if (resort.liftsOpen === 0) {
      statuses.push({
        intend: "danger",
        title: "Geschlossen",
      });
    }
    if (
      resort.liftsOpen !== 0 && (resort.liftsOpen / resort.liftsTotal < 0.8)
    ) {
      statuses.push({
        intend: "warning",
        title: "Lifte",
      });
    }
  }

  // SNOW
  if (freshSnow > 0 && freshSnow < 10) {
    statuses.push({
      intend: "success",
      title: "Neuschnee",
    });
  }
  if (freshSnow >= 10) {
    statuses.push({
      intend: "success",
      title: "Viel Neuschnee",
    });
  }

  // RAIN
  if (day.tmax < -1 && day.rainRisc > 0.7 && day.freshSnow > 10) {
    statuses.push({
      intend: "danger",
      title: "Schneefall",
    });
  } else if (
    day.tmax < -1 && day.rainRisc > 0.5 && day.freshSnow > 0
  ) {
    statuses.push({
      intend: "warning",
      title: "Schnee",
    });
  } else if (day.tmax < 2 && day.rainRisc > 0.7) {
    statuses.push({
      intend: "danger",
      title: "Schneeregen",
    });
  } else if (day.tmax < 2 && day.rainRisc > 0.5) {
    statuses.push({
      intend: "warning",
      title: "Schneeregen",
    });
  } else if (day.tmax >= 2 && day.rainRisc > 0.7) {
    statuses.push({
      intend: "danger",
      title: "Regen",
    });
  } else if (day.tmax >= 2 && day.rainRisc > 0.5) {
    statuses.push({
      intend: "warning",
      title: "Regen",
    });
  }

  // WIND
  if (wind! > 3 && wind! < 5) {
    statuses.push({
      intend: "warning",
      title: "Wind",
    });
  }
  if (wind! >= 5) {
    statuses.push({
      intend: "danger",
      title: "Wind",
    });
  }

  // SUN
  if (day.sun > 3) {
    statuses.push({
      intend: "success",
      title: "Sonnig",
    });
  }

  // TEMPERATURE
  if (day.tmax < -10) {
    statuses.push({
      intend: "danger",
      title: "Kalt",
    });
  } else if (day.tmax < -5) {
    statuses.push({
      intend: "warning",
      title: "Kalt",
    });
  } else if (day.tmax > 5) {
    statuses.push({
      intend: "danger",
      title: "Warm",
    });
  } else if (day.tmax > 10) {
    statuses.push({
      intend: "danger",
      title: "Warm",
    });
  }

  return statuses;
};
