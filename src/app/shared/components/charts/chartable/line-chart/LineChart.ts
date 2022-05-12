import {
  IDirtyChartData, INormalizedChartsData,
  NumericScaler,
  SVG, TChartDataKey,
} from 'src/app/shared/components/charts/charts.contants';
import { axisBottom, axisLeft, line, scaleLinear, scaleTime } from 'd3';

export interface IBaseBarChartConfig {
  svg: SVG;
  frameWidth: number;
  frameHeight: number;
  data: IDirtyChartData;
}

export class LineChart {
  protected svg: SVG;
  protected dataKey: TChartDataKey;
  protected frameWidth: number;
  protected frameHeight: number;
  protected data: IDirtyChartData;

  protected xScale: any;
  protected yScale: NumericScaler;

  protected AXIS_TICK_SIZE_PX = 5;
  protected parentElement: any;
  protected X_AXIS_MARGIN_FROM_CHART_PX: number;
  protected BASE_FONT_SIZE_PX: number;
  protected BARS_COLOR_HEX: string;
  protected transformedData: IDirtyChartData;

  protected X_AXIS_LABELS_PADDINGS_PX = { left: 15, top: 10 };

  protected Y_AXIS_OFFSET_FROM_BARS_PX = 5;
  protected Y_AXIS_TICKS_OFFSET_FROM_AXIS = 10;
  protected MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX: number;
  private normalizedData: INormalizedChartsData;

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
    console.log('LINE CHART DATA', this.transformedData);

    this.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX = config.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX;
    this.xScale = this.initXScale(this.transformedData, this.frameWidth);
    this.yScale = this.initYScale(this.transformedData, this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX);
  }

  protected transformData(): any {
    return { ...this.data, history: this.data.history.map((record) => {
      return { ...record, day: new Date(record.day) };
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

  protected initXScale(data: any, widthPx: number) {
    // return scaleTime().rangeRound([0, widthPx]).domain(data.history.map((country: any) => {
    //   return country.day;
    // }));

    return scaleTime().rangeRound([0, widthPx]);
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

    const lineMy = line().x((d: any) => xScale(d.day)).y((d: any) => yScale(d[this.dataKey]));
    console.log('lineMy', lineMy);
    this.drawBarsWrapperIfNeeded(svg).append('path')
      .datum(data.history)
      .attr('fill', 'red')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', lineMy as any);
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
    data: any  ;
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
      this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX,
    );

    this.updateBars({
      svg: this.svg,
      data: this.transformedData,
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
    this.xScale = this.initXScale(this.transformedData, this.frameWidth);
    this.yScale = this.initYScale(this.transformedData, this.frameHeight - this.X_AXIS_MARGIN_FROM_CHART_PX);
  }
}
