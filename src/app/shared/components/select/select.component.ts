import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit {
  @Input() options: {
    value: string;
    viewValue: string;
    selected: boolean;
  }[];
  @Output() optionChange = new EventEmitter<string>();

  public selectControl = new FormControl();

  public ngOnInit(): void {
    this.selectControl.setValue(this.options.find(option => option.selected)?.value || this.options[0].value);
    this.selectControl.valueChanges.subscribe((selected: string) => {
      this.changeSelectedOption(selected);
      this.optionChange.emit(selected);
    });
  }

  private changeSelectedOption(selectedOption: string): void {
    this.options.forEach(option => {
      option.selected = option.value === selectedOption;
    });
  }
}
