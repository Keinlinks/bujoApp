import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColorService } from 'src/app/core/services/color.service';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [NgFor],
  template: `<select (change)="selected($event)" [value]="selectedIndex">
    <option [value]="option.id" *ngFor="let option of options">
      {{ option.name }}
    </option>
    <option [value]="options.length">New theme</option>
  </select>`,
  styleUrls: ['./colorInput.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorInputComponent {
  options: { id: number; name: string }[];
  selectedIndex: number;
  constructor(private color: ColorService) {
    this.selectedIndex = color.colorSelected.getValue();
    if (color.colorThemes.getValue()) {
      this.options = color.colorThemes.getValue().map((theme) => {
        return { id: theme.id, name: theme.name };
      });
    } else {
      this.options = [];
    }
  }

  selected(event: any) {
    if (this.options.length != event.target.value)
      this.color.setColorIndex(event.target.value);
    else {
    }
  }
}
