import "./App.scss";
import { useSignals } from "@preact/signals-react/runtime";
import {Sidebar} from "./components/sidebar.tsx";
import {Resorts} from "./components/resorts.tsx";

function App() {
  useSignals();

  return (
    <div className="bp5-dark flex flex-col md:flex-row">
      <Sidebar />
      <Resorts />
    </div>
  );
}

export default App;
