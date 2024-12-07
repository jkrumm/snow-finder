import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { H3, SegmentedControl, Switch } from "@blueprintjs/core";
import { showForecasts, sorting } from "./weather.tsx";

export const sidebarVisible = signal<boolean>(true);
export const sidebarView = signal<"favorites" | "settings">("favorites");

export function Settings() {
  useSignals();

  return (
      <div className="w-[500px] max-w-screen p-4">
          <H3>Sortieren nach</H3>
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
  );
}
