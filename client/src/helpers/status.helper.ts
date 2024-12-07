import { ResortDto } from "../../../shared/dtos/weather.dto.ts";

export interface Status {
  intend: "primary" | "success" | "warning" | "danger";
  title: string;
  tooltip?: string;
}

export function getStatuses(resort: ResortDto): Status[] {
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
        tooltip: "Alle Lifte geschlossen",
      });
    }
    if (
      resort.liftsOpen !== 0 && (resort.liftsOpen / resort.liftsTotal < 0.7)
    ) {
      statuses.push({
        intend: "warning",
        title: "Lifte",
        tooltip: "Mehr als 30% der Lifte geschlossen",
      });
    }
  }

  // SNOW
  if (freshSnow > 0 && freshSnow < 10) {
    statuses.push({
      intend: "success",
      title: "Neuschnee",
      tooltip: "Bis 10cm Neuschnee",
    });
  }
  if (freshSnow >= 10) {
    statuses.push({
      intend: "success",
      title: "Viel Neuschnee",
      tooltip: "Mehr als 10cm Neuschnee",
    });
  }

  // RAIN
  if (day.tmax < 0 && day.rainRisc > 0.7 && day.freshSnow >= 25) {
    statuses.push({
      intend: "danger",
      title: "Schneefall",
      tooltip: "Über 25cm Schnellfall",
    });
  } else if (
    day.tmax < 0 && day.rainRisc > 0.5 && day.freshSnow >= 17
  ) {
    statuses.push({
      intend: "warning",
      title: "Schneefall",
      tooltip: "Über 17cm Schnellfall",
    });
  } else if (
    day.tmax < 0 && day.rainRisc > 0.3 && day.freshSnow >= 5
  ) {
    statuses.push({
      intend: "success",
      title: "Schneefall",
      tooltip: "Über 5cm Schnellfall",
    });
  } else if (day.tmax >= 4 && day.rainRisc > 0.7) {
    statuses.push({
      intend: "danger",
      title: "Regen",
      tooltip: "Hohe Regenwahrscheinlichkeit",
    });
  } else if (day.tmax >= 4 && day.rainRisc > 0.45) {
    statuses.push({
      intend: "warning",
      title: "Regen",
      tooltip: "Mittlere Regenwahrscheinlichkeit",
    });
  }

  // WIND
  if (windBft! > 3 && windBft! < 5) {
    statuses.push({
      intend: "warning",
      title: "Wind",
      tooltip: "Wind zwischen 29-38km/h",
    });
  }
  if (windBft! >= 5) {
    statuses.push({
      intend: "danger",
      title: "Wind",
      tooltip: "Wind über 38km/h",
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
      tooltip: "Maximale Temperatur unter -10°C",
    });
  } else if (day.tmax < -7) {
    statuses.push({
      intend: "warning",
      title: "Kalt",
      tooltip: "Maximale Temperatur unter -7°C",
    });
  } else if (day.tmax > 5) {
    statuses.push({
      intend: "danger",
      title: "Warm",
      tooltip: "Maximale Temperatur über 5°C",
    });
  } else if (day.tmax > 10) {
    statuses.push({
      intend: "danger",
      title: "Warm",
      tooltip: "Maximale Temperatur über 10°C",
    });
  }

  if (statuses.length === 0) {
    statuses.push({
      intend: "success",
      title: "Alles Gut",
    });
  }

  return statuses;
}
