import "leaflet/dist/leaflet.css";
import {
  CircleMarker,
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import L from "leaflet";
import { getStatuses } from "../helpers/status.helper.ts";
import { favoriteResorts, favorites, resorts } from "../state/resorts.state.ts";
import { fetchRecentMap } from "../helpers/fetch-client.helper.ts";
import { Icon, Menu, MenuItem } from "@blueprintjs/core";

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

  const isAfter12 = new Date().getHours() >= 12;

  const [snowHeightMap, setSnowHeightMap] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentMap("snow-height").then((map) => setSnowHeightMap(map));
  }, []);

  if (!snowHeightMap) {
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

  return (
    <div className="w-full bg-blue-extreme">
      <div className="fixed left-1/2 transform border-1 border-[#404854] -translate-x-1/2 bottom-[59px] md:bottom-[0px] w-[390px] bg-[#2f343c] z-[10000]">
        <Menu>
          <MenuItem
            text="Schneehöhe"
            popoverProps={{
              placement: "top",
              modifiers: {
                arrow: { enabled: true },
              },
              // minimal: false,
            }}
          >
            <MenuItem text="Schneehöhe" active />
            <MenuItem text="Neuschnee Gestern" disabled />
            <MenuItem text="Neuschnee Heute" disabled />
            <MenuItem text="Neuschnee Morgen" disabled />
            <MenuItem text="Neuschnee Übermogen" disabled />
          </MenuItem>
        </Menu>
        <div className="color-scale p-3">
          <div className="labels">
            <span>1</span>
            <span className="relative left-[3px]">10</span>
            <span className="relative left-[3px]">25</span>
            <span className="relative left-[5px]">50</span>
            <span>100</span>
            <span className="relative right-[6px]">200</span>
            <span className="relative right-[15px]">300</span>
            <span className="relative right-[30px]">&gt;400</span>
          </div>

          <div className="bars">
            <div className="bar yellow"></div>
            <div className="bar green"></div>
            <div className="bar lightblue"></div>
            <div className="bar blue"></div>
            <div className="bar indigo"></div>
            <div className="bar purple"></div>
            <div className="bar pink"></div>
            <div className="bar red"></div>
          </div>
        </div>
      </div>
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
          url={`https://static.avalanche.report/zamg_meteo/overlays/snow-height/${snowHeightMap}`}
          bounds={[[45.6167, 9.4], [47.8167, 13.0333]]}
          opacity={1}
        />
        {favoriteResorts.value.map((resort) => {
          const statuses = getStatuses(resort, isAfter12 ? 1 : 0);
          let marker = greenMarker;
          if (statuses.some((status) => status.intend === "danger")) {
            marker = redMarker;
          } else if (statuses.some((status) => status.intend === "warning")) {
            marker = orangeMarker;
          }
          return (
            <Marker
              icon={L.divIcon({
                html: marker,
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              })}
              key={resort.id}
              position={[resort.lat, resort.long]}
            >
              <Popup>{resort.name}</Popup>
            </Marker>
          );
        })}

        {resorts.value.filter((resort) => !favorites.value.includes(resort.id))
          .map((resort) => {
            const statuses = getStatuses(resort, isAfter12 ? 1 : 0);
            let color = "#29A634";
            if (statuses.some((status) => status.intend === "danger")) {
              color = "#CD4246";
            } else if (statuses.some((status) => status.intend === "warning")) {
              color = "#C87619";
            }
            return (
              <CircleMarker
                key={resort.id}
                center={[resort.lat, resort.long]}
                pathOptions={{ color }}
                radius={4}
              >
                <Popup>{resort.name}</Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
