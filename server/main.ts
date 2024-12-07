import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import { Weather } from "./data/weather.ts";


export const app = new Application();
const router = new Router();

app.use(
    oakCors({
      origin: "http://localhost:3000"
    }),
);

const weather = await Weather.init();

router.get("/api/resorts", async (context) => {
  context.response.body = await weather.getResortListDtos();
});

router.get("/api/resorts/:id", async (context) => {
  const id = context.params.id;

  if (!id) {
    throw new Error("Id not given");
  }

  context.response.body = await weather.getResort(id);
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
