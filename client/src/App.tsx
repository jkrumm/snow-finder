import {useEffect} from "react";
import "./App.css";
import {ResortListDto} from "../../shared/dtos/weather.dto.ts";
import {computed, signal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";
import {MultiSelect} from "@blueprintjs/select";
import {Button, ButtonGroup, Card, Elevation, MenuItem, Switch,} from "@blueprintjs/core";

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

const sorting = signal<"freshSnow" | "mountainHeight" | "tmax" | "sun">("freshSnow");

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
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) => a.freshSnow - b.freshSnow);
    } else if (sorting.value === "mountainHeight") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) => b.mountainHeight - a.mountainHeight);
    } else if (sorting.value === "tmax") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) => b.dailyForecasts![0].tmax - a.dailyForecasts![0].tmax);
    } else if (sorting.value === "sun") {
      favoriteResorts.value.sort((a: ResortListDto, b: ResortListDto) => a.dailyForecasts![0].sun - b.dailyForecasts![0].sun);
    }
  }, [sorting.value, favorites.value]);

  return (
    <div className="bp5-dark flex flex-col md:flex-row min-h-screen min-w-screen">
      <div className="flex-none w-full md:max-w-xs md:w-1/4 p-4">
        <h2 className="bp5-heading">Einstellungen</h2>
        <h3 className="bp5-heading">Favoriten</h3>
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
        <h3 className="bp5-heading">Vergleichen</h3>
        {
            favoriteResorts.value.map((resort) => (
                <Switch
                    key={resort.id}
                    checked={compareResortIds.value.includes(resort.id)}
                    onChange={() => {
                        compareResortIds.value = compareResortIds.value.includes(resort.id)
                            ? compareResortIds.value.filter((i) => i !== resort.id)
                            : [...compareResortIds.value, resort.id];
                    }}
                    label={resort.name}
                />))
        }
        <h3 className={"bp5-heading"}>Sortieren nach</h3>
        <ButtonGroup>
          <Button
              active={sorting.value === "freshSnow"}
              onClick={() => sorting.value = "freshSnow"}
          >
            Neuschnee
          </Button>
          <Button
              active={sorting.value === "mountainHeight"}
              onClick={() => sorting.value = "mountainHeight"}
          >
            Berg
          </Button>
          <Button
              active={sorting.value === "tmax"}
              onClick={() => sorting.value = "tmax"}
          >
            Temperatur
          </Button>
          <Button
              active={sorting.value === "sun"}
              onClick={() => sorting.value = "sun"}
          >
            Sonne
          </Button>
        </ButtonGroup>
        <h3 className="bp5-heading">Andere Einstellungen</h3>
        <Switch checked={showDailyForecasts.value} onChange={() => {
            showDailyForecasts.value = !showDailyForecasts.value}} label="Vorhersage anzeigen" />
      </div>
      <div className="flex-1 p-4 max-h-screen overflow-y-scroll">
        <h2 className="bp5-heading">Skigebiete</h2>
        {favoriteResorts.value.filter(
            (resort) => compareResortIds.value.includes(resort.id),
        ).map((resort) => (
          <Card key={resort.id} elevation={Elevation.TWO} className="mb-4">
            <div className="flex justify-between text-center">
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

            {showDailyForecasts.value && <div className="flex justify-evenly pt-8">
              {resort.dailyForecasts!.map((forecast) => (
                <div key={forecast.date}>
                  <h4 className="bp5-heading text-center pb-3">
                    {new Intl.DateTimeFormat("de-DE", { weekday: "long" })
                      .format(new Date(forecast.date))}
                  </h4>
                  <img
                    src={`https://vcdn.bergfex.at/images/wetter/bergfex-shaded/${forecast.img}`}
                    alt={`weather-img-${resort.id}-${forecast.date}`}
                    width="80"
                    className="mx-auto pb-3"
                  />
                  <Statistic
                    className="pb-3"
                    label="Temperatur"
                    value={`${forecast.tmax} °C / ${forecast.tmin} °C`}
                  />
                  <Statistic
                    className="pb-3"
                    label="Neuschnee"
                    value={forecast.freshSnow ?? 0}
                    append=" cm"
                  />
                  <Statistic
                    className="pb-3"
                    label="Sonne"
                    value={forecast.sun}
                    append=" h"
                  />
                  <Statistic
                      className="pb-3"
                    label="Wind"
                    value={forecast.wind}
                  />
                  <Statistic
                      label="Regenrisiko"
                      value={(forecast.rainRisc) * 100}
                        append=" %"
                  />
                </div>
              ))}
            </div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
