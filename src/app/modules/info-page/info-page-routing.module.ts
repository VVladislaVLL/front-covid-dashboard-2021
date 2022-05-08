import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { CountryDetailsComponent } from './components/country-details/country-details/country-details.component';
import { InfoPageComponent } from './components/info-page/info-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'info' },
  { path: 'info', pathMatch: 'full', component:  InfoPageComponent },
  // { path:  'country/:id', outlet: 'popup', pathMatch: 'full', component:  CountryDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class InfoPageRoutingModule { }
