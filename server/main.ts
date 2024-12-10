import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { Weather } from "./data/weather.ts";
import {
  generatePowderQualityIndex,
  getFakePqi,
  PowderQualityIndex,
} from "./util/ai-powder-quality.helper.ts";
import { DateTime } from "luxon";
import { isElapsed } from "./util/date.helper.ts";
import { env } from "node:process";
import { fetchRecentMap } from "./util/fetch-maps.helper.ts";

export const app = new Application();
const router = new Router();

export const baseUrl = Deno.env.get("BASE_URL") || env.BASE_URL ||
  "http://localhost:8000";

app.use(
  oakCors({
    origin: baseUrl === "http://localhost:8000"
      ? "http://localhost:3000"
      : baseUrl,
  }),
);

export const weather = await Weather.init();

const pqiMap = new Map<string, {
  id: string;
  date: string;
  powderQualityIndex: PowderQualityIndex[];
}>();

let apiResortsLocked: boolean = false;

router.get("/api/resorts", async (context) => {
  while (apiResortsLocked) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  apiResortsLocked = true;

  const releaseLock = () => {
    if (apiResortsLocked) {
      apiResortsLocked = false;
    }
  };
  const lockTimeout = setTimeout(releaseLock, 2000);

  try {
    context.response.body = await weather.getResortDtos();
  } finally {
    releaseLock();
    clearTimeout(lockTimeout);
  }
});

const pqiIdsLocked: Record<string, boolean> = {};

router.get("/api/pqi/:id", async (context) => {
  const id = context.params.id;

  if (!id) {
    throw new Error("Id not given");
  }

  while (pqiIdsLocked[id]) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  pqiIdsLocked[id] = true;

  const releaseLock = () => {
    if (pqiIdsLocked[id]) {
      delete pqiIdsLocked[id];
    }
  };
  const lockTimeout = setTimeout(releaseLock, 5000);

  try {
    const existingPqi = pqiMap.get(id);

    if (
      existingPqi &&
      !isElapsed(DateTime.fromISO(existingPqi.date), 60)
    ) {
      context.response.body = existingPqi;
      releaseLock();
      clearTimeout(lockTimeout);
      return;
    }

    if (Deno.env.get("DATA_SAVING")) {
      context.response.body = getFakePqi(id);
      releaseLock();
      clearTimeout(lockTimeout);
      return;
    }

    const resort = await weather.getResort(id);

    const pqi = await generatePowderQualityIndex(resort);

    pqiMap.set(id, {
      id,
      date: DateTime.now().toISO(),
      powderQualityIndex: pqi,
    });

    context.response.body = {
      id,
      date: DateTime.now().toISODate(),
      powderQualityIndex: pqi,
    };
  } finally {
    releaseLock();
    clearTimeout(lockTimeout);
  }
});

router.get("/api/recent-map/:map", async (context) => {
  const map = context.params.map;

  if (!map) {
    throw new Error("Id not given");
  }

  context.response.body = await fetchRecentMap(map);
});

app.use(router.routes());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

if (import.meta.main) {
  console.log("Server listening on port " + Deno.env.get("BASE_URL"));
  await app.listen({ port: 8000 });
}
