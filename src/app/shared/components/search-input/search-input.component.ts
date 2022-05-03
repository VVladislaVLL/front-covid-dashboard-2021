import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  @Input() numberOfCountries: number = 0;
  @Output() searchValue = new EventEmitter<string>();
  public input = new FormControl('');

  public ngOnInit(): void {
    this.input.valueChanges.subscribe((value: string) => {
      this.searchValue.emit(value.toLocaleLowerCase());
    });
  }
}
