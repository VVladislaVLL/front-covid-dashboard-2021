import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { InfoPageComponent } from './modules/info-page/components/info-page/info-page.component';
// import { CountryDetailsComponent } from './modules/details/country-details/country-details.component';

const routes: Routes = [
  // { path:  '', pathMatch: 'full', component:  InfoPageComponent },
  // { path:  'country/:iso2a', pathMatch: 'full', component:  CountryDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
