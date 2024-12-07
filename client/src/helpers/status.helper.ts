import { ResortDto } from "../../../shared/dtos/weather.dto.ts";

export interface Status {
  intend: "primary" | "success" | "warning" | "danger";
  title: string;
}

export const getStatuses = (resort: ResortDto): Status[] => {
  const statuses: Status[] = [];

  const isAfter12 = new Date().getHours() >= 12;

  const day = resort.dailyForecasts![isAfter12 ? 1 : 0] || null;

  if (!day) {
    statuses.push({
      intend: "danger",
      title: "Keine Daten",
    });
    return statuses;
  }

  const windBft = day!.windBft;
  const freshSnow = isAfter12
    ? resort.dailyForecasts![0].freshSnow
    : day!.freshSnow;

  if (!day || !windBft || freshSnow === undefined) {
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
  if (day.tmax < 0 && day.rainRisc > 0.7 && day.freshSnow >= 20) {
    statuses.push({
      intend: "danger",
      title: "Schneefall",
    });
  } else if (
    day.tmax < 0 && day.rainRisc > 0.5 && day.freshSnow >= 15
  ) {
    statuses.push({
      intend: "warning",
      title: "Schnee",
    });
  } else if (day.tmax >= 4 && day.rainRisc > 0.7) {
    statuses.push({
      intend: "danger",
      title: "Regen",
    });
  } else if (day.tmax >= 4 && day.rainRisc > 0.5) {
    statuses.push({
      intend: "warning",
      title: "Regen",
    });
  }

  // WIND
  if (windBft! > 3 && windBft! < 5) {
    statuses.push({
      intend: "warning",
      title: "Wind",
    });
  }
  if (windBft! >= 5) {
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
      title: "Sehr Kalt",
    });
  } else if (day.tmax < -7) {
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
