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
  RangeSlider,
  Switch,
} from "@blueprintjs/core";
import {
  showCurrentConditionsList,
  showForecastsList,
  showQiList,
  showStatusesList,
  sortingList,
  Sortings,
  weatherDayRangeList,
} from "../state/settings.state.ts";
import { useEffect } from "react";

export function List() {
  useSignals();

  useEffect(() => {
    window.location.hash = "";
  }, []);

  return (
    <div>
      <ButtonGroup fill className="detail-nav">
        <Popover
          content={
            <div className="pt-3 pb-1 px-4">
              <FormGroup label="Ansicht einstellen" className="!mb-0">
                <Switch
                  checked={showCurrentConditionsList.value}
                  onChange={() => {
                    showCurrentConditionsList.value = !showCurrentConditionsList
                      .value;
                  }}
                  label="Aktuelle Bedingungen anzeigen"
                />
                <Switch
                  checked={showQiList.value}
                  onChange={() => {
                    showQiList.value = !showQiList.value;
                  }}
                  label="Qualitätsindex anzeigen"
                />
                <Switch
                  checked={showStatusesList.value}
                  onChange={() => {
                    showStatusesList.value = !showStatusesList.value;
                  }}
                  label="Status anzeigen"
                />
                <Switch
                  checked={showForecastsList.value}
                  onChange={() => {
                    showForecastsList.value = !showForecastsList.value;
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
                    value={[
                      weatherDayRangeList.value[0] + 1,
                      weatherDayRangeList.value[1] + 1,
                    ]}
                    onChange={(value) => {
                      weatherDayRangeList.value = [
                        (value as [number, number])[0] - 1,
                        (value as [number, number])[1] - 1,
                      ];
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
                  sortingList.value = (e as unknown as {
                    target: { value: (typeof Sortings)[keyof typeof Sortings] };
                  }).target.value;
                }}
                selectedValue={sortingList.value}
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
        <Button
          // large
          icon="trash"
          // rightIcon="caret-down"
          text="Zurücksetzen"
          onClick={() => {
            showCurrentConditionsList.value = true;
            showQiList.value = false;
            showStatusesList.value = false;
            showForecastsList.value = true;
            sortingList.value = Sortings.freshSnow;
            weatherDayRangeList.value = [0, 1];
          }}
        />
      </ButtonGroup>
      <div className="w-[1600px] max-w-screen p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-4">
          {favoriteResorts.value.map((resort) => (
            <Detail
              key={resort.id}
              resort={resort}
              showCurrentConditions={showCurrentConditionsList.value}
              showQi={showQiList.value}
              showStatuses={showStatusesList.value}
              showForecasts={showForecastsList.value}
              days={weatherDayRangeList.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
