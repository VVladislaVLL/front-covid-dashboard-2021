import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges, EventEmitter, Output,
} from '@angular/core';
import { Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { CountriesService } from 'src/app/shared/services/countries.service';
import { IBasicCountryInfo } from 'src/app/models';
import { BaseComponent } from 'src/app/shared/components/base-component/base-component';

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

  private paramsSubscription: Subscription;

  constructor(
    private countriesService: CountriesService,
    protected changeDetector: ChangeDetectorRef,
  ) {
    super();
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
      )
        .pipe(take(1)).subscribe(([basicCountryInfo, countryCovidHistory, countryCovidOverview]) => {
          this.countryCovidHistory = countryCovidHistory;
          this.countryCovidOverview = countryCovidOverview;
          this.basicCountryData = basicCountryInfo;
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
}
