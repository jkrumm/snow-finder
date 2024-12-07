import {Application} from "jsr:@oak/oak/application";
import {Router} from "jsr:@oak/oak/router";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import * as cheerio from 'cheerio';

export const app = new Application();
const router = new Router();

const fetchPage = async (url: string): Promise<string> => {
  const response = await fetch(url);
    return await response.text();
};

// Util function that makes string "-" to 0 and removes " cm" from string and converts it to number
const convertToNumber = (str: string): number => {
  if (str === "-") return 0;
  return Number(str.replace(" cm", ""));
};

router.get("/list", async (context) => {
  const html = await fetchPage("https://www.bergfex.at/tirol/schneewerte/");
  const $ = cheerio.load(html);

  const table:{
    resort: string,
    url: string | null,
    valleyHeight: number,
    mountainHeight: number,
    freshSnow: number,
    liftsOpen: string,
    liftsTotal: string,
    date: string,
  }[] = [];

  // deno-lint-ignore no-unused-vars
  $('tbody tr').each((index, element) => {
    const resort = $(element).find('td').eq(0).text().trim();

    const href = $(element).find('td').eq(0).find('a').attr('href') || null;
    const url = href ? `https://www.bergfex.at${href.split("/").slice(0, 2).join("/")}/wetter/berg/` : null;

    const valleyHeight = convertToNumber($(element).find('td').eq(1).text().trim());
    const mountainHeight = convertToNumber($(element).find('td').eq(2).text().trim());
    const freshSnow = convertToNumber($(element).find('td').eq(3).text().trim());
    const lifts = $(element).find('td').eq(4).text().trim();
    const date = $(element).find('td').eq(5).text().trim();

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

    context.response.body = table;
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
