import { convertCmToNumber, fetchPage } from "./parser.helper.ts";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";

export interface FetchResort {
  id: string;
  name: string;
  valleyHeight: number;
  mountainHeight: number;
  freshSnow: number;
  liftsOpen: number;
  liftsTotal: number;
  date: DateTime;
}

export async function fetchResorts(): Promise<FetchResort[]> {
  const html: string = await fetchPage("https://www.bergfex.at/tirol/schneewerte/");
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
        valleyHeight,
        mountainHeight,
        freshSnow,
        liftsOpen,
        liftsTotal,
        date,
      },
    );
  });

  resorts.sort((a, b) => {
    if (a.freshSnow === b.freshSnow) {
      return b.mountainHeight - a.mountainHeight;
    }
    return b.freshSnow - a.freshSnow;
  });

  return resorts;
}
