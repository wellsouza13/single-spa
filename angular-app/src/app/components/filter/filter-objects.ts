import { Observable } from 'rxjs';

export class FilterColumn {
  columnDef: any;
  columnLabel: any;

  constructor(
    columnDef?: string,
    columnLabel?: string
  ) {
    this.columnDef = columnDef;
    this.columnLabel = columnLabel;
  }
}

export class Filter<T> {
  filter: T | undefined;
  columns: FilterColumn[] = [];
}

export class FilterData {
  label: string | undefined;
  value: string | undefined;
  filterID?: string;
  ignoreValues?: any[];
  defaultValue?: any;
}

export interface FilterComponent {

  filterChange(): Observable<FilterData>;

}
