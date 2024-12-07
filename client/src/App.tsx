import "./App.scss";
import { useSignals } from "@preact/signals-react/runtime";
import { H1 } from "@blueprintjs/core";
import { Weather } from "./components/weather.tsx";
import { Favorites } from "./components/favorites.tsx";
import { Settings } from "./components/settings.tsx";
import { Map } from "./components/map.tsx";
import { getPathTitle, path, Paths, usePath } from "./hooks/use-path.ts";
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
        <div>
          {path.value !== Paths.MAP && <H1 className="!m-0 !mx-4 !mt-3">{getPathTitle(path.value)}</H1>}
          <Component />
        </div>
      </div>
    </div>
  );
}

export default App;
