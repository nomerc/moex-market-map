"use client";

import useSWR from "swr";
import { fetcher } from "./shared/lib/data";
import {
  EndPoints,
  Industry,
  SHARES_INFO_NAMES,
  Securities,
} from "./shared/lib/definitions";
import { mergeArraysIntoObject } from "./shared/lib/utils";
import Group from "./shares/group";
import React from "react";

export default function Home() {
  const {
    data: securities,
    error: securitiesError,
    isLoading: securitiesLoading,
  } = useSWR<Securities>(EndPoints.SharesTQBRSecurities, fetcher);

  let data: any = [];
  let filteredData: any = [];
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
  }

  if (data.length != 0) {
    return (
      <main className="h-screen w-screen p-4">
        {industries.map((val, id: number) => (
          <div className="flex flex-column " key={"g" + val}>
            <Group
              key={val}
              name={val}
              data={filteredData}
              groupId={id}
            ></Group>
          </div>
        ))}
      </main>
    );
  }
  return <main>Loading...</main>;
}
