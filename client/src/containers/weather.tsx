import { useEffect } from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { favoriteResorts } from "../state/resorts.state.ts";
import { Detail } from "../components/detail.tsx";
import {
  Button,
  ButtonGroup,
  FormGroup,
  Popover,
  Radio,
  RadioGroup,
  Switch,
    RangeSlider,
} from "@blueprintjs/core";
import { currentView, Views } from "../state/navigation.state.ts";
import {
    showCurrentConditions, showForecasts,
    showQi,
    showStatuses,
    sorting,
    Sortings, weatherDayRange,
} from "../state/settings.state.ts";

export function Weather() {
  useSignals();

  return (
    <div>
      <ButtonGroup fill className="!border-t-0">
        <Button
          // large
          icon="menu"
          // rightIcon="arrow-left"
          onClick={() => currentView.value = Views.LIST}
          text="Liste"
        />
        <Popover
          content={
            <div className="pt-3 pb-1 px-4">
              <FormGroup label="Ansicht einstellen" className="!mb-0">
                <Switch
                  checked={showCurrentConditions.value}
                  onChange={() => {
                    showCurrentConditions.value = !showCurrentConditions.value;
                  }}
                  label="Aktuelle Bedingungen anzeigen"
                />
                <Switch
                  checked={showQi.value}
                  onChange={() => {
                    showQi.value = !showQi.value;
                  }}
                  label="Qualitätsindex anzeigen"
                />
                <Switch
                  checked={showStatuses.value}
                  onChange={() => {
                    showStatuses.value = !showStatuses.value;
                  }}
                  label="Status anzeigen"
                />
                <Switch
                    checked={showForecasts.value}
                    onChange={() => {
                      showForecasts.value = !showForecasts.value;
                    }}
                    label="Vorhersage anzeigen"
                />
                  <FormGroup
                      label="Vorhersage Tage anzeigen"
                      className="!mb-1 !mt-5"
                  >
                  <RangeSlider
                      min={1}
                      max={9}
                      stepSize={1}
                      value={[weatherDayRange.value[0] +1, weatherDayRange.value[1] +1]}
                      onChange={(value) => {
                          weatherDayRange.value =
                              [(value as [number, number])[0] - 1, (value as [number, number])[1] - 1];
                      }}
                  />
              </FormGroup>
              </FormGroup>
            </div>
          }
        >
          <Button
            // large
            icon="eye-open"
            // rightIcon="caret-down"
            text="Ansicht"
          />
        </Popover>
        <Popover
          content={
            <div className="pt-3 pb-1 px-4">
              <RadioGroup
                label="Sortierung ändern"
                onChange={(e) => {
                  sorting.value = (e as unknown as {
                    target: { value: (typeof Sortings)[keyof typeof Sortings] };
                  }).target.value;
                }}
                selectedValue={sorting.value}
              >
                <Radio label={Sortings.freshSnow} value={Sortings.freshSnow} />
                <Radio
                  label={Sortings.mountainHeight}
                  value={Sortings.mountainHeight}
                />
                <Radio label={Sortings.tmax} value={Sortings.tmax} />
                <Radio label={Sortings.sun} value={Sortings.sun} />
              </RadioGroup>
            </div>
          }
        >
          <Button
            // large
            icon="sort"
            // rightIcon="caret-down"
            text="Sortierung"
          />
        </Popover>
      </ButtonGroup>
      <div className="w-[1600px] max-w-screen p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {favoriteResorts.value.map((resort) => (
            <Detail key={resort.id} resort={resort} />
          ))}
        </div>
      </div>
    </div>
  );
}