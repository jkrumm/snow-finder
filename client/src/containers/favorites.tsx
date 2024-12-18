import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  Button,
  Card,
  Divider,
  FormGroup,
  H3,
  Icon,
  InputGroup,
  Menu,
  MenuItem,
  Slider,
  Switch,
  Tag,
} from "@blueprintjs/core";
import {
  snowCardTirolResortIds,
  superSkiCardResortIds,
} from "../constants/resorts.ts";
import { Regions, ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { favoriteResorts, favorites, resorts } from "../state/resorts.state.ts";
import { getStatuses } from "../helpers/status.helper.ts";
import { useLocalStorageSignal } from "../helpers/state.helper.ts";

export function StatusTags({ resort }: { resort: ResortDto }) {
  const isAfter12 = new Date().getHours() >= 12;
  const statuses = getStatuses(resort, isAfter12 ? 1 : 0);
  const { success, danger, warning }: {
    success: number;
    danger: number;
    warning: number;
  } = statuses.reduce(
    (acc, status) => {
      if (status.intend === "success") {
        acc.success++;
      } else if (status.intend === "danger") {
        acc.danger++;
      } else if (status.intend === "warning") {
        acc.warning++;
      }
      return acc;
    },
    { success: 0, danger: 0, warning: 0 },
  );
  return (
    <div className="favorite-tags flex justify-end space-x-1 items-center">
      <div className={`w-5 ${danger > 0 ? "" : "invisible"}`}>
        {danger > 0 && <Tag intent="danger">{danger}</Tag>}
      </div>
      <div className={` w-5 ${warning > 0 ? "" : "invisible"}`}>
        {warning > 0 && <Tag intent="warning">{warning}</Tag>}
      </div>
      <div className={` w-5 ${success > 0 ? "" : "invisible"}`}>
        {success > 0 && <Tag intent="success">{success}</Tag>}
      </div>
    </div>
  );
}

const superSkiCardFilter = useLocalStorageSignal<boolean>(
  "superSkiCardFilter",
  false,
);
const snowCardTirolFilter = useLocalStorageSignal<boolean>(
  "snowCardTirolFilter",
  false,
);
const tirolFilter = useLocalStorageSignal<boolean>("tirolFilter", true);
const salzburgerLandFilter = useLocalStorageSignal<boolean>(
  "salzburgerLandFilter",
  false,
);
const vorarlbergFilter = useLocalStorageSignal<boolean>(
  "vorarlbergFilter",
  false,
);
const liftSliderFilter = useLocalStorageSignal<number>(
  "liftSliderFilter",
  10,
);

export function Favorites() {
  useSignals();

  const [search, setSearch] = useState("");

  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [filteredOutFavorites, setFilteredOutFavorites] = useState([]);
  const [filteredResorts, setFilteredResorts] = useState([]);

  useEffect(() => {
    const matchesSearch = (resort: ResortDto) =>
      resort.name.toLowerCase().includes(search.toLowerCase());

    const matchesSuperSkiCard = (resort: ResortDto) =>
      !superSkiCardFilter.value || superSkiCardResortIds.includes(resort.id);

    const matchesSnowCardTirol = (resort: ResortDto) =>
      !snowCardTirolFilter.value || snowCardTirolResortIds.includes(resort.id);

    const matchesTirol = (resort: ResortDto) =>
      !tirolFilter.value || resort.region === Regions.TIROL;

    const matchesSalzburgerLand = (resort: ResortDto) =>
      !salzburgerLandFilter.value || resort.region === Regions.SALZBURG;

    const matchesVorarlberg = (resort: ResortDto) =>
      !vorarlbergFilter.value || resort.region === Regions.VORARLBERG;

    const matchesLiftCount = (resort: ResortDto) =>
      resort.liftsOpen >= liftSliderFilter.value;

    const matchesCommonFilters = (resort: ResortDto) =>
      matchesSearch(resort) &&
      matchesSuperSkiCard(resort) &&
      matchesSnowCardTirol(resort) &&
      matchesTirol(resort) &&
      matchesSalzburgerLand(resort) &&
      matchesVorarlberg(resort) &&
      matchesLiftCount(resort);

    const isFavorite = (resort: ResortDto) =>
      favorites.value.includes(resort.id);

    setFilteredFavorites(favoriteResorts.value.filter(
      (resort) => matchesCommonFilters(resort),
    ));

    setFilteredOutFavorites(favoriteResorts.value.filter(
      (resort) =>
        !(
          matchesCommonFilters(resort)
        ),
    ));

    setFilteredResorts(resorts.value.filter(
      (resort) =>
        !isFavorite(resort) &&
        matchesCommonFilters(resort),
    ));
  }, [
    search,
    superSkiCardFilter.value,
    snowCardTirolFilter.value,
    tirolFilter.value,
    salzburgerLandFilter.value,
    liftSliderFilter.value,
    favoriteResorts.value,
    resorts.value,
    favorites.value,
    superSkiCardResortIds,
    snowCardTirolResortIds,
  ]);

  return (
    <div className="w-[730px] max-w-screen p-2 sm:p-4">
      <div className="mb-2 sm:grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card compact className="!mb-3 sm:!mb-0">
          <H3>Saisonkarten filtern</H3>
          <FormGroup className="!mb-0 !mt-3">
            <Switch
              checked={superSkiCardFilter.value}
              onChange={() => {
                superSkiCardFilter.value = !superSkiCardFilter.value;
              }}
              label="Super Ski Card"
            />
            <Switch
              checked={snowCardTirolFilter.value}
              onChange={() => {
                snowCardTirolFilter.value = !snowCardTirolFilter.value;
              }}
              label="Snow Card Tirol"
            />
          </FormGroup>
        </Card>
        <Card compact className="!mb-3 sm:!mb-0">
          <H3>Region filtern</H3>
          <FormGroup className="!mb-0 !mt-3">
            <Switch
              checked={tirolFilter.value}
              onChange={() => {
                tirolFilter.value = !tirolFilter.value;
              }}
              label="Tirol"
            />
            <Switch
              checked={salzburgerLandFilter.value}
              onChange={() => {
                salzburgerLandFilter.value = !salzburgerLandFilter.value;
              }}
              label="Salzburger Land"
            />
            <Switch
              checked={vorarlbergFilter.value}
              onChange={() => {
                vorarlbergFilter.value = !vorarlbergFilter.value;
              }}
              label="Vorarlberg"
            />
          </FormGroup>
        </Card>
        <Card compact className="col-span-2 md:col-span-1 mb-3 md:mb-0">
          <H3>Liftstatus filtern</H3>
          <FormGroup className="!mb-0 !mt-3" label="Anzahl geöffneter Lifte">
            <Slider
              min={0}
              max={40}
              stepSize={1}
              labelStepSize={10}
              value={liftSliderFilter.value}
              onChange={(value) => {
                liftSliderFilter.value = value;
              }}
            />
          </FormGroup>
        </Card>
      </div>
      <InputGroup
        className="!mb-4 mt-3"
        placeholder="Suche ..."
        value={search}
        fill
        leftIcon="search"
        rightElement={
          <Button minimal>
            <Icon
              size={20}
              icon="cross"
              onClick={() => setSearch("")}
            />
          </Button>
        }
        onChange={(e) => setSearch(e.target.value)}
      />
      <Divider />
      <div className="sm:grid grid-cols-2 gap-4 items-start mt-4">
        <div className="mb-3">
          {filteredOutFavorites.length > 0 && (
            <div className="mb-5">
              <div className="flex justify-between">
                <H3 className="!mt-[2px]">Favoriten Rausgefiltert</H3>
                <Button
                  className="!mb-3"
                  onClick={() => {
                    favorites.value = favorites.value.filter((id) =>
                      !filteredOutFavorites.map((resort: ResortDto) =>
                        resort.id
                      ).includes(
                        id,
                      )
                    );
                  }}
                >
                  Alle entfernen
                </Button>
              </div>
              <Menu>
                {filteredOutFavorites.map((resort: ResortDto) => (
                  <MenuItem
                    key={resort.id}
                    intent="danger"
                    text={resort.name}
                    icon={<Icon icon="cross" />}
                    className="!px-0"
                    labelElement={<StatusTags resort={resort} />}
                    onClick={() => {
                      favorites.value = favorites.value.filter((id) =>
                        id !== resort.id
                      );
                    }}
                  />
                ))}
              </Menu>
            </div>
          )}
          <div className="flex justify-between">
            <H3 className="!mt-[2px]">Favoriten Gefiltert</H3>
            <Button
              className="!mb-3"
              onClick={() => {
                favorites.value = favorites.value.filter((id) =>
                  !filteredFavorites.map((resort: ResortDto) => resort.id)
                    .includes(
                      id,
                    )
                );
              }}
            >
              Alle entfernen
            </Button>
          </div>
          <Menu>
            {filteredFavorites.map((resort: ResortDto) => (
              <MenuItem
                key={resort.id}
                text={resort.name}
                icon={<Icon icon="cross" />}
                className="!px-0"
                labelElement={<StatusTags resort={resort} />}
                onClick={() => {
                  favorites.value = favorites.value.filter((id) =>
                    id !== resort.id
                  );
                }}
              />
            ))}
          </Menu>
        </div>
        <div className="mb-3">
          <div className="flex justify-between">
            <H3 className="!mt-[2px]">Resorts Gefiltert</H3>
            <Button
              className="!mb-3"
              onClick={() => {
                favorites.value = [
                  ...favorites.value,
                  ...filteredResorts.map((resort: ResortDto) => resort.id),
                ];
              }}
            >
              Alle hinzufügen
            </Button>
          </div>
          <Menu>
            {filteredResorts
              .sort(
                (a: ResortDto, b: ResortDto) => a.name.localeCompare(b.name),
              )
              .map((resort: ResortDto) => (
                <MenuItem
                  className="!px-0"
                  key={resort.id}
                  text={resort.name}
                  icon={<Icon icon="plus" />}
                  labelElement={<StatusTags resort={resort} />}
                  onClick={() => {
                    favorites.value = [...favorites.value, resort.id];
                  }}
                />
              ))}
          </Menu>
        </div>
      </div>
      <div className="h-1" />
    </div>
  );
}
