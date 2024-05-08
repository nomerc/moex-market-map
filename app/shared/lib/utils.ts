import {
  FieldTitles,
  FieldTitlesValues,
  SHARES_INFO_NAMES,
  Securities,
  StrNumObj,
} from "./definitions";

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

// рассчет размера секторов в группе в долях от 12(для сетки)
export const getRelativeGroupScales = (
  data: [],
  id: SHARES_INFO_NAMES,
  value: SHARES_INFO_NAMES,
  frac: number
) => {
  let result: StrNumObj = {};

  const total: number = data.reduce(
    (acc: number, cur: StrNumObj) => acc + cur[value],
    0
  );

  data.map((el) => {
    const key: string = el[id] || "";
    const val: number = Math.round((el[value] / total) * frac) + 1;

    result = { ...result, [key]: val };
  });
  return result;
};
