import { useEffect, useState } from "react";
import "./App.css";
import { ResortListDto } from "../../shared/dtos/weather.dto.ts";

function App() {
  const [resorts, setResorts] = useState<ResortListDto[]>([]);

  const fetchResorts = async () => {
    if (resorts.length > 0) return;
    const response = await fetch("http://localhost:8000/api/resorts");
    setResorts(await response.json());
  };

  useEffect(() => {
    fetchResorts().then();
  }, []);

  return (
    <>
      <h1>Resorts</h1>
      <div>
        {resorts.map((resort: ResortListDto) => (
          <div key={resort.id}>{resort.name}</div>
        ))}
      </div>
    </>
  );
}

export default App;
