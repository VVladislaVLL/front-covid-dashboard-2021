import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { zip } from 'rxjs';

import { CountriesService } from 'src/app/shared/services/countries.service';
import { IBasicCountryInfo, ICovidGeneralData, InfoField } from 'src/app/models';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent implements OnInit {
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

  constructor(
    private countriesService: CountriesService,
    private changeDetection: ChangeDetectorRef,
  ) { }

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
    // this.countriesService.getCountriesData().pipe(take(1)).subscribe((data: IBasicCountryInfo[]) => {
    //   this.countriesData = data;
    //   this.isLoadingCountriesData = false;
    //   this.changeDetection.detectChanges();
    // });

  }

  public onSelectCountry(iso2: string): void {
    console.log('onSelectCountry iso2', iso2);
    // this.isLoadingSelectedCountry = true;
    // this.countriesService.getCountryBasicInfo(iso2)
    //   .pipe(take(1))
    //   .subscribe((countryBasicInfo: IBasicCountryInfo) => {
    //     this.selectedCountryInfo = countryBasicInfo;
    //     this.isLoadingSelectedCountry = false;
    //   });
  }

  public isEnoughDataToDisplayCountryInfoSidebar(): boolean {
    return this.countriesData.length > 0;
  }

  public handleOptionChanges(option: string): void {
  }
}
