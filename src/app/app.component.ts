import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from './core/services/data.service';
import { CursorService } from './core/services/cursor.service';
import { CursorComponent } from './core/components/cursor/cursor.component';
import { ColorService } from './core/services/color.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, CursorComponent, NgIf],
})
export class AppComponent implements OnInit {
  title = 'bujoApp';
  showCursor: boolean = true;
  constructor(
    private dataService: DataService,
    private cursor: CursorService
  ) {}

  ngOnInit(): void {
    this.dataService.initDB();
    this.dataService.getObjetives().subscribe(() => {
      this.dataService.updateDB();
    });
    this.cursor.getSelected().subscribe((selected) => {
      if (selected == 'white') {
        this.showCursor = false;
      } else {
        this.showCursor = true;
      }
    });
  }
}
