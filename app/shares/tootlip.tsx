import { SHARES_INFO_NAMES } from "../shared/lib/definitions";
import { TICKERS } from "../shared/lib/tickers";
import { colorize } from "../shared/lib/utils";
import clsx from "clsx";

export default function Tooltip({
  info,
  sectorId,
  groupId,
}: {
  info: any;
  sectorId: number;
  groupId: number;
}) {
  const name = info[SHARES_INFO_NAMES.SECID];
  const delta = info[SHARES_INFO_NAMES.LASTTOPREVPRICE];
  // const volume = info[SHARES_INFO_NAMES.VALTODAY_RUR];
  const current = info[SHARES_INFO_NAMES.LAST];

  const divStl = clsx(
    `absolute flex items-center justify-center border border-black bg-white z-40`,
    {
      "-top-20": groupId !== 0,
      "top-20": groupId === 0,
      "left-20": sectorId === 0,
    }
  );

  return (
    <div
      // className={`absolute flex -top-20  items-center justify-center border border-black bg-white`}
      className={divStl}
    >
      <div className="flex flex-col  px-4 py-2">
        <div className="text-black text-xs"> {TICKERS[name]?.name || name}</div>
        <div className="flex">
          <div className="text-black font-bold text-2xl">{current}</div>
          <div style={colorize(delta, false)} className="text-2xl">
            {delta > 0 ? "+" + delta + "%" : delta + "%"}
          </div>
        </div>
      </div>
    </div>
  );
}
