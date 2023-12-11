import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursorService {
  public selected: Subject<string> = new Subject<string>();
  public level: number = -1;
  constructor() {}

  getSelected(): Observable<string> {
    return this.selected.asObservable();
  }
  setSelected(newValue: string, level: number) {
    this.selected.next(newValue);
    this.level = level;
  }
}
