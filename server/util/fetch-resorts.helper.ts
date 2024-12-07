import {convertCmToNumber, fetchPage} from "./parser.helper.ts";
import * as cheerio from "cheerio";
import {Resort} from "../data/weather.ts";
import {DateTime} from "luxon";

export const fetchResorts = async (): Promise<Resort[]> => {
    const html = await fetchPage("https://www.bergfex.at/tirol/schneewerte/");
    const $ = cheerio.load(html);

    const resorts: Resort[] = [];

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

        const timestamp = $(element).find("td").eq(5).text().trim().split(", ")[1];
        const date = DateTime.fromISO(`${DateTime.now().setZone('Europe/Berlin').toISODate()}T${timestamp}`, { zone: 'Europe/Berlin' });

        if (lifts === "0" || mountainHeight === 0) {
            return;
        }

        resorts.push(new Resort({
            id,
            name,
            valleyHeight,
            mountainHeight,
            freshSnow,
            liftsOpen: Number(lifts.split("/")[0]),
            liftsTotal: Number(lifts.split("/")[1]),
            date,
        }));
    });

    resorts.sort((a, b) => {
        if (a.freshSnow === b.freshSnow) {
            return b.mountainHeight - a.mountainHeight;
        }
        return b.freshSnow - a.freshSnow;
    });

    return resorts;
};