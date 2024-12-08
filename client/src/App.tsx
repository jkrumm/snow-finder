import "./App.scss";
import { useSignals } from "@preact/signals-react/runtime";
import { Weather } from "./components/weather.tsx";
import { Favorites } from "./components/favorites.tsx";
import { Map } from "./components/map.tsx";
import { Navigation } from "./components/navigation.tsx";
import { currentView, Views } from "./state/navigation.state.ts";

function App() {
  useSignals();

  let Component;
  switch (currentView.value) {
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
      <div id="wrapper">
        <Component />
      </div>
    </div>
  );
}

export default App;
