interface DataPoint {
  label?: string;
  color?: string;
  value: number;
}

interface Rect {
  data: any[];
  xBeginning: number;
  yBeginning: number;
  totalWidth: number;
  totalHeight: number;
  label?: string;
  color?: string;
}
//helpers
const getMaximum = (array: number[]) => Math.max(...array);

const getMinimum = (array: number[]) => Math.min(...array);

const sumReducer = (acc: number, cur: number) => acc + cur;

const roundValue = (number: number) =>
  Math.max(Math.round(number * 100) / 100, 0);

const validateArguments = ({
  data,
  width,
  height,
}: {
  data: DataPoint[];
  width: number;
  height: number;
}) => {
  if (!width || typeof width !== "number" || width < 0) {
    throw new Error("You need to specify the width of your treemap");
  }
  if (!height || typeof height !== "number" || height < 0) {
    throw new Error("You need to specify the height of your treemap");
  }
  if (
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    !data.every(
      (dataPoint) =>
        Object.prototype.hasOwnProperty.call(dataPoint, "value") &&
        typeof dataPoint.value === "number" &&
        dataPoint.value >= 0 &&
        !Number.isNaN(dataPoint.value)
    )
  ) {
    throw new Error(
      "You data must be in this format [{ value: 1 }, { value: 2 }], 'value' being a positive number"
    );
  }
};

const worstRatio = (row: number[], width: number) => {
  const sum = row.reduce(sumReducer, 0);
  const rowMax = getMaximum(row);
  const rowMin = getMinimum(row);
  return Math.max(
    (width ** 2 * rowMax) / sum ** 2,
    sum ** 2 / (width ** 2 * rowMin)
  );
};

const getMinWidth = (rect: Rect) => {
  if (rect.totalHeight ** 2 > rect.totalWidth ** 2) {
    return { value: rect.totalWidth, vertical: false };
  }
  return { value: rect.totalHeight, vertical: true };
};

const layoutRow = (
  rect: Rect,
  initialData: DataPoint[],
  row: number[],
  width: number,
  vertical: boolean
) => {
  const rowHeight = row.reduce(sumReducer, 0) / width;

  row.forEach((rowItem) => {
    const rowWidth = rowItem / rowHeight;
    const { xBeginning } = rect;
    const { yBeginning } = rect;

    let dt;
    if (vertical) {
      dt = {
        x: xBeginning,
        y: yBeginning,
        width: rowHeight,
        height: rowWidth,
        data: initialData[rect.data.length],
      };
      rect.yBeginning += rowWidth;
    } else {
      dt = {
        x: xBeginning,
        y: yBeginning,
        width: rowWidth,
        height: rowHeight,
        data: initialData[rect.data.length],
      };
      rect.xBeginning += rowWidth;
    }

    rect.data.push(dt);
  });

  if (vertical) {
    rect.xBeginning += rowHeight;
    rect.yBeginning -= width;
    rect.totalWidth -= rowHeight;
  } else {
    rect.xBeginning -= width;
    rect.yBeginning += rowHeight;
    rect.totalHeight -= rowHeight;
  }
};

const layoutLastRow = (
  rect: Rect,
  initialData: DataPoint[],
  rows: number[],
  children: number[],
  width: number
) => {
  const { vertical } = getMinWidth(rect);
  layoutRow(rect, initialData, rows, width, vertical);
  layoutRow(rect, initialData, children, width, vertical);
};

const squarify = (
  rect: Rect,
  initialData: DataPoint[],
  children: number[],
  row: number[],
  width: number
): any => {
  if (children.length === 1) {
    return layoutLastRow(rect, initialData, row, children, width);
  }

  const rowWithChild = [...row, children[0]];

  if (
    row.length === 0 ||
    worstRatio(row, width) >= worstRatio(rowWithChild, width)
  ) {
    children.shift();
    return squarify(rect, initialData, children, rowWithChild, width);
  }
  layoutRow(rect, initialData, row, width, getMinWidth(rect).vertical);
  return squarify(rect, initialData, children, [], getMinWidth(rect).value);
};

export const getTreemap = ({
  data,
  width,
  height,
}: {
  data: DataPoint[];
  width: number;
  height: number;
}) => {
  let rect: Rect = {
    data: [],
    xBeginning: 0,
    yBeginning: 0,
    totalWidth: width,
    totalHeight: height,
  };

  validateArguments({ data, width, height });

  const totalValue = data
    .map((dataPoint) => dataPoint.value)
    .reduce(sumReducer, 0);
  const dataScaled = data.map(
    (dataPoint) => (dataPoint.value * height * width) / totalValue
  );

  squarify(rect, data, dataScaled, [], getMinWidth(rect).value);

  return rect.data.map((dataPoint) => ({
    x: roundValue(dataPoint.x),
    y: roundValue(dataPoint.y),
    width: roundValue(dataPoint.width),
    height: roundValue(dataPoint.height),
    color: dataPoint.data.color,
    value: dataPoint.data.value,
    label: dataPoint.data.label,
  }));
};
