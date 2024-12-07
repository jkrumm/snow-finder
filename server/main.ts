import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import * as cheerio from "cheerio";

export const app = new Application();
const router = new Router();

const fetchPage = async (url: string): Promise<string> => {
  const response = await fetch(url);
  return await response.text();
};

const convertCmToNumber = (str: string): number => {
  if (str === "-") return 0;
  return Number(str.replace(" cm", ""));
};

const convertPercentageToNumber = (str: string): number => {
  return Math.round(Number(str.replace("%", "")) * 0.01 * 100) / 100;
};

const convertHoursToNumber = (str: string): number => {
  if (str === "-") return 0;
  return Number(str.replace("h", ""));
};

const convertTemperatureToNumber = (str: string): number => {
  return Number(str.replace("°C", ""));
};

const table: {
  resort: string;
  url: string | null;
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: string;
  liftsTotal: string;
  date: string;
}[] = [];

const updateList = async () => {
  const html = await fetchPage("https://www.bergfex.at/tirol/schneewerte/");
  const $ = cheerio.load(html);

  // deno-lint-ignore no-unused-vars
  $("tbody tr").each((index, element) => {
    const resort = $(element).find("td").eq(0).text().trim();

    const href = $(element).find("td").eq(0).find("a").attr("href") || null;
    const url = href ? href.split("/").slice(0, 2).join("/") : null;

    const valleyHeight = convertCmToNumber(
      $(element).find("td").eq(1).text().trim(),
    );
    const mountainHeight = convertCmToNumber(
      $(element).find("td").eq(2).text().trim(),
    );
    const freshSnow = convertCmToNumber(
      $(element).find("td").eq(3).text().trim(),
    );
    const lifts = $(element).find("td").eq(4).text().trim();
    const date = $(element).find("td").eq(5).text().trim();

    if (lifts === "0" || mountainHeight === 0) {
      return;
    }

    table.push({
      resort,
      url,
      valleyHeight,
      mountainHeight,
      freshSnow,
      liftsOpen: lifts.split("/")[0],
      liftsTotal: lifts.split("/")[1],
      date: date.split(", ")[1],
    });
  });

  table.sort((a, b) => {
    if (a.freshSnow === b.freshSnow) {
      return b.mountainHeight - a.mountainHeight;
    }
    return b.freshSnow - a.freshSnow;
  });
};


const forecastData: {
  date: string;
  img: string | null;
  tmax: number;
  tmin: number;
  freshSnow: number;
  rainRisc: number;
  sun: number;
  wind: string;
}[] = [];

const updateForecast = async (skiAreaUrl: string) => {
  const html = await fetchPage(
      `https://www.bergfex.at${skiAreaUrl}/wetter/berg/`,
  );
  const $ = cheerio.load(html);

  $(".day.clickable.selectable.fields, .day.clickable.trend.fields").each(
  // deno-lint-ignore no-unused-vars
      (index, element) => {
        const date = $(element).find(".date a").text().trim();
        const img =
            ($(element).find(".icon img").attr("src") || "").split("/").pop() ||
            null;
        const tmax = convertTemperatureToNumber(
            $(element).find(".tmax").text().trim(),
        );
        const tmin = convertTemperatureToNumber(
            $(element).find(".tmin").text().trim(),
        );
        const freshSnow = convertCmToNumber(
            $(element).find(".group.nschnee").text().trim(),
        );
        const rainRisc = convertPercentageToNumber(
            $(element).find(".rrp").text().trim(),
        );
        const sun = convertHoursToNumber($(element).find(".sonne").text().trim());
        const wind = $(element).find(".ff").text().trim();

        forecastData.push({
          date,
          img, // vcdn.bergfex.at/images/wetter/bergfex-shaded/b3s2.png
          tmax,
          tmin,
          freshSnow,
          rainRisc,
          sun,
          wind,
        });
      },
  );
}

router.get("/list", async (context) => {
  await updateList();

  const skiArea = table[0];

  await updateForecast(skiArea.url!);

  context.response.body = forecastData;
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
