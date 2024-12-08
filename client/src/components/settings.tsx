import { useSignals } from "@preact/signals-react/runtime";
import { H3, SegmentedControl, Switch } from "@blueprintjs/core";
import {showForecasts, sorting} from "../containers/weather.tsx";

export function Settings() {
  useSignals();

  return (
    <div className="w-[500px] max-w-screen p-2 sm:p-4">
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
