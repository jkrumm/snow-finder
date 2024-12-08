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
} from "@blueprintjs/core";
import {
  snowCardTirolResortIds,
  superSkiCardResortIds,
} from "../constants/resorts.ts";
import { Regions, ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { fetchResorts } from "../helpers/fetch-client.helper.ts";
import { favoriteResorts, favorites, resorts } from "../state/resorts.state.ts";

export function Favorites() {
  useSignals();

  const [search, setSearch] = useState("");

  const [superSkiCardFilter, setSuperSkiCardFilter] = useState(false);
  const [snowCardTirolFilter, setSnowCardTirolFilter] = useState(false);
  const [tirolFilter, setTirolFilter] = useState(true);
  const [salzburgerLandFilter, setSalzburgerLandFilter] = useState(false);
  const [vorarlbergFilter, setVorarlbergFilter] = useState(false);
  const [liftSliderFilter, setLiftSliderFilter] = useState(10);

  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [filteredOutFavorites, setFilteredOutFavorites] = useState([]);
  const [filteredResorts, setFilteredResorts] = useState([]);

  useEffect(() => {
    const matchesSearch = (resort: ResortDto) =>
      resort.name.toLowerCase().includes(search.toLowerCase());

    const matchesSuperSkiCard = (resort: ResortDto) =>
      !superSkiCardFilter || superSkiCardResortIds.includes(resort.id);

    const matchesSnowCardTirol = (resort: ResortDto) =>
      !snowCardTirolFilter || snowCardTirolResortIds.includes(resort.id);

    const matchesTirol = (resort: ResortDto) =>
      !tirolFilter || resort.region === Regions.TIROL;

    const matchesSalzburgerLand = (resort: ResortDto) =>
      !salzburgerLandFilter || resort.region === Regions.SALZBURG;

    const matchesVorarlberg = (resort: ResortDto) =>
      !vorarlbergFilter || resort.region === Regions.VORARLBERG;

    const matchesLiftCount = (resort: ResortDto) =>
      resort.liftsOpen >= liftSliderFilter;

    const isFavorite = (resort: ResortDto) =>
      favorites.value.includes(resort.id);

    setFilteredFavorites(favoriteResorts.value.filter(
      (resort) =>
        matchesSearch(resort) &&
        matchesSuperSkiCard(resort) &&
        matchesSnowCardTirol(resort) &&
        matchesTirol(resort) &&
        matchesSalzburgerLand(resort) &&
        matchesVorarlberg(resort) &&
        matchesLiftCount(resort),
    ));

    setFilteredOutFavorites(favoriteResorts.value.filter(
      (resort) =>
        !(
          matchesSearch(resort) &&
          matchesSuperSkiCard(resort) &&
          matchesSnowCardTirol(resort) &&
          matchesTirol(resort) &&
          matchesSalzburgerLand(resort) &&
          matchesVorarlberg(resort) &&
          matchesLiftCount(resort)
        ),
    ));

    setFilteredResorts(resorts.value.filter(
      (resort) =>
        matchesSearch(resort) &&
        !isFavorite(resort) &&
        matchesSuperSkiCard(resort) &&
        matchesSnowCardTirol(resort) &&
        matchesTirol(resort) &&
        matchesSalzburgerLand(resort) &&
        matchesVorarlberg(resort) &&
        matchesLiftCount(resort),
    ));
  }, [
    search,
    superSkiCardFilter,
    snowCardTirolFilter,
    tirolFilter,
    salzburgerLandFilter,
    liftSliderFilter,
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
              checked={superSkiCardFilter}
              onChange={() => {
                setSuperSkiCardFilter(!superSkiCardFilter);
              }}
              label="Super Ski Card"
            />
            <Switch
              checked={snowCardTirolFilter}
              onChange={() => {
                setSnowCardTirolFilter(!snowCardTirolFilter);
              }}
              label="Snow Card Tirol"
            />
          </FormGroup>
        </Card>
        <Card compact className="!mb-3 sm:!mb-0">
          <H3>Region filtern</H3>
          <FormGroup className="!mb-0 !mt-3">
            <Switch
              checked={tirolFilter}
              onChange={() => {
                setTirolFilter(!tirolFilter);
                if (
                  (salzburgerLandFilter || vorarlbergFilter) && !tirolFilter
                ) {
                  setSalzburgerLandFilter(false);
                  setVorarlbergFilter(false);
                }
              }}
              label="Tirol"
            />
            <Switch
              checked={salzburgerLandFilter}
              onChange={() => {
                setSalzburgerLandFilter(!salzburgerLandFilter);
                if (
                  (tirolFilter || vorarlbergFilter) && !salzburgerLandFilter
                ) {
                  setTirolFilter(false);
                  setVorarlbergFilter(false);
                }
              }}
              label="Salzburger Land"
            />
            <Switch
              checked={vorarlbergFilter}
              onChange={() => {
                setVorarlbergFilter(!vorarlbergFilter);
                if (
                  (salzburgerLandFilter || tirolFilter) && !vorarlbergFilter
                ) {
                  setSalzburgerLandFilter(false);
                  setTirolFilter(false);
                }
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
              value={liftSliderFilter}
              onChange={(value) => {
                setLiftSliderFilter(value);
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
                    labelElement={<Icon icon="cross" />}
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
                labelElement={<Icon icon="cross" />}
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
      </div>
    </div>
  );
}
