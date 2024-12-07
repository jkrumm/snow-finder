import { convertCmOrMToNumber, fetchPage } from "./parser.helper.ts";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";
import {Regions} from "../../shared/dtos/weather.dto.ts";

export interface FetchResort {
  id: string;
  name: string;
  region: (typeof Regions)[keyof typeof Regions];
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: number;
  liftsTotal: number;
  date: DateTime;
}

async function fetchRegion(
  region: (typeof Regions)[keyof typeof Regions],
): Promise<FetchResort[]> {
  const html: string = await fetchPage(
    `https://www.bergfex.at/${region}/schneewerte/`,
  );
  const $ = cheerio.load(html);

  const resorts: FetchResort[] = [];

  // deno-lint-ignore no-unused-vars
  $("tbody tr").each((index, element) => {
    const name = $(element).find("td").eq(0).text().trim();

    const href = $(element).find("td").eq(0).find("a").attr("href") || null;
    const id = href ? href.split("/").slice(0, 2)[1] : null;

    if (!id) {
      throw new Error("Resort ID not found");
    }

    const valleyHeight = convertCmOrMToNumber(
      $(element).find("td").eq(1).text().trim(),
    );
    const mountainHeight = convertCmOrMToNumber(
      $(element).find("td").eq(2).text().trim(),
    );
    const freshSnow = convertCmOrMToNumber(
      $(element).find("td").eq(3).text().trim(),
    );
    const lifts = $(element).find("td").eq(4).text().trim();
    const liftsOpen = Number(lifts.split("/")[0] || 0);
    const liftsTotal = Number(lifts.split("/")[1] || 0);

    const timestamp = $(element).find("td").eq(5).text().trim().split(", ")[1];
    const date = DateTime.fromISO(
      `${DateTime.now().setZone("Europe/Berlin").toISODate()}T${timestamp}`,
      { zone: "Europe/Berlin" },
    );

    if (lifts === "0" && mountainHeight === 0 && valleyHeight === 0) {
      return;
    }

    resorts.push(
      {
        id,
        name,
        region,
        valleyHeight,
        mountainHeight,
        freshSnow,
        liftsOpen,
        liftsTotal,
        date,
      },
    );
  });

  return resorts;
}

export async function fetchResorts(): Promise<FetchResort[]> {
  const resorts: FetchResort[] = [];

  resorts.push(...(await fetchRegion(Regions.TIROL)));
  resorts.push(...((await fetchRegion(Regions.SALZBURG)).filter(
    (resort) => !resorts.some((r) => r.id === resort.id),
  )));

  resorts.sort((a, b) => {
    if (a.freshSnow === b.freshSnow) {
      return b.mountainHeight - a.mountainHeight;
    }
    return b.freshSnow - a.freshSnow;
  });

  return resorts;
}
