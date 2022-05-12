import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { select } from 'd3';

import { DEFAULT_BAR_CHART_COLOR, IDirtyChartData, SVG, TChartDataKey } from './charts.contants';
import { VerticalBarChart } from './chartable/bar-chart/VerticalBarChart';
import { LineChart } from './chartable/line-chart/LineChart';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent implements OnChanges {
  @Input() data: IDirtyChartData;
  @Input() dataKey: TChartDataKey = 'infected';
  @Input() isLoadingChartsData: boolean = false;
  @Input() type: 'bar' | 'line' = 'bar';
  @Input() DEFAULT_BAR_CHART_COLOR: string = DEFAULT_BAR_CHART_COLOR;

  private VerticalBarChart: VerticalBarChart;
  private LineChart: LineChart;

  private DRAW_FRAME_MARGINS_PX = { top: 50, left: 100, bottom: 50, right: 50 };
  private VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX = { top: 50, left: 100, bottom: 50, right: 50 };
  private X_AXIS_MARGIN_FROM_CHART_PX = 10;
  private BASE_FONT_SIZE_PX = 16;
  private MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX = 30;

  constructor(
    private element: ElementRef,
    private changeDetector: ChangeDetectorRef,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.isNeedToDisplayCharts() && changes.data || changes.dataKey) {
      this.clearCanvas();
      this.initDrawableChartsIfNeeded();
      this.reinitChartsIfNeeded();
      switch (this.type) {
        case 'line':
          this.drawLineChart();
          break;
        case 'bar':
        default:
          this.drawBarChart();
          break;
      }
    }
  }

  public isNeedToDisplayCharts(): boolean {
    return this.data && this.data.history.length > 0;
  }

  private createDrawFrame(marginsSource = this.DRAW_FRAME_MARGINS_PX): SVG {
    const svg = select(this.element.nativeElement).select('.main');

    if (!svg.node()) {
      return select(this.element.nativeElement)
        .select('.charts')
        .append('g')
        .attr('class', 'main')
        .attr('transform', `translate(${marginsSource.left}, ${marginsSource.top})`);
    } else {
      svg.attr('transform', `translate(${marginsSource.left}, ${marginsSource.top})`);
      return svg as unknown as SVG;
    }
  }

  private getWidth() {
    return this.element.nativeElement.clientWidth;
  }

  private getHeight() {
    // return this.element.nativeElement.clientHeight;
    return 500;
  }

  private clearCanvas() {
    const node = this.element.nativeElement.querySelector('.charts');
    if (!node) {
      return;
    }
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  private getMaxHorizontalBarChartFrameHeight(marginsSource = this.DRAW_FRAME_MARGINS_PX) {
    return this.getHeight() - marginsSource.top - marginsSource.bottom;
  }

  private getHorizontalBarMaxWidth() {
    return (
      this.getWidth() -
      this.DRAW_FRAME_MARGINS_PX.left -
      this.DRAW_FRAME_MARGINS_PX.right
    );
  }

  private initDrawableChartsIfNeeded() {
    const commonBarChartDeps = {
      svg: this.createDrawFrame(),
      frameWidth: this.getHorizontalBarMaxWidth(),
      frameHeight: this.getMaxHorizontalBarChartFrameHeight(),
      data: this.data,
      dataKey: this.dataKey,
      parentElement: this.element,
      DRAW_FRAME_MARGINS_PX: this.DRAW_FRAME_MARGINS_PX,
      X_AXIS_MARGIN_FROM_CHART_PX: this.X_AXIS_MARGIN_FROM_CHART_PX,
      BASE_FONT_SIZE_PX: this.BASE_FONT_SIZE_PX,
    };


    switch (this.type) {
      case 'line':
        this.initLineChartIfNeeded(commonBarChartDeps);
        break;
      case 'bar':
      default:
        this.initVertical1dBarChartIfNeeded(commonBarChartDeps);
        break;
    }
    // if (this.type === 'bar') {
    //   this.initVertical1dBarChartIfNeeded(commonBarChartDeps);
    // }
  }

  private reinitChartsIfNeeded() {
    switch (this.type) {
      case 'line':
        this.LineChart.reinitData({
          svg: this.createDrawFrame(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
          frameWidth: this.getHorizontalBarMaxWidth(),
          frameHeight: this.getMaxHorizontalBarChartFrameHeight(
            this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX,
          ),
          data: this.data,
          barsColorHex: this.DEFAULT_BAR_CHART_COLOR,
        });
        break;
      case 'bar':
      default:
        this.VerticalBarChart.reinitData({
          svg: this.createDrawFrame(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
          frameWidth: this.getHorizontalBarMaxWidth(),
          frameHeight: this.getMaxHorizontalBarChartFrameHeight(
            this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX,
          ),
          data: this.data,
          barsColorHex: this.DEFAULT_BAR_CHART_COLOR,
        });
        break;
    }
  }

  private initVertical1dBarChartIfNeeded(deps: any) {
    this.VerticalBarChart = new VerticalBarChart({
      ...deps,
      svg: this.createDrawFrame(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
      frameWidth: this.getHorizontalBarMaxWidth(),
      frameHeight: this.getMaxHorizontalBarChartFrameHeight(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
      MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX: this.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX,
      DRAW_FRAME_MARGINS_PX: this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX,
      BARS_COLOR_HEX: this.DEFAULT_BAR_CHART_COLOR,
    });
  }

  private initLineChartIfNeeded(deps: any) {
    this.LineChart = new LineChart({
      ...deps,
      svg: this.createDrawFrame(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
      frameWidth: this.getHorizontalBarMaxWidth(),
      frameHeight: this.getMaxHorizontalBarChartFrameHeight(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
      MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX: this.MIN_VERTICAL_BAR_CHART_ELEMENT_HEIGHT_PX,
      DRAW_FRAME_MARGINS_PX: this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX,
      BARS_COLOR_HEX: this.DEFAULT_BAR_CHART_COLOR,
    });
  }

  private drawBarChart() {
    this.VerticalBarChart.draw();
  }

  private drawLineChart() {
    this.LineChart.draw();
  }
}
