import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-request-service-step-4',
  standalone: true,
  imports: [NgClass, CurrencyPipe],
  templateUrl: './client-request-service-step-4.component.html',
  styleUrls: ['./client-request-service-step-4.component.css']
})
export class ClientRequestServiceStep4Component {
  @Output() nextStep = new EventEmitter<any>();
  @Input() stepData!: string | null;
  extraPrice = 0;

  step4Form = new FormGroup({
    extraServices: new FormControl<string[]>([], Validators.required)
  });

  ngOnInit(): void {
    // Suscripción a los cambios de extraServices
    this.step4Form.controls.extraServices.valueChanges.subscribe((services) => {
      this.updateExtraPrice(services);
    });
    
    if (this.stepData) {
      this.step4Form.patchValue(JSON.parse(this.stepData));
    }
  }

  updateExtraServices(service: string) {
    const servicesArray = this.step4Form.controls.extraServices.value ?? [];
    const index = servicesArray.indexOf(service);

    if (index > -1) {
      servicesArray.splice(index, 1); // Si existe, eliminarlo
    } else {
      servicesArray.push(service); // Si no existe, agregarlo
    }

    this.step4Form.controls.extraServices.setValue([...servicesArray]);
  }

  updateExtraPrice(services: string[] | null) {
    this.extraPrice = (services?.length || 0) * 25; // Multiplica el número de servicios por 25
  }

  onNextStep() {
    if (this.step4Form.valid) {
      this.nextStep.emit(this.step4Form.value);
    }
  }
}
