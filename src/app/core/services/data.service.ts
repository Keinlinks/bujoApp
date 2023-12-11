import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, forkJoin, map } from 'rxjs';
import {
  CompletedDays,
  Objective,
  ObjectiveMainData,
  Store,
} from '../interfaces/objective.model';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { mockObjetive } from 'src/app/mocks/objetiveMock';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  objectives$: BehaviorSubject<Objective[]> = new BehaviorSubject<Objective[]>(
    []
  );
  constructor(private dbService: NgxIndexedDBService) {}

  initDB() {
    this.dbService.getAll<Objective>('objectives').subscribe((data) => {
      if (data.length < 1) {
        this.createInitialObjetive();
      } else {
        this.setObjetives(data);
      }
    });
  }

  //set, get BehaviourSubject
  getObjetives(): Observable<Objective[]> {
    return this.objectives$.asObservable();
  }
  /*   setObjective(newObjetive: Objective) {
    const allObjetives = this.objectives$.getValue();
    allObjetives.push(newObjetive);
    this.objectives$.next(allObjetives);
    this.setObjectiveDB(newObjetive);
  } */
  setObjetives(newObjetives: Objective[]) {
    this.objectives$.next(newObjetives);
  }

  //get, set, delete: indexDB

  getAllObjectivesDB() {
    return this.dbService.getAll<Objective>('objectives');
  }

  setObjectivesDB(objectives: Objective[]) {
    if (objectives.length > 0) {
      const addObservables = objectives.map((objective) =>
        this.dbService.add('objectives', objective)
      );
      return forkJoin(addObservables);
    }
    return EMPTY;
  }
  setObjectiveDB(objective: Objective) {
    this.dbService.add('objectives', objective);
  }
  deleteObjective(id: number) {
    return this.dbService.delete('objectives', id);
  }

  //updateObjetive
  setDayIntensity(
    objetiveId: number,
    month: number,
    day: number,
    intensity: number,
    year: number
  ) {
    const editDate = `${day.toString().padStart(2, '0')}/${
      month.toString().length < 2 ? `0${+month + 1}` : +month + 1
    }/${year}`;
    if (compareDate(editDate)) {
      let newObject: Objective[] = this.objectives$.getValue();
      let objetive = newObject[objetiveId];
      objetive = {
        ...objetive,
        MainData: objetive.MainData.map((object) => {
          if (object.year === year) {
            let monthMap = getMonth(object, +month);
            if (
              monthMap.dayNumber.find((dayObject) => {
                return dayObject.number != day;
              }) ||
              monthMap.dayNumber.length == 0
            ) {
              monthMap.dayNumber.push({ intensity: intensity, number: day });
            }
            return { ...object, monthMap };
          } else {
            return object;
          }
        }),
      };
      newObject[objetiveId] = objetive;
      this.objectives$.next(newObject);
    } else {
    }
  }

  createInitialObjetive() {
    this.setObjectivesDB([mockObjetive]).subscribe((datas) => {});
  }
  updateDB() {
    if (this.objectives$.getValue()) {
      this.dbService
        .bulkPut('objectives', this.objectives$.getValue())
        .subscribe((x) => {
          console.log(x);
        });
    }
  }
}

function getMonth(objective: ObjectiveMainData, month: number) {
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
function compareDate(date1: string) {
  const actualDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const convertirStringADate = (date: string) => {
    const partes = date.split('/');
    if (partes.length === 3) {
      const [dia, mes, año] = partes.map(Number);
      return new Date(año, mes - 1, dia);
    } else {
      throw new Error('Formato de fecha no válido');
    }
  };

  const fecha1 = convertirStringADate(date1);
  const fecha2 = convertirStringADate(actualDate);
  return fecha1 <= fecha2;
}
