export class Note {
  date: Date = new Date();
  description: String = '';

  public constructor( note: String) {
    this.description = note;
  }
}


