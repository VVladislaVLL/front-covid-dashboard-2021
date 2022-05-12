import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { CountryRowComponent } from './components/sidebar/country-row/country-row.component';
import { GeneralInfoComponent } from './components/sidebar/general-info/general-info.component';
import { MapComponent } from './components/map/map/map.component';
import { SearchComponent } from './components/sidebar/search/search.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { CountriesListComponent } from './components/sidebar/countries-list/countries-list.component';
import { LegendComponent } from './components/map/legend/legend.component';
import { CountryTooltipComponent } from './components/map/country-tooltip/country-tooltip.component';
import { SidebarSkeletonComponent } from './components/sidebar/sidebar-skeleton/sidebar-skeleton.component';
import { InfoPageRoutingModule } from './info-page-routing.module';
import { CountryDetailsComponent } from './components/country-details/country-details/country-details.component';
import { SkeletonCountryDetailsComponent } from './components/country-details/skeleton-country-details/skeleton-country-details.component';

@NgModule({
  declarations: [
    CountryRowComponent,
    GeneralInfoComponent,
    MapComponent,
    SearchComponent,
    InfoPageComponent,
    CountriesListComponent,
    LegendComponent,
    CountryTooltipComponent,
    SidebarSkeletonComponent,
    CountryDetailsComponent,
    SkeletonCountryDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfoPageRoutingModule,
  ],
  exports: [
    CountryRowComponent,
    GeneralInfoComponent,
    MapComponent,
    SearchComponent,
    InfoPageComponent,
  ],
})
export class InfoPageModule { }
