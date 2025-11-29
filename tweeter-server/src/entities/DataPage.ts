
export class DataPage<T> {
  values: T[]; 
  hasMorePages: boolean;

  public constructor(values: T[], hasMorePages: boolean) {
    this.values = values;
    this.hasMorePages = hasMorePages;
  }
}
