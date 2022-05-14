import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges, EventEmitter, Output, ElementRef,
} from '@angular/core';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { CountriesService } from 'src/app/shared/services/countries.service';
import { IBasicCountryInfo } from 'src/app/models';
import { BaseComponent } from 'src/app/shared/components/base-component/base-component';
import { Plotly } from 'angular-plotly.js/lib/plotly.interface';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent extends BaseComponent implements OnChanges {
  @Input() iso2: string;
  @Output() onClose = new EventEmitter<void>();

  public isLoading: boolean = true;
  public countryCovidHistory: any;
  public countryCovidOverview: any;
  public basicCountryData: IBasicCountryInfo;

  private countryCovidPredictionData: any;
  private readonly DAY: string = 'day';

  constructor(
    private countriesService: CountriesService,
    protected changeDetector: ChangeDetectorRef,
    private element: ElementRef,
  ) {
    super();
  }

  private getWidth(): number {
    return this.element.nativeElement.clientWidth;
  }

  public get countryName(): string {
    return this.basicCountryData?.name || this.countryCovidHistory?.name;
  }

  public get countryFlag(): string {
    return this.basicCountryData?.flag;
  }

  public getTooltipText(field: string): string {
    return `There are no recorded cases or this country doesn't provide information about ${field} from COVID-19`;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.iso2 && changes.iso2.currentValue) {
      this.isLoading = true;

      const dataSubscription = zip(
        this.countriesService.getGeneralCountryInfoByISO2(this.iso2),
        this.countriesService.getCountryCovidHistoryByISO2A(this.iso2),
        this.countriesService.getCountryCovidOverviewByISO2A(this.iso2),
        this.countriesService.getCountryCovidPredictionByISO2A(this.iso2),
      )
        .pipe(take(1)).subscribe(([basicCountryInfo, countryCovidHistory, countryCovidOverview, countryCovidPrediction]) => {
          console.log('COUNTRYCOVIDOVERVIEW', countryCovidOverview);
          this.countryCovidHistory = countryCovidHistory;
          this.countryCovidOverview = countryCovidOverview;
          this.basicCountryData = basicCountryInfo;
          this.countryCovidPredictionData = countryCovidPrediction;
          this.isLoading = false;
          this.changeDetector.markForCheck();
        });
      this.subscriptions.add(dataSubscription);
    }
  }

  public get todayNewCases(): number {
    const length = this.countryCovidHistory.history?.length;
    return  this.countryCovidHistory.history[length - 1].infected - this.countryCovidHistory.history[length - 2].infected;
  }

  public get todayNewDeaths(): number {
    const length = this.countryCovidHistory.history?.length;
    return  this.countryCovidHistory.history[length - 1].dead - this.countryCovidHistory.history[length - 2].dead;
  }

  public get totalCases(): number {
    return this.basicCountryData.infected;
  }

  public get totalDeaths(): number {
    return this.basicCountryData.dead;
  }

  public get peopleVaccinated(): number {
    return this.basicCountryData.vaccinated;
  }

  public get activeCases(): number {
    return this.basicCountryData.sick;
  }

  public get population(): number {
    return this.basicCountryData.population;
  }

  public get casePerMillion(): string {
    return (this.basicCountryData.infected / 1000000).toFixed(2) + '/M';
  }

  public get deathsPerMillion(): string {
    return (this.basicCountryData.dead / 1000000).toFixed(2) + '/M';
  }

  public get recoveries(): number {
    return this.basicCountryData.recovered;
  }

  public get fatalityRate(): string {
    return (this.basicCountryData.dead / this.basicCountryData.infected * 100).toFixed(2) + '%';
  }

  public closeDetails(): void {
    this.onClose.emit();
  }

  public getDataForPredictionLinePlot(): Plotly.Data[] {
    const lineWidth = 3;
    console.log('this.countryCovidPredictionData', this.countryCovidPredictionData);
    const infectedData = this.transformDataToPlotlyFormat(this.countryCovidPredictionData.history, this.DAY, 'infected');
    const vaccinatedData = this.transformDataToPlotlyFormat(this.countryCovidPredictionData.history, this.DAY, 'vaccinated');
    const recoveredData = this.transformDataToPlotlyFormat(this.countryCovidPredictionData.history, this.DAY, 'recovered');
    const sickData = this.transformDataToPlotlyFormat(this.countryCovidPredictionData.history, this.DAY, 'sick');
    const deadData = this.transformDataToPlotlyFormat(this.countryCovidPredictionData.history, this.DAY, 'dead');

    const infectedPlotlyData = {
      x: infectedData.x,
      y: infectedData.y,
      type: 'scatter',
      line: {
        color: 'rgba(255,19,41,0.5)',
        width: lineWidth,
      },
      name: 'Predicted Infected',
    };

    const vaccinatedPlotlyData = {
      x: vaccinatedData.x,
      y: vaccinatedData.y,
      type: 'scatter',
      line: {
        color: '#1C82FF',
        width: lineWidth,
      },
      name: 'Predicted Vaccinated',
    };

    const recoveredPlotlyData = {
      x: recoveredData.x,
      y: recoveredData.y,
      type: 'scatter',
      line: {
        color: '#70A32E',
        width: lineWidth,
      },
      name: 'Predicted Recovered',
    };

    const deadPlotlyData = {
      x: deadData.x,
      y: deadData.y,
      type: 'scatter',
      line: {
        color: '#d58000',
        width: lineWidth,
      },
      name: 'Predicted Deaths',
    };

    const sickPlotlyData = {
      x: sickData.x,
      y: sickData.y,
      type: 'scatter',
      line: {
        color: '#9a66ff',
        width: lineWidth,
      },
      name: 'Predicted Sick',
    };

    // const data = {
    //   x,
    //   y,
    //   type: 'scatter',
    //   name: 'Prediction',
    //   line: {
    //     color: 'rgba(255,19,41,0.5)',
    //     width: 3,
    //   },
    // };
    // return [infectedPlotlyData, vaccinatedPlotlyData, recoveredPlotlyData, deadPlotlyData, sickPlotlyData];
    return [infectedPlotlyData, recoveredPlotlyData, deadPlotlyData];
  }

  public getLayoutForPredictionLinePlot(title: string = 'Infected'): Plotly.Layout {
    return {
      title,
      width: this.getWidth() - 200,
      height: 500,
      xaxis: {
        title: 'Date',
        showgrid: true,
        zeroline: true,
        gridcolor: 'rgba(255,255,255,0.19)',
      },
      yaxis: {
        title: 'People',
        showline: true,
        gridcolor: 'rgba(255,255,255,0.19)',
      },
      legend: {
        y: 0.5,
        traceorder: 'reversed',
        font: { size: 16 },
        yref: 'paper',
      },
      plot_bgcolor: 'rgb(20, 20, 20)',
      paper_bgcolor: 'rgb(20, 20, 20)',
      separotors: '.',
      font: {
        color: 'rgba(255,255,255,0.7)',
      },
      autosize: true,
      showlegend: true,
      transition: {
        
      },
    };
  }

  public transformDataToPlotlyFormat(originalData: { [key: string]: string | number }[], keyX: string, keyY: string): { x: (string | number)[]; y: (string | number)[] } {
    return originalData.reduce<{ x: (string | number)[]; y: (string | number)[] }>((data, dayCovidData) => {
      data.x.push(dayCovidData[keyX]);
      data.y.push(dayCovidData[keyY]);
      return data;
    }, { x: [], y: [] });
  }

  public getFirstChartsData() {
    const dayKey = 'day';
    const infectedData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, dayKey, 'infected');
    const vaccinatedData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, dayKey, 'vaccinated');
    const recoveredData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, dayKey, 'recovered');
    const infectedPlotlyData = {
      x: infectedData.x,
      y: infectedData.y,
      type: 'bar',
      marker: {
        color: '#A33636',
      },
      name: 'Infected',
    };

    const vaccinatedPlotlyData = {
      x: vaccinatedData.x,
      y: vaccinatedData.y,
      type: 'bar',
      marker: {
        color: '#1C82FF',
      },
      name: 'Vaccinated',
    };

    const recoveredPlotlyData = {
      x: recoveredData.x,
      y: recoveredData.y,
      type: 'bar',
      marker: {
        color: '#70A32E',
      },
      name: 'Recovered',
    };

    return [infectedPlotlyData, vaccinatedPlotlyData, recoveredPlotlyData];
  }

  public getSecondChartsData() {
    const sickData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'sick');
    const deadData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'dead');

    const deadPlotlyData = {
      x: deadData.x,
      y: deadData.y,
      type: 'bar',
      marker: {
        color: '#d50000',
      },
      name: 'Deaths',
    };

    const sickPlotlyData = {
      x: sickData.x,
      y: sickData.y,
      type: 'bar',
      marker: {
        color: '#9a66ff',
      },
      name: 'Sick',
    };
    return [deadPlotlyData, sickPlotlyData];
  }

  // public getDataForBarCharts(): Plotly.Data[] {
  //   const infectedData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'infected');
  //   const vaccinatedData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'vaccinated');
  //   const recoveredData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'recovered');
  //   const sickData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'sick');
  //   const deadData = this.transformDataToPlotlyFormat(this.countryCovidOverview.history, this.DAY, 'dead');
  //
  //   const infectedPlotlyData = {
  //     x: infectedData.x,
  //     y: infectedData.y,
  //     type: 'bar',
  //     marker: {
  //       color: '#A33636',
  //     },
  //     name: 'Infected',
  //   };
  //
  //   const vaccinatedPlotlyData = {
  //     x: vaccinatedData.x,
  //     y: vaccinatedData.y,
  //     type: 'bar',
  //     marker: {
  //       color: '#1C82FF',
  //     },
  //     name: 'Vaccinated',
  //   };
  //
  //   const recoveredPlotlyData = {
  //     x: recoveredData.x,
  //     y: recoveredData.y,
  //     type: 'bar',
  //     marker: {
  //       color: '#70A32E',
  //     },
  //     name: 'Recovered',
  //   };
  //
  //   const deadPlotlyData = {
  //     x: deadData.x,
  //     y: deadData.y,
  //     type: 'bar',
  //     marker: {
  //       color: '#4f1515',
  //     },
  //     name: 'Deaths',
  //   };
  //
  //   const sickPlotlyData = {
  //     x: sickData.x,
  //     y: sickData.y,
  //     type: 'bar',
  //     marker: {
  //       color: '#ea68ff',
  //     },
  //     name: 'Sick',
  //   };
  //
  //   return [infectedPlotlyData, vaccinatedPlotlyData, recoveredPlotlyData, deadPlotlyData, sickPlotlyData];
  // }
}
