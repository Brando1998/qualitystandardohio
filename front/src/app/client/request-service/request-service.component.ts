import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { ClientRequestServiceStep1Component } from '../../core/client-request-service-step-1/client-request-service-step-1.component';
import { ClientRequestServiceStep2Component } from '../../core/client-request-service-step-2/client-request-service-step-2.component';
import { ClientRequestServiceStep3Component } from '../../core/client-request-service-step-3/client-request-service-step-3.component';
import { ClientRequestServiceStep4Component } from '../../core/client-request-service-step-4/client-request-service-step-4.component';
import { ClientRequestServiceStep5Component } from '../../core/client-request-service-step-5/client-request-service-step-5.component';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ClientRequestServiceResumeComponent } from '../../core/client-request-service-resume/client-request-service-resume.component';
import { FooterComponent } from '../../core/footer/footer.component';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-request-service',
  standalone: true,
  imports: [
    HeaderComponent,
    ClientRequestServiceStep1Component,
    ClientRequestServiceStep2Component,
    ClientRequestServiceStep3Component,
    ClientRequestServiceStep4Component,
    ClientRequestServiceStep5Component,
    ClientRequestServiceResumeComponent,
    FooterComponent,
    NgIf
  ],
  templateUrl: './request-service.component.html',
  styleUrl: './request-service.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class RequestServiceComponent implements OnInit {
  currentStep = 6;
  stepData: any = null;

  constructor(private formDataService: FormDataService) { }

  ngOnInit() {
    // Cargar datos del paso actual si existen
    this.loadStepData();
  }

  onNextStep(data: any) {
    this.stepData = JSON.stringify(data);
    this.saveStepData();
    this.currentStep++;
    this.loadStepData();
  }

  onPrevStep() {
    this.saveStepData();
    this.currentStep--;
    this.loadStepData();
  }

  saveStepData() {
    // Guardar datos del paso actual
    this.formDataService.saveStepData(`step${this.currentStep}`, this.stepData);
  }

  loadStepData() {
    // Cargar datos del paso actual, o inicializar un objeto vacío
    this.stepData = this.formDataService.getStepData(`step${this.currentStep}`) || null;
  }
}
