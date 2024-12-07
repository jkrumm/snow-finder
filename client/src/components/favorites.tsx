import { useState } from "react";
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
  Switch,
} from "@blueprintjs/core";
import { favoriteResorts, favorites, resorts } from "./weather.tsx";
import {
  snowCardTirolResortIds,
  superSkiCardResortIds,
} from "../constants/resorts.ts";

export function Favorites() {
  useSignals();

  const [search, setSearch] = useState("");

  const [superSkiCardFilter, setSuperSkiCardFilter] = useState(false);
  const [snowCardTirolFilter, setSnowCardTirolFilter] = useState(false);
  const [tirolFilter, setTirolFilter] = useState(false);
  const [salzburgerLandFilter, setSalzburgerLandFilter] = useState(false);

  return (
    <div className="@container w-[730px] max-w-screen p-4">
      <div className="mb-4 @lg:grid grid-cols-2 gap-4">
        <Card compact className="!mb-3 @lg:!mb-0">
          <H3>Nach Saisonkarten filtern</H3>
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
          <H3>Nach Region filtern</H3>
          <FormGroup className="!mb-0 !mt-3">
            <Switch
              checked={tirolFilter}
              large
              disabled
              onChange={() => {
                setTirolFilter(!tirolFilter);
              }}
              label="Tirol"
            />
            <Switch
              checked={salzburgerLandFilter}
              large
              disabled
              onChange={() => {
                setSalzburgerLandFilter(!salzburgerLandFilter);
              }}
              label="Salzburger Land"
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
          <H3>Meine Favoriten</H3>
          <Menu>
            {favoriteResorts.value.filter(
              (resort) =>
                resort.name.toLowerCase().includes(search.toLowerCase()) &&
                (!superSkiCardFilter ||
                  superSkiCardResortIds.includes(resort.id)) &&
                (!snowCardTirolFilter ||
                  superSkiCardResortIds.includes(resort.id)),
            ).map((resort) => (
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
        <div>
          <H3>Alle Resorts</H3>
          <Menu>
            {resorts.value.filter((resort) =>
              !favorites.value.includes(resort.id)
            ).filter((resort) =>
              resort.name.toLowerCase().includes(search.toLowerCase()) &&
              (!superSkiCardFilter ||
                superSkiCardResortIds.includes(resort.id)) &&
              (!snowCardTirolFilter ||
                snowCardTirolResortIds.includes(resort.id))
            )
              .sort(
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
      </div>
    </div>
  );
}
