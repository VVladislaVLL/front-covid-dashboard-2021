import { ScaleBand, ScaleLinear, Selection } from 'd3';

export type SVG = Selection<SVGGElement, unknown, null, undefined>;
export type NumericScaler = ScaleLinear<number, number>;
export type StringifiedScaler = ScaleBand<string>;
export const DEFAULT_BAR_CHART_COLOR = '#93B2EE';

export interface ICountryHistoryData {
  infected: number;
  recovered: number;
  dead: number;
  vaccinated: number;
  day: string;
}

export interface IDirtyChartData {
  id: string;
  iso2: string;
  name: string;
  history: ICountryHistoryData[];
}

export type INormalizeCountryHistoryData = (ICountryHistoryData & { valueToShow: number });

export interface INormalizedChartsData {
  id: string;
  iso2: string;
  name: string;
  history: INormalizeCountryHistoryData[];
}

export type TChartDataKey = 'infected' | 'dead' | 'vaccinated' | 'recovered';
