import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "lib-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements AfterViewInit {
  @Input() label = "";
  @Input() disabled = false;
  @Input() autoFocused = false;
  @Input() color: "primary" | "accent" | "warn";
  @Input() buttonType:
    | "flat"
    | "raised"
    | "button"
    | "stroked"
    | "icon"
    | "fab"
    | "mini-fab"
    | "plus-button" = "raised";
  @Input() icon: string;
  @Input() customClass = "";
  @Output() clickAction = new EventEmitter<any>();
  @ViewChild("btnRef", { static: false }) buttonRef: MatButton;

  ngAfterViewInit() {
    if (this.autoFocused) {
      this.buttonFocus();
    }
  }

  buttonFocus() {
    this.buttonRef.focus();
  }

  onClick($event: Event) {
    $event.stopPropagation();
    if (!this.disabled) {
      this.clickAction.emit($event);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
