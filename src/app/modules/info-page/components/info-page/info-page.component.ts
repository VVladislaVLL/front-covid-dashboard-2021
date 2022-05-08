import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject, Subscription, zip } from 'rxjs';

import { CountriesService } from 'src/app/shared/services/countries.service';
import { IBasicCountryInfo, ICovidGeneralData, InfoField } from 'src/app/models';
import { inOutAnimation } from 'src/app/utils';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [inOutAnimation],
})
export class InfoPageComponent implements OnInit, OnDestroy {
  public selectedCountryInfo: IBasicCountryInfo | null = null;
  public isLoadingSelectedCountry: boolean = false;
  public isLoadingCountriesData: boolean = false;
  public countriesData: IBasicCountryInfo[] = [];
  public covidGeneralData: ICovidGeneralData;
  public selectedOptions: { value: InfoField; viewValue: string; selected: boolean; }[] = [
    { value: InfoField.Infected, viewValue: 'Infected', selected: true },
    { value: InfoField.Vaccinated, viewValue: 'Vaccinated', selected: false },
    { value: InfoField.Recovered, viewValue: 'Recovered', selected: false },
    { value: InfoField.Dead, viewValue: 'Dead', selected: false },
  ];

  private subscriptions: Subscription[] = [];
  public isDetailsOpen: boolean = false;
  public openDetailsSubject$ = new BehaviorSubject<string>('');

  constructor(
    private countriesService: CountriesService,
    private changeDetection: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.subscriptions.push(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.openDetailsSubject$.next(this.router.routerState.snapshot.root.queryParams.id);
      }),
    );
  }

  get selectedOption(): { value: InfoField; viewValue: string; selected: boolean; } {
    return this.selectedOptions.find(option => option.selected) || this.selectedOptions[0];
  }

  public ngOnInit(): void {
    this.isLoadingCountriesData = true;
    zip(
      this.countriesService.getCovidGeneralData(),
      this.countriesService.getCountriesData(),
    ).pipe(take(1)).subscribe(([covidGeneralData, data]: [ICovidGeneralData, IBasicCountryInfo[]]) => {
      this.countriesData = data;
      this.covidGeneralData = covidGeneralData;
      this.isLoadingCountriesData = false;
      this.changeDetection.detectChanges();
    });
  }

  public onSelectCountry(iso2: string): void {
    console.log('onSelectCountry iso2', iso2);
    this.isDetailsOpen = true;
    this.router.navigate(['/info'], {
      queryParams: { id: iso2 },
    });
  }

  public isEnoughDataToDisplayCountryInfoSidebar(): boolean {
    return this.countriesData.length > 0;
  }

  public handleOptionChanges(option: string): void {
  }

  public onCountryDetailsClose(): void {
    this.router.navigate(['/info']);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
