import { FieldTitles, FieldTitlesValues, Securities } from "./definitions";

/** Клиент для MOEX ISS. */
type Values = string | number | number;
type TableRow = Record<string, Values>;
type Table = TableRow[];
type TablesDict = Record<string, Table>;
// type WebQuery = Record<string, string | number>;

// const BASE_QUERY: WebQuery = { "iss.json": "extended", "iss.meta": "off" };

//

export const mergeArraysIntoObject = (
  keys?: string[],
  values?: any[]
): { [key: string]: string | number } => {
  if (keys)
    return keys.reduce((obj, key, index) => {
      obj[key] = values?.[index];
      return obj;
    }, {} as { [key: string]: string | number });
  return {};
};

export const createTitlesObject = (
  fieldInfo?: (string | number)[][]
): FieldTitles => {
  //takes an array of arrays [name, shortTitle, Title] and returns an object {name : {shortTitle : value, title : value} }
  const fieldNames: FieldTitles = {};

  if (fieldInfo) {
    for (let i = 0; i < fieldInfo.length; ++i) {
      const name = fieldInfo[i][1] as string;
      const names: FieldTitlesValues = {
        shortTitle: fieldInfo[i][2] as string,
        title: fieldInfo[i][3] as string,
      };
      fieldNames[name] = names;
    }
    return fieldNames;
  }

  return fieldNames;
};

export const selectElementsByPosition = <T>(
  positions: number[],
  source?: T[]
): T[] => {
  // Create a new array by filtering the original array
  // The filter callback checks if the current index is included in the positions array
  if (source) return source?.filter((_, index) => positions.includes(index));
  return [];
};

export const selectElementsByName = <T>(
  data: T[][],
  names: string[]
): T[][] => {
  // Create a new array by filtering the original array
  // The filter callback checks if element name is included in names array
  return data?.filter(([name]) => names.includes(name as string));
};

export const getSecurityDetailsByPosition = (
  fieldInfo?: (string | number)[][],
  namesSrc?: Securities[],
  dataSrc?: (string | number)[],
  positions: number[] = []
): { [key: string]: string | number } => {
  //creates an object with of a form {short title : value} from desired positions of data entry
  const fieldNames = createTitlesObject(fieldInfo);
  const shortNames: string[] | undefined = namesSrc?.map(
    (el: any) => fieldNames[el.toUpperCase()].shortTitle
  );

  return mergeArraysIntoObject(
    selectElementsByPosition(positions, shortNames),
    selectElementsByPosition(positions, dataSrc)
  );
};

export const colorize = (delta: number, bg: boolean = true) => {
  let r, g, b, clr;
  let deltaAbs = Math.abs(delta);

  switch (true) {
    case deltaAbs <= 1:
      r = 220;
      g = b = 38;
      break;
    case deltaAbs <= 5:
      r = 185;
      g = b = 28;
      break;
    case deltaAbs <= 10:
      r = 153;
      g = b = 27;
      break;
    case deltaAbs <= 15:
      r = 127;
      g = b = 29;
      break;
    case deltaAbs <= 25:
      r = 124;
      g = 45;
      b = 18;
      break;
  }

  delta < 0 ? (clr = `rgb(${r},${g},${b})`) : (clr = `rgb(${g},${r},${b})`);

  if (bg) return { backgroundColor: clr };
  return { color: clr };
};

// export const colorize = (delta: number, bg: boolean = true): string => {
//   let intns = "500";
//   let clr = "green-";

//   if (delta < 0) clr = "red-";

//   let deltaAbs = Math.abs(delta);

//   switch (true) {
//     case deltaAbs <= 5:
//       intns = "600";
//       break;
//     case deltaAbs <= 10:
//       intns = "700";
//       break;
//     case deltaAbs <= 15:
//       intns = "800";
//       break;
//     case deltaAbs <= 25:
//       intns = "900";
//       break;
//   }

//   if (bg) return ("bg-" + clr + intns) as string;
//   return "text-" + clr + intns;
// };

// const createNamedInfoObject = () => {
//   const marketdata = securities?.marketdata;
//   const titles = createTitlesObject(names?.marketdata.data);
//   const aliases = marketdata?.columns.map((key) => titles[key].title);
//   marketdata?.data.map((row) =>
//     data.push(mergeArraysIntoObject(marketdata?.columns, row))
//   );
// };

// async function get(url: string) {
//   const res = await fetch(url);
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error("Failed to fetch data");
//   }
//   const dt = res.json();
//   return res.json();
// }

// export function getTable(data: TablesDict, table: string): Table {
//   try {
//     return data[table] as Table;
//   } catch (err) {
//     throw new Error(`Отсутствует таблица ${table} в данных`);
//   }
// }

// async function getShortData(url: string, table: string) {
//   const res = await get(url);
//   return getTable(res, table);
// }

// class ISSClient implements Iterable<TablesDict> {
//   private _session: Session;
//   private _url: string;
//   private _query: WebQuery;

//   constructor(session: Session, url: string, query: WebQuery | null = null) {
//     this._session = session;
//     this._url = url;
//     this._query = query || {};
//   }

//   [Symbol.iterator](): Iterator<TablesDict> {
//     let start = 0;
//     return {
//       next: () => {
//         const data = this.get(start);
//         if ("history.cursor" in data) {
//           const [cursor, ...wrongData] = data["history.cursor"];
//           if (wrongData.length !== 0 || cursor["INDEX"] !== start) {
//             throw new ISSMoexError(
//               `Некорректные данные history.cursor ${data["history.cursor"]} для начальной позиции ${start}`
//             );
//           }
//           delete data["history.cursor"];
//           start += cursor["PAGESIZE"] as number;
//           if ((start >= cursor["TOTAL"]) as number) {
//             return { done: true, value: data };
//           }
//         } else {
//           const key = Object.keys(data)[0];
//           const block_size = data[key].length;
//           start += block_size;
//           return { done: block_size === 0, value: data };
//         }
//       },
//     };
//   }

//   get(start: number | null = null): Record<string, TableRow[]> {
//     const query = this._makeQuery(start);
//     const respond = this._session.get(this._url, { params: query });
//     const [_, data, ...wrongData] = respond.json();
//     if (wrongData.length !== 0) {
//       throw new ISSMoexError("Ответ содержит некорректные данные");
//     }
//     return data;
//   }

//   private _makeQuery(start: number | null = null): WebQuery {
//     const query: WebQuery = { ...BASE_QUERY, ...this._query };
//     if (start) {
//       query["start"] = start;
//     }
//     return query;
//   }

//   getAll(): TablesDict {
//     const allData: TablesDict = {};
//     for (const data of this) {
//       for (const [key, value] of Object.entries(data)) {
//         allData[key] = [...(allData[key] || []), ...value];
//       }
//     }
//     return allData;
//   }
// }

// class ISSMoexError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "ISSMoexError";
//   }
// }
