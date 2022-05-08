import {
  IDirtyChartData,
  NumericScaler,
  StringifiedScaler,
  SVG, TChartDataKey,
} from 'src/app/shared/components/charts/charts.contants';
import { DatePipe } from '@angular/common';

export interface IBaseBarChartConfig {
  svg: SVG;
  frameWidth: number;
  frameHeight: number;
  data: IDirtyChartData;
}

export class BarChart {
  protected svg: SVG;
  protected dataKey: TChartDataKey;
  protected frameWidth: number;
  protected frameHeight: number;
  protected data: IDirtyChartData;

  protected xScale: StringifiedScaler;
  protected yScale: NumericScaler;

  protected AXIS_TICK_SIZE_PX = 5;
  protected parentElement: any;
  protected X_AXIS_MARGIN_FROM_CHART_PX: number;
  protected BASE_FONT_SIZE_PX: number;
  protected BARS_COLOR_HEX: string;
  protected transformedData: IDirtyChartData;

  constructor(config: any) {
    this.svg = config.svg;
    this.frameHeight = config.frameHeight;
    this.frameWidth = config.frameWidth;
    this.data = config.data;
    this.dataKey = config.dataKey;
    this.parentElement = config.parentElement;
    this.X_AXIS_MARGIN_FROM_CHART_PX = config.X_AXIS_MARGIN_FROM_CHART_PX;
    this.BASE_FONT_SIZE_PX = config.BASE_FONT_SIZE_PX;
    this.BARS_COLOR_HEX = config.BARS_COLOR_HEX;
    this.transformedData = this.transformData();
  }

  protected transformData(): IDirtyChartData {
    const datePipe = new DatePipe('en-US');
    return { ...this.data, history: this.data.history.map((record) => {
      return { ...record, day: datePipe.transform(record.day, 'MMM y') as string };
    }) };
  }

  protected drawXAxisWrapperIfNeeded(
    svg: SVG,
    heightPx: number,
  ) {
    let xAxisSelector = 'x-axis';
    const xAxis = svg.select(`.${xAxisSelector}`);

    if (xAxis.node()) {
      return (xAxis as unknown as SVG).attr('transform', `translate(0,${heightPx})`);
    } else {
      return svg
        .append('g')
        .attr('class', xAxisSelector)
        .attr('transform', `translate(0,${heightPx})`);
    }
  }

  protected drawYAxisWrapperIfNeeded(
    svg: SVG,
    leftOffsetPx: number = 0,
    topOffsetPx: number = 0,
  ): SVG {
    let yAxisSelector = 'y-axis';
    const yAxis = svg.select(`.${yAxisSelector}`);

    if (yAxis.node()) {
      return (yAxis as unknown as SVG).attr('transform', `translate(${leftOffsetPx}, 0)`);
    } else {
      return svg
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${leftOffsetPx}, ${topOffsetPx})`);
    }
  }

  protected drawBarsWrapperIfNeeded(svg: SVG): SVG {
    const barsWrapper = svg.select('.bars');

    if (!barsWrapper.node()) {
      return svg
        .append('g')
        .attr('class', 'bars')
        .attr('transform', 'translate(0,0)');
    } else {
      return barsWrapper as unknown as SVG;
    }
  }

  protected normalizeData(data: IDirtyChartData, normalizeIfNeeded: (itemsCount: number) => number) {
    return {
      ...data,
      history: data.history.map(node => {
        // const date = new Date(node.day).getUTCDate().toLocaleString();
        return ({
          ...node,
          valueToShow: normalizeIfNeeded(node[this.dataKey]),
          // day: date,
        });
      }),
    };
  }

  // protected drawValuesInsideBarsWrapperIfNeeded(svg: SVG): SVG {
  //   const barsValuesWrapper = svg.select('.values-inside-bars');
  //
  //   if (!barsValuesWrapper.node()) {
  //     return svg
  //       .append('g')
  //       .attr('class', 'values-inside-bars')
  //       .attr('transform', 'translate(0,0)');
  //   } else {
  //     return barsValuesWrapper as unknown as SVG;
  //   }
  // }
  //
  // protected drawTotalValuesWrapperIfNeeded(svg: SVG): SVG {
  //   const barsTotalValuesWrapper = svg.select('.totals-values');
  //
  //   if (!barsTotalValuesWrapper.node()) {
  //     return svg
  //       .append('g')
  //       .attr('class', 'totals-values')
  //       .attr('transform', 'translate(0,0)');
  //   } else {
  //     return barsTotalValuesWrapper as unknown as SVG;
  //   }
  // }
  //
  // protected waitEndAllTransitionsBeforeCallback(transition: Transition<any, any, any, any>, callback: () => void) {
  //   let animationCounter: number;
  //   if (transition.empty()) {
  //     callback();
  //   } else {
  //     animationCounter = transition.size();
  //     transition.on('end', () => {
  //       animationCounter--;
  //       if (animationCounter === 0) {
  //         callback();
  //       }
  //     });
  //   }
  // }
  //
  // protected clearBarsIfNeeded(): void {
  //   const bars = this.svg.select('.bars').selectAll('g');
  //   if (!bars.empty()) {
  //     bars.data([]).exit().remove();
  //   }
  // }
}
