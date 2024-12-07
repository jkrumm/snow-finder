import "leaflet/dist/leaflet.css";
import {
  CircleMarker,
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { useSignals } from "@preact/signals-react/runtime";
import L from "leaflet";
import { favoriteResorts, favorites, resorts } from "./weather.tsx";

const blueMarker =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0a8 8 0 0 0-8 8c0 1.421.382 2.75 1.031 3.906.108.192.221.381.344.563L12 24l6.625-11.531c.102-.151.19-.311.281-.469l.063-.094A7.954 7.954 0 0 0 20 8a8 8 0 0 0-8-8zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#2d72d2" class="fill-e74c3c fill-215db0"></path><path d="M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#215db0" class="fill-c0392b fill-184a90"></path></svg>';
const greenMarker =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0a8 8 0 0 0-8 8c0 1.421.382 2.75 1.031 3.906.108.192.221.381.344.563L12 24l6.625-11.531c.102-.151.19-.311.281-.469l.063-.094A7.954 7.954 0 0 0 20 8a8 8 0 0 0-8-8zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#43bf4d" class="fill-e74c3c fill-215db0"></path><path d="M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#29a634" class="fill-c0392b fill-184a90"></path></svg>';
const orangeMarker =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0a8 8 0 0 0-8 8c0 1.421.382 2.75 1.031 3.906.108.192.221.381.344.563L12 24l6.625-11.531c.102-.151.19-.311.281-.469l.063-.094A7.954 7.954 0 0 0 20 8a8 8 0 0 0-8-8zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#ec9a3c" class="fill-e74c3c fill-215db0"></path><path d="M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#c87619" class="fill-c0392b fill-184a90"></path></svg>';
const redMarker =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0a8 8 0 0 0-8 8c0 1.421.382 2.75 1.031 3.906.108.192.221.381.344.563L12 24l6.625-11.531c.102-.151.19-.311.281-.469l.063-.094A7.954 7.954 0 0 0 20 8a8 8 0 0 0-8-8zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="#e76a6e" class="fill-e74c3c fill-215db0"></path><path d="M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" fill="#cd4246" class="fill-c0392b fill-184a90"></path></svg>';

export function Map() {
  useSignals();
  return (
    <div className="w-full bg-blue-extreme">
      <MapContainer
        center={[47.2, 11.8]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "calc(100vh - 50px)", width: "100vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://static.avalanche.report/tms/{z}/{x}/{y}.png"
        />
        <ImageOverlay
          url="https://static.avalanche.report/zamg_meteo/overlays/snow-height/2024-12-06_14-00_snow-height_V2.gif"
          bounds={[[45.6167, 9.4], [47.8167, 13.0333]]}
          opacity={1}
        />
        {favoriteResorts.value.map((resort) => (
          <Marker
            icon={L.divIcon({
              html: redMarker,
              className: "",
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })}
            key={resort.id}
            position={[resort.lat, resort.long]}
          >
            <Popup>{resort.name}</Popup>
          </Marker>
          //   <CircleMarker center={[resort.lat, resort.long]} pathOptions={{ color: '#AC2F33E5' }} radius={8}>
          //     <Popup>{resort.name}</Popup>
          //   </CircleMarker>
        ))}

        {resorts.value.filter((resort) => !favorites.value.includes(resort.id))
          .map((resort) => (
            <CircleMarker
              center={[resort.lat, resort.long]}
              pathOptions={{ color: "#1c2127" }}
              radius={4}
            >
              <Popup>{resort.name}</Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}
