import { favoriteResorts, resorts } from "../components/weather.tsx";
import { PqiDto, ResortDto } from "../../../shared/dtos/weather.dto.ts";

async function fetchPqiData() {
  const favoriteResortsThatNeedPqi = favoriteResorts.value.filter(
    (resort) => resort.dailyForecasts && !resort.dailyForecasts[0].pqi,
  );

  const baseUrl = window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : window.location.origin;

  const pqiPromises = favoriteResortsThatNeedPqi.map((resort: ResortDto) =>
    fetch(
      `${baseUrl}/api/pqi/${resort.id}`,
    ).then((response) => response.json() as Promise<PqiDto>)
  );

  const pqiData = await Promise.all(pqiPromises);

  for (const resort of favoriteResortsThatNeedPqi) {
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
    const matchingResort = favoriteResortsThatNeedPqi.find((r) =>
      r.id === resort.id
    );
    if (matchingResort) {
      return matchingResort;
    }
    return resort;
  });
}

export async function fetchResorts() {
  if (resorts.value.length > 0) return;
  const baseUrl = window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : window.location.origin;
  const response = await fetch(baseUrl + "/api/resorts");
  resorts.value = await response.json();
  await fetchPqiData();
}
