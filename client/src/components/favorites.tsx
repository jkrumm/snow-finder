import { useSignals } from "@preact/signals-react/runtime";
import { Icon, Menu, MenuItem } from "@blueprintjs/core";
import { favoriteResorts, favorites, weather } from "./weather.tsx";

export function Favorites() {
  useSignals();

  return (
    <div className="@container w-[730px] max-w-screen p-4">
      <div className="@lg:flex items-start">
        <Menu className="!mb-3 @lg:!mr-4">
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
          {weather.value.filter((resort) =>
            !favorites.value.includes(resort.id)
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
