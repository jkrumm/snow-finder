import { useEffect } from "react";
import "./App.scss";
import { ResortListDto } from "../../shared/dtos/weather.dto.ts";
import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import {ForecastTable} from "./components/forecast-table.tsx";
import { MultiSelect } from "@blueprintjs/select";
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  H2,
  H3,
  MenuItem,
  SegmentedControl,
  Switch,
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

const favoriteResorts = computed<ResortListDto[]>(() => {
  return resorts.value.filter((resort) => favorites.value.includes(resort.id));
});

const compareResortIds = signal<string[]>([]);

const showDailyForecasts = signal<boolean>(true);

const sorting = signal<"freshSnow" | "mountainHeight" | "tmax" | "sun">(
  "freshSnow",
);

const Statistic = ({ label, value, prepend, append, className }: {
  label: string;
  value: string | number;
  prepend?: string;
  append?: string;
  className?: string;
}) => (
  <div className={`text-center ${className}`}>
    <span className="block pb-1 text-[#abb3bf] uppercase">{label}</span>
    <span className="text-lg font-bold">{prepend}{value}{append}</span>
  </div>
);

function App() {
  useSignals();

  const fetchResorts = async () => {
    if (resorts.value.length > 0) return;
    const response = await fetch("http://localhost:8000/api/resorts");
    resorts.value = await response.json();
  };

  useEffect(() => {
    fetchResorts().then();
    compareResortIds.value = favorites.value;
  }, [favorites.value]);

  useEffect(() => {
    if (sorting.value === "freshSnow") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) =>
        a.freshSnow - b.freshSnow
      );
    } else if (sorting.value === "mountainHeight") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) =>
        b.mountainHeight - a.mountainHeight
      );
    } else if (sorting.value === "tmax") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) =>
        b.dailyForecasts![0].tmax - a.dailyForecasts![0].tmax
      );
    } else if (sorting.value === "sun") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) =>
        a.dailyForecasts![0].sun - b.dailyForecasts![0].sun
      );
    }
  }, [sorting.value, favorites.value]);

  return (
    <div className="bp5-dark flex flex-col md:flex-row min-h-screen min-w-screen">
      <div className="flex-none w-full md:max-w-xs md:w-1/4 p-4">
        <H2>Einstellungen</H2>
        <H3>Favoriten</H3>
        <MultiSelect
          items={[...resorts.value].filter((resort) =>
            !favorites.value.includes(resort.id)
          )}
          selectedItems={favoriteResorts.value}
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
        <H3 className="!mt-6">Vergleichen</H3>
        {favoriteResorts.value.map((resort) => (
          <Switch
            key={resort.id}
            checked={compareResortIds.value.includes(resort.id)}
            onChange={() => {
              compareResortIds.value =
                compareResortIds.value.includes(resort.id)
                  ? compareResortIds.value.filter((i) => i !== resort.id)
                  : [...compareResortIds.value, resort.id];
            }}
            label={resort.name}
          />
        ))}
        <H3 className="!mt-6">Sortieren nach</H3>
        <SegmentedControl
          onValueChange={(e) => {
            sorting.value = e as
              | "freshSnow"
              | "mountainHeight"
              | "tmax"
              | "sun";
          }}
          options={[
            {
              label: "Neuschnee",
              value: "freshSnow",
            },
            {
              label: "Berg",
              value: "mountainHeight",
            },
            {
              label: "Temperatur",
              value: "tmax",
            },
            {
              label: "Sonne",
              value: "sun",
            },
          ]}
          defaultValue="freshSnow"
        />
        <H3 className="!mt-6">Andere Einstellungen</H3>
        <Switch
          checked={showDailyForecasts.value}
          onChange={() => {
            showDailyForecasts.value = !showDailyForecasts.value;
          }}
          label="Vorhersage anzeigen"
        />
      </div>
      <div className="flex-1 p-4 max-h-screen overflow-y-scroll">
        <H2 className="bp5-heading">Skigebiete</H2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
          {favoriteResorts.value.filter(
            (resort) => compareResortIds.value.includes(resort.id),
          ).map((resort) => (
            <Card key={resort.id} elevation={Elevation.THREE} className="!p-0">
              <ButtonGroup fill>
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
              <div className="p-4">
              <H3 className="bp5-heading !mb-0 truncate max-w-full">{resort.name}</H3>
              </div>
              <div className="grid grid-cols-4 grid-rows-2 gap-x-2 gap-y-5 w-full muted-bg">
                <Statistic
                    label="Tal"
                    value={resort.valleyHeight}
                    append=" cm"
                />
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
                    label="Lifte"
                    value={`${resort.liftsOpen}/${resort.liftsTotal}`}
                />
              <Statistic
                  label="Temperatur"
                  value={`${resort.dailyForecasts![0].tmax}° / ${
                    resort.dailyForecasts![0].tmin
                  }°`}
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

              <ForecastTable forecasts={resort.dailyForecasts!} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
