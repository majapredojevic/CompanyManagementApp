import {Note} from './note'

export class Employee {
  id?: string;
  firstName: String = '';
  lastName: String = '';
  position: String= '';
  birthday?: Date;
  amount?: Number;
  startDate: Date = new Date();
  note: Array<Note> = new Array();
}

