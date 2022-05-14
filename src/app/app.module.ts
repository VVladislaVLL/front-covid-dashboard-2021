import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoPageModule } from './modules/info-page/info-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfoPageModule,
    BrowserAnimationsModule,
    PlotlyModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
