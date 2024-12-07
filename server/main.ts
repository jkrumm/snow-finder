import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { Weather } from "./data/weather.ts";
import {
  generatePowderQualityIndex,
  PowderQualityIndex,
} from "./util/powder-quality.helper.ts";
import { DateTime } from "luxon";
import { isElapsed } from "./util/date.helper.ts";

export const app = new Application();
const router = new Router();

app.use(
  oakCors({
    origin: "http://localhost:3000",
  }),
);

export const weather = await Weather.init();

const pqiMap = new Map<string, {
  id: string;
  date: string;
  powderQualityIndex: PowderQualityIndex[];
}>();

router.get("/api/resorts", async (context) => {
  context.response.body = await weather.getResortDtos();
});

router.get("/api/pqi/:id", async (context) => {
  const id = context.params.id;

  if (!id) {
    throw new Error("Id not given");
  }

  const existingPqi = pqiMap.get(id);

  if (
    existingPqi &&
    !isElapsed(DateTime.fromISO(existingPqi.date).startOf("day"), 60)
  ) {
    context.response.body = existingPqi;
    return;
  }

  const costPrevention = false;
  if (costPrevention) {
    context.response.body = [];
    return;
  }

  const resort = await weather.getResort(id);

  const pqi = await generatePowderQualityIndex(resort);

  pqiMap.set(id, {
    id,
    date: DateTime.now().toISODate(),
    powderQualityIndex: pqi,
  });

  context.response.body = {
    id,
    date: DateTime.now().toISODate(),
    powderQualityIndex: pqi,
  };
});

app.use(router.routes());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
