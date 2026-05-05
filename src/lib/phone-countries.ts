import { countries as COUNTRY_FLAG_CODES } from "country-flag-icons";

export type PhoneCountry = {
  iso2: string;
  name: string;
  dial: string;
};

const COUNTRY_DIAL_BY_ISO2: Record<string, string> = {
  US: "1",
  CA: "1",
  RU: "7",
  KZ: "7",
  EG: "20",
  ZA: "27",
  GR: "30",
  GB: "44",
  DK: "45",
  PL: "48",
  AU: "61",
  NZ: "64",
  VN: "84",
  ID: "62",
  TH: "66",
  SG: "65",
  MY: "60",
  PH: "63",
  IN: "91",
  CN: "86",
  TR: "90",
  PK: "92",
  AF: "93",
  LK: "94",
  MM: "95",
  IR: "98",
  JP: "81",
  KR: "82",
  DE: "49",
  FR: "33",
  BE: "32",
  HU: "36",
  RO: "40",
  CH: "41",
  AT: "43",
  ES: "34",
  IT: "39",
  NL: "31",
  SE: "46",
  NO: "47",
  PE: "51",
  CU: "53",
  AR: "54",
  CL: "56",
  CO: "57",
  VE: "58",
  BR: "55",
  MX: "52",
};

const countryNameFormatter = new Intl.DisplayNames(["en"], { type: "region" });

function getCountryName(iso2: string): string {
  try {
    return countryNameFormatter.of(iso2) ?? iso2;
  } catch {
    return iso2;
  }
}

export const PHONE_COUNTRIES: PhoneCountry[] = COUNTRY_FLAG_CODES.map((iso2) => ({
  iso2,
  name: getCountryName(iso2),
  dial: COUNTRY_DIAL_BY_ISO2[iso2] ?? "",
})).sort((a, b) => a.name.localeCompare(b.name));

export function getDefaultPhoneCountry(): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.iso2 === "US") ?? PHONE_COUNTRIES[0];
}