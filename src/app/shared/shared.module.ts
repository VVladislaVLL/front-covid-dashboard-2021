import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { CaseBlockComponent } from './components/case-block/case-block.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SpinnerComponent,
    CaseBlockComponent,
    SidebarComponent,
    SearchInputComponent,
    HighlightPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SpinnerComponent,
    CaseBlockComponent,
    SidebarComponent,
    SearchInputComponent,
    HighlightPipe,
  ],
})
export class SharedModule { }
