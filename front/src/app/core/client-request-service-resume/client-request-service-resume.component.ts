import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormDataService } from '../../services/form-data.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-client-request-service-resume',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, SpinnerComponent, CurrencyPipe],
  templateUrl: './client-request-service-resume.component.html',
  styleUrl: './client-request-service-resume.component.css'
})
export class ClientRequestServiceResumeComponent implements OnInit {
  @Output() nextStep = new EventEmitter<any>();
  @Input() stepData!: string | null;
  resume: any;
  step2: any;
  step3: any;
  step4: any;
  step5: any;
  formData: any;
  stripeUrl: any;
  isLoading = false;
  servicePrice = 0;

  step6Form = new FormGroup({
    notes: new FormControl(''),
  });

  constructor(
    private formDataService: FormDataService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.resume = this.formDataService.getAllFormData();
    this.step2 = JSON.parse(this.resume.step2)
    this.step3 = JSON.parse(this.resume.step3)
    this.step4 = JSON.parse(this.resume.step4)
    
    if (this.stepData) {
      const stepData = JSON.parse(this.stepData)
      this.step6Form.setValue(stepData)
    }

    this.updateServicePrice();
  }

  onNextStep() {
    if (this.step6Form.valid) {
      this.formData = this.mergeDeserializedData(this.formDataService.getAllFormData());
      console.log('Original Form Data:', this.formData);

      // Transformar las claves para que coincidan con el serializador de Django
      this.formData = this.transformKeys(this.formData);
      console.log('Transformed Form Data:', this.formData);

      this.placeOrder();
    }
  }

  mergeDeserializedData(data: Record<string, string>) {
    const mergedData = {};
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Parse each JSON string and merge into the mergedData object
        Object.assign(mergedData, JSON.parse(data[key]));
      }
    }
  
    return mergedData;
  }

  transformKeys(data: any) {
    const transformedData = {
      frequency: {
        date: data.frequency.date,
        time: data.frequency.time,
        week: data.frequency.week,
        frequency: data.frequency.frequency
      },
      extra_services: data.extraServices, // Cambia a snake_case
      type_of_construction: data.typeOfConstruction, // Cambia a snake_case
      bedrooms_number: data.bedroomsNumber, // Cambia a snake_case
      bathrooms_number: data.bathroomsNumber, // Cambia a snake_case
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      accept_terms: data.acceptTerms, // Cambia a snake_case
      notes: data.notes
    };
    return transformedData;
  }

  placeOrder() {
    this.isLoading = true;
    console.log("Placing order...");
    this.clientService.placeOrder(this.formData).subscribe({
      next: (r) => {
        console.log('Order response:', r);
        this.stripeUrl = r.url;
        this.isLoading = false; 
      },
      error: (e) => {
        console.error('Order error:', e);
        this.isLoading = false; 
      }
    });
  }

  private updateServicePrice() {
    const formValue = this.step2;
    console.log(formValue)

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

    const servicesArray = this.step3.extraServices;
    this.servicePrice = ((servicesArray?.length || 0) * 25) + this.servicePrice;
  }

  // updateExtraPrice(services: string[] | null) {
  //   this.extraPrice = (services?.length || 0) * 25; // Multiplica el número de servicios por 25
  // }
}
