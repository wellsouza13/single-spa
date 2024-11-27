import { ControlValueAccessor, NgModel } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { OnInit, Input, ViewChild, Directive } from '@angular/core';
import { FilterComponent, FilterData } from '../filter/filter-objects';
import { VOID } from '../utils';
import { isString } from 'src/app/base/helper';
import { Constraint, ConstraintComponent } from './input-objects';

@Directive()
export abstract class CustomValueAccessor<Model> implements ControlValueAccessor, OnInit, FilterComponent, ConstraintComponent {

  @Input() label: string | undefined;
  @Input() disabled: boolean = false;

  @ViewChild(NgModel) ngModel: NgModel | undefined;

  public model: Model | undefined;
  public constraintMessage = '';

  private filterEvent: Subject<FilterData> = new Subject();
  private constraintEvent: Subject<boolean> = new Subject();
  private constraints: Constraint[] | undefined;

  private onTouchedCallback: () => void = VOID;
  private onChangeCallback: (_: any) => void = VOID;

  abstract translateValue(value: any): Model;
  abstract onInit(): void;

  ngOnInit(): void {
    this.onInit();
  }

  get value(): any {
    return this.model;
  }

  set value(v: any) {
    if (v !== this.model) {
      this.model = this.translateValue(v);
      this.onChangeCallback(v);
      if (this.constraints) {
        this.constraintEvent.next(this.isValid());
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  writeValue(obj: any): void {
    this.model = this.translateValue(obj);
    if (this.constraints) {
      this.constraintEvent.next(this.isValid());
    }
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  inputEvent(value: any, displayValue?: string) {
    const display = isString(displayValue) ? displayValue : value;
    this.onChangeCallback(value);
    this.filterEvent.next({
      label: this.label!,
      value: display
    });
    if (this.constraints) {
      this.constraintEvent.next(this.isValid());
    }
  }
  blurEvent() {
    if (this.constraints) {
      this.constraintEvent.next(this.isValid());
    }
    this.onTouchedCallback();
  }
  filterChange(): Observable<FilterData> {
    return this.filterEvent.asObservable();
  }

  updateConstraints(constraints: Constraint[]) {
    this.constraints = constraints;
    if (this.ngModel) {
      this.ngModel.control.setErrors(null);
    }
    this.constraintMessage = '';
  }

  configureConstraints(constraints: Constraint[]): Observable<boolean> {
    this.constraints = constraints;
    if (this.constraints && this.ngModel) {
      this.constraintEvent.next(this.isValid());
    }
    return this.constraintEvent.asObservable();
  }

  isValid(): boolean {
    if (!this.constraints) return true; // Sem constraints, sempre válido
    for (const constraint of this.constraints) {
      if (!constraint.apply!(this.model)) {
        this.constraintMessage = constraint.message!;
        if (this.ngModel) {
          this.ngModel.control.markAllAsTouched();
          this.ngModel.control.markAsDirty();
          this.ngModel.control.setErrors({ invalid: true });
        }
        return false;
      }
    }
    if (this.ngModel) {
      this.ngModel.control.setErrors(null);
    }
    this.constraintMessage = '';
    return true;
  }

}
