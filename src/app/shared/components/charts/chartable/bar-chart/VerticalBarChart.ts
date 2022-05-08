import { axisBottom, axisLeft, scaleBand, scaleLinear, transition } from 'd3';

import { BarChart } from './BarChart';
import {
  IDirtyChartData, INormalizeCountryHistoryData, INormalizedChartsData,
  NumericScaler, StringifiedScaler,
  SVG,
} from 'src/app/shared/components/charts/charts.contants';
// import { DatePipe } from '@angular/common';

export class VerticalBarChart extends BarChart {
  protected X_AXIS_LABELS_PADDINGS_PX = { left: 15, top: 10 };

  protected Y_AXIS_OFFSET_FROM_BARS_PX = 5;
  protected Y_AXIS_TICKS_OFFSET_FROM_AXIS = 10;
  protected MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX: number;
  private normalizedData: INormalizedChartsData;

  constructor(config: any) {
    super(config);
    this.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX = config.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX;
    this.xScale = this.initXScale(this.transformedData, this.frameWidth);
    // this.xScale = this.initXScale(this.data, this.frameWidth);
    // this.yScale = this.initYScale(this.data, this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX);
    this.yScale = this.initYScale(this.transformedData, this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX);

    this.normalizedData = this.normalizeData(
      // this.data,
      this.transformedData,
      this.basedOnMinBarHeightDataNormalizer,
    );
  }

  protected initXScale(data: IDirtyChartData, widthPx: number): StringifiedScaler {
    // const datePipe = new DatePipe('en-US');
    return scaleBand()
      .rangeRound([0, widthPx])
      .paddingInner(0.05)
      .align(0.1)
      .domain(data.history.map((country) => {
        // return datePipe.transform(country.day, 'MMM y') as string;
        return country.day;
      })) as StringifiedScaler;
  }

  protected drawYAxis(svg: SVG, yScale: NumericScaler) {
    const ticksInnerSizePx = -this.AXIS_TICK_SIZE_PX;
    const offsetFromBars = -this.Y_AXIS_OFFSET_FROM_BARS_PX;
    const ticksOffsetFromAxis = this.Y_AXIS_TICKS_OFFSET_FROM_AXIS;

    this.drawYAxisWrapperIfNeeded(svg, offsetFromBars)
      .call(
        axisLeft(yScale)
          .scale(yScale)
          .tickSizeOuter(0)
          .tickSizeInner(ticksInnerSizePx)
          .tickPadding(ticksOffsetFromAxis),
      )
      .attr('text-anchor', 'end');
  }

  protected updateYAxis(svg: SVG, yScale: NumericScaler) {
    svg.select('.y-axis')
      .selectAll('g')
      .data([])
      .exit()
      .remove();

    this.drawYAxis(svg, yScale);
  }

  protected initYScale(data: IDirtyChartData, heightPx: number): NumericScaler {
    return scaleLinear()
      .rangeRound([heightPx, 0])
      .domain([0, Math.max(...data.history.map(country => country[this.dataKey]))]) as NumericScaler;
  }

  protected drawXAxis(svg: SVG, heightPx: number, bottomOffsetPx: number, xScale: any) {
    const ticksInnerSizePx = -this.AXIS_TICK_SIZE_PX;
    const axisWrapper = this.drawXAxisWrapperIfNeeded(svg, heightPx);

    axisWrapper
      .call(
        axisBottom(xScale)
          .tickSizeOuter(0)
          .tickSizeInner(ticksInnerSizePx)
          .tickFormat((labelId: any) => {
            return labelId;
          }),
      )
      .selectAll('text')
      .attr('y', 0)
      .attr('dy', 0)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('transform', `translate(0,${this.X_AXIS_LABELS_PADDINGS_PX.top}) rotate(-90)`)
      .append('title')
      .text((tickDisplayId: any) => {
        return tickDisplayId;
      });
  }

  protected drawBars({
    svg,
    data,
    xScale,
    yScale,
    frameHeightPx,
    barsConfig,
  }: {
    svg: SVG;
    data: INormalizedChartsData;
    xScale: any;
    yScale: NumericScaler;
    frameHeightPx: number;
    barsConfig: { barsColor: string; enableTransition: boolean };
  }) {
    const transitionOption = barsConfig.enableTransition ? transition().duration(500) : transition().duration(0);

    this.drawBarsWrapperIfNeeded(svg)
      .selectAll('g')
      .data(data.history)
      .enter()
      .append('g')
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', barsConfig.barsColor)
      .attr('x', (node: INormalizeCountryHistoryData) => {
        return xScale(node.day);
      })
      .attr('y', (node: INormalizeCountryHistoryData) => {
        return yScale(node.valueToShow);
      })
      .attr('width', () => {
        return xScale.bandwidth();
      })
      .transition(transitionOption as any)
      .attr('height', (node: INormalizeCountryHistoryData) => {
        return frameHeightPx - yScale(node.valueToShow);
      });
  }

  protected updateBars({
    svg,
    data,
    xScale,
    yScale,
    frameHeightPx,
    barsConfig,
  }: {
    svg: SVG;
    data: INormalizedChartsData;
    xScale: any;
    yScale: NumericScaler;
    frameHeightPx: number;
    barsConfig: { barsColor: string; enableTransition: boolean };
  }) {
    svg.select('.bars')
      .selectAll('g')
      .data([])
      .exit()
      .remove();

    this.drawBars({ svg, data, xScale, yScale, frameHeightPx, barsConfig });
  }

  public draw() {
    this.xScale = this.xScale.rangeRound([
      this.Y_AXIS_OFFSET_FROM_BARS_PX,
      this.frameWidth,
    ]);
    this.yScale = this.initYScale(
      this.transformedData,
      // this.data,
      this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX,
    );

    this.updateBars({
      svg: this.svg,
      data: this.normalizedData,
      xScale: this.xScale,
      yScale: this.yScale,
      frameHeightPx: this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX,
      barsConfig: {
        barsColor: this.BARS_COLOR_HEX,
        enableTransition: true,
      },
    });

    this.drawXAxis(
      this.svg,
      this.frameHeight,
      this.parentElement.nativeElement.clientHeight -
      this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX,
      this.xScale,
    );

    this.drawYAxis(this.svg, this.yScale);
  }

  public reinitData({
    svg,
    data,
    barsColorHex,
    frameHeight,
    frameWidth,
  }: {
    svg: SVG;
    data: IDirtyChartData;
    barsColorHex?: string;
    frameHeight: number;
    frameWidth: number;
  }) {
    this.svg = svg;
    this.frameHeight = frameHeight;
    this.frameWidth = frameWidth;
    if (barsColorHex) {
      this.BARS_COLOR_HEX = barsColorHex;
    }
    this.data = data;
    this.transformedData = this.transformData();
    // this.xScale = this.initXScale(this.data, this.frameWidth);
    this.xScale = this.initXScale(this.transformedData, this.frameWidth);
    this.yScale = this.initYScale(this.transformedData, this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX);
    // this.yScale = this.initYScale(this.data, this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX);
    this.normalizedData = this.normalizeData(this.transformedData, this.basedOnMinBarHeightDataNormalizer);
    // this.normalizedData = this.normalizeData(this.data, this.basedOnMinBarHeightDataNormalizer);
  }

  protected basedOnMinBarHeightDataNormalizer = (value: number) => {
    return this.yScale(value) > this.frameHeight - this.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX &&
    value !== 0
      ? this.yScale.invert(this.frameHeight - this.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX)
      : value;
  };
}
