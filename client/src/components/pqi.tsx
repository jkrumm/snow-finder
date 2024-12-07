import { ResortDto } from "../../../shared/dtos/weather.dto.ts";

export function Pqi({ resort, index }: { resort: ResortDto; index: number }) {
  const pqi = resort.dailyForecasts[index]!.pqi || 0;
  const description = resort.dailyForecasts[index]!.pqiDescription || "";

  let pqiBgColor = `bg-[#252a31]`;
  if (pqi >= 3) {
    pqiBgColor = `bg-green-low`;
  }
  if (pqi >= 5) {
    pqiBgColor = `bg-green-medium`;
  }
  if (pqi >= 7) {
    pqiBgColor = `bg-green-high`;
  }
  if (pqi >= 9) {
    pqiBgColor = `bg-green-extreme`;
  }

  return (
    <div className="flex m-2 mb-0 min-h-[80px] border-1 border-[#404854]">
      <div
        className={`flex justify-center min-w-[50px] items-center py-2 ${pqiBgColor}`}
      >
        <span>{pqi}</span>
      </div>
      <div className="flex flex-col justify-center p-3 border-l border-[#404854]">
        <span>{description}</span>
      </div>
    </div>
  );
}
