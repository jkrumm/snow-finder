import { useEffect } from "react";
import "./App.css";
import { ResortListDto } from "../../shared/dtos/weather.dto.ts";
import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { MultiSelect } from "@blueprintjs/select";
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  MenuItem,
} from "@blueprintjs/core";

const resorts = signal<ResortListDto[]>([]);

const favorites = signal<string[]>([
  "fieberbrunn",
  "kitzbuehel-kirchberg",
  "axamer-lizum",
  "hochfuegen",
  "westendorf",
]);

const resortIds = computed<string[]>(() => {
  return resorts.value.map((resort) => resort.id);
});

const favoriteResortIds = computed<ResortListDto[]>(() => {
  return resorts.value.filter((resort) => favorites.value.includes(resort.id));
});

const Statistic = ({ label, value, prepend, append }: {
  label: string;
  value: string | number;
  prepend?: string;
  append?: string;
}) => (
  <div className="text-center">
    <span className="block pb-1 text-[#abb3bf] uppercase">{label}</span>
    <span className="text-lg font-bold">{prepend}{value}{append}</span>
  </div>
);

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
    <div className="bp5-dark flex flex-col md:flex-row min-h-screen min-w-screen">
      <div className="flex-none w-full md:max-w-xs md:w-1/4 p-4">
        <h2 className="bp5-heading">Einstellungen</h2>
        <h3 className="bp5-heading">Favoriten</h3>
        <MultiSelect
          items={[...resorts.value].filter((resort) =>
            !favorites.value.includes(resort.id)
          )}
          selectedItems={favoriteResortIds.value}
          onItemSelect={(resort) => {
            favorites.value = [...favorites.value, resort.id];
          }}
          tagRenderer={(resort) => resort.name}
          itemRenderer={(resort, { handleClick }) => (
            <MenuItem onClick={handleClick} text={resort.name} />
          )}
          onRemove={(resort) => {
            favorites.value = favorites.value.filter((id) => id !== resort.id);
          }}
        />
      </div>
      <div className="flex-1 p-4 max-h-screen overflow-y-scroll">
        <h2 className="bp5-heading">Skigebiete</h2>
        {favoriteResortIds.value.sort(
          (a, b) => b.freshSnow - a.freshSnow,
        ).map((resort) => (
          <Card key={resort.id} elevation={Elevation.TWO} className="mb-4">
            <div className="flex justify-between">
              <h3 className="bp5-heading">{resort.name}</h3>
              <div className="flex">
                <ButtonGroup>
                  <Button
                    icon="star"
                    onClick={() => {
                      favorites.value = favorites.value.filter(
                        (id) =>
                          id !== resort.id,
                      );
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    icon="arrow-right"
                    onClick={() => {
                      window.location.href = `/resort/${resort.id}`;
                    }}
                  >
                    Details
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div className="lg:flex justify-evenly pt-6 w-full">
              <div className="flex justify-evenly w-full pb-6 lg:pb-0 lg:w-1/2">
              <Statistic label="Tal" value={resort.valleyHeight} append=" cm" />
              <Statistic
                label="Berg"
                value={resort.mountainHeight}
                append=" cm"
              />
              <Statistic
                label="Neuschnee"
                value={resort.freshSnow}
                append=" cm"
              />
              <Statistic
                label="Lifte offen"
                value={`${resort.liftsOpen}/${resort.liftsTotal}`}
              />
              </div>
              <div className="flex justify-evenly w-full lg:w-1/2">
              <Statistic
                label="Temperatur"
                value={`${resort.dailyForecasts![0].tmax} °C / ${
                  resort.dailyForecasts![0].tmin
                } °C`}
              />
              <Statistic
                label="Sonne"
                value={resort.dailyForecasts![0].sun}
                append=" h"
              />
              <Statistic
                label="Wind"
                value={resort.dailyForecasts![0].wind}
              />
              <Statistic
                label="Regenrisiko"
                value={(resort.dailyForecasts![0].rainRisc) * 100}
                append=" %"
              />
            </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
