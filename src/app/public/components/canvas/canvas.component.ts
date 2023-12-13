import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import { Group } from 'konva/lib/Group';
import {
  CompletedDays,
  Objective,
  ObjectiveMainData,
} from 'src/app/core/interfaces/objective.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { ColorService } from 'src/app/core/services/color.service';
import { CursorService } from 'src/app/core/services/cursor.service';

const configSquare = {
  stroke: 'black',
  strokeWidth: 3,
  cornerRadius: 15,
};

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  template: ` <div id="konva-holder" #konvaHolder></div>`,
  styleUrls: ['./canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private route: ActivatedRoute,
    private dataService: DataService,
    private colorService: ColorService,
    private cursor: CursorService
  ) {}
  columns: number = 7;
  rows: number = 5;

  stage!: Stage;
  layer: Layer = new Layer();
  mainData!: Objective[];
  objectReferences: { Rect: Rect; intensity: number }[] = [];

  month: number = new Date().getMonth();
  indexObjetive: number = 0;
  year: number = 2023;

  actualMonth = new Date().getMonth();
  ngOnInit(): void {
    const parentScale = this.getParentScale();
    const width = (parentScale.height / this.rows) * this.columns;
    this.dataService.getObjetives().subscribe((objetivesAll) => {
      if (objetivesAll[0]) {
        this.mainData = objetivesAll;
        const objetive_2 = this.mainData[this.indexObjetive || 0];
        const objetiveByYear_2 = objetive_2.MainData.find((data) => {
          return data.year == this.year;
        });
        this.printCanvas(width, parentScale.height, objetiveByYear_2);
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.month = params['month'] || 0;
      this.indexObjetive = params['objetive'] || 0;
      this.year = params['year'] || new Date().getFullYear();
      if (this.mainData) {
        const objetive = this.mainData[this.indexObjetive || 0];
        const objetiveByYear = objetive.MainData.find((data) => {
          return data.year == this.year;
        });
        if (objetiveByYear) {
          this.printCanvas(width, parentScale.height, objetiveByYear);
        } else {
          this.printCanvas(width, parentScale.height);
        }
      } else {
        this.printCanvas(width, parentScale.height);
      }
    });
    this.colorService.getActualColorTheme().subscribe(() => {
      if (this.mainData) {
        const objetive = this.mainData[this.indexObjetive || 0];
        const objetiveByYear = objetive.MainData.find((data) => {
          return data.year == this.year;
        });
        if (objetiveByYear) {
          this.printCanvas(width, parentScale.height, objetiveByYear);
        } else {
          this.printCanvas(width, parentScale.height);
        }
      } else {
        this.printCanvas(width, parentScale.height);
      }
    });
  }

  printCanvas(
    width: number,
    height: number,
    objetive?: ObjectiveMainData,
    theme: number = this.colorService.colorSelected.getValue()
  ) {
    this.objectReferences = [];
    this.stage = this.getStage(width, height);
    const squareHeight = height / this.rows - configSquare.cornerRadius;
    const squareWidth = width / this.columns - configSquare.cornerRadius;
    this.layer.destroy();
    this.layer = new Layer();

    let i = 1;
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns; y++) {
        if (i <= 31) {
          const config = {
            ...configSquare,
            width: squareWidth,
            height: squareHeight,
            x: y * (squareHeight + configSquare.strokeWidth),
            y: x * (squareWidth + configSquare.strokeWidth),
            id: `${i}`,
          };
          const text = new Text({
            stroke: 'black',
            strokeWidth: 1,
            width: squareWidth,
            height: squareHeight,
            text: `${i}`,
            fontSize: 32,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center', // Centrar el texto horizontalmente
            verticalAlign: 'middle',
          });
          const newSquare = {
            Rect: new Rect({ ...config, x: 0, y: 0 }),
            intensity: 0,
          };

          let groupSquare = new Group({
            ...config,
          });
          groupSquare.add(newSquare.Rect);
          groupSquare.add(text);
          this.objectReferences.push(newSquare);
          groupSquare.on('click', () => {
            const clickedDay = this.objectReferences.indexOf(newSquare);
            if (this.cursor.level != -1) {
              this.changeIntesity(clickedDay, this.cursor.level - 1);
            } else {
              this.changeIntesity(clickedDay, newSquare.intensity);
            }
          });
          this.layer.add(groupSquare);
          i++;
        }
      }
    }
    if (objetive) {
      let mapped = this.getMonth(objetive, +this.month);

      this.fillSquares(mapped, theme);
    }
    this.stage.add(this.layer);
  }

  getParentScale() {
    const parentElement = this.renderer.parentNode(this.el.nativeElement);
    let parentWidth = parentElement.clientWidth;
    let parentHeight = parentElement.clientHeight;

    return {
      width: parentWidth,
      height: parentHeight > 870 ? 870 : parentHeight,
    };
  }
  getStage(width: number, height: number): Stage {
    return new Stage({
      height: height,
      width: width,
      container: 'konva-holder',
    });
  }

  fillSquares(days: CompletedDays, idTheme: number) {
    days.dayNumber.forEach((day) => {
      const color = this.colorService.mapColor(day.intensity + 1, idTheme);
      if (day.intensity < 5) {
        this.objectReferences[day.number - 1].Rect.fill(color);
        this.objectReferences[day.number - 1].intensity = day.intensity + 1;
      } else {
        this.objectReferences[day.number - 1].Rect.fill('transparent');
        this.objectReferences[day.number - 1].intensity = 0;
      }
    });
    if (this.actualMonth == this.month) {
      this.fillToday();
    }
  }
  fillToday() {
    const today = new Date().getDate();
    this.objectReferences[+today - 1].Rect.stroke('red');
  }

  getMonth(objective: ObjectiveMainData, month: number) {
    switch (month) {
      case 0:
        return objective.january;
      case 1:
        return objective.february;
      case 2:
        return objective.march;
      case 3:
        return objective.april;
      case 4:
        return objective.may;
      case 5:
        return objective.june;
      case 6:
        return objective.july;
      case 7:
        return objective.august;
      case 8:
        return objective.september;
      case 9:
        return objective.october;
      case 10:
        return objective.november;
      case 11:
        return objective.december;
      default:
        throw new Error('Índice de mes no válido');
    }
  }

  changeIntesity(day: number, intensity: number) {
    this.dataService.setDayIntensity(
      this.indexObjetive,
      this.month,
      day + 1,
      intensity,
      this.year
    );
  }
}
