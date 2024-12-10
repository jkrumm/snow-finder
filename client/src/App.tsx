import "./App.scss";
import { useSignals } from "@preact/signals-react/runtime";
import { Navigation } from "./components/navigation.tsx";
import { currentView, Views } from "./state/navigation.state.ts";
import { favorites } from "./state/resorts.state.ts";
import { Icon } from "@blueprintjs/core";
import { Weather } from "./containers/weather.tsx";
import { Favorites } from "./containers/favorites.tsx";
import { Map } from "./containers/map.tsx";
import { List } from "./containers/list.tsx";
import useFetchResorts from "./hooks/use-fetch-resorts.tsx";

function App() {
  useSignals();

  const { loading } = useFetchResorts(favorites.value);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="snowflake-loader">
          <Icon
            className="snowflake-icon"
            size={70}
            icon="snowflake"
          />
        </div>
      </div>
    );
  }

  let Component;
  switch (currentView.value) {
    case Views.LIST:
      Component = () => <List />;
      break;
    case Views.WEATHER:
      Component = () => <Weather />;
      break;
    case Views.MAP:
      Component = () => <Map />;
      break;
    case Views.FAVORITES:
      Component = () => <Favorites />;
      break;
    default:
      Component = () => <h1>404 Not Found</h1>;
      break;
  }

  return (
    <div className="bp5-dark" id="content">
      <Navigation />
      <div
        id="wrapper"
        className={(currentView.value === Views.LIST ||
            currentView.value === Views.WEATHER)
          ? "more-spacing"
          : ""}
      >
        <Component />
      </div>
    </div>
  );
}

export default App;
