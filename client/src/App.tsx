import "./App.scss";
import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { Weather } from "./components/weather.tsx";
import { Favorites } from "./components/favorites.tsx";
import { Map } from "./components/map.tsx";
import { Navigation } from "./components/navigation.tsx";
import { currentView, Views } from "./state/navigation.state.ts";
import { fetchPqiData, fetchResorts } from "./helpers/fetch-client.helper.ts";
import { favorites, resorts } from "./state/resorts.state.ts";

function App() {
  useSignals();

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (resorts.value.length !== 0) return;
    if (fetching) return;
    fetchResorts().then(
      () => setLoading(false),
      () => setFetching(false),
    );
    fetchPqiData().then();
  }, [favorites.value]);

  if (loading) {
    return (
      <div className="bp5-dark" id="content">
        <Navigation />
        <div id="wrapper">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

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
