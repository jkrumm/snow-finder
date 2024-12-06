import "./App.scss";
import { useSignals } from "@preact/signals-react/runtime";
import { Weather } from "./components/weather.tsx";
import { Favorites } from "./components/favorites.tsx";
import { Settings } from "./components/settings.tsx";
import { Map } from "./components/map.tsx";
import { path, Paths, usePath } from "./hooks/use-path.ts";
import { Navigation } from "./components/navigation.tsx";

function App() {
  useSignals();

  usePath();

  let Component;
  switch (path.value) {
    case Paths.HOME:
      Component = () => <Weather />;
      break;
    case Paths.WEATHER:
      Component = () => <Weather />;
      break;
    case Paths.MAP:
      Component = () => <Map />;
      break;
    case Paths.FAVORITES:
      Component = () => <Favorites />;
      break;
    case Paths.SETTINGS:
      Component = () => <Settings />;
      break;
    default:
      Component = () => <h1>404 Not Found</h1>;
      break;
  }

  return (
    <div className="bp5-dark" id="content">
      <Navigation />
      <div id="wrapper">
        <Component />
      </div>
    </div>
  );
}

export default App;
