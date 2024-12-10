import { PqiDto, ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { favoriteResorts, resorts } from "../state/resorts.state.ts";

let baseUrl: string;

function getBaseUrl(): string {
  if (baseUrl) return baseUrl;
  baseUrl = window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "https://snow-finder.jkrumm.dev";
  return baseUrl;
}

async function fetchPqiData() {
  const pqiPromises = favoriteResorts.value.map((resort: ResortDto) =>
    fetch(
      `${getBaseUrl()}/api/pqi/${resort.id}`,
    ).then((response) => response.json() as Promise<PqiDto>)
  );

  const pqiData = await Promise.all(pqiPromises);

  for (const resort of favoriteResorts.value) {
    const matchingPqi = pqiData.find((pqi) => pqi.id === resort.id);
    if (!matchingPqi) {
      return;
    }
    for (const forecast of resort.dailyForecasts!) {
      const pqiIndex = matchingPqi.powderQualityIndex.find(
        (pqi) => pqi.date.substring(0, 10) === forecast.date.substring(0, 10),
      );
      if (pqiIndex) {
        forecast.pqi = pqiIndex.powderQualityIndex;
        forecast.pqiDescription = pqiIndex.description;
      }
    }
  }

  resorts.value = resorts.value.map((resort) => {
    const matchingResort = favoriteResorts.value.find((r) =>
      r.id === resort.id
    );
    if (matchingResort) {
      return matchingResort;
    }
    return resort;
  });
}

export async function fetchResorts() {
  const response = await fetch(getBaseUrl() + "/api/resorts");
  resorts.value = await response.json();
  await fetchPqiData();
}

export async function fetchRecentMap(map: string) {
  const response = await fetch(
    `${getBaseUrl()}/api/recent-map/${map}`,
  );
  return await response.text();
}
