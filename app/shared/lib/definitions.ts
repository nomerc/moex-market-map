export const N_COLUMNS = 12; // допустимые значения 1...12

export const enum SHARES_INFO_NAMES {
  ISSUECAPITALIZATION = "ISSUECAPITALIZATION", //Текущая капитализация акции
  LAST = "LAST", //Цена последней сделки
  LASTTOPREVPRICE = "LASTTOPREVPRICE", //Изменение цены последней сделки к последней цене предыдущего дня, %
  NUMTRADES = "NUMTRADES", //Количество сделок за торговый день
  OPEN = "OPEN", //Цена первой сделки
  SECID = "SECID",
  VOLTODAY = "VOLTODAY", //Объем совершенных сделок, выраженный в единицах ценных бумаг
  VALTODAY = "VALTODAY", //Объем совершенных сделок, в валюте рассчетов
  VALTODAY_RUR = "VALTODAY_RUR", //Объем совершенных сделок, рублей
  WAPRICE = "WAPRICE", // Средневзвешенная цена
}

export enum EndPoints {
  //Акции
  // список имен полей акций
  Shares = "https://iss.moex.com/iss/engines/stock/markets/shares.json",
  // список акций торгуемых в во всех режимах
  SharesSecurities = "https://iss.moex.com/iss/engines/stock/markets/shares/securities.json",
  // список акций торгуемых в в режиме TQBR
  SharesTQBRSecurities = "https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json",
  //Ценная бумага (при формировании запроса необходимо добавить (secid/.json)
  Security = "https://iss.moex.com/iss/securities/", //
  //история торгов цб (при формировании запроса необходимо добавить (secid/.json) 3 - итоговая сессия торгов
  SecurityHistory = "https://iss.moex.com/iss/history/engines/stock/markets/bonds/sessions/3/securities/",
}

//описание данных возвращаемых с https://iss.moex.com/iss/engines/stock/markets/shares.json
export interface Shares {
  boards: Block;
  boardgroups: Block;
  history: Block;
  history_yields: Block;
  marketdata: Block;
  marketdata_yields: Block;
  orderbook: Block;
  secstats: Block;
  securities: Block;
  trades: Block;
  trades_hist: Block;
  trades_yields: Block;
}

//описание данных возвращаемых с https://iss.moex.com/iss/engines/stock/markets/shares/securities.json
export interface Securities {
  securities: Block;
  marketdata: Block;
  dataversion: Block;
  marketdata_yields: Block;
}

// общее описание блока данных возвращаемого с одного ендпойнтв
export interface Block {
  metadata: {};
  columns: [];
  data: (string | number)[][];
}

export interface FieldTitles {
  [key: string]: FieldTitlesValues;
}

export interface FieldTitlesValues {
  shortTitle: string;
  title: string;
}

export interface Ticker {
  [key: string]: Company;
}

interface Company {
  name?: string;
  industry?: Industry;
}

export interface StrNumObj {
  [key: string]: number;
}

export enum Industry {
  "OilGas",
  "Financial",
  "IndustrialsFarm",
  "IndustrialsMachinery",
  "IndustrialsOther",
  "Telecom Services",
  "Transport",
  "Retail",
  "BasicMaterialsBlack",
  "BasicMaterialsColor",
  "BasicMaterialsGold",
  "BasicMaterialsMining",
  "BasicMaterialsChemicals",
  "BasicMaterialsSpecialtyChemicals",
  "Banks",
  "Energy",
  "Internet",
  "Electricity",
  "EnergySales",
  "Consumer",
  "HighTech",
  "Media",
  "Development",
  "Third",
}

export const IndustryRU: { [key: number]: string } = {
  [Industry.OilGas]: "Нефтегаз",
  [Industry.Financial]: "Финансы",
  [Industry.IndustrialsFarm]: "АгроПром и Пищепром",
  [Industry["Telecom Services"]]: "Телеком",
  [Industry.Transport]: "Транспорт",
  [Industry.Retail]: "Розница",
  [Industry.BasicMaterialsBlack]: "Черная мет.",
  [Industry.BasicMaterialsColor]: "Цветная мет.",
  [Industry.BasicMaterialsGold]: "Золото",
  [Industry.Banks]: "Банки",
  [Industry.BasicMaterialsMining]: "Горнодобывающие",
  [Industry.BasicMaterialsChemicals]: "Химия удобрения",
  [Industry.BasicMaterialsSpecialtyChemicals]: "Химия разное",
  [Industry.Energy]: "Э/Генерация",
  [Industry.EnergySales]: "Энергосбыт",
  [Industry.Internet]: "Интернет",
  [Industry.Electricity]: "Электросети",
  [Industry.Consumer]: "Потреб",
  [Industry.IndustrialsOther]: "Промышленность разное",
  [Industry.HighTech]: "High Tech",
  [Industry.Media]: "Медиа",
  [Industry.Development]: "Строители",
  [Industry.IndustrialsMachinery]: "Машиностроение",
  [Industry.Third]: "Третий эшелон",
};
