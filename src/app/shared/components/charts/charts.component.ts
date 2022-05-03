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

  private VerticalBarChart: VerticalBarChart;

  private DRAW_FRAME_MARGINS_PX = { top: 50, left: 200, bottom: 50, right: 200 };
  private VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX = { top: 50, left: 200, bottom: 50, right: 200 };
  private X_AXIS_MARGIN_FROM_CHART_PX = 10;
  private DEFAULT_BAR_CHART_COLOR = DEFAULT_BAR_CHART_COLOR;
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
      this.drawBarChart();
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
    return this.element.nativeElement.clientHeight;
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

    this.initVertical1dBarChartIfNeeded(commonBarChartDeps);
  }

  private reinitChartsIfNeeded() {
    this.VerticalBarChart.reinitData({
      svg: this.createDrawFrame(this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX),
      frameWidth: this.getHorizontalBarMaxWidth(),
      frameHeight: this.getMaxHorizontalBarChartFrameHeight(
        this.VERTICAL_BAR_CHART_DRAW_FRAME_MARGINS_PX,
      ),
      data: this.data,
      barsColorHex: this.DEFAULT_BAR_CHART_COLOR,
    });
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

  private drawBarChart() {
    this.VerticalBarChart.draw();
  }
}
