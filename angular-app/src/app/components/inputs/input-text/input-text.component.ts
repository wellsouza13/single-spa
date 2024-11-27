import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomValueAccessor } from '../custom-value-accessor';

@Component({
  selector: 'lib-input-text',
  templateUrl: './input-text.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTextComponent),
    multi: true
  }]
})
export class InputTextComponent extends CustomValueAccessor<string> {

  @Input() appearance: 'fill' | 'legacy' | 'outline' | 'standard' = 'standard';
  @Input() textCase: 'normal' | 'lower' | 'upper' = 'normal';
  @Input() type: 'text' | 'password' = 'text';
  @Input() icon: string | undefined;
  @Input() maxLength = 32000;
  @Input() required = false;
  @Input() readOnly = false;

  @Output() eventInput = new EventEmitter<any>();
  @Output() eventBlur = new EventEmitter<void>();

  onInit() { }

  onInput($event: any) {
    this.setModelToLowerOrUpperCase(this.model!, this.textCase);
    this.inputEvent(this.model);
    this.eventInput.emit(this.model);
  }

  onBlur() {
    this.blurEvent();
    this.eventBlur.emit();
  }

  translateValue(value: any): string {
    return value;
  }

  setModelToLowerOrUpperCase(model: string, textCase: string) {
    switch (textCase) {
      case 'lower':
        this.model = model.toLowerCase();
        break;
      case 'upper':
        this.model = model.toUpperCase();
        break;
      default:
        break;
    }
  }

}
