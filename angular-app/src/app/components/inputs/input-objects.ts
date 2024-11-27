import { Observable } from 'rxjs';
import { Moment } from 'moment';

export declare type CONSTRAINT_TYPE = 'required' | 'mask' | 'custom';

export interface ConstraintComponent {
  updateConstraints(constraints: Constraint[]): void;
  configureConstraints(constraints: Constraint[]): Observable<boolean>;
  isValid(): boolean;
}

export class Constraint {
  type: CONSTRAINT_TYPE | undefined;
  message: string | undefined;
  apply: ((model: any) => boolean) | undefined;
}

export class DateRange {
  begin?: Moment;
  end?: Moment;
}

export const DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

