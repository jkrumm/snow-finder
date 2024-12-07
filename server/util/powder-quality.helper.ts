import OpenAI from "@openai/openai";
import { ResortDto } from "../../shared/dtos/weather.dto.ts";
import { DateTime } from "luxon";

const client = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

export interface PowderQualityIndex {
  date: DateTime;
  powderQualityIndex: number;
  description: string;
}

export async function generatePowderQualityIndex(
  resort: ResortDto,
): Promise<PowderQualityIndex[]> {
  const systemPrompt = `
    You are an expert ski conditions analyst. Your task is to evaluate the powder quality for freeskiing for a ski resort based on the given weather data.
    
    In the given data you have the resort information with the valley and mountain height, the current snow height, and the current fresh snow. You also have the daily forecasts for the next days with the temperatures, snowline, fresh snow, rain risk, rain amount, sun hours, wind direction, and wind Bft.
    The first entry in forecasts is the current day. So the first day has the current fresh snow of the last days and the current snow height while the following build up on the previous days.
    
    Rule: Without new fresh snow the snow quality can never increase but only degrade over the days.
    Rule: The current conditions resulting through the days before are usually more important than the current day.
    
    Very important: Dont degrade the first day too much as it doesnt have previous days but consider the current fresh snow and the current snow height of the resort and the weather conditions. The first entry in forecasts is the current day.
    Highest impact: Consider factors over the days of the forecast like current and cumulative fresh snow, snow fall line, temperature variations, sun exposure, wind conditions. The days before (snow fall, temperature, ...) the current day are very important for the snow quality of each day.
    High impact: Given that after or during the recent snowfall the snow quality is usually best, the snow quality of the current day is usually better than the snow quality of the following days if there is no fresh snow. So without fresh snow the snow quality is degrading over the days while the next days after fresh snow are usually optimal for powder skiing.
    High impact: Roughly Accumulated snow heights on the mountain of 70cm or more are ideal for freeskiing. While snow heights above 50cm is sufficient for freeskiing. The more accumulated snow the better. Snow heights also degrade over the days without fresh snow.
    High impact: Accumulated fresh snow of the last 2-3 days of 20cm or more is ideal for powder snow. The more fresh snow the better the snow quality.
    High impact: The fresh snow of each forecast happens during the entire day and not all of the current days fresh snow can be taken into account but of the previous days and current snow height.
    High impact: Especially consecutive days of fresh snow, low temperatures and not too high winds are ideal for powder snow. The more consecutive days of good conditions the better the snow quality.
    High impact: If the temperatures are get above -2°C and the snowline is above the valley height and there is precipitation expected it can rain which greatly degrades the snow quality.  
    Medium impact: Temperatures below -4°C are ideal for fresh powder snow. Temperatures below -2°C are usually fine to sustain snow quality. The colder the better the snow quality stays. Temperatures above 0°C are bad for powder snow.
    Medium impact: Wind Bft 1-3 is ideal for powder snow. Especially wind Bft above 4 is bad for powder snow. Especially during snowfalls the wind has more impact on the snow quality.
    Medium impact: The snowline is the altitude where the snow turns into rain. The lower the snowline, the better the snow quality. If the snowline is below the valley height, the snow quality is usually good and it can not rain. If the resort mountain height is not much higher than the snowline, the snow quality is usually bad.
    Medium impact: The more sun hours the worse the snow quality degrades over the days. A sunny day after fresh snow is no problem for the snow quality but consecutive sunny days degrade the snow quality if the temperatures are low enough.
    Low impact: Usually north facing slopes have the best powder snow quality as the sun does not melt the snow as fast as on south facing slopes. Winds from the south can also transport snow to the north facing slopes making the snow quality even better.
    
    Respond with a JSON object containing the date and a powder quality index from 0 to 10 for each forecast and a description. 
    
    The description should be german and understandable for the freeskiers using my app. Explain the powder quality index with the factors that influenced it in 2-3 sentences keep it simple and understandable and focus on the most important factors.
    Include the day in the description like: "Heute am 12.12. ist der Schnee mit einer Qualität von 10/10 optimal. Es hat in den letzten Tagen viel geschneit und die Temperaturen sind ideal. Die Sonne scheint heute nicht und der Wind ist schwach."
    The first entry in forecasts is the current day (Heute), the 2nd entry is the next day (Morgen) and from then on use the weekdays name in german like "Dienstag" for the day after tomorrow.
    Be careful that the powder quality index in the description is always the same as the one in the JSON object.
  `;

  const userPrompt = `
   Resort Information: 
    Heights: Valley ${resort.resortValleyHeight}m, Mountain ${resort.resortMountainHeight}m
    Current Snow height: Valley: ${resort.valleyHeight}cm, Mountain: ${resort.mountainHeight}cm
    Current Fresh Snow: ${resort.freshSnow}cm
    Forecasts:
    ${
    resort.dailyForecasts.map((f) => `
      Date: ${f.date}, Max temperature: ${f.tmax}°C, Min temperature: ${f.tmin}°C, Snowline: ${f.snowline}m, Fresh Snow: ${f.freshSnow}cm, Precipitation Risk: ${
      f.rainRisc * 100
    }% Precipitation Amount: ${f.rainAmount}l, Sun: ${f.sun}h, Wind Direction: ${f.windDirection} Wind Bft: ${f.windBft}
    `).join("")
  }
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }, {
      role: "user",
      content: userPrompt,
    }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "powder_quality_index",
        strict: true,
        schema: {
          "type": "object",
          "properties": {
            "results": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "date": {
                    "type": "string",
                    "description":
                      "The date of the forecast in ISO 8601 date format without time",
                  },
                  "powderQualityIndex": {
                    "type": "number",
                    "description": "The powder quality index from 0 to 10",
                  },
                  "description": {
                    "type": "string",
                    "description":
                      "A german description of 2-3 sentences explaining the powder quality index with the factors that influenced it",
                  },
                },
                "required": ["date", "powderQualityIndex", "description"],
                "additionalProperties": false,
              },
            },
          },
          "required": ["results"],
          "additionalProperties": false,
        },
      },
    },
    max_tokens: 1440,
  });

  const message = completion.choices[0]?.message;

  if (!message || !message.content || !!message.refusal) {
    throw new Error("Failed to generate AI response");
  }

  const parsed = JSON.parse(message.content) as {
    results: {
      date: string;
      powderQualityIndex: number;
      description: string;
    }[];
  };

  return parsed.results.map(
    (r) => ({
      date: DateTime.fromISO(r.date).startOf("day"),
      powderQualityIndex: r.powderQualityIndex,
      description: r.description,
    }),
  );
}
