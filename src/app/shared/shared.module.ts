import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { HighlightPipe } from './pipes/highlight.pipe';
import { TimesPipe } from './pipes/times.pipe';
import { PxToRemPipe } from './pipes/px-to-rem.pipe';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { CaseBlockComponent } from './components/case-block/case-block.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { ChartsComponent } from './components/charts/charts.component';
import { SelectComponent } from './components/select/select.component';
import { TooltipDirective } from './directives/tooltip/tooltip.directive';
import { PortalComponent } from './components/portal/portal.component';

import { SkeletonWrapperComponent, SkeletonLineComponent, SkeletonCircleComponent, SkeletonDirective } from './components/skeleton';

const declarations = [
  SpinnerComponent,
  CaseBlockComponent,
  SidebarComponent,
  SearchInputComponent,
  ChartsComponent,
  SelectComponent,
  HighlightPipe,
  TimesPipe,
  PxToRemPipe,
  TooltipDirective,
  PortalComponent,
  SkeletonWrapperComponent,
  SkeletonLineComponent,
  SkeletonCircleComponent,
  SkeletonDirective,
];

@NgModule({
  declarations: [...declarations],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [...declarations],
})
export class SharedModule { }
