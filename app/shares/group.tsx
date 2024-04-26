import { Children } from "react";
import {
  Industry,
  IndustryRU,
  SHARES_INFO_NAMES,
} from "../shared/lib/definitions";
import { TICKERS } from "../shared/lib/tickers";
import { colorize } from "../shared/lib/utils";

// export default function Group({ info }: { info: any }) {
export default function Group({
  info,
  name,
  children,
}: {
  info?: any;
  name: string;
  children: string;
}) {
  // const name = info[SHARES_INFO_NAMES.SECID];
  // const delta = info[SHARES_INFO_NAMES.LASTTOPREVPRICE];
  // const volume = info[SHARES_INFO_NAMES.VALTODAY_RUR];
  // const current = info[SHARES_INFO_NAMES.LAST];
  const id = Number(name);
  return (
    <div className="w-64 hover:border hover:border-white">
      <div className="bg-slate-500">{IndustryRU[id]}</div>
      <div className="flex flex-wrap items-center border border-black ">
        {Children.map(children, (child) => (
          <>{child}</>
        ))}
      </div>
    </div>
  );
}
