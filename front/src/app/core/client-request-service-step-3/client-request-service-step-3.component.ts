import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';


// Validador personalizado
export function atLeastOneNonZero(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const bedroomsNumber = parseInt(control.get('bedroomsNumber')?.value || '0', 10);
    const bathroomsNumber = parseInt(control.get('bathroomsNumber')?.value || '0', 10);

    if (bedroomsNumber > 0 && bathroomsNumber > 0) {
      return null; // Es válido
    }
    return { atLeastOneNonZero: true }; // No es válido
  };
}

@Component({
  selector: 'app-client-request-service-step-3',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, CurrencyPipe],
  templateUrl: './client-request-service-step-3.component.html',
  styleUrls: ['./client-request-service-step-3.component.css']
})
export class ClientRequestServiceStep3Component {
  @Output() nextStep = new EventEmitter<any>();
  @Input() stepData!: string | null;
  selectedType: string | null = null;
  servicePrice = 0;

  step3Form = new FormGroup({
    typeOfConstruction: new FormControl('', Validators.required),
    bedroomsNumber: new FormControl(null, Validators.required),
    bathroomsNumber: new FormControl(null, Validators.required),
  },
  { validators: atLeastOneNonZero() }
);

  ngOnInit(): void {

    // Suscríbete a los cambios del formulario
    this.step3Form.valueChanges.subscribe(() => {
      this.updateServicePrice();
    });

    if (this.stepData) {
      const stepData = JSON.parse(this.stepData);
      this.step3Form.patchValue(stepData);
      this.selectedType = stepData.typeOfConstruction;
    }
  }

  selectType(type: string) {
    this.selectedType = type;
    this.step3Form.controls.typeOfConstruction.setValue(type);
  }

  onNextStep() {
    if (this.step3Form.valid) {
      this.nextStep.emit(this.step3Form.value);
    }
  }

  private updateServicePrice() {
    const formValue = this.step3Form.value;

    const typeOfConstruction = formValue.typeOfConstruction;
    const bedroomsNumber = parseInt(formValue.bedroomsNumber || '0', 10);
    const bathroomsNumber = parseInt(formValue.bathroomsNumber || '0', 10);

    if (
      typeOfConstruction === 'apartment' &&
      bedroomsNumber >= 0 && bedroomsNumber <= 2 &&
      (bathroomsNumber === 0 || bathroomsNumber === 1)
    ) {
      this.servicePrice = 130;
    } else if (
      typeOfConstruction === 'familiar' &&
      bedroomsNumber >= 2 && bedroomsNumber <= 3 &&
      bathroomsNumber >= 1 && bathroomsNumber <= 2
    ) {
      this.servicePrice = 150;
    } else if (
      typeOfConstruction === 'familiar' &&
      bedroomsNumber > 3 &&
      bathroomsNumber > 2
    ) {
      this.servicePrice = 170;
    } else {
      this.servicePrice = 0; // Valor por defecto si no cumple ninguna condición
    }
  }
}
