export const fetchPage = async (url: string): Promise<string> => {
    const response = await fetch(url);
    return await response.text();
};

export const convertCmToNumber = (str: string): number => {
    if (str === "-") return 0;
    return Number(str.replace("cm", "").trim());
};

export const convertPercentageToNumber = (str: string): number => {
    return Math.round(Number(str.replace("%", "")) * 0.01 * 100) / 100;
};

export const convertHoursToNumber = (str: string): number => {
    if (str === "-") return 0;
    return Number(str.replace("h", ""));
};

export const convertTemperatureToNumber = (str: string): number => {
    return Number(str.replace("°C", ""));
};