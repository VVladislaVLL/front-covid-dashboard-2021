import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges, Output, EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { CountriesService } from 'src/app/shared/services/countries.service';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent implements OnChanges {
  @Input() iso2: string;
  @Output() onClose = new EventEmitter<void>();

  public isLoading: boolean = true;
  public country: any;

  private paramsSubscription: Subscription;

  constructor(
    private countriesService: CountriesService,
    protected changeDetector: ChangeDetectorRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.iso2 && changes.iso2.currentValue) {
      this.isLoading = true;
      this.countriesService.getFullCountryInfoByISO2A(this.iso2).subscribe((countryInfo) => {
        console.log('this.country', countryInfo);
        this.country = countryInfo;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      });
    }
  }

  // public ngOnInit(): void {
  //   console.log('ngOnInit details');
  //   // this.paramsSubscription = this.route.params.pipe().subscribe((params) => {
  //   //   console.log('params', params[ISO_2A_ROUTE_PARAM]);
  //   //   const countryISO2A = params[ISO_2A_ROUTE_PARAM];
  //   //   this.country = this.countriesService.getFullCountryInfoByISO2A(countryISO2A);
  //   // });
  //   // this.subscriptions.push(
  //   //   this.router.events.pipe(
  //   //     // filter((event) => event instanceof NavigationEnd)
  //   //   ).subscribe((event) => {
  //   //     console.log('event', event);
  //   //     console.log('this.router.routerState.snapshot.root.queryParams', this.router.routerState.snapshot.root.queryParams);
  //   //   }),
  //   // this.route.params.subscribe((params) => {
  //   //   console.log('params', params);
  //   // }),
  //   // );
  // }
  closeDetails(): void {
    this.onClose.emit();
  }
  // public ngOnDestroy(): void {
  //   this.subscriptions.forEach((subscription) => {
  //     subscription.unsubscribe();
  //   });
  // }

}
