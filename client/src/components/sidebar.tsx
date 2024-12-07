import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  H1,
  H3,
  Icon,
  Menu,
  MenuItem,
  SegmentedControl,
  Switch,
  Tab,
  Tabs,
} from "@blueprintjs/core";
import {
  favoriteResorts,
  favorites,
  resorts,
  showForecasts,
  sorting,
} from "./resorts.tsx";

export const sidebarVisible = signal<boolean>(true);
export const sidebarView = signal<"favorites" | "settings">("favorites");

export function Sidebar() {
  useSignals();

  return (
    <>
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
    </>
  );
}
