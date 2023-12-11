import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Color } from 'src/app/core/interfaces/color.model';
import { ColorService } from 'src/app/core/services/color.service';
import { CursorService } from 'src/app/core/services/cursor.service';

@Component({
  selector: 'app-legends-color',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./legendsColor.component.html`,
  styleUrls: ['./legendsColor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendsColorComponent implements OnInit {
  constructor(
    private colorService: ColorService,
    private cursor: CursorService
  ) {}
  color!: Color;

  ngOnInit(): void {
    this.colorService.getActualColorTheme().subscribe((colorSelected) => {
      this.color = this.colorService.colorThemes.getValue()[colorSelected];
    });
  }

  clickOnColor(color: string, i: number) {
    this.cursor.setSelected(color, i);
  }
}
