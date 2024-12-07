import { useEffect } from "react";
import "./App.css";
import { ResortListDto } from "../../shared/dtos/weather.dto.ts";
import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

const resorts = signal<ResortListDto[]>([]);

const favorites = signal<string[]>([
  "fieberbrunn",
  "kitzbuehel-kirchberg",
  "axamer-lizum",
  "hochfuegen",
]);

const resortIds = computed<string[]>(() => {
  return resorts.value.map((resort) => resort.id);
});

const favoriteResorts = computed<ResortListDto[]>(() => {
  return resorts.value.filter((resort) => favorites.value.includes(resort.id));
});

function App() {
  useSignals();

  const fetchResorts = async () => {
    if (resorts.value.length > 0) return;
    const response = await fetch("http://localhost:8000/api/resorts");
    resorts.value = (await response.json()) as ResortListDto[];
  };

  useEffect(() => {
    fetchResorts().then();
  }, [favorites]);

  return (
    <>
      <h1>Resorts</h1>
      <div>
        {favoriteResorts.value.map((resort: ResortListDto) => (
          <div key={resort.id}>{resort.id}</div>
        ))}
      </div>
      <br />
      <br />
      <div>
        {resortIds.value.map((id) => <div key={id}>{id}</div>)}
      </div>
    </>
  );
}

export default App;
