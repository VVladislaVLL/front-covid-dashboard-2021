export interface IBasicCountryInfo {
  countryId: string;
  name: string;
  iso2: string;
  iso3: string;
  population: number,
  flag: string;
  infected: number;
  sick: number;
  dead: number
  recovered: number;
  vaccinated: number;
  lastUpdated: Date | string;
}

export interface ICovidGeneralData extends Pick<
IBasicCountryInfo,
'infected' | 'recovered' | 'dead' | 'sick' | 'vaccinated' | 'lastUpdated'
> {}

export enum InfoField {
  Infected = 'infected',
  Recovered = 'recovered',
  Dead = 'dead',
  Sick = 'sick',
  Vaccinated = 'vaccinated',
}
