import { fetchPage } from "./parser.helper.ts";
import * as cheerio from "cheerio";

export async function fetchRecentMap(map: string): Promise<string> {
  const html: string = await fetchPage(
    `https://static.avalanche.report/zamg_meteo/overlays/${map}/?sort=time&order=desc`,
  );

  const $ = cheerio.load(html);

  return $('tbody tr.file td a[href$=".gif"]')
    .first()
    .find(".name")
    .text();
}
