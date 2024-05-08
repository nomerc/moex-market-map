import { useState } from "react";
import { N_COLUMNS, SHARES_INFO_NAMES } from "../shared/lib/definitions";
import Tooltip from "./tootlip";
import { colorize } from "../shared/lib/utils";

export default function Sector({
  info,
  sectorId,
  groupId,
  groupScales,
}: {
  info: any;
  sectorId: number;
  groupId: number;
  groupScales: { [key: string]: number };
}) {
  const name = info[SHARES_INFO_NAMES.SECID];
  const delta = info[SHARES_INFO_NAMES.LASTTOPREVPRICE];
  const n = (groupScales[name] / N_COLUMNS) * 100 + `%`;

  const [isHovered, setIsHovered] = useState(false);
  const stl = { ...colorize(delta), [`flexBasis`]: n };
  return (
    <div
      style={stl}
      className={`p-1 relative flex  items-center justify-center  hover:cursor-pointer `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className=" flex flex-col items-center justify-center">
        <div className="font-bold">{name}</div>
        <div className=""> {delta > 0 ? "+" + delta + "%" : delta + "%"}</div>
      </div>
      {isHovered && (
        <Tooltip info={info} sectorId={sectorId} groupId={groupId} />
      )}
    </div>
  );
}
