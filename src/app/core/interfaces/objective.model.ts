import { Color } from './color.model';

export interface Objective {
  id?: number;
  name: string;
  createdAt: Date;
  MainData: ObjectiveMainData[];
  color: Color;
}

export interface ObjectiveMainData {
  year: number;
  january: CompletedDays;
  february: CompletedDays;
  march: CompletedDays;
  april: CompletedDays;
  may: CompletedDays;
  june: CompletedDays;
  july: CompletedDays;
  august: CompletedDays;
  september: CompletedDays;
  october: CompletedDays;
  november: CompletedDays;
  december: CompletedDays;
}

export interface CompletedDays {
  dayNumber: Day[];
}

interface Day {
  number: number;
  intensity: number;
}

export const Months: string[] = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export interface Store {
  name: string;
  createdAt: Date;
  color: {
    id: number;
    level_1: string;
    level_2: string;
    level_3: string;
    level_4: string;
    level_5: string;
  };
  MainData: {
    year: number;
    january: { dayNumber: number[] };
    february: { dayNumber: number[] };
    march: { dayNumber: number[] };
    april: { dayNumber: number[] };
    may: { dayNumber: number[] };
    june: { dayNumber: number[] };
    july: { dayNumber: number[] };
    august: { dayNumber: number[] };
    september: { dayNumber: number[] };
    october: { dayNumber: number[] };
    november: { dayNumber: number[] };
    december: { dayNumber: number[] };
  }[];
  id: number;
}
