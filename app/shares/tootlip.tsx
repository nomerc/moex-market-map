import { SHARES_INFO_NAMES } from "../shared/lib/definitions";
import { TICKERS } from "../shared/lib/tickers";
import { colorize } from "../shared/lib/utils";

export default function Tooltip({ info }: { info: any }) {
  const name = info[SHARES_INFO_NAMES.SECID];
  const delta = info[SHARES_INFO_NAMES.LASTTOPREVPRICE];
  // const volume = info[SHARES_INFO_NAMES.VALTODAY_RUR];
  const current = info[SHARES_INFO_NAMES.LAST];

  return (
    <div className=" absolute flex -top-20  items-center justify-center border border-black bg-white">
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
