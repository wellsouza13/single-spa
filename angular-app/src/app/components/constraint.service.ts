import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class ConstraintService {

  private $constraintEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private $constraintObservable: Observable<boolean> = this.$constraintEvent.asObservable().pipe(debounceTime(200));
  private invalidFields: string[] = [];

  constraintEvent(): Observable<boolean> {
    return this.$constraintObservable;
  }

  constraintUpdate(cid: string, valid: boolean) {
    if (valid) {
      this.invalidFields = this.invalidFields.filter(field => cid !== field);
    } else {
      this.invalidFields.push(cid);
    }
    this.publishState();
  }

  publishState() {
    this.$constraintEvent.next(this.invalidFields.length === 0);
  }

  hasCid(cids: string[]): boolean {
    for (const cid of cids) {
      if (this.invalidFields.findIndex(field => field === cid) > -1) {
        return true;
      }
    }
    return false;
  }
}
