import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { favoriteResorts } from "../state/resorts.state.ts";
import { Detail } from "../components/detail.tsx";

export const showForecasts = signal<boolean>(true);

export const sorting = signal<"freshSnow" | "mountainHeight" | "tmax" | "sun">(
  "freshSnow",
);

export function Weather() {
  useSignals();

  return (
    <div className="w-[1600px] max-w-screen p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {favoriteResorts.value.map((resort) => <Detail resort={resort} />)}
      </div>
    </div>
  );
}
