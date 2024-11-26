import { Component, OnInit } from '@angular/core';
import { FormDataService } from '../../services/form-data.service';
import { ClientService } from '../../services/client.service';
import { response } from 'express';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-client-request-service-go-to-pay',
  standalone: true,
  imports: [NgIf],
  templateUrl: './client-request-service-go-to-pay.component.html',
  styleUrl: './client-request-service-go-to-pay.component.css'
})
export class ClientRequestServiceGoToPayComponent implements OnInit{
  formData: any;
  stripeUrl: any;

  constructor(
    private formDataService: FormDataService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.formData = this.mergeDeserializedData(this.formDataService.getAllFormData());
    console.log('Original Form Data:', this.formData);

    // Transformar las claves para que coincidan con el serializador de Django
    this.formData = this.transformKeys(this.formData);
    console.log('Transformed Form Data:', this.formData);
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
    console.log("Placing order...");
    this.clientService.placeOrder(this.formData).subscribe({
      next: (r) => {
        console.log('Order response:', r);
        this.stripeUrl = r.url;
      },
      error: (e) => {
        console.error('Order error:', e);
      }
    });
  }
  
}
