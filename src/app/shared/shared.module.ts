import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { CaseBlockComponent } from './components/case-block/case-block.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { ChartsComponent } from './components/charts/charts.component';
import { SelectComponent } from './components/select/select.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    SpinnerComponent,
    CaseBlockComponent,
    SidebarComponent,
    SearchInputComponent,
    HighlightPipe,
    ChartsComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [
    SpinnerComponent,
    CaseBlockComponent,
    SidebarComponent,
    SearchInputComponent,
    HighlightPipe,
    ChartsComponent,
    SelectComponent,
  ],
})
export class SharedModule { }
