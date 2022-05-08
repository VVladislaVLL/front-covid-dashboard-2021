import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CountriesService } from 'src/app/shared/services/countries.service';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss'],
  animations: [
    trigger('slideOnHideAnimation', [
      state('right', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
      state('left', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
      state('in', style({ transform: 'translate3d(0%, 0, 0)' })),

      transition('right->in', animate('300ms ease-out')),
      transition('in->right', animate('300ms ease-out')),
      transition('left->in', animate('300ms ease-out')),
      transition('in->left', animate('300ms ease-out')),
    ]),
    trigger('slideOnDestroyAnimation', [
      state('right', style({ transform: 'translate3d(0%, 0, 0)' })),
      state('left', style({ transform: 'translate3d(0%, 0, 0)' })),

      transition('void->right', [style({ transform: 'translate3d(100%, 0, 0)' }), animate('300ms ease-out')]),
      transition('right->void', [animate('300ms ease-out', style({ transform: 'translate3d(100%, 0, 0)' }))]),
      transition('void->left', [style({ transform: 'translate3d(-100%, 0, 0)' }), animate('300ms ease-out')]),
      transition('left->void', [animate('300ms ease-out', style({ transform: 'translate3d(-100%, 0, 0)' }))]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent implements OnChanges {
  @Input() iso2: string;
  private paramsSubscription: Subscription;
  private country: any;
  constructor(
    private countriesService: CountriesService,
    protected changeDetector: ChangeDetectorRef,
    protected router: Router,
    protected route: ActivatedRoute,
  ) { }

  public date = Date.now();
  // private subscriptions: Subscription[] = [];
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.iso2 && changes.iso2.currentValue) {
      console.log('iso2', this.iso2);
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

  // public ngOnDestroy(): void {
  //   this.subscriptions.forEach((subscription) => {
  //     subscription.unsubscribe();
  //   });
  // }

}
