export async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}

export function convertCmOrMToNumber(str: string): number {
  str = str.replace("cm", "").replace(".", "").replace("m", "").trim();
  if (str === "-") return 0;
  if (str === "<1cm") return 0;
  return parseFloat(str) || 0;
}

export function convertPercentageToNumber(str: string): number {
  return Math.round(Number(str.replace("%", "")) * 0.01 * 100) / 100 || 0;
}

export function convertHoursToNumber(str: string): number {
  if (str === "-") return 0;
  return Number(str.replace("h", "")) || 0;
}

export function convertTemperatureToNumber(str: string): number {
  return Number(str.replace("°C", "")) || 0;
}
