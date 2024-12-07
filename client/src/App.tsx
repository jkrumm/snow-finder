import { useEffect } from "react";
import "./App.scss";
import { ResortDto } from "../../shared/dtos/weather.dto.ts";
import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ForecastTable } from "./components/forecast-table.tsx";
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  H1,
    H2,
  H3,
  Icon,
  Menu,
  MenuItem,
  SegmentedControl,
  Switch,
  Tab,
  Tabs,
  TabsExpander,
} from "@blueprintjs/core";

const resorts = signal<ResortDto[]>([]);

const favorites = signal<string[]>([
  "fieberbrunn",
  "kitzbuehel-kirchberg",
  "axamer-lizum",
  "hochfuegen",
  "westendorf",
  "stanton-stchristoph",
]);

const showForecasts = signal<boolean>(true);

const sorting = signal<"freshSnow" | "mountainHeight" | "tmax" | "sun">(
  "freshSnow",
);

const favoriteResorts = computed<ResortDto[]>(() => {
  return resorts.value.filter((resort) => favorites.value.includes(resort.id))
    .sort(
      (a: ResortDto, b: ResortDto) => {
        if (sorting.value === "freshSnow") {
          return b.freshSnow - a.freshSnow;
        }
        if (sorting.value === "mountainHeight") {
          return b.mountainHeight - a.mountainHeight;
        }
        if (sorting.value === "tmax") {
          return b.dailyForecasts![0].tmax - a.dailyForecasts![0].tmax;
        }
        if (sorting.value === "sun") {
          return b.dailyForecasts![0].sun - a.dailyForecasts![0].sun;
        }
        return 0;
      },
    );
});

const sidebarVisible = signal<boolean>(true);
const sidebarView = signal<"favorites" | "settings">("favorites");

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
  }, [favorites.value]);

  return (
    <div className="bp5-dark flex flex-col md:flex-row">
      {sidebarVisible.value && (
        <div className="md:w-1/3 lg:w-1/4 px-4 py-2">
          <div>
            <Tabs
              id="sidebar"
              large
              selectedTabId={sidebarView.value}
              onChange={(e) => {
                sidebarView.value = e as "favorites" | "settings";
              }}
            >
              <Tab
                id="favorites"
                icon="star"
                title="Favoriten"
                panel={
                  <div>
                    <H3>Favoriten</H3>
                    <Menu className="!mb-3">
                      {favoriteResorts.value.map((resort) => (
                        <MenuItem
                          key={resort.id}
                          text={resort.name}
                          labelElement={<Icon icon="cross" />}
                          onClick={() => {
                            favorites.value = favorites.value.filter((id) =>
                              id !== resort.id
                            );
                          }}
                        />
                      ))}
                    </Menu>
                    <Menu>
                      {resorts.value.filter((resort) =>
                        !favorites.value.includes(resort.id)
                      ).sort(
                        (a, b) => a.name.localeCompare(b.name),
                      )
                        .map((resort) => (
                          <MenuItem
                            key={resort.id}
                            text={resort.name}
                            labelElement={<Icon icon="plus" />}
                            onClick={() => {
                              favorites.value = [...favorites.value, resort.id];
                            }}
                          />
                        ))}
                    </Menu>
                  </div>
                }
              />
              <Tab
                id="settings"
                icon="cog"
                title="Einstellungen"
                panel={
                  <div>
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
                      checked={showForecasts.value}
                      onChange={() => {
                        showForecasts.value = !showForecasts.value;
                      }}
                      label="Vorhersage anzeigen"
                    />
                  </div>
                }
              />
            </Tabs>
          </div>
        </div>
      )}
      <div className={`flex-1 p-4 ${sidebarVisible && "md:pl-0"} lg:max-h-screen lg:overflow-y-scroll`}>
        <div className="flex justify-between">
          <H1>Skigebiete</H1>
          <div
            className="flex cursor-pointer"
            onClick={() => {
              sidebarVisible.value = !sidebarVisible.value;
            }}
          >
            <Icon
              size={22}
              icon={sidebarVisible.value ? "menu-closed" : "menu-open"}
            />
            <span className="mt-[3px] ml-2">Einstellungen</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
          {favoriteResorts.value.map((resort) => {
            return (
              <Card
                key={resort.id}
                elevation={Elevation.THREE}
                className="!p-0"
              >
                <ButtonGroup fill>
                  <Button
                    icon="star"
                    onClick={() => {
                      favorites.value = favorites.value.filter(
                        (id) => id !== resort.id,
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
                    disabled
                  >
                    Details
                  </Button>
                </ButtonGroup>
                <div className="m-4">
                  <H3 className="bp5-heading !mb-0 truncate max-w-full">
                    {resort.name}
                  </H3>
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

                {showForecasts.value && (
                  <ForecastTable
                    resortId={resort.id}
                    dailyForecasts={resort.dailyForecasts!}
                    hourlyForecasts={resort.hourlyForecasts!}
                  />
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
