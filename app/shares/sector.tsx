import { useState } from "react";
import { SHARES_INFO_NAMES } from "../shared/lib/definitions";
import Tooltip from "./tootlip";
import { colorize } from "../shared/lib/utils";

export default function Sector({ info }: { info: any }) {
  const name = info[SHARES_INFO_NAMES.SECID];
  const delta = info[SHARES_INFO_NAMES.LASTTOPREVPRICE];
  const volume = info[SHARES_INFO_NAMES.VALTODAY_RUR];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={colorize(delta)}
      className={`basis-1/2 h-16 relative flex items-center justify-center  hover:cursor-pointer hover:border-2`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-8 h-8 flex flex-col items-center justify-center">
        <div className="font-bold">{name}</div>
        <div className=""> {delta > 0 ? "+" + delta + "%" : delta + "%"}</div>
      </div>
      {isHovered && <Tooltip info={info} />}
    </div>
  );
}
