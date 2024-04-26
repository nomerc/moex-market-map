"use client";

import useSWR from "swr";
import { fetcher } from "./shared/lib/data";
import {
  EndPoints,
  Industry,
  IndustryRU,
  SHARES_INFO_NAMES,
  Securities,
} from "./shared/lib/definitions";
import { mergeArraysIntoObject } from "./shared/lib/utils";
import Sector from "./shares/sector";
import Group from "./shares/group";
import { TICKERS } from "./shared/lib/tickers";
import { getTreemap } from "./shared/lib/getTreeMap";
import React from "react";

//browser page width
const getWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
};

//browser page height
const getHeight = () => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
};

//рассчет размера секторов на диаграмме
const getRelativeArea = (data: []) => {
  let result: { [key: string]: number } = {};

  data.map((el) => {
    const key =
      TICKERS[el[SHARES_INFO_NAMES.SECID]]?.industry?.toString() || "";

    // const val =
    //   result[key] ||
    //   0 + el[SHARES_INFO_NAMES.WAPRICE] * el[SHARES_INFO_NAMES.VOLTODAY];
    const val = result[key] || 0 + el[SHARES_INFO_NAMES.VALTODAY_RUR];

    result = { ...result, [key]: val };
  });
  return result;
};

export default function Home() {
  //расшифровка полей для акций
  // const { data: names, isLoading: namesLoading } = useSWR<Shares>(
  //   EndPoints.Shares,
  //   fetcher
  // );

  //вариант данных по акциям(альтернатива в маркетдата)
  const {
    data: securities,
    error: securitiesError,
    isLoading: securitiesLoading,
  } = useSWR<Securities>(EndPoints.SharesTQBRSecurities, fetcher, {
    revalidateOnFocus: false,
  });

  let data: any = [];
  let filteredData: any = [];
  let treemap;
  //get values from Industry - 0,1,2,3 change to !isNan for GasOil etc
  const industries = Object.keys(Industry).filter((key: any) =>
    isNaN(Number(Industry[key]))
  );

  if (securitiesError) throw new Error("Failed to load security information");

  if (!securitiesLoading) {
    const marketdata = securities?.marketdata;
    marketdata?.data.map((row) =>
      data.push(mergeArraysIntoObject(marketdata?.columns, row))
    );
    filteredData = data.filter(
      (el: any) => el[SHARES_INFO_NAMES.LASTTOPREVPRICE] != 0
    );

    const tmDataObj = getRelativeArea(filteredData);
    let tmDataA: any = [];
    Object.keys(tmDataObj).map((key) =>
      tmDataA.push({
        value: tmDataObj[key],
        color: "#1B277C",
        label: IndustryRU[Number(key)],
      })
    );

    console.log(tmDataA);

    treemap = getTreemap({
      data: tmDataA,
      width: getWidth(),
      height: getHeight(),
    });
  }

  if (data.length != 0) {
    return (
      <main className="flex flex-wrap h-screen w-screen p-4">
        <svg
          width={window.screen.width}
          height={window.screen.height}
          className="hover:border hover:border-white"
        >
          <g key={"g"}>
            {treemap?.map((rect) => (
              <React.Fragment key={"fragment" + rect.x + rect.y}>
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={rect.color}
                  stroke="black"
                ></rect>
                <text
                  x={rect.x + rect.width / 2}
                  y={rect.y + rect.height / 2}
                  fill="white"
                >
                  {rect.label}
                </text>
              </React.Fragment>
            ))}
          </g>
        </svg>

        {industries.map((val) => (
          <Group key={val} name={val}>
            {filteredData
              .filter(
                (el: any) =>
                  TICKERS[el[SHARES_INFO_NAMES.SECID]]?.industry?.toString() ==
                  val
              )
              .map((el: any) => (
                <Sector info={el} key={el[SHARES_INFO_NAMES.SECID]} />
              ))}
          </Group>
        ))}
      </main>
    );
  }
  return <main>Loading...</main>;
}
