import { useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { Button, Icon, InputGroup, Menu, MenuItem } from "@blueprintjs/core";
import { favoriteResorts, favorites, resorts } from "./weather.tsx";

export function Favorites() {
  useSignals();

  const [search, setSearch] = useState("");

  return (
    <div className="@container w-[730px] max-w-screen p-4">
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
      <div className="@lg:flex items-start">
        <Menu className="!mb-3 @lg:!mr-4 w-1/2">
          {favoriteResorts.value.filter(
            (resort) =>
              resort.name.toLowerCase().includes(search.toLowerCase()),
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
        <Menu className="w-1/2">
          {resorts.value.filter((resort) =>
            !favorites.value.includes(resort.id)
          ).filter((resort) =>
            resort.name.toLowerCase().includes(search.toLowerCase())
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
  );
}
