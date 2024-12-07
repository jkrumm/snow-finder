import "leaflet/dist/leaflet.css";
import { MapContainer, ImageOverlay, Marker, Popup, TileLayer } from "react-leaflet";
import { useSignals } from "@preact/signals-react/runtime";

export function Map() {
  useSignals();
  return (
    <div className="w-full bg-blue-extreme">
      <MapContainer center={[47.2, 11.8]} zoom={10} scrollWheelZoom={true}
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
        {/*<Marker position={[51.505, -0.09]}>*/}
        {/*  <Popup>*/}
        {/*    A pretty CSS3 popup. <br /> Easily customizable.*/}
        {/*  </Popup>*/}
        {/*</Marker>*/}
      </MapContainer>
    </div>
  );
}
