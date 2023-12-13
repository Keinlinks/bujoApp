import { Injectable } from '@angular/core';
import { Color } from '../interfaces/color.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { colorsDefault } from 'src/app/mocks/colorMock';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  public colorThemes: BehaviorSubject<Color[]> = new BehaviorSubject<Color[]>(
    colorsDefault
  );
  public colorSelected: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  constructor() {}

  mapColor(intensity: number, idTheme: number) {
    const theme = this.colorThemes.getValue().find((theme) => {
      return theme.id == this.colorSelected.getValue();
    });
    if (theme) {
      switch (intensity) {
        case 1:
          return theme?.level_1;
        case 2:
          return theme?.level_2;
        case 3:
          return theme?.level_3;
        case 4:
          return theme?.level_4;
        case 5:
          return theme?.level_5;
        default:
          return 'transparent';
      }
    }
    return 'transparent';
  }

  getActualColorTheme(): Observable<Color[]> {
    return this.colorThemes.asObservable();
  }
  setColorIndex(index: number) {
    this.colorSelected.next(index);
    this.colorThemes.next(this.colorThemes.getValue());
  }
}
