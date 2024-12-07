import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  Button,
  Card,
  FormGroup,
  H3,
  Icon,
  InputGroup,
  Menu,
  MenuItem,
  Slider,
  Switch,
} from "@blueprintjs/core";
import { favoriteResorts, favorites, resorts } from "./weather.tsx";
import {
  snowCardTirolResortIds,
  superSkiCardResortIds,
} from "../constants/resorts.ts";
import { Regions, ResortDto } from "../../../shared/dtos/weather.dto.ts";
import { fetchResorts } from "../helpers/fetch-client.helper.ts";

export function Favorites() {
  useSignals();

  useEffect(() => {
    if (resorts.value.length !== 0) return;
    fetchResorts().then();
  }, []);

  const [search, setSearch] = useState("");

  const [superSkiCardFilter, setSuperSkiCardFilter] = useState(false);
  const [snowCardTirolFilter, setSnowCardTirolFilter] = useState(false);
  const [tirolFilter, setTirolFilter] = useState(false);
  const [salzburgerLandFilter, setSalzburgerLandFilter] = useState(false);
  const [liftSliderFilter, setLiftSliderFilter] = useState(7);

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
    <div className="@container w-[730px] max-w-screen p-4">
      <div className="mb-4 @lg:grid grid-cols-3 gap-4">
        <Card compact className="!mb-3 @lg:!mb-0">
          <H3>Saisonkarten filtern</H3>
          <FormGroup className="!mb-0 !mt-3">
            <Switch
              checked={superSkiCardFilter}
              large
              onChange={() => {
                setSuperSkiCardFilter(!superSkiCardFilter);
              }}
              label="Super Ski Card"
            />
            <Switch
              checked={snowCardTirolFilter}
              large
              onChange={() => {
                setSnowCardTirolFilter(!snowCardTirolFilter);
              }}
              label="Snow Card Tirol"
            />
          </FormGroup>
        </Card>
        <Card compact>
          <H3>Region filtern</H3>
          <FormGroup className="!mb-0 !mt-3">
            <Switch
              checked={tirolFilter}
              large
              onChange={() => {
                setTirolFilter(!tirolFilter);
                if (salzburgerLandFilter && !tirolFilter) {
                  setSalzburgerLandFilter(false);
                }
              }}
              label="Tirol"
            />
            <Switch
              checked={salzburgerLandFilter}
              large
              onChange={() => {
                setSalzburgerLandFilter(!salzburgerLandFilter);
                if (!salzburgerLandFilter && tirolFilter) {
                  setTirolFilter(false);
                }
              }}
              label="Salzburger Land"
            />
          </FormGroup>
        </Card>
        <Card compact>
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
        className="!mb-4"
        placeholder="Suche ..."
        value={search}
        fill
        large
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
      <div className="@lg:grid grid-cols-2 gap-4 items-start mt-6">
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
