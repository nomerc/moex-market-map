import {
  IndustryRU,
  N_COLUMNS,
  SHARES_INFO_NAMES,
} from "../shared/lib/definitions";
import { TICKERS } from "../shared/lib/tickers";
import Sector from "./sector";
import { getRelativeGroupScales } from "../shared/lib/utils";

export default function Group({
  data,
  name,
  groupId,
}: {
  data?: any;
  name: string;
  groupId: number;
}) {
  const id = Number(name);

  const groupData: [] = data.filter(
    (el: any) =>
      TICKERS[el[SHARES_INFO_NAMES.SECID]]?.industry?.toString() == name
  );

  const groupScales = getRelativeGroupScales(
    groupData,
    SHARES_INFO_NAMES.SECID,
    SHARES_INFO_NAMES.VALTODAY,
    N_COLUMNS
  );

  groupData.sort(
    (a, b) =>
      groupScales[b[SHARES_INFO_NAMES.SECID]] -
      groupScales[a[SHARES_INFO_NAMES.SECID]]
  );

  return (
    <div className="px-2 py-1 text-base flex w-full">
      <div className="w-48 mr-4 bg-slate-500 flex text-center shrink-0 items-center justify-center">
        {IndustryRU[id]}
      </div>
      <div className="w-full flex flex-wrap gap-4 border border-black block">
        {groupData.map((el: any, index: number) => (
          <Sector
            key={el[SHARES_INFO_NAMES.SECID]}
            info={el}
            sectorId={index}
            groupId={groupId}
            groupScales={groupScales}
          />
        ))}
      </div>
    </div>
  );
}
