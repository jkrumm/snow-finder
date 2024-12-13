import { assertEquals } from "jsr:@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";
import {isElapsed} from "./date.helper.ts";
import { DateTime } from 'luxon';

describe("Date Helper", () => {
    it("should return false if the date is within the last 10 minutes", () => {
        const date = DateTime.now().minus({ minutes: 5 });
        assertEquals(isElapsed(date, 10), false);
    });

    it("should return true if the date is older than 10 minutes", () => {
        const date = DateTime.now().minus({ minutes: 15 });
        assertEquals(isElapsed(date, 10), true);
    });
});