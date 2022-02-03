import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryRowComponent } from './components/country-row/country-row.component';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CountryRowComponent,
    GeneralInfoComponent,
    MapComponent,
    SearchComponent,
    InfoPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
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
